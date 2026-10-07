# DermaDot

A clean full-stack starter running on
[vinext](https://github.com/cloudflare/vinext), with optional Cloudflare D1 and
Drizzle support.

## Prerequisites

- Node.js `>=22.13.0`

## Quick Start

```bash
npm ci
npm run dev
npm run build
```

The repository includes `wrangler.jsonc` for direct Cloudflare Workers
Builds deployment. Create the `dermadot-contact` D1 database and configure its
`DB` binding in Cloudflare before deploying. The app currently does not use R2,
so an R2 bucket is not required. The Vite config contains the local D1 database
name and ID used by `npm run dev`.

## Production contact form

The contact form is handled by `POST /api/contact` in the Cloudflare Worker. It
uses the `DB` D1 binding for the exact three-submissions-per-15-minutes rate
limit and calls Resend only from the server.

Configure these hosted runtime values before deploying:

- `RESEND_API_KEY`: Resend server API key.
- `CONTACT_RECIPIENT`: destination mailbox.
- `CONTACT_SENDER`: sender on a domain verified in Resend.
- `RATE_LIMIT_SALT`: a long random secret used to hash visitor identifiers.

For local development, copy `.env.example` to an ignored `.env.local` and use
non-production values. Never prefix these values with `NEXT_PUBLIC_`.

Keep `CANONICAL_HOST` unset until the custom domain is attached: setting it
redirects the `workers.dev` preview to that hostname. The `.env.example` value
is only for local setup; do not commit `.env` files.

### Cloudflare Web Analytics

The app supports Cloudflare's privacy-focused Web Analytics beacon. In the
Cloudflare dashboard, add `dermadot.plus` under **Web Analytics**. If the site is
proxied through Cloudflare, you can enable automatic beacon injection there. For
manual setup (including a `workers.dev` hostname), copy the site's token into
the Cloudflare Builds environment variable
`NEXT_PUBLIC_CF_WEB_ANALYTICS_TOKEN`, then redeploy. This analytics token is a
public site identifier, not a secret; do not put email API keys or other secrets
in `NEXT_PUBLIC_*` variables. The app's CSP allows the Cloudflare beacon and its
reporting endpoint.

## Included Shape

- edit site code under `app/`
- `.openai/hosting.json` declares optional Sites D1 and R2 bindings
- `vite.config.ts` simulates declared bindings for local development
- `db/schema.ts` defines the contact-form rate-limit table. Expired rows are
  pruned hourly by a Worker Cron Trigger.
- `examples/d1/` contains an optional D1 example surface
- `drizzle.config.ts` supports local migration generation when needed

## Useful Commands

- `npm run dev`: start local development
- `npm run build`: verify the vinext build output
- `npm test`: build the site and verify routes, metadata, security headers,
  contact abuse controls, internal links, and rendered content
- `npm run db:generate`: generate Drizzle migrations after schema changes

## Learn More

- [vinext Documentation](https://github.com/cloudflare/vinext)
- [Drizzle D1 Guide](https://orm.drizzle.team/docs/get-started/d1-new)
