# MY EXISTING AI PROJECTS — Project Integration Report

**For:** VEY LORA (AI Tools Marketplace & SaaS — Discover. Try. Subscribe.)
**Date:** 2026-11-07
**Purpose:** Inspection only. No integration has started. No existing project was modified, deleted, renamed, or overwritten in preparing this report.
**Method:** Read-only inspection of files in the Muse AI workspace, artifact status, and project READMEs / QA / test reports already on disk. No code was copied. No secret values were printed or stored here — only the *existence* and *location* of placeholders was noted.
**Status of VEY LORA at inspection time:** Phase 1 foundation only. Next.js 14 + TypeScript + Tailwind + Prisma schema (20 models). No live PostgreSQL, no live payments, no AI provider key. Preview artifact `vey-lora` exists; source ZIP `vey-lora-source.zip` (67K, SHA-256 28c028a9…e0).

---

## Summary table

| # | Project | What it is | Working status | Demo available | Safe for multiple users today? | Recommended integration |
|---|---|---|---|---|---|---|
| 1 | ReadForMe Demo | Flutter reading app: listen instead of reading (bn/en TTS, PDF, OCR, AI assistant, cloud sync, Premium) | Source complete v0.2.0, **never built or run here** | Yes — web demo (shared) | Designed for it, **not proven** — no live backend test | **Best candidate.** List as external tool + link to web demo now; API integration later, after its backend is live |
| 2 | Facebook Page AI Agent Demo | Niloy Store demo shop agent: friendly Bangla chat + voice, orders, Post Maker | Demo only, v13; **no Facebook connection at all** | Yes — web demo (not shared) | **No** — no auth, single shared demo shop | Link-out concept demo only. Real integration needs a Meta backend first |
| 3 | MYBOOK | Privacy-first social network + Creator Earning Platform | Extensive demo preview; **no real social network, no DB, no auth** | Yes — web preview (shared, v60) | **No** — single hardcoded user, no auth on API routes | Separate deployment only. Do not merge its server into VEY LORA |
| 4 | Jarvis (ONEMAHFUZ) | Friend-like Bangla voice assistant (panel + Android app + Python/Flask PC versions) | Three diverging lines; panel demo works, **no APK, Flask server code not in workspace** | Yes — web panel (shared) | **No** — single-user local assistant by design | Link-out demo only. Never expose its PC system commands as a service |

**Headline finding: none of the four projects is production-ready for multi-user use inside VEY LORA today. Only ReadForMe was *designed* for multi-user use, and even that has never run against a live backend. Everything else must stay a separate, clearly-labelled demo until its backend, auth, and per-user isolation exist and are tested.**

---

## 1. ReadForMe Demo

### 1. Project name
ReadForMe — "Read Less. Listen More. Learn Better."

### 2. Main features
- Smart text reader (Bengali + English TTS, voice selection, sentence highlighting, Play/Pause/Resume/Stop, rate/volume/pitch, sleep timer)
- "Listen to this boxed text" bar, tap-a-sentence listening, listen-to-selected-text
- PDF reader (view + text extraction, page bookmarks)
- Scan / OCR: English via Google ML Kit; Bengali via Tesseract (`ben+eng`)
- Camera tab: photograph a document, save it to the library (browser-local in the web demo)
- Offline SQLite library, bookmarks, reading history, folders
- AI Reading Assistant: summary (adjustable length), simple-language explanation, Bengali explanation of English text, key points, quiz generator, word explanations
- Reading analytics (minutes, streak, goals, weekly chart), onboarding, accessibility settings
- Cloud Sync (offline-first, newer `updatedAt` wins, tombstones) and Premium tiers (Free / Premium)

