import assert from "node:assert/strict";
import { access, readFile, readdir, stat } from "node:fs/promises";
import test from "node:test";

const templateRoot = new URL("../", import.meta.url);
const previewRoot = new URL("../app/_sites-preview/", import.meta.url);

async function render(pathname = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${pathname}`, {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("server-renders the DermaDot site", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /<title>Scalp Micropigmentation στην Αθήνα — DermaDot<\/title>/i);
  assert.match(html, /Scalp Micropigmentation/);
  assert.doesNotMatch(html, /\/Users\/[^\s"']+\.vinext\/fonts/i);
  assert.equal([...html.matchAll(/<link rel="preload"[^>]+as="font"/gi)].length, 0, "font subsets should not be blanket-preloaded");
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("all public Greek and English pages render with page-specific metadata", async () => {
  const routes = [
    ["/", "Scalp Micropigmentation στην Αθήνα"],
    ["/info", "Πληροφορίες για SMP"],
    ["/applications", "Εφαρμογές SMP"],
    ["/doctor", "Ανδρέας Πετρόπουλος"],
    ["/what-is-smp", "Τι είναι το SMP"],
    ["/treatment-guide", "SMP ή μεταμόσχευση μαλλιών;"],
    ["/procedure", "Η διαδικασία SMP"],
    ["/aftercare", "Φροντίδα μετά το SMP"],
    ["/contact", "Επικοινωνία και αξιολόγηση"],
    ["/faq", "Συχνές ερωτήσεις για SMP"],
    ["/en", "Scalp Micropigmentation in Athens"],
    ["/en/info", "SMP Treatment Information"],
    ["/en/applications", "SMP Applications"],
    ["/en/doctor", "About Andreas Petropoulos"],
    ["/en/what-is-smp", "What Is SMP?"],
    ["/en/treatment-guide", "SMP or Hair Transplant?"],
    ["/en/procedure", "The SMP Procedure"],
    ["/en/aftercare", "SMP Aftercare"],
    ["/en/contact", "Contact and Consultation"],
    ["/en/faq", "SMP Frequently Asked Questions"],
  ];

  for (const [path, title] of routes) {
    const response = await render(path);
    assert.equal(response.status, 200, `${path} should render`);
    const html = await response.text();
    assert.match(html, new RegExp(`<title>[^<]*${title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}[^<]*</title>`), path);
    assert.match(html, /<meta name="description" content="[^"]+"/i, `${path} has a description`);
    assert.match(html, /<link rel="canonical" href="https:\/\/dermadot\.plus/i, `${path} has the canonical domain`);
    assert.match(html, /<meta property="og:image" content="https:\/\/dermadot\.plus\/og\.jpg"\/?\s*>/i, `${path} has a social preview image`);
    assert.match(html, /<meta name="twitter:card" content="summary_large_image"\/?\s*>/i, `${path} has a large social preview card`);
  }

  await access(new URL("../public/og.jpg", import.meta.url));
});

test("sitemap, robots, favicon and not-found routes are present", async () => {
  const [sitemapResponse, robotsResponse, missingResponse] = await Promise.all([
    render("/sitemap.xml"),
    render("/robots.txt"),
    render("/a-page-that-does-not-exist"),
  ]);
  const [disabledResultsGreek, disabledResultsEnglish] = await Promise.all([
    render("/results"),
    render("/en/results"),
  ]);

  assert.equal(sitemapResponse.status, 200);
  const sitemap = await sitemapResponse.text();
  assert.match(sitemap, /https:\/\/dermadot\.plus\//);
  assert.match(sitemap, /https:\/\/dermadot\.plus\/en\/faq/);
  assert.doesNotMatch(sitemap, /\/results(?:<|\/)/);

  assert.equal(robotsResponse.status, 200);
  const robots = await robotsResponse.text();
  assert.match(robots, /Sitemap: https:\/\/dermadot\.plus\/sitemap\.xml/i);
  assert.match(robots, /Disallow: \/admin\//i);
  assert.match(robots, /Disallow: \/wp-admin\//i);
  assert.match(robots, /Disallow: \/\*\?\*sessionid=/i);
  assert.match(robots, /Disallow: \/api\//i);
  for (const bot of ["Googlebot", "Bingbot", "OAI-SearchBot", "ChatGPT-User", "GPTBot", "Claude-SearchBot", "Claude-User", "ClaudeBot", "PerplexityBot", "Perplexity-User", "Google-Extended", "Applebot", "Applebot-Extended", "CCBot"]) {
    assert.match(robots, new RegExp(`User-agent: ${bot}\\s+Allow: \\/(?:\\r?\\n|$)`, "i"), `${bot} is allowed`);
  }

  assert.equal(missingResponse.status, 404);
  assert.match(await missingResponse.text(), /404|δεν βρέθηκε/i);
  assert.equal(disabledResultsGreek.status, 404);
  assert.equal(disabledResultsEnglish.status, 404);
  assert.match(await disabledResultsEnglish.text(), /This page could not be found\./);
  await access(new URL("../app/icon.svg", import.meta.url));
});

test("all rendered internal links point to a live page", async () => {
  const routes = ["/", "/info", "/applications", "/doctor", "/what-is-smp", "/treatment-guide", "/procedure", "/aftercare", "/contact", "/faq", "/en", "/en/info", "/en/applications", "/en/doctor", "/en/what-is-smp", "/en/treatment-guide", "/en/procedure", "/en/aftercare", "/en/contact", "/en/faq"];
  const destinations = new Set();
  const fragmentsByDestination = new Map();

  for (const route of routes) {
    const html = await (await render(route)).text();
    for (const anchor of html.matchAll(/<a\b[^>]*\bhref="([^"]+)"/gi)) {
      const href = anchor[1].replaceAll("&amp;", "&");
      if (!href.startsWith("/") && !href.startsWith("https://dermadot.plus/")) continue;
      const url = new URL(href, "https://dermadot.plus");
      destinations.add(url.pathname);
      if (url.hash) {
        const fragments = fragmentsByDestination.get(url.pathname) ?? new Set();
        fragments.add(decodeURIComponent(url.hash.slice(1)));
        fragmentsByDestination.set(url.pathname, fragments);
      }
    }
  }

  for (const destination of destinations) {
    const response = await render(destination);
    assert.equal(response.status, 200, `internal link ${destination} should resolve`);
    const html = await response.text();
    const ids = new Set([...html.matchAll(/\bid="([^"]+)"/gi)].map(([, id]) => id));
    for (const fragment of fragmentsByDestination.get(destination) ?? []) {
      assert.ok(ids.has(fragment), `internal link ${destination}#${fragment} should target an element`);
    }
  }
});

