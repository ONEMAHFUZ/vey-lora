# VEY LORA — Phase A Inspection Report
## 15-Category AI Functionality — Inspect Before Building

**Date:** 2026-11-07
**Scope:** Phase A ONLY — inspect the current application, database, existing categories, existing AI integrations, and subscription system. **No code was modified in this phase. No Phase B–H work has started.**
**Method:** Read-only inspection of the Next.js source at `~/workspace/vey-lora/` (52 files), `QA_REPORT.md`, `.env.example`, and the live preview artifact `vey-lora` (builder handoff + earlier probe). No files were edited, deleted, or renamed.

---

## 1. What exists today

| Area | State |
|---|---|
| Source | Next.js 14 App Router + TypeScript + Tailwind, 52 files (after `node_modules` removal). `package.json`: Next 14.2, React 18, Prisma 5, NextAuth 4, bcryptjs, zod, Stripe 17 |
| Preview | Web artifact `vey-lora` (static, 5.6 MB) — Home, Explore, Categories, Tool Details, Pricing, Blog, About, Contact, FAQ, Privacy, Terms, 6-demo engine, Dashboard preview, Admin preview, Creator submit flow. Earlier probe verified the Text Summarizer end-to-end (genuine extractive summary, usage counter 12 → 11) |
| Database | **None.** Prisma schema file only (281 lines, 20 models). No PostgreSQL in this workspace, no `DATABASE_URL`, no migration ever run, no seed data |
| Build | **Not production-ready here.** `npm install --ignore-scripts` succeeded (147 packages); full `npm install` failed on postinstall TLS (`ECONNRESET`); `prisma generate` failed twice on the same engine-download `ECONNRESET`; `tsc --noEmit` has exactly 1 error (missing generated `PrismaClient`); `next build` compiled all pages/routes, then failed type-check on that same single error. No production artifact exists. This is an environment/network limit, not a code error |
| Dev server | Not running here (`next dev` never run against a live DB) |
| Secrets | None in the repo. `.env.example` holds placeholders only. No real `.env` file exists |

---

## 2. Categories — all 15 exist in UI and data

`src/data/categories.ts` lists all 15, names exactly as specified. The Categories page and Explore filters use this same list. Homepage shows all 15.

| # | Category | Sample tools in catalogue |
|---|---|---|
| 1 | AI Chatbots | 2 (LoraChat, ChatForge Pro) |
| 2 | AI Writing | 2 (InkPilot, ScriptSmith) |
| 3 | AI Image Generation | 1 (PixelForge) |
| 4 | AI Video Generation | 1 (MotionMint) |
| 5 | AI Voice Generation | 2 (VoxCraft, VoiceVerse) |
| 6 | AI Music | 1 (MelodyMind) |
| 7 | AI Coding | 1 (CodeSage) |
| 8 | AI Business | 1 (BizLens) |
| 9 | AI Marketing | 1 (MarketMaven) |
| 10 | AI Education | 1 (StudyBuddy AI) |
| 11 | AI Productivity | 1 (FlowState) |
| 12 | AI Research | 1 (ResearchRadar) |
| 13 | AI Data Analysis | 1 (DataDive) |
| 14 | AI Design | 1 (DesignDeck) |
| 15 | AI Translation | 1 (LinguaBridge) |

**Total: 18 SAMPLE tools, 1–2 per category.** Every listing, rating, and review figure is labelled SAMPLE. No real creator tools are onboarded. Explore works on this sample data: text search, category filter, Free/Paid/Freemium filter, Highest-rated and Recently-added sort, empty state. Pagination exists only in the API route (`/api/tools`, page/perPage over sample data) — the Explore UI itself shows all filtered results on one page.

---

## 3. Feature coverage — 77 required features mapped

The brief requires 5–6 features per category (77 total). Verdicts: **Live** = genuine output through a configured provider (0 features). **Local-demo partial** = works in the demo but is rule-based, not a live model (7 features, all partial). **Missing** = no implementation at all (70 features).

### Category 1 — AI Chatbots (0 live, 2 partial, 3 missing)
| Feature | State |
|---|---|
| General AI Chat | Partial — `chat-assistant` demo echoes the input back with a "connect a provider" message. Single-turn only |
| Question Answering | Partial — same single-turn demo; no retrieval, no sources |
| Document Chat | Missing — no upload, no document parsing, no retrieval |
| Conversation History | Missing — demo page keeps one input/output in React state; nothing is saved |
| Copy Responses | Working (demo UI copy button) — but the "response" is the local-demo echo |

### Category 2 — AI Writing (0 live, 1 partial, 5 missing)
| Feature | State |
|---|---|
| Blog Writer / Article Generator / Email Writer / Story Writer | Partial, as one generic tool — `text-writer` returns the user's own input back with a demo header. No separate writers, no tone/length controls |
| Grammar Assistant | Missing |
| Text Rewriter | Missing |

