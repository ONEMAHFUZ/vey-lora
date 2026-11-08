# VEY LORA — AI Tools Marketplace & SaaS

**Tagline:** Discover. Try. Subscribe.
Premium dark UI (deep navy, purple & electric blue). Next.js 14 App Router, TypeScript, Tailwind CSS, PostgreSQL + Prisma, NextAuth, Stripe (test mode).

## Quick start
```bash
cp .env.example .env.local   # fill in DATABASE_URL, NEXTAUTH_SECRET, Stripe test keys
npm install
npx prisma generate
npx prisma migrate dev       # requires a running PostgreSQL instance
npm run dev                  # http://localhost:3000
```

## What's included
- Public pages: Home, Explore, Categories, Tool Details, Pricing, About, Blog, Contact, FAQ, Privacy, Terms; sitemap + robots.
- Marketplace: 15 categories, 18 SAMPLE tools (clearly labelled SAMPLE — ratings/reviews are placeholders, not real data), search/filter/sort/pagination via `/api/tools`.
- Demo engine: 6 demos (Chat Assistant, Text Writer, Summarizer, Translator, Title Generator, Code Explainer) on a provider abstraction. Default provider is a real local rule-based generator labelled LOCAL DEMO; OpenAI provider returns a clear "API key not configured" error when the key is missing. No fake AI output.
- Auth: NextAuth credentials + bcrypt (12 rounds), role enum GUEST/USER/CREATOR/ADMIN/SUPER_ADMIN. Email verification / password reset need an email provider (not yet wired).
- Subscriptions & payments: plan tiers FREE/STARTER/PRO/PREMIUM, Stripe test-mode abstraction, webhook route that verifies signatures. Premium access is NEVER unlocked from a frontend redirect — only verified webhooks change state. No card details are stored.
- Creator flow: submission intake with status workflow Submitted → Under Review → Approved/Rejected → Published. Payouts disabled until legal/tax/payment/identity requirements are met.
- Admin: dashboard shell covering all 20 sections; guard with `isAdmin()` server-side before launch.
- Database: Prisma schema with all 20 models, relations, unique constraints and indexes.

## Deployment
1. Provision PostgreSQL, set `DATABASE_URL`, run `npx prisma migrate deploy`.
2. Set `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, Stripe test keys + webhook secret.
3. `npm run build && npm start` (Vercel, or any Node host). See `QA_REPORT.md` for the honest launch checklist.

## Phase B — Live TEXT providers ($0 free tiers)

`src/lib/providers/` adds a common `TextProvider` interface, a `GeminiAdapter`
(Flash-Lite first, Flash fallback) and a `GroqAdapter` (`openai/gpt-oss-120b`),
plus a router that falls back Gemini → Groq on rate-limit/config/upstream
errors and returns clear user-facing messages. The 6 text tools (chat,
writer, summarizer, translator, title generator, code explainer) run through
it via `POST /api/demo/[tool]`; with no keys set, the labelled local demo
runs exactly as before.

**Env vars (server-side only — never client code, never committed):**

| Var | Purpose |
| --- | --- |
| `GEMINI_API_KEY` | Google AI Studio key (free tier, no card) |
| `GROQ_API_KEY` | Groq Console key (free tier, no card) |
| `AI_PROVIDER_ORDER` | Router order, default `gemini,groq` |
| `GEMINI_MODEL_LITE` / `GEMINI_MODEL` | Model IDs, defaults `gemini-3.5-flash-lite` / `gemini-3.6-flash` |
| `GROQ_MODEL` | Default `openai/gpt-oss-120b` |

**Credits (server-side, before generation):** daily allowance from PLANS —
FREE 20/day, STARTER 500/day, PRO 2000/day, PREMIUM 10000/day; guests 5/day.
1 credit is deducted only after a verified successful run, and every run is
recorded as a `UsageRecord` (provider, model, tokens, cost $0 on free tiers).
Without a live database the same limits are enforced with in-memory
per-day counters (process-local; they do not survive a restart).

**Admin config:** `GET/POST /api/admin/providers` (ADMIN/SUPER_ADMIN only)
reads/writes the `ProviderConfig` row (primary/fallback provider + model,
guest daily limit). Keys are never accepted or returned there.

**Still needed to verify live:** real `GEMINI_API_KEY` + `GROQ_API_KEY`,
a live PostgreSQL (`DATABASE_URL`, `prisma migrate dev` for the new
`ProviderConfig` model + `UsageRecord.provider/model` fields), then
`prisma generate` + `npm run build`. In this workspace `prisma generate`
fails on ECONNRESET downloading engine binaries, so `tsc`/`next build`
fail on the single pre-existing missing-`PrismaClient` error — not on
Phase B code. Image/video/voice/music/data tools are NOT in Phase B
(no provider wired for them yet).

## Known limitations
See `QA_REPORT.md` — no live database here, no real AI key, payments test-mode only, auth route guards and email flows not yet wired.