test("every public page has one consistent primary consultation action", async () => {
  const routes = ["/", "/info", "/applications", "/doctor", "/what-is-smp", "/treatment-guide", "/procedure", "/aftercare", "/contact", "/faq", "/en", "/en/info", "/en/applications", "/en/doctor", "/en/what-is-smp", "/en/treatment-guide", "/en/procedure", "/en/aftercare", "/en/contact", "/en/faq"];

  for (const route of routes) {
    const html = await (await render(route)).text();
    const english = route === "/en" || route.startsWith("/en/");
    const expectedHref = english ? "/en/contact" : "/contact";
    const expectedText = english ? "Request a consultation" : "Ζητήστε αξιολόγηση";
    const primaryActions = [...html.matchAll(/<a\b[^>]*class="[^"]*\bbutton\b[^"]*"[^>]*href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/gi)]
      .map(([, href, content]) => ({
        href,
        text: content.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim().replace(/\s*→$/, ""),
      }))
      .filter(({ href, text }) => href === expectedHref && text === expectedText);

    assert.ok(primaryActions.length > 0, `${route} should show the localized consultation action linking to ${expectedHref}`);
  }
});

test("rendered content images have alternative text and public image references exist", async () => {
  const routes = ["/", "/info", "/applications", "/doctor", "/what-is-smp", "/treatment-guide", "/procedure", "/aftercare", "/contact", "/faq", "/en", "/en/info", "/en/applications", "/en/doctor", "/en/what-is-smp", "/en/treatment-guide", "/en/procedure", "/en/aftercare", "/en/contact", "/en/faq"];
  let imageCount = 0;
  for (const route of routes) {
    const html = await (await render(route)).text();
    const images = [...html.matchAll(/<img\b[^>]*>/gi)].map(([tag]) => tag);
    imageCount += images.length;
    for (const image of images) assert.match(image, /\balt="[^"]*"/i, `${route}: ${image}`);
  }
  assert.ok(imageCount > 0, "public pages should render content images");

  const publicRoot = new URL("../public/", import.meta.url);
  const publicFiles = new Set(await readdir(publicRoot, { recursive: true }));
  const sourceFiles = [
    await readFile(new URL("../app/globals.css", import.meta.url), "utf8"),
    await readFile(new URL("../app/site.tsx", import.meta.url), "utf8"),
  ].join("\n");
  for (const [, assetPath] of sourceFiles.matchAll(/["']\/(.[^"']*\.(?:png|jpe?g|webp|svg))["']/gi)) {
    assert.ok(publicFiles.has(assetPath), `public asset /${assetPath} should exist`);
  }
});