### 3. Technology stack
- **App:** Flutter / Dart, Riverpod, `sqflite`, `flutter_tts`, `google_mlkit_text_recognition`, `flutter_tesseract_ocr`, Syncfusion PDF viewer + PDF, `file_picker` / `image_picker`, `dio`, `flutter_secure_storage`, `in_app_purchase`
- **Backend (source only):** Express 5 + TypeScript + Prisma 6 + PostgreSQL, JWT with rotating refresh tokens, `bcryptjs`, `helmet`, `express-rate-limit`, CORS
- **Web demo:** static web artifact (`readforme-demo`), browser `speechSynthesis` TTS, browser local storage — no Flutter, no server

### 4. Current working status
- Flutter source v0.2.0 at `~/workspace/readforme/` — **107 files, 59 Dart files in `lib/`, 14 screens, 8 test files**
- **Not built or run here, ever:** no Flutter/Dart SDK in this environment (a git clone of the SDK was declined by the user and was not retried). `flutter analyze`, `flutter test`, `flutter run`, APK/AAB/IPA — **none done, no installable file exists**
- Backend source written and reviewed by inspection only. `npm install`, `prisma generate`, `prisma migrate`, `tsc`, any run — **not done here** (no PostgreSQL, no `DATABASE_URL`). **No live backend exists.** Default API URL `https://api.readforme.app` is unreachable by design
- Bengali TTS voice, Bengali OCR accuracy, PDF rendering, SQLite on-device — **not tested on a real device**
- Known gaps in source: `ben.traineddata` is **not bundled** (needed for Bengali OCR); Syncfusion needs a commercial or Community licence; subscription receipt verification returns 501 by design (stub, never fakes success); password-reset email is a no-op until a mail provider is wired; object storage not configured

### 5. Demo availability
- Yes. Web demo artifact `readforme-demo` (v4, **shared** public link). Home, Reader, Library, Bookmarks, History, Camera, Settings — in Bengali and English. Real browser TTS; Bangla works only if a Bengali voice is installed on the test device, otherwise it shows the install path. Demo-only: no PDF import, no real OCR, no AI server call, no cloud sync.

### 6. Integration method
- **Now (no code changes):** list ReadForMe as a tool in VEY LORA's Explore catalogue with a "Try web demo" link-out to its own demo, labelled SAMPLE/demo. Separate deployment — do not embed its Flutter code into the Next.js app.
- **Later (after approval + backend live):** authorized API integration — VEY LORA calls the ReadForMe backend (`/auth`, `/sync`, `/ai`, `/subscription`) with a per-user Bearer token; VEY LORA never holds the AI key (it stays in the ReadForMe backend `.env`). Its AI-proxy and quota pattern can also inform VEY LORA's own demo engine, by reference — not by copying code blindly.

### 7. Required changes
1. Build on a machine with Flutter 3.47.9 + Android Studio / Xcode; sign and publish APK/AAB/IPA
2. Bundle `ben.traineddata`; confirm Syncfusion licence
3. Provision PostgreSQL; set `DATABASE_URL`, `JWT_SECRET`, `AI_API_KEY` / `AI_MODEL`, email provider, Play/App Store products, domain + TLS
4. Run `flutter analyze`, `flutter test`, backend `prisma migrate`, and device tests (Bengali voice, Bengali OCR, PDF, offline mode)
5. Add `https://vey-lora…` to the backend `CORS_ORIGINS` allowlist before any cross-origin call

### 8. Security concerns
- **Good design (unverified live):** tokens only in `flutter_secure_storage`; entitlement verified by the backend, never by the client alone; AI key only in backend `.env`; no real `.env` file in the repo (placeholders only); per-user quotas (Free 10 AI / 20 OCR per day, Premium 100 / 200)
- **Concerns:** subscription verification is a 501 stub; email reset is a no-op; sync conflict rule and per-user isolation exist in code but have **never been tested against a live server** — do not claim multi-user safety until they are. Bengali voice is device-dependent; never assume it exists.

---

## 2. Facebook Page AI Agent Demo

### 1. Project name
Facebook Page AI Agent Demo — demo shop "Niloy Store"