### Category 3 — AI Image Generation (0 live, 0 partial, 5 missing)
Text to Image, Image Editing, Image Variations, Image Prompt Assistant, Download Generated Images — **all missing**. PixelForge has `demoAvailable: false`. No image provider, no image API call, no upload, no image output anywhere in the codebase.

### Category 4 — AI Video Generation (0 live, 0 partial, 5 missing)
Text to Video, Image to Video, Video Prompt Generator, Video Generation History, Download Generated Videos — **all missing**. MotionMint has `demoAvailable: false`. No video provider or job/queue system exists.

### Category 5 — AI Voice Generation (0 live, 0 partial, 5 missing)
Text to Speech, Voiceover Generator, Language Selection, Audio Preview, Download Audio — **all missing in source**. VoxCraft / VoiceVerse have `demoAvailable: false`. No TTS provider, no audio generation, no audio file output. (The web *preview* artifact uses browser speech for its own demo voice in other projects — that is not part of this source and is not a VEY LORA voice tool.)

### Category 6 — AI Music (0 live, 0 partial, 5 missing)
AI Music Generation, Background Music, Sound Effects, Music Style Selection, Audio Preview — **all missing**. No music provider, no audio output.

### Category 7 — AI Coding (0 live, 1 partial, 4 missing)
| Feature | State |
|---|---|
| Code Explainer | Partial — `code-explainer` lists the first 12 lines back as bullets, labelled LOCAL DEMO |
| Code Generator / Debugging Assistant / Code Optimization | Missing |
| Programming Language Selection | Missing — no language picker exists |

### Category 8 — AI Business (0 live, 0 partial, 5 missing)
Business Plan Generator, Business Name Generator, Business Report Writer, Proposal Generator, SWOT Analysis — **all missing**. BizLens is a sample listing only.

### Category 9 — AI Marketing (0 live, 1 partial, 4 missing)
| Feature | State |
|---|---|
| Social Media Post Generator / Advertisement Copy / SEO Content Assistant | Partial, as one tool — `title-generator` returns 3 templated titles from the first 6 words |
| Product Description Generator / Marketing Campaign Planner | Missing |

### Category 10 — AI Education (0 live, 1 partial, 4 missing)
| Feature | State |
|---|---|
| AI Tutor / Topic Explanation / Study Notes / Learning Assistant | Partial, via `summarizer` — StudyBuddy AI reuses the summarizer demo key; it summarises pasted text, it does not tutor or explain |
| Quiz Generator | Missing |

### Category 11 — AI Productivity (0 live, 1 partial, 4 missing)
| Feature | State |
|---|---|
| Text Summarizer | Partial — `summarizer` is a genuine extractive summarizer (first third of sentences), verified in the preview probe |
| Task Planner / Meeting Notes / Email Summarizer / Daily Workflow Assistant | Missing (email summarising is not separate from the generic summarizer) |

### Category 12 — AI Research (0 live, 1 partial, 4 missing)
| Feature | State |
|---|---|
| Research Summaries | Partial — same generic summarizer reused under ResearchRadar |
| Research Assistant / Topic Analysis / Document Analysis / Source and Citation Assistance | Missing — no search, no sources, no citations |

### Category 13 — AI Data Analysis (0 live, 0 partial, 5 missing)
CSV Upload, Data Summary, Data Visualization, Charts, Report Generation — **all missing**. A grep for upload / FormData / multipart / CSV / Blob across `src/` returns **nothing**. DataDive is a sample listing only.

### Category 14 — AI Design (0 live, 0 partial, 5 missing)
Logo Concept Assistant, Design Prompt Generator, Color Palette Generator, Branding Assistant, Creative Design Ideas — **all missing**. DesignDeck is a sample listing only. (Color palettes / logo concepts need an image or text provider — neither exists.)

### Category 15 — AI Translation (0 live, 1 partial, 4 missing)
| Feature | State |
|---|---|
| Text Translation | Partial — `translator` uses a 10-word EN→ES dictionary (`hello→hola`, `thank→gracias`, …); unknown words pass through unchanged. Labelled as a demo dictionary |
| Multi-language Translation / Language Detection / Translation History / Copy Translated Text | Missing — one fixed language pair, no detection, no history (copy exists in demo UI) |

**Coverage totals: 0 live / 7 local-demo partial / 70 missing out of 77.**

---

## 4. AI provider architecture — what exists, what does not