test("legacy image originals stay in source but deployment redirects to optimized replacements", async () => {
  const publicRoot = new URL("../public/", import.meta.url);
  const [ignoreSource, redirectSource, builtIgnore, builtRedirects] = await Promise.all([
    readFile(new URL("../public/.assetsignore", import.meta.url), "utf8"),
    readFile(new URL("../public/_redirects", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/.assetsignore", import.meta.url), "utf8"),
    readFile(new URL("../dist/client/_redirects", import.meta.url), "utf8"),
  ]);
  const ignoredAssets = ignoreSource
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => /\.(?:png|jpe?g)$/i.test(line));
  const redirects = new Map(
    redirectSource
      .split(/\r?\n/)
      .map((line) => line.trim().split(/\s+/))
      .filter(([source, destination, status]) => source && destination && status)
      .map(([source, destination]) => [source.slice(1), destination.slice(1)]),
  );
  const publicFiles = new Set(await readdir(publicRoot, { recursive: true }));
  let originalsBytes = 0;
  let replacementsBytes = 0;

  assert.ok(ignoredAssets.length > 0, "large duplicate source images should be excluded from the upload");
  for (const original of ignoredAssets) {
    const replacement = redirects.get(original);
    assert.ok(publicFiles.has(original), `source image ${original} stays available in the repository`);
    assert.ok(replacement, `${original} has a legacy URL redirect`);
    assert.ok(publicFiles.has(replacement), `replacement image ${replacement} exists`);
    assert.ok(builtIgnore.includes(original), `build copies the deployment exclusion for ${original}`);
    assert.ok(builtRedirects.includes(`/${original} /${replacement} 301`), `build copies the redirect for ${original}`);
    originalsBytes += (await stat(new URL(original, publicRoot))).size;
    replacementsBytes += (await stat(new URL(replacement, publicRoot))).size;
  }

  assert.ok(replacementsBytes < originalsBytes * 0.1, "optimized replacements should reduce these assets by at least 90%");
});

test("unused generated font subsets are excluded from the Cloudflare asset upload", async () => {
  const ignore = await readFile(new URL("../dist/client/.assetsignore", import.meta.url), "utf8");
  const headers = await readFile(new URL("../dist/client/_headers", import.meta.url), "utf8");
  const clientAssets = new URL("../dist/client/assets/", import.meta.url);
  const files = await readdir(clientAssets, { recursive: true });
  const cssFiles = files.filter((file) => String(file).endsWith(".css"));

  assert.match(ignore, /assets\/_vinext_fonts\/\*\*/);
  assert.match(headers, /\/assets\/\*[\s\S]*?max-age=31536000, immutable/);
  assert.match(headers, /\/fonts\/\*[\s\S]*?max-age=604800, stale-while-revalidate=86400/);
  assert.match(headers, /\/\*\.webp[\s\S]*?max-age=604800, stale-while-revalidate=86400/);
  assert.ok(cssFiles.length > 0, "the client build should include CSS assets");
  for (const file of cssFiles) {
    const css = await readFile(new URL(String(file), clientAssets), "utf8");
    assert.doesNotMatch(css, /_vinext_fonts/, `${file} must not depend on the excluded font cache`);
  }
});

test("Cloudflare analytics is optional and CSP permits only its required endpoints", async () => {
  const response = await render("/");
  const html = await response.text();
  const layout = await readFile(new URL("../app/layout.tsx", import.meta.url), "utf8");
  const csp = response.headers.get("content-security-policy") ?? "";
  assert.match(layout, /NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN/);
  assert.match(layout, /data-cf-beacon/);
  assert.match(layout, /type="module"/);
  assert.match(csp, /script-src[^;]*https:\/\/static\.cloudflareinsights\.com/);
  assert.match(csp, /connect-src[^;]*https:\/\/cloudflareinsights\.com/);
  assert.doesNotMatch(html, /beacon\.min\.js/);

  const clientRoot = new URL("../dist/client/", import.meta.url);
  const clientFiles = await readdir(clientRoot, { recursive: true });
  for (const file of clientFiles.filter((name) => String(name).endsWith(".js"))) {
    const bundle = await readFile(new URL(String(file), clientRoot), "utf8");
    assert.doesNotMatch(bundle, /RESEND_API_KEY|CONTACT_RECIPIENT|CONTACT_SENDER|RATE_LIMIT_SALT|ADMIN_PASSWORD|ADMIN_SESSION_SECRET/);
  }
});

test("keeps starter preview code out of the production project", async () => {
  const [page, layout, packageJson] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../app/layout.tsx", import.meta.url), "utf8"),
    readFile(new URL("../package.json", import.meta.url), "utf8"),
  ]);

  assert.match(page, /<DermaDotSite route="home" \/>/);
  assert.match(layout, /DermaDot — Scalp Micropigmentation Αθήνα/);
  assert.doesNotMatch(page, /codex-preview|_sites-preview|SkeletonPreview/);
  assert.doesNotMatch(layout, /codex-preview|_sites-preview|Starter Project/);
  assert.doesNotMatch(packageJson, /react-loading-skeleton/);

  await assert.rejects(access(previewRoot));
  await assert.rejects(access(new URL("public/_sites-preview", templateRoot)));
});

