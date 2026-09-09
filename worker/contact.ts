export interface ContactEnv {
  DB?: D1Database;
  RESEND_API_KEY?: string;
  CONTACT_RECIPIENT?: string;
  CONTACT_SENDER?: string;
  RATE_LIMIT_SALT?: string;
  CANONICAL_HOST?: string;
  RESEND_API?: Fetcher;
}

export interface ContactPayload {
  name: string;
  email: string;
  phone: string;
  message: string;
  website: string;
}

const EMAIL_MAX_LENGTH = 254;
const PHONE_MAX_LENGTH = 40;
const RATE_LIMIT_WINDOW_SECONDS = 15 * 60;
const RATE_LIMIT_MAX_SUBMISSIONS = 3;
const MAX_REQUEST_BYTES = 12_000;
const rateLimitSchemaReadiness = new WeakMap<object, Promise<void>>();

const json = (body: Record<string, unknown>, status = 200, headers?: HeadersInit) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { "content-type": "application/json; charset=utf-8", ...headers },
  });

const hasControlCharacters = (value: string) => /[\u0000-\u001f\u007f]/.test(value);

export function isValidEmail(email: string): boolean {
  if (email.length < 3 || email.length > EMAIL_MAX_LENGTH || hasControlCharacters(email)) return false;

  const at = email.lastIndexOf("@");
  if (at <= 0 || at !== email.indexOf("@")) return false;

  const local = email.slice(0, at);
  const domain = email.slice(at + 1).toLowerCase();
  if (local.length > 64 || local.startsWith(".") || local.endsWith(".") || local.includes("..")) return false;
  if (!/^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+$/i.test(local)) return false;
  if (domain.length > 253 || !domain.includes(".")) return false;

  const labels = domain.split(".");
  if (labels.some((label) => !label || label.length > 63 || !/^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i.test(label))) {
    return false;
  }

  return /^[a-z]{2,63}$/i.test(labels.at(-1) ?? "") || /^xn--[a-z0-9-]{2,59}$/i.test(labels.at(-1) ?? "");
}

export function validatePhone(phone: string): boolean {
  if (!phone || phone.length > PHONE_MAX_LENGTH || hasControlCharacters(phone)) return false;
  if (!/^[0-9+().\s-]+$/.test(phone)) return false;

  const plusMatches = phone.match(/\+/g)?.length ?? 0;
  if (plusMatches > 1 || (plusMatches === 1 && !phone.trimStart().startsWith("+"))) return false;

  const digitCount = phone.replace(/\D/g, "").length;
  return digitCount === 10 || digitCount === 14;
}

export function validateContactPayload(value: unknown):
  | { ok: true; data: ContactPayload }
  | { ok: false; field: keyof ContactPayload | "request" } {
  if (!value || typeof value !== "object" || Array.isArray(value)) return { ok: false, field: "request" };

  const record = value as Record<string, unknown>;
  const fields = ["name", "email", "phone", "message", "website"] as const;
  if (fields.some((field) => typeof record[field] !== "string")) return { ok: false, field: "request" };

  const data: ContactPayload = {
    name: (record.name as string).trim(),
    email: (record.email as string).trim(),
    phone: (record.phone as string).trim(),
    message: (record.message as string).trim(),
    website: (record.website as string).trim(),
  };

  if (data.website) return { ok: true, data };
  if (data.name.length < 2 || data.name.length > 100 || hasControlCharacters(data.name)) return { ok: false, field: "name" };
  if (!isValidEmail(data.email)) return { ok: false, field: "email" };
  if (!validatePhone(data.phone)) return { ok: false, field: "phone" };
  if (data.message.length < 10 || data.message.length > 2_000 || data.message.includes("\u0000")) return { ok: false, field: "message" };

  return { ok: true, data };
}

export function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  })[character] ?? character);
}

function isAllowedOrigin(request: Request, canonicalHost?: string): boolean {
  const originHeader = request.headers.get("origin");
  if (!originHeader) return false;

  try {
    const requestUrl = new URL(request.url);
    const origin = new URL(originHeader);
    if (origin.pathname !== "/" || origin.search || origin.hash || origin.username || origin.password) return false;

    const isLocal = requestUrl.hostname === "localhost" || requestUrl.hostname === "127.0.0.1";
    const expectedHost = isLocal ? requestUrl.host : (canonicalHost?.trim().toLowerCase() || requestUrl.host.toLowerCase());
    const expectedProtocol = isLocal ? requestUrl.protocol : "https:";
    return origin.protocol === expectedProtocol && origin.host.toLowerCase() === expectedHost;
  } catch {
    return false;
  }
}

