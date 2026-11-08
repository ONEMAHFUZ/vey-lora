# VEY LORA — QA Report

Date: 2026-11-07. Environment: Linux VM, Node v24.22.1, npm 10.9.4. No live PostgreSQL here. No real secrets anywhere in the repo (`.env.example` holds placeholders only).

## Commands actually run — observed results

| Command | Result |
|---|---|
| `npm install` (full, with postinstall) | **FAILED** — `ECONNRESET` during postinstall (`node scripts/postinstall.js`, TLS socket aborted). npm log: `/home/hatch/.npm/_logs/2026-11-07T12_58_39_377Z-debug-0.log`. |
| `npm install --ignore-scripts` | **SUCCEEDED** — "added 147 packages in 13s". |
| `npx prisma validate` (via npx download) | Inconclusive — backgrounded, exited 0 with no output captured. |
| `./node_modules/.bin/prisma validate` | **FAILED** — same `ECONNRESET` (Prisma tries to download its query-engine binary over the network). |
| `./node_modules/.bin/prisma generate` (2 attempts) | **FAILED both times** — `Error: aborted … code: 'ECONNRESET'` while fetching Prisma engines. The generated `@prisma/client` therefore does not exist here. |
| `npx tsc --noEmit` | **1 error only**: `src/lib/prisma.ts(1,10): Module '"@prisma/client"' has no exported member 'PrismaClient'` — a direct consequence of `prisma generate` never completing. Every other file typechecks clean. |
| `./node_modules/.bin/next build` | **Partial**: "✓ Compiled successfully" (all pages and API routes compile), then "Failed to compile" at the type-check stage on the same single missing-`PrismaClient` error. No production build artifact was produced. |

Root cause of all failures: this machine's network aborts the TLS connection Prisma uses to download its engine binaries (same class of failure as the earlier Gradle-daemon TCP block on this VM). It is an environment/network limitation, not a code error. On a machine with normal network access, `npm install && npx prisma generate && npm run build` is the expected path.

## Completed

- Project foundation: `package.json` (Next 14, React 18, Prisma 5, NextAuth 4, bcryptjs, zod, Stripe), `tsconfig.json`, `tailwind.config.ts`, `next.config.mjs` (security headers), `postcss.config.js`, `.env.example`, `.gitignore`, `README.md`.
- Prisma schema: **all 20 models** (User, UserProfile, AITool, AICategory, AIToolFeature, AIToolReview, FavoriteTool, SubscriptionPlan, UserSubscription, Payment, UsageRecord, CreditBalance, CreatorProfile, ToolSubmission, Notification, BlogPost, Coupon, AuditLog, SupportTicket, NewsletterSubscriber) with relations, unique constraints, indexes, and enums Role (GUEST/USER/CREATOR/ADMIN/SUPER_ADMIN), PlanTier, SubscriptionStatus, PaymentStatus, SubmissionStatus, TicketStatus. **Schema validity was NOT verified by `prisma validate` here** (see above) — validate it on a network-healthy machine before migrating.
- Lib: `prisma.ts`, `auth.ts` (NextAuth credentials + bcrypt 12 rounds + `hasRole`/`isAdmin`), `ai-providers.ts` (provider interface; `LocalDemoProvider` does real local rule-based generation and is always labelled LOCAL DEMO; `OpenAIProvider` skeleton errors clearly when no key is set — never fakes output), `credits.ts`, `stripe.ts` (test-mode abstraction, webhook verification helper).
- Data: 15 categories, 18 sample tools + 4 plans — all labelled SAMPLE in code and UI; ratings are SAMPLE, no invented real reviews/stats.
- Pages (all real `.tsx`): Home (hero, search, Popular/Trending/New, categories, Why, How It Works, reviews placeholder stating no real reviews exist, newsletter, CTA, footer), Explore (search/category/pricing filters, sorting), Categories, Tool detail (`tools/[slug]`), Pricing, About, Blog, Contact, FAQ, Privacy, Terms, Dashboard (10 sections), Admin (20 sections), Creator (submit + dashboard), Demo (6 demos with input/generate/loading/copy/clear/usage counter/limit message), auth signin/signup, 404, sitemap, robots.
- Components: Navbar, Footer, ToolCard, SearchBar. All nav links point at real routes.
- API routes: `api/tools` (GET pagination/search/filter; POST validated submission intake), `api/tools/[slug]`, `api/demo/[tool]` (input validation, in-memory per-IP rate limit 10/min, provider abstraction), `api/subscriptions`, `api/webhooks/stripe` (signature verification), `api/newsletter`, `api/contact`.