### 2. Main features
- Messenger/WhatsApp-like chat: client talks naturally, agent replies in clear Bangla script, direct answer first, short simple sentences (even for Roman Bangla input)
- Product picture flow: asks which product first, then shows only that product's 4–5 pictures in a side-scrollable strip (up to 16 on "aro dekhaw")
- Price questions answered as text only, no picture cards; size-marked ordering
- Order List, Post Maker, demo call screen with slow, clear Bangla female voice (speech synthesis), mic listening loop

### 3. Technology stack
- **Web artifact only** (`facebook-page-ai-agent-demo`, 23 MB). Client-side demo logic, session memory, browser speech synthesis. **No source folder in the workspace, no backend, no Meta SDK, no Graph API code.**

### 4. Current working status
- Live version v13 (restored v11 feature set). The v12 plain-chat-only simplification was rejected by the user and reversed — hero, option buttons, catalog, Order List, Post Maker, and call screen are all back
- **Demo-only. Reload resets everything.** No orders are really received, no posts are really published
- **No Facebook account is linked here; Messenger is not connected; no Page access exists.** Real 24-hour auto-reply needs Meta Business + Page access + a webhook server — none of that exists
- Voice/mic is **not fully verified**: the in-Muse preview blocks the mic; it needs real phone Chrome with mic permission. The user's own check of the restored demo is still pending

### 5. Demo availability
- Yes. Web demo artifact, **not shared** (preview card only). Testable in chat as a client talking to the Niloy Store agent.

### 6. Integration method
- **Now:** link-out concept demo only, clearly labelled "Demo — not connected to any real Facebook Page". Do not present it as a VEY LORA tool that works on a visitor's Page.
- **Later (real integration):** separate backend service — Meta app + Page access token held **server-side only**, webhook signature verification, Graph API for inbox/posts/orders, per-Page/per-user token isolation. VEY LORA would call that service with a per-user token; it would never see the Page token.

