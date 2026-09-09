/** Cloudflare Worker entry point for the vinext-starter template. */
import { handleImageOptimization, DEFAULT_DEVICE_SIZES, DEFAULT_IMAGE_SIZES } from "vinext/server/image-optimization";
import handler from "vinext/server/app-router-entry";
import { handleContactRequest, type ContactEnv } from "./contact";

interface Env extends ContactEnv {
  ASSETS: Fetcher;
  CANONICAL_HOST?: string;
  IMAGES: {
    input(stream: ReadableStream): {
      transform(options: Record<string, unknown>): {
        output(options: { format: string; quality: number }): Promise<{ response(): Response }>;
      };
    };
  };
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
  passThroughOnException(): void;
}

// Image security config. SVG sources with .svg extension auto-skip the
// optimization endpoint on the client side (served directly, no proxy).
// To route SVGs through the optimizer (with security headers), set
// dangerouslyAllowSVG: true in next.config.js and uncomment below:
// const imageConfig: ImageConfig = { dangerouslyAllowSVG: true };

const worker = {
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    const isLocal = url.hostname === "localhost" || url.hostname === "127.0.0.1";
    if (!isLocal) {
      const canonicalHost = env.CANONICAL_HOST?.trim().toLowerCase() || url.hostname.replace(/^www\./i, "");
      if (url.protocol !== "https:" || url.hostname.toLowerCase() !== canonicalHost || url.port) {
        url.protocol = "https:";
        url.hostname = canonicalHost;
        url.port = "";
        return withSecurityHeaders(Response.redirect(url.toString(), 308), request);
      }
    }

    if (url.pathname === "/api/contact") {
      return withSecurityHeaders(await handleContactRequest(request, env), request);
    }

    if (url.pathname === "/_vinext/image") {
      const allowedWidths = [...DEFAULT_DEVICE_SIZES, ...DEFAULT_IMAGE_SIZES];
      const response = await handleImageOptimization(request, {
        fetchAsset: (path) => env.ASSETS.fetch(new Request(new URL(path, request.url))),
        transformImage: async (body, { width, format, quality }) => {
          const result = await env.IMAGES.input(body).transform(width > 0 ? { width } : {}).output({ format, quality });
          return result.response();
        },
      }, allowedWidths);
      return withSecurityHeaders(response, request);
    }

    return withSecurityHeaders(await handler.fetch(request, env, ctx), request);
  },
};

function withSecurityHeaders(response: Response, request: Request): Response {
  const secured = new Response(response.body, response);
  const headers = secured.headers;
  headers.set("content-security-policy", [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    "form-action 'self'",
    "script-src 'self' 'unsafe-inline'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
  ].join("; "));
  headers.set("x-frame-options", "DENY");
  headers.set("x-content-type-options", "nosniff");
  headers.set("referrer-policy", "strict-origin-when-cross-origin");
  headers.set("permissions-policy", "camera=(), microphone=(), geolocation=(), payment=(), usb=()");

  const url = new URL(request.url);
  if (url.protocol === "https:" && url.hostname !== "localhost" && url.hostname !== "127.0.0.1") {
    headers.set("strict-transport-security", "max-age=63072000; includeSubDomains; preload");
  }

  return secured;
}

export default worker;
