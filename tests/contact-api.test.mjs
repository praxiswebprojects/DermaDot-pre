import assert from "node:assert/strict";
import test from "node:test";

const workerUrl = new URL("../dist/server/index.js", import.meta.url);
workerUrl.searchParams.set("contact-tests", `${process.pid}-${Date.now()}`);
const { default: worker } = await import(workerUrl.href);

class MemoryRateLimitDb {
  constructor() {
    this.records = new Map();
  }

  prepare(sql) {
    let values = [];
    return {
      run: async () => {
        assert.match(sql, /CREATE TABLE IF NOT EXISTS contact_rate_limits/);
        return { success: true };
      },
      bind: (...args) => {
        values = args;
        return {
          first: async () => {
            const [key, now, cutoff] = values;
            const current = this.records.get(key);

            if (!current || current.windowStartedAt <= cutoff) {
              const fresh = { windowStartedAt: now, submissionCount: 1 };
              this.records.set(key, fresh);
              return { submission_count: 1 };
            }

            if (current.submissionCount >= 3) return null;
            current.submissionCount += 1;
            return { submission_count: current.submissionCount };
          },
        };
      },
    };
  }
}

class MockResend {
  constructor(responseFactory = () => new Response(JSON.stringify({ id: "email_123" }), { status: 200 })) {
    this.requests = [];
    this.responseFactory = responseFactory;
  }

  async fetch(request) {
    const body = await request.clone().json();
    this.requests.push({ request, body });
    return this.responseFactory(request, body);
  }
}

const validPayload = {
  name: "Maria Example",
  email: "maria@example.com",
  phone: "+30 1234 5678 9012",
  message: "I would like to arrange a private consultation.",
  website: "",
};

function createEnv(overrides = {}) {
  return {
    DB: new MemoryRateLimitDb(),
    RESEND_API_KEY: "re_super_secret_server_key",
    CONTACT_RECIPIENT: "clinic@example.com",
    CONTACT_SENDER: "DermaDot <contact@example.com>",
    RATE_LIMIT_SALT: "a-long-random-rate-limit-salt-for-tests",
    CANONICAL_HOST: "example.com",
    RESEND_API: new MockResend(),
    ...overrides,
  };
}

function contactRequest(payload = validPayload, overrides = {}) {
  return new Request("https://example.com/api/contact", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      origin: "https://example.com",
      "cf-connecting-ip": "198.51.100.24",
      ...overrides.headers,
    },
    body: overrides.rawBody ?? JSON.stringify(payload),
  });
}

test("valid contact request is delivered through Resend", async () => {
  const resend = new MockResend();
  const response = await worker.fetch(contactRequest(), createEnv({ RESEND_API: resend }), {});

  assert.equal(response.status, 200);
  assert.equal(resend.requests.length, 1);

  const delivery = resend.requests[0];
  assert.equal(delivery.request.headers.get("authorization"), "Bearer re_super_secret_server_key");
  assert.match(delivery.request.headers.get("idempotency-key") ?? "", /^contact\/[0-9a-f-]{36}$/i);
  assert.equal(delivery.body.reply_to, validPayload.email);
  assert.deepEqual(delivery.body.to, ["clinic@example.com"]);
  assert.match(delivery.body.text, /Maria Example/);
  assert.match(delivery.body.html, /maria@example\.com/);
});

test("invalid email is rejected", async () => {
  const resend = new MockResend();
  const response = await worker.fetch(
    contactRequest({ ...validPayload, email: "not-an-email" }),
    createEnv({ RESEND_API: resend }),
    {},
  );

  assert.equal(response.status, 400);
  assert.equal(resend.requests.length, 0);
});

test("9-digit and malformed phone numbers are rejected", async () => {
  for (const phone of ["123 456 789", "210-123-ABCD"]) {
    const response = await worker.fetch(contactRequest({ ...validPayload, phone }), createEnv(), {});
    assert.equal(response.status, 400, phone);
  }
});

