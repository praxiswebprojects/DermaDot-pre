import { register } from "node:module";

// The production Worker receives this module from the Cloudflare runtime. These
// tests execute the built handler under Node, where only optional tracing is used.
register("./cloudflare-workers-test-loader.mjs", import.meta.url);