**Exists (`src/lib/ai-providers.ts`, 1 interface + 2 providers):**
- `AIProvider` interface: `generate({ prompt, input, demoKey }) → { output, provider, model, isLocalDemo }`
- `LocalDemoProvider` ("local-demo", model `local-rules-v1`): real rule-based generation — extractive summarizer, templated titles, 10-word EN→ES dictionary, code-line lister, text-writer echo, chat echo. Every result is flagged `isLocalDemo: true` and the UI appends "LOCAL DEMO output (rule-based, not a live AI model)"
- `OpenAIProvider` skeleton: if `OPENAI_API_KEY` is missing it throws a clear configuration error; if the key *is* present it still throws — "live call not yet wired". It never fabricates output
- `getProvider()`: reads `AI_PROVIDER` (default `"local-demo"`); `"openai"` selects the skeleton, anything else falls back to local demo
- Demo API route `POST /api/demo/[tool]`: only 6 demo keys accepted (`chat-assistant`, `text-writer`, `summarizer`, `translator`, `title-generator`, `code-explainer`); zod validation (input 1–5000 chars, prompt ≤ 500); in-memory per-IP rate limit 10/min; errors return 400 / 404 / 429 / 503 with messages — no fake success

**Does NOT exist:**
- No image, video, audio/voice, or music provider or adapter of any kind
- No provider for data analysis, no file-processing service
- No Anthropic provider implementation (the env var `ANTHROPIC_API_KEY` is listed as a placeholder in `.env.example` only — no code reads it)
- No provider/model configuration storage — **there is no `ProviderConfig` / `ApiProvider` model in the Prisma schema at all**
- No model selection UI or API; no timeout handling (no live fetch exists to time out); no token/usage/cost logging at runtime (the `UsageRecord` table is defined but **never written to** — the demo route carries a comment: "UsageRecord persistence is wired once DATABASE_URL is configured")
- No admin provider-configuration UI (see §7)
- Keys are never exposed to the frontend — the only key reads are server-side `process.env` in `ai-providers.ts` / `stripe.ts`. Good.

---

## 5. Database — schema designed, never created

Prisma schema (20 models) — relevant models and their gaps for this brief:

| Model | Has | Missing for this brief |
|---|---|---|
| `AICategory` | id, name/slug unique, description, icon, tools relation | — (adequate) |
| `AITool` | name/slug, descriptions, logo/website URL, category, pricingType, priceMonthly, `demoAvailable`, `isPublished`, `isSample`, languages, creator, features/reviews/favorites/usage relations | **No `creditCost`, no `provider`, no `model`, no daily/monthly limit, no per-tool enabled flag beyond `isPublished`** |
| `SubscriptionPlan` | tier unique, priceMonthly/Yearly, `monthlyCredits`, stripePriceId, isActive | — (adequate for plans) |
| `UserSubscription` | user, plan, status enum, stripeSubscriptionId, currentPeriodEnd, cancelAtPeriodEnd | — (adequate) |
| `CreditBalance` | user unique, `balance`, updatedAt | **No ledger / transaction history — balance changes are untraceable** |
| `UsageRecord` | user?, tool?, demoKey, tokens, costUsd, createdAt | **No `creditsUsed`, no provider/model, no status (success/failed), no error field** |
| `Payment` | user, amount, status enum | — (adequate, unwired) |
| `User` / `UserProfile` | role enum (GUEST/USER/CREATOR/ADMIN/SUPER_ADMIN), profile | Email verification state is not modelled |

**Schema validity was never verified here** (`prisma validate` failed on the engine download). No migration, no seed, no data.

---

## 6. Subscription & credit system — designed on paper, not enforced

- **Plans (hardcoded in `src/data/tools.ts`, mirrored by the schema):** FREE $0 — 20 daily credits; STARTER $9/mo ($90/yr) — 500 monthly credits; PRO $19/mo ($190/yr) — 2,000; PREMIUM $39/mo ($390/yr) — 10,000
- **`src/lib/credits.ts`:** constants only — guest daily limit 5, user daily limit 20, demo cost 1 credit. **Nothing imports these constants.** The demo API route does not check credits, does not check the user, and does not deduct anything. Its only guard is the in-memory per-IP 10/min rate limit
- **Demo usage counter** exists in the demo page and in the preview (session-only `uses/limit` state, e.g. 12-run session limit in the preview). It is **client-side state, not a server balance** — it must never be trusted for billing
- **Subscriptions API:** `GET /api/subscriptions` returns the hardcoded plans with a "Test mode only" note. `POST` returns **503** — "Checkout is not enabled yet: Stripe keys are not configured"
- **Stripe:** `src/lib/stripe.ts` — test-mode abstraction; `getStripe()` returns null for missing/placeholder keys; webhook signature verification helper exists. No Checkout session is ever created. Premium is never unlocked from a frontend redirect (by design; webhook handler exists but has no DB persistence wired)
- **Dashboard:** shell only — "Remaining Credits 20 / 20 (SAMPLE)", "Usage Statistics — Demo runs, tokens and cost tracked per day" as static text. No live numbers
- **Duplicate / unauthorized usage prevention:** none beyond the per-IP rate limit. No idempotency key, no per-user check, no server-side balance check