test("10-digit and 14-digit phone numbers are accepted", async () => {
  for (const phone of ["210 123 4567", "+30 1234 5678 9012"]) {
    const resend = new MockResend();
    const response = await worker.fetch(
      contactRequest({ ...validPayload, phone }),
      createEnv({ RESEND_API: resend }),
      {},
    );
    assert.equal(response.status, 200, phone);
    assert.equal(resend.requests.length, 1, phone);
  }
});

test("honeypot submissions are silently accepted without delivery", async () => {
  const resend = new MockResend();
  const env = createEnv({ RESEND_API: resend });
  const response = await worker.fetch(
    contactRequest({ ...validPayload, website: "https://bot.example" }),
    env,
    {},
  );

  assert.equal(response.status, 200);
  assert.equal(resend.requests.length, 0);
  assert.equal(env.DB.records.size, 0);
});

test("cross-origin contact requests are rejected", async () => {
  const resend = new MockResend();
  const response = await worker.fetch(
    contactRequest(validPayload, { headers: { origin: "https://attacker.example" } }),
    createEnv({ RESEND_API: resend }),
    {},
  );

  assert.equal(response.status, 403);
  assert.equal(resend.requests.length, 0);
});

test("contact endpoint rate limits the fourth submission for 15 minutes", async () => {
  const resend = new MockResend();
  const env = createEnv({ RESEND_API: resend });

  for (let attempt = 1; attempt <= 3; attempt += 1) {
    const response = await worker.fetch(contactRequest(), env, {});
    assert.equal(response.status, 200, `attempt ${attempt}`);
  }

  const limited = await worker.fetch(contactRequest(), env, {});
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("retry-after"), "900");
  assert.equal(resend.requests.length, 3);
});

test("provider errors and API keys are never exposed to the client", async () => {
  const secret = "re_do_not_expose_this_value";
  const resend = new MockResend(() => new Response(JSON.stringify({ error: secret }), { status: 500 }));
  const response = await worker.fetch(
    contactRequest(),
    createEnv({ RESEND_API_KEY: secret, RESEND_API: resend }),
    {},
  );
  const body = await response.text();

  assert.equal(response.status, 502);
  assert.doesNotMatch(body, new RegExp(secret));
  assert.doesNotMatch(body, /resend/i);
});

test("invalid JSON and wrong methods are rejected safely", async () => {
  const invalidJson = await worker.fetch(contactRequest(validPayload, { rawBody: "{" }), createEnv(), {});
  assert.equal(invalidJson.status, 400);

  const wrongMethod = await worker.fetch(
    new Request("https://example.com/api/contact", {
      method: "GET",
      headers: { origin: "https://example.com" },
    }),
    createEnv(),
    {},
  );
  assert.equal(wrongMethod.status, 405);
  assert.equal(wrongMethod.headers.get("allow"), "POST");
});

test("HTML values are escaped and production responses carry security headers", async () => {
  const resend = new MockResend();
  const response = await worker.fetch(
    contactRequest({ ...validPayload, name: "Maria <Admin>", message: "Hello <script>alert(1)</script>" }),
    createEnv({ RESEND_API: resend }),
    {},
  );

  assert.equal(response.status, 200);
  assert.match(resend.requests[0].body.html, /Maria &lt;Admin&gt;/);
  assert.doesNotMatch(resend.requests[0].body.html, /<script>/);
  assert.match(response.headers.get("content-security-policy") ?? "", /form-action 'self'/);
  assert.equal(response.headers.get("x-frame-options"), "DENY");
  assert.equal(response.headers.get("x-content-type-options"), "nosniff");
  assert.match(response.headers.get("strict-transport-security") ?? "", /max-age=/);
});

test("HTTP and www requests permanently redirect to canonical HTTPS", async () => {
  const response = await worker.fetch(
    new Request("http://www.example.com/contact?source=test"),
    createEnv(),
    {},
  );

  assert.equal(response.status, 308);
  assert.equal(response.headers.get("location"), "https://example.com/contact?source=test");
});