### 7. Required changes
1. Connect Facebook / Meta Business, grant Page access, create a Meta app
2. Build a webhook server (verify signatures, handle inbox events, 24h reply window rules)
3. Per-Page order storage, product catalogue per Page (today's catalogue is hardcoded demo data)
4. Bangla intent/NLU + product lookup backed by real data, not demo replies
5. Voice: Messenger voice replies are limited by the official API — design around text-first, voice only where the channel allows it

### 8. Security concerns
- **High risk if integrated naively.** The demo has **no authentication at all** and a single shared demo shop. There is no per-user data separation — every visitor sees the same Niloy Store, the same orders, the same session.
- A real Page access token must **never** be placed in client-side code or in a shared demo. One user's Page token must never be visible to, or usable by, another VEY LORA user. Until a server-side token vault + per-user scoping exists, this project **cannot** safely support multiple users.

---

## 3. MYBOOK

### 1. Project name
MYBOOK — privacy-first social network + Creator Earning Platform

### 2. Main features
- News Feed, Messenger, Friends, Reels, Marketplace, Groups, Pages, Privacy (scan/audit), Profile (Facebook-style layout), Settings
- Creator Dashboard as separate pages: Analytics / Content / Community / Monetize / Tools
- Creator Programs (10): Starter Program, New Creator Boost, Transparent Earning System, Fan Support, Brand Collaboration Marketplace, Fan Membership, AI Creator Studio, Creator Challenges, Growth Coach, Digital Shop
- MYBOOK Identity hub (10): Fair Reach, Feed Control, Smart Communities, Growth Coach, Collaboration Match, Transparent Income, AI Studio, Collections, Member Recognition, Trust Center
- Phase 3 modules: Smart Search, Smart Scheduler, Co-Create Posts, Global Events, Live Rooms
- Dark + Gold luxury theme (default) with Classic theme switch; Bangla / English toggle
- Earnings / cashout screens (demo numbers only)

### 3. Technology stack
- **Original uploaded project:** React 19 + Vite + Express + TypeScript, **in-memory data in `server.ts`**, 16 REST routes, `@google/genai` (Gemini) client created server-side
- **Preview:** web artifact `mybook` (v60, **shared** public link), 1.3 GB artifact space
- **Android:** native Kotlin + Jetpack Compose source (`mybook-app-v2.zip`, 14 files, compileSdk/targetSdk 35)
- **Phase 1 backend (new, separate):** Express + TypeScript + PostgreSQL + Prisma 6, 12 models (`User`, `UserProfile`, `Session`, `Post`, `Media`, `Comment`, `Reaction`, `Follow`, `Notification`, `Report`, `UserBlock`, `PostSave`), `GET /health` only

### 4. Current working status
- **Preview is a demo, not a real social network.** Page reload resets it. No real users, no real posts, no real money, no real end-to-end encryption — despite the "privacy-first" branding
- Original server: in-memory arrays, a single hardcoded `currentUser` (`user_1`), **no authentication, no database**
- Phase 1 backend: **STEP 1 only, verified** — Prisma validation / Client generation, TS check/build passed, `GET /health` 200 (`databaseConfigured: false`). **STEP 2 blocked:** no PostgreSQL, no dev/test database, no `DATABASE_URL` / `DIRECT_URL`. No migration has ever run; no auth / posts / comments code exists in the new backend
- Android source: **not a compiled APK, not built/tested here** (Gradle build failed on the machine's TCP block; needs Android Studio). A user trying to install the source ZIP itself cannot install it — only an `.apk` installs
- A single-file `mybook.html` (86 MB) exists for double-click PC trial; confirmation pending
- Unresolved decision (2026-11-01): Dashboard header name matches a real person's name from a screenshot photo, which the user previously said not to copy — whether to keep it linked to Profile or change it to a neutral demo name is still awaiting the user's choice

### 5. Demo availability
- Yes. Preview artifact `mybook` (v60, shared). Also the Android source ZIP and the Phase 1 backend transfer ZIP (`mybook-backend.zip`) exist as files.

### 6. Integration method
- **Separate deployment only.** Do not merge MYBOOK's in-memory server into VEY LORA, and do not copy its demo data or its real-person names/photos into VEY LORA.
- What *can* transfer (after approval, by design reference — not by copying code blindly): the Creator Dashboard / Creator Programs *concepts* for VEY LORA's own creator features, and the Phase 1 backend *pattern* (Express + Prisma + PostgreSQL) which already matches VEY LORA's stack. Any shared code would need real auth + migrations first.

### 7. Required changes
1. PostgreSQL + migrations; real JWT/session auth; per-user data for every route
2. Move the Gemini key fully server-side with per-user quotas; remove the AI-Studio-injected key path from any production build
3. Real storage for media, real moderation/reporting workflow, real payouts only after legal / tax / payment / identity requirements are satisfied
4. Android build in Android Studio to produce a real APK; iOS project does not exist
5. Resolve the Dashboard header-name decision; replace all demo content that copies a real person's name, photo, or posts

### 8. Security concerns
- **Critical, as shipped in the original upload:** the original `server.ts` creates a Gemini client from an environment-injected key, serves **16 REST routes with no authentication**, and stores everything in shared in-memory arrays under one hardcoded user. Anyone calling the API acts as `user_1` — they can post, like, and comment as that user. There is **no per-user isolation at all**.
- Privacy claims in the UI (encrypted posts, privacy scan, "zero-knowledge auth") are **demo labels, not real cryptography** — the preview itself says so, and VEY LORA must never repeat those claims as fact.
- Earnings balances are demo numbers; presenting them as real money would be misleading. No real `.env` file exists in the workspace (placeholders only), which is good — but the key-injection path in the original project must be removed before any hosted deployment.

---

## 4. Jarvis (ONEMAHFUZ)

### 1. Project name
Jarvis — multifunctional Jarvis-style assistant, named ONEMAHFUZ (assistant name chosen 2026-10-25; avatar from the user's uploaded photo, white embroidered kurta)

### 2. Main features
- Friend-like Bangla chat: check-ins (khoj-khobor), stories/adda, general questions "like ChatGPT", top-10 latest news summaries for any country
- Bangla voice, conversational back-and-forth; preferred voice: female "Aria", warm, slightly slower
- Phone tasks (Android app): battery, dial, alarm, SMS intents
- PC version: Tkinter HUD, voice via `pyttsx3` + `SpeechRecognition`, Wikipedia (Bangla), open Notepad/Calculator/Explorer, play music, create files, shutdown/restart (with confirmation)
- Flask web UI (`jarvis.html`): dark HUD + holographic orb, Bangla clock/date, mic button, text input, 6 quick chips, console — matches Flask routes `POST /listen` and `POST /process`, with a browser demo fallback when Flask is not running

### 3. Technology stack
- **Web panel:** artifact `jarvis` (shared), static panel + demo test console; direct-answer routing for Bangla questions (so function words / endearments are not sent to encyclopedia lookups)
- **Android:** native Kotlin source (`onemahfuz-app.zip`, 14 files) — Bangla chat + `bn-BD` voice + free Pollinations AI (`https://text.pollinations.ai/…`, called directly from the app, no key) + phone intents
- **PC:** Python (`jarvis-fixed.py`, Tkinter) and Flask (`jarvis.html` front-end only in this workspace)
- **Voice:** browser `speechSynthesis` / `pyttsx3` on PC; no hosted voice service

### 4. Current working status
- **Three diverging lines, not one product:** (a) web panel artifact, (b) Android Kotlin source, (c) Python/Flask PC code. The user has repeatedly said they want an **OS app, not a webpage** — the panel was only an interim workaround
- Panel demo works in preview; voice comes late / needs mic permission + refresh, and confirmation that Bangla voice works after allowing the mic is still pending
- Android source: **not a compiled APK, not built/tested here** (no SDK); building needs Android Studio
- Flask: the **original Flask server code (`app.py`) is not in this workspace** — only `jarvis.html` and the separate fixed Python script exist — so the PC Flask run cannot be verified here. `jarvis-fixed.py` was reviewed and fixed (crash fixes, shutdown confirmation, Bangla dates) but **not run here**
- Past trust issue (recorded): the panel gave identical generic religious-creation answers to different "who made you?" questions and misrouted Bangla questions to encyclopedia lookups; direct-answer routing was added as a fix and must be regression-tested, not assumed

### 5. Demo availability
- Yes. Web panel artifact `jarvis` (shared) and `jarvis.html` (18K) for PC Flask use. No APK, no hosted backend.

### 6. Integration method
- **Now:** link-out demo only — list Jarvis in VEY LORA as an external assistant with a link to its panel, labelled demo / single-user. Its Bangla direct-answer routing and voice UX can *inform* VEY LORA's demo engine design, by reference.
- **Later (after approval):** a single canonical Jarvis backend (one API, per-user memory / soul / settings, provider key server-side) that VEY LORA calls as an authorized API. Do not wire the panel, the Android app, and the Flask code together as they stand — pick one line first.

### 7. Required changes
1. Decide the canonical form: Android OS app (user's stated want) vs web panel vs PC Flask — and stop carrying all three forward in parallel
2. Build a real backend: per-user auth, per-user memory/settings, server-side AI provider key, quotas, news source
3. Android Studio build for a real APK; mic permission flow on real phones
4. Regression set for Bangla question routing (function words, endearments, number words, hypotheticals, "who made you?")
5. If the Flask PC line continues, keep destructive commands (shutdown / restart / cmd / file creation) behind explicit confirmation, or remove them if the user does not confirm them

### 8. Security concerns
- **High — by design, not by accident.** `jarvis-fixed.py` runs **local system commands** (`shutdown`, `restart`, file creation, opening apps). That is acceptable as a *local, single-user* PC program with confirmations. It must **never** be exposed as a web service or a multi-user backend — a hosted Jarvis that can shut down a machine is a critical vulnerability.
- The Android app calls the free Pollinations API **directly from the device** with no key, no per-user auth, and no server-side quota — fine for a personal demo, not a multi-user marketplace tool. Anyone could abuse the endpoint or exhaust shared limits.
- The web panel has **no authentication and no per-user isolation**; memory / soul / settings in the panel are demo state. Voice data in the demo stays in the browser/device, but there is no hosted privacy policy for a VEY LORA-hosted version yet.

---

## Cross-cutting findings

### Multi-user safety
| Project | Auth | Per-user data isolation | API keys isolated per user | Verdict |
|---|---|---|---|---|
| ReadForMe | JWT + refresh tokens (backend source, untested live) | Designed per-user in Prisma schema | Key server-side only (backend `.env`) | **Designed for it, unproven** |
| Facebook Page AI Agent | None (demo) | None — one shared demo shop | No key / no Page token exists | **Not safe** |
| MYBOOK | None (original) / not built yet (Phase 1 backend) | None — one hardcoded user | Gemini key env-injected in original | **Not safe** |
| Jarvis | None (panel/app/PC) | None — single-user local design | Pollinations called client-side, no key | **Not safe by design** |
| VEY LORA itself | NextAuth credentials stub (unwired guards) | Prisma schema designed per-user (20 models) | Placeholders only, no keys | **Not live yet** |

### Missing dependencies & external API requirements (all four)
- **PostgreSQL** — needed by ReadForMe backend, MYBOOK Phase 1 backend, and VEY LORA. **None exists in this workspace.**
- **AI provider key** — needed for live AI in ReadForMe (OpenAI or equivalent), MYBOOK (Gemini), Jarvis (Pollinations is free but uncontrolled; a managed provider key is needed for quotas), and VEY LORA demos. **No live key is configured anywhere here.**
- **Email provider** — ReadForMe password reset is a no-op without one; MYBOOK / VEY LORA auth verification needs one.
- **Meta Business + Page access** — Facebook agent only.
- **Play Store / App Store** — ReadForMe Premium (in-app purchase), Jarvis APK, MYBOOK APK. No store accounts or signing keys are in this workspace.
- **Syncfusion licence, `ben.traineddata`** — ReadForMe only.
- **Flutter SDK, Android SDK, Xcode** — needed to build any of the mobile apps. None is installed here (Flutter clone was declined; Android SDK exists but Gradle builds are blocked by this machine's TCP setting).

### Secrets check (existence only, no values read or printed)
- No real `.env` file was found in any of the four projects or in VEY LORA. All `.env.example` files contain placeholders only. No secret values are stored in this report.

### What must NOT happen
1. Do not copy any of these codebases into VEY LORA blindly — each has demo data, hardcoded users, or local-only assumptions that would break multi-user safety.
2. Do not present any of the four as a working VEY LORA tool until its backend, auth, and per-user isolation exist and are tested.
3. Do not put a Page token, Gemini key, or any AI key in client-side code or in a shared demo.
4. Do not expose Jarvis's PC system commands (shutdown / restart / cmd) through any web or multi-user service.
5. Do not copy real people's names, photos, or posts from MYBOOK screenshots into VEY LORA.
6. Do not repeat MYBOOK's "privacy-first / encrypted" claims or any earnings figures as fact — they are demo labels.

---

## Recommended next steps (awaiting approval — nothing started)

1. **Approve / correct this report** — especially the verdicts above.
2. **Phase A (listing only, no code integration):** add a "MY EXISTING AI PROJECTS" section to VEY LORA listing all four with honest demo labels and link-outs to their existing demos.
3. **Phase B (first real integration):** ReadForMe — bring its backend live (PostgreSQL + keys + device tests), then connect VEY LORA to it via authorized API with per-user tokens.
4. **Phase C:** Jarvis — pick one canonical form and build its backend; keep it link-out until then.
5. **Phase D:** Facebook agent — only after Meta Business + webhook server exist.
6. **Phase E:** MYBOOK — keep as a separate deployment; revisit only after its Phase 1 backend has real auth + migrations.

**No integration work will start until the user approves this report and picks the phase.**