---

## 7. Admin controls — headings only

`src/app/admin/page.tsx` (18 lines) lists 20 sections including "API Providers", "AI Tools", "Usage Analytics", "Revenue Analytics" — each renders only "— (no live data yet)". A note states admin actions "are implemented as API routes backed by Prisma once DATABASE_URL is set". **None of the required admin abilities exists:** no enable/disable per tool, no provider credential configuration, no model selection, no credit-cost setting, no daily/monthly limit setting, no free-demo-limit setting, no usage/cost monitoring, no error/failed-request view, no tool-availability management.

Auth guards are also unwired: the admin page carries the comment "Guard with isAdmin(role) server-side before launch", the dashboard "wire NextAuth getServerSession + redirect". `src/lib/auth.ts` itself is sound (NextAuth credentials provider, bcrypt 12 rounds, `hasRole` / `isAdmin` helpers, JWT session with role) — but **no page or API route calls it**. Email verification and forgot/reset password are unwired stubs; no email provider exists.

---

## 8. Security & reliability — Phase A findings

| Requirement | State |
|---|---|
| Server-side API integration | Partial — demo route is server-side, but only for 6 text demos; no live provider call exists |
| Secure env vars / keys never in frontend | **Good** — placeholders only; keys read server-side only |
| Input validation | Partial — zod on the demo route only; no other tool inputs exist to validate |
| Rate limiting | Weak — in-memory per-IP map, per-process only; resets on restart; no per-user limits; no Redis/DB |
| File upload validation / size limits / safe processing | **Absent** — no upload code exists at all |
| User data isolation | Designed in schema (userId relations, Cascade/SetNull) but **never exercised** — no DB, no guards, demo route is anonymous |
| Secure authorization | Not wired (see §7) |
| API error handling | Good in the demo route (400/404/429/503 with messages, no fake success) |
| Provider timeout handling | Absent — no live provider call to time out |
| Usage and cost logging | Absent at runtime — schema fields exist, never written |
| Download functionality | Copy/clear exist in demo UI; **no download of generated media exists** (nothing is generated) |
| Mobile responsive | Layouts use responsive Tailwind grids; the preview probe found no mobile horizontal overflow |

---

## 9. What Phase B–H must add (no work started)

1. **Schema additions:** `ProviderConfig` (provider, model, encrypted key reference, isActive, cost per unit), per-tool `creditCost` / `provider` / `model` / limits, `UsageRecord` fields (creditsUsed, provider, model, status, error), a credit ledger table, idempotency keys
2. **Providers (each needs a configured key + adapter):** text (OpenAI/Anthropic — skeleton exists, call unwired), image, video, voice/TTS, music, data-analysis/file service. No provider is configured today; **provider choice is a user decision, not an assumption**
3. **71 new or rebuilt tool implementations** (70 missing + the 7 partials hardened to live providers), each with input validation, loading, copy/clear, download where applicable, usage counter, error states
4. **File pipeline:** upload validation, size limits, safe processing, CSV parsing, chart generation, document chat retrieval
5. **Credits enforcement:** server-side balance check before processing, deduct only on verified usage, record every request, per-user + per-IP rate limits, duplicate prevention
6. **Admin:** full provider/tool configuration area (enable/disable, credentials, models, costs, limits, usage/cost monitoring, error log)
7. **Auth wiring:** guards on dashboard/admin/creator + API routes, email verification, password reset
8. **Verification:** `prisma generate` + migrate on a network-healthy machine with PostgreSQL, `npm run build`, per-category tests

## 10. Decisions needed from the user before Phase B

1. **Which providers?** Text (OpenAI, Anthropic, other?), image, video, voice, music — and who supplies the API keys / budget? I will not invent keys or pick paid providers on your behalf.
2. **Credit costs:** same 1 credit per tool, or different costs per category (image/video/audio cost more)? Free demo limits per day?
3. **Scope order:** the brief lists Phases C→F in order (text → image/design → video/voice/music → data). Confirm that order, or re-prioritise (e.g. voice/music before video).
4. **Preview vs source:** the web preview is static and cannot run server-side providers, credits, or payments. New tools will be built in the **Next.js source first**; the preview can only mirror them as a labelled demo afterwards. Confirm this split is acceptable.

**Phase A is complete. No functionality was changed. Awaiting approval + the four decisions above before Phase B.**