## Incomplete / not done here

- `prisma generate`, `prisma validate`, `prisma migrate` — blocked by the engine-download network failure; no migration has ever run.
- Production build — blocked by the same single missing generated client.
- Auth route guards: dashboard/admin pages are shells; `getServerSession` + redirect and `isAdmin()` enforcement are NOT yet wired (flagged in code comments).
- Email verification, forgot/reset password — need an email provider; not wired.
- Stripe Checkout session creation — `POST /api/subscriptions` returns 503 until test keys are set; webhook handler verifies signatures but has no DB persistence wired yet (TODO in code).
- Newsletter/contact/tool-submission persistence — routes validate input and return honest 503 until the database is configured.
- UsageRecord / credit deduction persistence — same, pending DB.
- No end-to-end test of the running app (`next dev` not run; no live DB/AI key to test against). Demo provider logic was not executed here.

## Known limitations

- All tool listings, ratings and "reviews" are SAMPLE placeholders; the homepage stats show tool/category counts only and state user counts are not yet measured.
- Demo outputs are rule-based LOCAL DEMO results (summarizer, titles, EN→ES dictionary, code explainer templates), clearly labelled in UI and API responses.
- In-memory demo rate limiting is per-process only; use Redis/DB in production.
- Privacy/Terms texts are foundation drafts — have counsel review before launch.

## API keys still required

- `DATABASE_URL` (PostgreSQL) — required for everything persistent.
- `NEXTAUTH_SECRET` — required for auth sessions.
- `STRIPE_SECRET_KEY` / `STRIPE_PUBLISHABLE_KEY` / `STRIPE_WEBHOOK_SECRET` — test mode only; real payments disabled until the business/payment account is authorised.
- `OPENAI_API_KEY` (or another provider key) — required for live AI demos; without it demos run on the labelled LOCAL DEMO provider.

## Database setup status

**No live PostgreSQL here.** No database exists, no migration has run, no data has been seeded. Schema file is written; run `npx prisma migrate dev` against a real PostgreSQL instance on a network-healthy machine.

## Payment status

**Test mode only. No real payments.** No checkout session is created, no card details are stored, and premium access is never unlocked from a frontend redirect — only a verified Stripe webhook may change subscription state (handler present, DB persistence pending).

## Security notes

- No real secrets in the repo; `.env.example` is placeholders only; `.env*` gitignored.
- Passwords hashed with bcrypt (12 rounds); credentials checked server-side only.
- All API inputs validated with zod; demo route rate-limited; secure headers set in `next.config.mjs`.
- API keys are never exposed to the client; Stripe webhook signature is verified before any event is trusted.
- Outstanding before launch: wire auth guards on dashboard/admin/creator, add rate limits to auth endpoints, configure email provider, run `prisma validate` + migrations, complete webhook DB persistence, and re-run the full build on a network-healthy machine.

## Deployment instructions

1. `cp .env.example .env.local` and fill in real values (see "API keys still required").
2. Provision PostgreSQL; `npm install`; `npx prisma generate`; `npx prisma migrate deploy`.
3. `npm run build && npm start` (or deploy to Vercel with the same env vars).
4. Configure the Stripe webhook endpoint (`/api/webhooks/stripe`) in test mode first; verify a test event before going live.