test("keeps contact secrets server-only and required fields separate", async () => {
  const [clientSource, gitignore, envExample] = await Promise.all([
    readFile(new URL("../app/site.tsx", import.meta.url), "utf8"),
    readFile(new URL("../.gitignore", import.meta.url), "utf8"),
    readFile(new URL("../.env.example", import.meta.url), "utf8"),
  ]);

  assert.match(clientSource, /name="email"\s+type="email"/);
  assert.match(clientSource, /name="phone"[\s\S]*?type="tel"/);
  assert.match(clientSource, /name="website"/);
  assert.match(clientSource, /fetch\("\/api\/contact"/);
  assert.doesNotMatch(clientSource, /RESEND_API_KEY|NEXT_PUBLIC_RESEND/i);
  assert.match(gitignore, /^\.env\*/m, "local environment files should be ignored");
  assert.match(gitignore, /^!\.env\.example$/m, "only the safe example file should be committable");
  assert.match(envExample, /^RESEND_API_KEY=re_your_resend_api_key$/m);
  assert.match(envExample, /^ADMIN_PASSWORD=replace-with-a-strong-password$/m);
  assert.match(envExample, /^ADMIN_SESSION_SECRET=replace-with-a-long-random-secret$/m);
  assert.match(envExample, /^RATE_LIMIT_SALT=replace-with-an-independent-long-random-value$/m);
});
