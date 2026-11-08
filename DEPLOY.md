# VEY LORA — Deploy Guide (Next.js source)

Status as of 2026-11-08: the production build is green locally
(`npm run build` exits 0, 27 static pages, all API routes dynamic).
**The site is NOT live and NOT deployed.** This document is the exact
path from here to live, and what is still blocked.

## 1. The hosting decision (read first — it changes the work)

This app is a full-stack Next.js 14.2.18 app with Prisma 5.22.0.
There are two $0 hosts, and they need different work:

### Option A — Cloudflare Workers (what "Cloudflare Pages" means now)
Cloudflare's own Pages docs (checked 2026-11-08) say full-stack
Next.js (SSR, route handlers, Server Actions) belongs on **Workers**,
not Pages; Pages is only for static export. The adapter for that is
`@cloudflare/next-on-pages` (deprecated — Cloudflare now points at
`@opennextjs/cloudflare`, whose current release needs Next 15.5+/16).

Verified here:
- `@cloudflare/next-on-pages@1.13.15` + `wrangler@3.114.17` are
  installed as devDependencies (1.13.16, the latest, requires
  Next >= 14.3.0, so 1.13.15 is the newest version that installs
  cleanly with this app's Next 14.2.18).
- `npm run pages:build` runs the full Next build, then FAILS at the
  Cloudflare conversion step with a precise error: 10 routes are not
  configured for the Edge Runtime:
  `/api/admin/providers`, `/api/contact`, `/api/demo/[tool]`,
  `/api/newsletter`, `/api/subscriptions`, `/api/tools`,
  `/api/tools/[slug]`, `/api/webhooks/stripe`, `/explore`,
  `/tools/[slug]`.
- Even after adding `export const runtime = 'edge'` to those routes,
  the app still cannot run on Workers as-is: **Prisma Client 5.22
  loads a native Rust engine binary (`libquery_engine`) through
  Node-API, and workerd cannot load native modules.** Every
  database-backed route would fail at runtime.

The fix for Option A (code change, not yet done — needs approval):
1. `npm i @prisma/adapter-neon@5.22.0 @neondatabase/serverless@^0.10.0`
   (adapter-neon 5.22.0's peer range is serverless ^0.6.0–^0.10.0;
   do NOT install serverless 1.x — it is outside the peer range).
2. Add `previewFeatures = ["driverAdapters"]` to the `generator client`
   block in `prisma/schema.prisma`.
3. Construct the client with the adapter in `src/lib/prisma.ts`
   (Neon serverless driver over HTTP, no native engine):
   `new PrismaClient({ adapter: new PrismaNeon({ connectionString }) })`.
4. Add `export const runtime = 'edge'` to the 10 routes listed above.
5. Re-run `npm run build` and `npm run pages:build` to verify.
6. Workers free-plan limits apply (10 ms CPU/request, small bundle
   cap). A busy SSR app may need the Workers Paid plan ($5/month).

### Option B — Plain Node host, e.g. Render free tier (no code changes)
A normal Node.js server runs this app exactly as built here:
`npm run build` then `npm start`, with Prisma talking to Neon over
its normal pooled TCP connection. No adapter, no edge runtime, no
Next upgrade. Render's free web-service tier is the $0 example:
750 hours/month, 512 MB RAM, spins down after 15 minutes idle
(cold start on the next visit). Vercel Hobby also runs it natively
but is **non-commercial only** — it is not acceptable once the site
charges users, so it is not the launch host.

A `render.yaml` Blueprint now exists at the repo root (added
2026-11-08): free Node web service, build `npm install && npx
prisma generate && npm run build`, start `npm start`, health check
`/`, Node 24 pinned via `NODE_VERSION` (Render's current default is
24.22.1, the exact version the build is green on locally; Node 20 is
end of life on Render). All secrets are `sync: false` — set them in
the Render dashboard, never in the file. `next start` reads Render's
`PORT` env var and binds `0.0.0.0` by default (verified from `next
start --help`), so no start-command change is needed. No
`/api/health` route exists; `/` is a static page with no DB call, so
it is the health check. The local curl workaround for Prisma engines
is not needed on Render (normal network — `prisma generate`
downloads its engines itself). Free tier does not support
`preDeployCommand`, so the migration runs as the last step of
`buildCommand` instead (`npm run build && npx prisma migrate
deploy`). The first migration exists
(`prisma/migrations/20261108202200_init`).

**Recommendation for the $0 launch: Option B (Render).** Option A is
the better long-term host but needs the two code changes above plus
a decision on Workers limits.

## 2. Database — Neon free PostgreSQL

1. Create a free Neon account (neon.tech). No card is needed for the
   free tier (per Neon's free tier as checked Oct–Nov 2026: 0.5 GB
   storage per project, 100 compute-hours, compute scales to zero
   after 5 minutes idle — confirm the numbers on the signup page).
2. Create a project. Pick the region closest to the users
   (e.g. Singapore for Bangladesh; the host region does not have to
   match — pick once, it cannot be changed later for that project).
3. Create a database (default name `neondb` is fine) and a role.
4. Neon shows TWO connection strings for the same database:
   - **Pooled** — hostname ends in `-pooler.neon.tech`. This is
     `DATABASE_URL`. The app uses this at runtime. It must include
     `?sslmode=require` (Neon's dashboard string already has it).
     With PgBouncer the string should also carry `?pgbouncer=true`
     — Neon includes it in the pooled string it shows.
   - **Direct** — hostname has NO `-pooler` part. This is
     `DIRECT_URL`. It is used ONLY by `prisma migrate deploy`.
     Never point the running app at the direct URL.
5. Never paste either string into chat or commit it. They go into
   the host's environment variables (see §3) or, for local work,
   into a local `.env` file (gitignored) via the secure entry flow.

Migrations (run once, after the database exists — NOT run yet):
```bash
# from ~/workspace/vey-lora, with DATABASE_URL + DIRECT_URL set
npx prisma migrate deploy
```
This creates all tables from `prisma/schema.prisma`. No migration
has been run anywhere yet; there is no `prisma/migrations/` folder
in this repo (migrate dev will create it — use `migrate deploy`
on the host, never `migrate dev`, for a deployed database).

## 3. Environment variables (set on the host, never in files)

| Variable | Value source | Notes |
|---|---|---|
| `DATABASE_URL` | Neon pooled connection string | Runtime DB access |
| `DIRECT_URL` | Neon direct connection string | Migrations only |
| `NEXTAUTH_URL` | The deployed site URL, e.g. `https://vey-lora.pages.dev` (Option A) or the Render URL (Option B) | Must match the real origin, or sign-in breaks |
| `NEXTAUTH_SECRET` | Generate at deploy time (`openssl rand -base64 32`) on the host or locally and paste via secure entry | Never reuse a placeholder; never commit it |
| `GEMINI_API_KEY` | User's Google AI Studio key | Already proven working; server-side only |
| `GROQ_API_KEY` | User's Groq Console key | Already proven working; server-side only. The server-side client sends a browser-like User-Agent (fixed in `src/lib/providers/types.ts`) — Cloudflare error 1010 blocks the default Node UA |
| `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` | Stripe dashboard, test mode first | Live keys only after the business/payment account is authorised; checkout is test-mode until then |
| `AI_PROVIDER_ORDER` | `gemini,groq` (default) | Optional |
| `GEMINI_MODEL_LITE` / `GEMINI_MODEL` / `GROQ_MODEL` | Defaults in `.env.example` | Optional overrides |

Full list with placeholders: `.env.example`.

## 4. What is NOT wired yet (code work, not deploy config)

- **Email is not wired.** There is no Resend/nodemailer/SMTP code
  in the source; `src/lib/auth.ts` notes the forgot/reset password
  flows are stubs. Password-reset emails will not send until an
  email provider is integrated (Resend free tier: 3,000 emails/month).
- **Stripe Checkout is test-mode abstraction only** (per the QA
  report): no live Checkout session, webhook handling is present
  as a route but end-to-end payment flow has never run against a
  real Stripe account.
- **Admin creation is undecided** (open user decision): no Admin
  account is seeded; the first-account-becomes-Admin vs one-time
  setup choice is still pending.
- **Seed data**: the 18 catalog tools / 15 categories in the source
  are sample data; nothing has been seeded into a real database.

## 5. Ordered checklist — what the user must do on their own accounts

1. [ ] Neon: create account + project + database (§2). Copy the
       pooled string as `DATABASE_URL` and the direct string as
       `DIRECT_URL` via secure entry (never paste in chat).
2. [ ] Decide the host: **Option B (Render free)** for the $0 launch,
       or **Option A (Cloudflare Workers)** if the code changes in
       §1 are approved and done first.
3. [ ] Host account + project: Render — push this source to a
       GitHub repo first (this folder is not a git repo yet), then
       New + -> Blueprint -> connect the repo; Render reads
       `render.yaml`. Or Cloudflare account + Workers/Pages project
       (Option A).
4. [ ] Set every variable in §3 in the host's dashboard.
       Generate `NEXTAUTH_SECRET` fresh at this step.
5. [ ] Run `npx prisma migrate deploy` once against the Neon
       database (from this machine with the env vars set, or from
       the host's deploy hook).
6. [ ] Deploy. Then verify on the live URL: home page loads, sign
       up + sign in works, one AI Studio chat run completes
       (Gemini first, Groq fallback), and the Dashboard shows the
       run in usage history.
7. [ ] Later, when ready to charge: Stripe live keys + webhook
       secret, email provider integration, Admin creation decision.

## 6. Local verification already done (2026-11-08)

- Prisma engine binaries for 5.22.0 (engines commit
  `605197351a3c8bdd595af2d2a9bc3025bca48ea2`) were fetched from the
  official `binaries.prisma.sh` host with curl and SHA-256-verified
  against the published checksums, then placed in
  `node_modules/@prisma/engines/` (plus a `libquery_engine` copy in
  `node_modules/prisma/`). No binary was fabricated; no project
  source was changed for this.
- `npx prisma generate` — OK (247 ms).
- `npx tsc --noEmit` — OK, zero errors.
- `npm run build` — OK (Next 14.2.35, 27 static pages).
- Schema fix required for the parser: Prisma 5.22.0's WASM validator
  rejects single-line `generator`, `datasource` and `enum` blocks
  (proven by isolated A/B tests — identical content validates
  multi-line and fails single-line with P1012). The schema was
  rewritten to multi-line blocks only; no model, field, relation or
  enum value changed. `directUrl = env("DIRECT_URL")` was added to
  the datasource for Neon pooled connections.
- Groq User-Agent fix: `src/lib/providers/types.ts`
  `fetchWithTimeout` now sends a browser-like User-Agent. Verified
  live (no real key used — dummy token): Groq answers
  `401 Invalid API Key` instead of `403` Cloudflare error 1010,
  proving the request reaches Groq.
- `@cloudflare/next-on-pages@1.13.15` + `wrangler@3.114.17`
  installed as devDependencies; `npm run pages:build` runs but
  stops at the Edge Runtime error in §1 (10 routes).