async function visitorKey(request: Request, salt: string): Promise<string> {
  const connectingIp = request.headers.get("cf-connecting-ip") ?? request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const bytes = new TextEncoder().encode(`${salt}\u0000${connectingIp}`);
  const digest = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

async function ensureRateLimitSchema(db: D1Database): Promise<void> {
  const database = db as unknown as object;
  let readiness = rateLimitSchemaReadiness.get(database);

  if (!readiness) {
    readiness = db.prepare(`
      CREATE TABLE IF NOT EXISTS contact_rate_limits (
        visitor_key TEXT PRIMARY KEY NOT NULL,
        window_started_at INTEGER NOT NULL,
        submission_count INTEGER NOT NULL
      )
    `).run().then(() => undefined);
    rateLimitSchemaReadiness.set(database, readiness);
  }

  try {
    await readiness;
  } catch (error) {
    rateLimitSchemaReadiness.delete(database);
    throw error;
  }
}

async function consumeRateLimit(db: D1Database, key: string, nowSeconds: number): Promise<boolean> {
  const cutoff = nowSeconds - RATE_LIMIT_WINDOW_SECONDS;
  const row = await db.prepare(`
    INSERT INTO contact_rate_limits (visitor_key, window_started_at, submission_count)
    VALUES (?, ?, 1)
    ON CONFLICT(visitor_key) DO UPDATE SET
      window_started_at = CASE
        WHEN contact_rate_limits.window_started_at <= ? THEN excluded.window_started_at
        ELSE contact_rate_limits.window_started_at
      END,
      submission_count = CASE
        WHEN contact_rate_limits.window_started_at <= ? THEN 1
        ELSE contact_rate_limits.submission_count + 1
      END
    WHERE contact_rate_limits.window_started_at <= ?
       OR contact_rate_limits.submission_count < ${RATE_LIMIT_MAX_SUBMISSIONS}
    RETURNING submission_count
  `).bind(key, nowSeconds, cutoff, cutoff, cutoff).first<{ submission_count: number }>();

  return Boolean(row);
}

function emailBodies(data: ContactPayload): { text: string; html: string } {
  const text = [
    "New DermaDot contact request",
    "",
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    `Phone: ${data.phone}`,
    "",
    "Message:",
    data.message,
  ].join("\n");

  const htmlMessage = escapeHtml(data.message).replace(/\r?\n/g, "<br>");
  const html = `<!doctype html>
<html lang="en"><body>
  <h1>New DermaDot contact request</h1>
  <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
  <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
  <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
  <p><strong>Message:</strong><br>${htmlMessage}</p>
</body></html>`;

  return { text, html };
}

export async function handleContactRequest(request: Request, env: ContactEnv): Promise<Response> {
  if (request.method !== "POST") {
    return json({ ok: false, error: "Method not allowed." }, 405, { allow: "POST" });
  }

  if (!isAllowedOrigin(request, env.CANONICAL_HOST)) {
    return json({ ok: false, error: "Request origin is not allowed." }, 403);
  }

  const contentType = request.headers.get("content-type")?.toLowerCase() ?? "";
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (!contentType.startsWith("application/json") || (Number.isFinite(contentLength) && contentLength > MAX_REQUEST_BYTES)) {
    return json({ ok: false, error: "Invalid request." }, 400);
  }

  let raw = "";
  let body: unknown;
  try {
    raw = await request.text();
    if (!raw || new TextEncoder().encode(raw).byteLength > MAX_REQUEST_BYTES) throw new Error("invalid size");
    body = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Invalid JSON request." }, 400);
  }

  const validation = validateContactPayload(body);
  if (!validation.ok) {
    return json({ ok: false, error: "Please check the submitted fields.", field: validation.field }, 400);
  }

  if (validation.data.website) {
    return json({ ok: true, message: "Message received." });
  }

  if (!env.DB || !env.RATE_LIMIT_SALT) {
    return json({ ok: false, error: "Contact service is temporarily unavailable." }, 503);
  }

  try {
    await ensureRateLimitSchema(env.DB);
    const key = await visitorKey(request, env.RATE_LIMIT_SALT);
    const allowed = await consumeRateLimit(env.DB, key, Math.floor(Date.now() / 1_000));
    if (!allowed) {
      return json(
        { ok: false, error: "Too many requests. Please try again later." },
        429,
        { "retry-after": String(RATE_LIMIT_WINDOW_SECONDS) },
      );
    }
  } catch {
    return json({ ok: false, error: "Contact service is temporarily unavailable." }, 503);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_RECIPIENT || !env.CONTACT_SENDER) {
    return json({ ok: false, error: "Contact service is temporarily unavailable." }, 503);
  }

  const bodies = emailBodies(validation.data);
  const resendRequest = new Request("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
      "idempotency-key": `contact/${crypto.randomUUID()}`,
    },
    body: JSON.stringify({
      from: env.CONTACT_SENDER,
      to: [env.CONTACT_RECIPIENT],
      reply_to: validation.data.email,
      subject: `New contact request from ${validation.data.name}`,
      text: bodies.text,
      html: bodies.html,
    }),
  });

  try {
    const provider = env.RESEND_API ? await env.RESEND_API.fetch(resendRequest) : await fetch(resendRequest);
    if (!provider.ok) {
      return json({ ok: false, error: "We could not send your message. Please try again later." }, 502);
    }
  } catch {
    return json({ ok: false, error: "We could not send your message. Please try again later." }, 502);
  }

  return json({ ok: true, message: "Message sent." });
}
