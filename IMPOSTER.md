# IMPOSTER.md: Universal Production-Readiness Protocol for Next.js Applications

> **What this file is:** a self-contained instruction set for an AI coding agent. A developer gives this file to the agent and says **"initiate IMPOSTER.md"**. The agent then (1) scans the whole application, (2) writes a complete application document, (3) builds a project knowledge base in `docs/`, (4) audits the app for everything that would fail in production, (5) fixes it with approval, and (6) keeps the knowledge base current for every future task.
>
> **Works for:** any **Next.js** application (App Router or Pages Router, JS or TS), with or without a backend, with or without **Google Sheets** as the data store. Conditional sections are marked **[IF GOOGLE SHEETS]**, **[IF BACKEND]**, **[IF AUTH]**, **[IF PAYMENTS]**.
>
> **Core promise:** the agent never guesses. Every fact comes from the code, the generated documents, or the developer. If none of those has the answer, the agent **asks**.

---

## 0. Prime Directives (apply to every phase, every future task)

### 0.1 Anti-hallucination rules
1. **Source hierarchy for any fact or decision:**
   1. The code and config in the repository (read the file; don't recall it).
   2. `<AppName>.md` (the application document generated in Phase 1) and `docs/*` (especially `docs/memory.md` and `docs/rules.md`).
   3. The developer's answers.
   4. Official documentation **for the exact installed version** (check `package.json` / lockfile; don't rely on memory of framework APIs that change between versions).
   Anything outside these four is **not a fact**.
2. **Never invent:** business rules, prices, policies, contact details, names, URLs, library APIs, env var names, file paths, test results, or "typical" values. If unknown, write **`UNKNOWN: ask developer`**.
3. **Cite evidence:** every statement in the generated documents names its source file (`path/to/file.ts`, with line range when useful). Statements without evidence are labelled `ASSUMPTION` and listed in the questions section.
4. **Only claim what you ran.** "Tests pass", "build succeeds", "no vulnerabilities" must be backed by pasted command output. If you could not run something (no credentials, no network, no permission), write **`NOT VERIFIED: <reason>`**. Never tick a checkbox without proof.
5. **No silent scope creep.** Do not redesign the UI, rename things, or change business behavior unless a finding or the developer requires it.
6. **Prove before deleting.** Grep for references, delete, rebuild, run tests. If unsure, move the item to `NEEDS_DECISION`.
7. **Never push, deploy, publish, rotate secrets, or edit production data** unless the developer explicitly instructs it.
8. **Never print secrets.** Show env var **names** only. If you find a secret in the repo or git history, report the **location** (not the value) and tell the developer to rotate it.

### 0.2 Decision protocol (when in doubt)
```
Doubt or fork in the road
  → 1. Search <AppName>.md and docs/ (memory.md, rules.md, architecture.md, prd.md)
  → 2. Search the code
  → 3. Still unclear? STOP that item and ask the developer:
        • one precise question
        • 2–3 concrete options (A/B/C) with trade-offs
        • your recommended default and why
  → 4. Record the answer in docs/memory.md (decision log) before continuing
```
Never choose randomly, never "pick something reasonable" for business, security, data, legal or cost decisions. Purely cosmetic technical choices (a variable name) follow `docs/rules.md`.

### 0.3 Working method
Inventory → plan (short, posted in chat) → implement in small steps → verify with commands → record in `docs/progress.md` and `docs/memory.md`. If the repo uses git, work on a local branch with small checkpoint commits. Do not rewrite history.

### 0.4 Trigger phrases
"initiate IMPOSTER.md", "run imposter", or "start imposter". On trigger, reply: *"Starting IMPOSTER.md, Phase 1: scanning the application."* Then follow Section 2.

---

## 1. Stack Detection & Conditional Modules

First, detect and record (with evidence) in a table:

| Item | How to detect | Record |
|------|---------------|--------|
| App name & brand spelling | `package.json` name, metadata, logo alt text, README, header/footer. **If sources disagree on spelling, ask the developer** (brand misspellings are a common error) | e.g., `Ficcado` |
| Next.js version & router | `package.json`, presence of `app/` or `pages/` | |
| Language / package manager / Node version | tsconfig, lockfile, `.nvmrc`, `engines` | |
| Styling & UI libs | Tailwind/CSS Modules/etc. | |
| Rendering modes | per-route static / ISR / dynamic / client | |
| Hosting target | `netlify.toml`, `vercel.json`, Dockerfile, CI files | |
| Data layer | Google Sheets, SQL/NoSQL, CMS, REST backend, none | **[IF GOOGLE SHEETS]** … |
| Backend | separate service (Spring Boot, Express, etc.) or API routes only | **[IF BACKEND]** … |
| Auth | NextAuth/Clerk/custom/none | **[IF AUTH]** … |
| Payments | gateway SDKs/webhooks/none | **[IF PAYMENTS]** … |
| Third-party scripts/SDKs | analytics, chat, pixels, maps, fonts | |
| Existing tests / CI / lint | folders, workflows, configs | |

Sections of this protocol that don't apply are marked **N/A (reason)**, never silently skipped.

---

## 2. Workflow Overview (phases and gates)

| Phase | Output | Gate |
|-------|--------|------|
| **1. Deep Scan** | `<AppName>.md` (root) | Developer reviews; answers questions |
| **2. Knowledge Base** | `docs/prd.md`, `architecture.md`, `rules.md`, `design.md`, `tasks.md`, `memory.md`, `progress.md` | none (derived from Phase 1) |
| **3. Production Audit** | `docs/audit-report.md` + findings loaded into `docs/tasks.md` | Developer reviews |
| **4. Fix Plan** | Prioritized plan | **Developer approval required** (they may approve all or select items) |
| **5. Implementation** | Code, tests, CI/CD, docs updates | Verified per batch |
| **6. Final Verification & Report** | Updated `<AppName>.md`, `progress.md`, `memory.md`, final summary | Developer sign-off |

Post a one-line status when each phase starts and ends. If the developer is unavailable for a gate, continue with non-dependent work and list what is blocked.

---

## 3. PHASE 1: Deep Scan & `<AppName>.md`

### 3.1 Output file
Create **`<AppName>.md` in the project root**, named after the application as spelled in the codebase (example: `Ficcado-Website.md`). This is the single most important document: the agent's long-term reference. It must be **huge, accurate, and evidence-backed**, covering the application **from top to bottom**.

### 3.2 Scan method (do not skim)
1. Enumerate **all** tracked files (exclude only `node_modules`, `.next`, build output, `.git`, lock-file bodies). Keep a **coverage table**: total files, files read, files skipped (with reason). Target: **100 % of source, config, content, docs, scripts, tests, CI files**.
2. Read every route, layout, template, loading/error/not-found file, component, hook, context/store, util, lib, API route/server action, middleware/proxy, config, script, content file, and test.
3. Run (and paste summaries of) the project's own tools: dependency list, `next build` route table, lint, type-check, tests (if any). Use cross-platform commands (works on Windows PowerShell and Linux/macOS), or tiny Node scripts.
4. Trace flows by following **imports and calls**, not by file names. Follow each user action from UI event → handler → function → network/API → data source → response → UI update.
5. Record anything dead, duplicated, suspicious, or unclear for the audit (don't fix yet).

### 3.3 Required contents of `<AppName>.md`

Header: app name, generated date, **scanned git commit hash** (for delta scans), tool versions, coverage summary.

1. **Overview**: what the app does, who uses it, business model/flow in plain language (only facts supported by code/content).
2. **Tech stack & versions** (table), runtime requirements, scripts (`package.json`) and what each does.
3. **Folder & file structure**: full annotated tree (2–6 levels deep as needed), with a one-line purpose per folder and per important file.
4. **Configuration**: every config file (`next.config`, `tsconfig`, Tailwind, ESLint, hosting config, redirects, headers) and what it controls.
5. **Environment variables**: name, where used (file), public vs secret, required vs optional, example **shape** (never values).
6. **Route map**: every route/page/API: path, file, rendering mode (static/ISR/dynamic/client), revalidation, data sources, auth requirement, metadata/SEO, redirects, noindex status.
7. **Page-by-page deep dive** (one subsection per page/route):
   - Purpose; UI sections in order; components used.
   - Features and logic: forms, validation rules, buttons and handlers, calculations, conditionals, empty/loading/error states.
   - Data read (source, how, cached how) and data written (where, how).
   - State used (local, context, store, URL, storage).
   - Navigation in/out (links, redirects, programmatic routing).
   - Accessibility and responsive behavior notes.
8. **Navigation system**: header, footer, mobile menu, breadcrumbs, redirects/rewrites, middleware/proxy behavior, 404/error handling, deep links.
9. **Components catalog**: each shared component: props, behavior, where used, client/server, side effects.
10. **State management**: contexts/stores, their shape, persistence (storage keys + versioning), hydration approach.
11. **API / server logic inventory** (route handlers, server actions): method, path, input and validation, auth, output/status codes, side effects, error handling, rate limiting, who calls it.
12. **Data layer & persistence map**: *every place data is read or saved*: source, schema/fields, read path, write path, caching layers, validation, failure behavior, who can access it.
13. **[IF GOOGLE SHEETS]** Sheets integration: auth method, sheet/tab names, **every column per tab with meaning**, header-mapping approach, bootstrap/schema-ensure logic, read pipeline (cache/ISR/snapshot), write pipeline (append, locking, ID generation, idempotency), quota/rate handling, retry/backoff, failure fallbacks, formula-injection protection, sharing/permissions model.
14. **[IF BACKEND]** Backend service: endpoints consumed, contracts, auth, base URLs per environment, failure behavior.
15. **[IF AUTH]** Auth flows, session storage, protected routes, roles. **[IF PAYMENTS]** Payment flows, webhooks, idempotency, reconciliation.
16. **Browser storage & cookies inventory**: every cookie, `localStorage`, `sessionStorage`, IndexedDB key: name, purpose, set where, duration, category (necessary/preferences/analytics/marketing), first/third-party.
17. **Third-party scripts & services**: what loads, when, why, cost/limits, consent dependency.
18. **Assets**: images (structure and naming rules), fonts, icons, static files; how each is loaded.
19. **Styling & design system**: tokens, breakpoints, utilities, global CSS, theming.
20. **SEO & metadata**: per-page metadata, structured data, sitemap/robots/llms files, canonical rules.
21. **Security posture (as found)**: headers, CSP, validation, secrets handling, exposed endpoints, CORS, dependency risks. Facts only; judgments belong in the audit.
22. **Performance posture (as found)**: bundle sizes by route (from build output), image strategy, caching headers, client/server split, known slow paths.
23. **Testing & CI/CD (as found)**: test files, frameworks, coverage, workflows, deploy pipeline.
24. **Build & deployment**: build steps, hosting config, environment separation, domain/DNS notes if present.
25. **End-to-end flows** (numbered step lists with file references) for each business-critical journey, e.g., browse → add to bag → checkout → order saved → handoff.
26. **Dead code / duplicates / suspicious items** discovered (list only).
27. **Glossary** (domain terms, ID formats, status values).
28. **Questions for the developer** (`UNKNOWN` and `ASSUMPTION` items, each with options and a recommended default).

### 3.4 Gate
Post: *"Phase 1 complete. `<AppName>.md` created. Please review and answer the questions in section 28."* Continue to Phase 2 while waiting. Record every answer in `docs/memory.md` and correct `<AppName>.md`.

---

## 4. PHASE 2: Knowledge Base (`docs/`)

Create the folder `docs/` and these files, all **derived from Phase 1 evidence** (no invention). Each file starts with: purpose, last-updated date, and "source: `<AppName>.md` + file references".

| File | Must contain |
|------|--------------|
| **`docs/prd.md`** | Product vision; users/personas (only as evidenced); goals and non-goals; every existing feature with acceptance criteria; business rules (statuses, categories, ID formats, pricing/charge rules); data requirements; constraints (hosting, quotas); success metrics (ask the developer if unknown); assumptions and open questions |
| **`docs/architecture.md`** | System overview and Mermaid diagrams (components, request flow, read path, write path); rendering strategy per route; caching layers and TTLs; data flow and stores; integrations; security architecture; scaling strategy; deployment topology; environment matrix (dev/preview/prod); failure modes and fallbacks; Architecture Decision Records (ADRs) for decisions evidenced in code |
| **`docs/rules.md`** | The project's operating rules for any agent or developer: anti-hallucination and decision protocol (Section 0 restated); coding conventions found in the repo; folder rules (where each kind of file goes); error-handling pattern; validation pattern; logging rules; security rules (never trust the client, etc.); performance rules; cookie/consent rules; testing rules; commit/PR rules; definition of done; **"never do" list specific to this app**; how to update memory/progress |
| **`docs/design.md`** | UI design system as it exists: color/typography/spacing tokens (from Tailwind/CSS), breakpoints, component inventory with variants, layout patterns, interaction/animation rules, loading/empty/error patterns, accessibility rules, image rules, content tone. **Describes; never redesigns** |
| **`docs/tasks.md`** | Backlog and tracker (format in Appendix H): audit findings converted to tasks with IDs, priority, status, acceptance criteria, files likely affected; completed tasks link to `progress.md` |
| **`docs/memory.md`** | Persistent agent memory (format in Appendix H): confirmed facts with sources, **decision log** (date, question, answer, who decided), developer preferences, constraints, glossary, "do not change" list, known pitfalls, current-state summary, scanned commit hash |
| **`docs/progress.md`** | Chronological change log (format in Appendix H): every change: files added/removed/modified/moved, logic changes, refactors, new requirements, tests run, results, follow-ups |
| **`docs/audit-report.md`** | Created in Phase 3 (findings, severities, evidence) |

*(The developer asked for six core files; `progress.md` and `audit-report.md` are additions. If the developer prefers `progress.md` at the project root, move it and update references, and ask if unsure.)*

---

## 5. PHASE 3: Production Audit ("Find the Phase-10 Problems")

Use `<AppName>.md` as the map. For each check below, record **Pass / Fail / N/A / NOT VERIFIED** with evidence. Every failure becomes a finding:

`ID | Severity | Category | Location (file:line) | What is wrong | What breaks in production | Fix | Effort | Status`

**Severity:** **Blocker** (data loss, security hole, crash, legal exposure, outage under expected load) · **High** (serious reliability/perf/security gap) · **Medium** · **Low**.

Each category below also states the **standard the app must reach** (used in Phase 5).

### B1. Boilerplate, dead code, unnecessary logic
- Framework starter files and default assets, default metadata, unused components/hooks/contexts/utils/types/CSS/routes/images, unused dependencies (`depcheck`/`knip`), unused env vars.
- Hard-coded values that should be config, env, or Sheets; mock/dummy/sample/lorem data; fake delays (`setTimeout` simulating work); `Math.random` for business data; commented-out code; stale TODO/FIXME; debug `console.log`; duplicated logic (nav links, formatters, validators); over-engineered abstractions with one use; giant files that mix concerns.
- **Standard:** zero mock data on runtime paths; one source of truth per value; every file has a reason to exist.

### B2. Error handling: complete try/catch and friendly failures
Audit **every** `try/catch`, `.catch`, `await`, `fetch`, server action, route handler, and JSON parse:
- Empty or log-only `catch`, swallowed errors, `catch (e) {}`, rethrow without context, missing `finally` for cleanup/loading flags.
- `await`/promise without error handling; fire-and-forget without `.catch`; unhandled rejections.
- Missing timeouts (`AbortController`) on network calls; no retry/backoff on transient failures (429/5xx); retry on non-idempotent calls without idempotency keys.
- Next.js boundaries missing: `error.tsx`, `global-error.tsx`, `not-found.tsx`, `loading.tsx` where needed.
- Route handlers returning 200 on failure, or leaking stack traces/internal messages.

**Standard:**
- One **error-handling pattern** (documented in `docs/rules.md`): typed app errors with `code`, safe `message`, HTTP status; central helper to convert unknown errors.
- **Standard API error shape:** `{ "ok": false, "error": { "code": "RATE_LIMITED", "message": "<friendly text>", "requestId": "..." } }`. Success: `{ "ok": true, "data": ... }`.
- **User-friendly messages** in the UI for every failure class (validation, network offline, timeout, rate-limited, server error, not found, temporarily unavailable), written in plain language, telling the user what to do next. **Never show raw errors, stack traces, or internal IDs** (a short `requestId` is fine).
- Errors logged server-side with context (route, requestId, error code) and **without personal data or secrets**.
- Every async UI action shows pending/success/failure state and prevents double submission.
- Graceful degradation paths for each external dependency (Sheets, backend, third parties) are defined, implemented and tested.

### B3. Automated tests (required before production)
Audit existing tests; then **create what is missing**:

| Layer | Tooling (use what the repo has; otherwise propose and ask) | What to cover |
|-------|-----------------------------------------------------------|---------------|
| Unit | Vitest or Jest | Pure logic: money/total calculations, ID generators, slug/format utils, validators (zod), parsers (Sheets rows), message builders, consent logic, rate-limit logic |
| Component | React Testing Library | Forms, bag/cart behavior, consent banner, error/empty states |
| API/route | Test with real `Request`/`Response` objects | Validation failures, success, rate-limit, error mapping, auth (if any), idempotency |
| Integration | Test doubles **at the boundary** (fake Sheets client, MSW) | Data layer reads/writes, cache fallbacks, retry/backoff |
| End-to-end | Playwright | Critical journeys (browse → add to cart → checkout → order submit → handoff), 404, error pages, consent flow, mobile viewport |
| Accessibility | axe via Playwright/RTL | Main pages, forms, banner |
| Load/perf | k6 (Appendix G) | Read path and write path separately |

**Standard:** test files live only in `tests/` or `__tests__/` (never imported by runtime code); fixtures and mocks exist **only in test code**; coverage thresholds enforced in CI (suggest ≥ 80 % for server/lib logic and **100 % for money, ID and security-critical logic**; ask the developer to confirm the numbers); no flaky tests (no real network, no real Sheets, no sleeping).

### B4. CI/CD pipeline
- Detect the VCS/CI provider; if none, propose **GitHub Actions** and ask before adding.
- **Pipeline stages** (see Appendix C template): install with frozen lockfile → lint → type-check → unit/integration tests with coverage → build → e2e against the built app → dependency audit → secret scan → (optional) Lighthouse CI + bundle budget → deploy.
- **Deploy gating:** production deploys happen only after all required checks pass (protected branch + required status checks, or deploy from CI). Hosting platforms that auto-build on push (e.g., Netlify/Vercel) can bypass CI unless configured; **ask the developer how they want to gate** and document it.
- Separate **preview** (test data, `noindex`) and **production** environments with separate secrets and **separate Google Sheet for non-production** **[IF GOOGLE SHEETS]**.
- Pin Node version (`.nvmrc`/`engines`), cache dependencies, keep pipeline under ~10 minutes.
- Dependabot/Renovate for dependency updates.
- **Standard:** a failing test, lint, type-check, build, or high-severity vulnerability blocks release. Document rollback (re-deploy previous build) in `docs/architecture.md`.

### B5. Scale: very high traffic with no lag
> **Developer's target:** the app should serve on the order of **1 lakh (100,000) users at a time** without lag. **Reality check the agent must state honestly:** no application can *guarantee* a number without measurement. The goal is to **design so that traffic is absorbed by the CDN**, measure with load tests, and report **measured** limits. Public read paths (pages, images, catalog) can scale to this level on a CDN. **Dynamic and write paths cannot**, especially **[IF GOOGLE SHEETS]**, where Google enforces strict per-minute quotas. Those paths must be protected by caching, rate limits, queuing and graceful degradation. Never claim "handles 1 lakh users" in any document without test evidence.

**Checks and standards:**
1. **Request-path classification table** (Appendix D): for every user-facing path (page view, catalog data, search, cart actions, order submit, support submit, health), state: static/ISR/dynamic, cache TTL, expected share of traffic, bottleneck, protection, and fallback. Ask the developer for **expected peak split** (e.g., what fraction of 100,000 visitors place orders).
2. **Public pages are static or ISR and CDN-cacheable.** No per-request database/Sheets/backend reads for visitors. One shared cached catalog fetch per revalidation window (not one per page). `Cache-Control` with `s-maxage` + `stale-while-revalidate` on cacheable responses; immutable caching for hashed assets.
3. **Do not break CDN caching:** no `Set-Cookie` on public pages, no reading cookies/headers in layouts/pages that should be static (this silently turns pages dynamic), no per-request middleware work on static routes (restrict the middleware/proxy `matcher`; the file is named middleware or proxy depending on Next version, so verify in installed docs).
4. **Client JS is small** (budgets in B10): server components by default, dynamic imports for modals/drawers, no heavy libraries (e.g., avoid huge SDKs in serverless/client bundles).
5. **Write paths are bounded and durable.** Writes (orders, support) are validated, rate-limited, idempotent (client `submission_id`), timeout-bounded, and **never lose data**: if the store is down or throttled, return a friendly degraded response with a documented fallback. **[IF GOOGLE SHEETS]**: batch/buffer writes where possible, atomic ID generation (lock), exponential backoff with jitter, `429` with `Retry-After` toward clients when saturated.
6. **Platform limits and cost:** ask the developer which hosting plan is used. Document bandwidth, function invocation/concurrency limits, build minutes, and the **cost exposure** of a traffic spike or bot flood. Recommend spend caps/alerts.
7. **Load test (Appendix G):** staged ramp on **staging** with a **test sheet**; read path (static + catalog) and write path separately. Record p50/p95/p99, error rate, CDN cache-hit ratio, and the point where degradation starts. **Never load-test production data or the production Sheet.** Publish the measured numbers in `docs/architecture.md`.

### B6. Rate limiting and request limits
- **Layers:** (1) CDN/platform/WAF rules, (2) application limiter on a **shared store** (in-memory limiters are useless on serverless: each instance has its own memory and cold starts reset it), (3) per-route business limits, (4) bot challenge on write endpoints.
- **Ask the developer** which shared store/provider to use (e.g., Upstash Redis, platform KV/Blobs, Cloudflare). Do not pick silently.
- **Limits table** (Appendix D format) for each endpoint: window, max requests per IP, per session/token, burst, response (`429` + `Retry-After`), UI message. Different limits for reads, order submit, support submit, admin/health.
- Request-size limits, max array lengths (e.g., max cart lines), max string lengths, max concurrent submissions per client.
- Bot controls: honeypot, minimum-time-to-submit, Cloudflare Turnstile/hCaptcha/reCAPTCHA **(ask before enabling)**, block obviously automated user agents on write routes, no verbose responses.
- The client UI shows a friendly message on `429` (e.g., "Too many attempts. Please wait a minute and try again.") and disables resubmission until `Retry-After`.
- **Standard:** limits enforced on every state-changing endpoint, tested, and documented; limiter failure mode defined (fail-closed for writes, fail-open for reads, justified).

### B7. Security
Map to **OWASP Top 10** and verify each applies/doesn't:

| Area | Required standard |
|------|-------------------|
| **API surface** | Every endpoint that the browser can call is **public by nature**. Reduce the surface: prefer server components/server actions; delete unused routes; no debug/admin routes in production; every remaining endpoint has input validation, abuse protection, minimal output; admin/health endpoints require a secret token (and optionally IP allowlist) and are not linked anywhere; restrict HTTP methods; `OPTIONS`/CORS locked to the app's own origin (never `*` on state-changing routes); same-origin/`Origin` checks on state-changing requests |
| **Validation** | Schema validation (e.g., zod) at **every** boundary: request bodies, query params, env vars at startup, and external data (Sheets rows, backend responses). Reject unknown fields. Server **recomputes** anything the client could tamper with (prices, totals, fees, IDs) and ignores client-supplied values |
| **Injection** | Parameterized queries **[IF DB]**; **spreadsheet formula injection** guard (prefix `'` for cells starting with `=`, `+`, `-`, `@`) **[IF GOOGLE SHEETS]**; no `eval`/dynamic `Function`; safe JSON-LD serialization (escape `<`); no `dangerouslySetInnerHTML` with user data |
| **XSS/CSRF/Clickjacking** | Strict **CSP** (nonce/hash-based where feasible), `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `frame-ancestors`/`X-Frame-Options`, HSTS on the production domain, CSRF protection for cookie-authenticated mutations |
| **SSRF / redirects / traversal** | No server-side fetch of user-supplied URLs; no open redirects (validate `next=` params); no user-controlled file paths |
| **Secrets** | No secret in `NEXT_PUBLIC_*`; no secrets in repo or git history (run a secret scanner); `.env*` ignored; separate prod/test credentials; least-privilege service accounts **[IF GOOGLE SHEETS]**: share the sheet only with the service account (Editor), nobody else unnecessarily, 2-step verification on the owning Google account, key rotation plan; env validation fails the build/start when required vars are missing or look like dummies |
| **Dependencies** | `npm audit` (high/critical block release), lockfile committed, automated update PRs, remove unused packages |
| **Info leakage** | `poweredByHeader: false`, no public source maps unless intended, generic error messages, no stack traces, no PII in logs, no directory listings, no sensitive data in URLs |
| **Auth/session [IF AUTH]** | HttpOnly/Secure/SameSite cookies, session expiry/rotation, brute-force limits, role checks server-side |
| **Payments [IF PAYMENTS]** | Server-side amount calculation, signed webhooks, idempotency, no card data touching the app |
| **Data at rest/privacy** | List all personal data stored (names, phones, addresses, emails) and where (Sheets is not a hardened database). Minimize collection, restrict access, define retention/archival and deletion handling. Flag applicable data-protection laws (for example India's DPDP Act, GDPR for EU visitors) **for the developer/legal counsel to confirm; the agent does not give legal advice** |

### B8. Data integrity & Google Sheets performance/safety **[IF GOOGLE SHEETS]**
- **Startup/schema safety:** verify the spreadsheet exists and is reachable; verify required tabs/headers; create missing tabs/headers **without overwriting data**; read columns **by header name**; idempotent, memoized per instance, never on the visitor read path, handles the "already exists" race.
- **Reads:** never on the visitor path; one shared cached fetch (ISR/data cache); last-good snapshot fallback (generated from real data, not committed); validation of every row; invalid rows skipped with a warning (no fake defaults).
- **Writes:** server-side only; validated; sanitized; **atomic unique ID generation** that survives row deletion (lock + counter, or equivalent); idempotency key; timeout (~8 s) and retry with backoff for 429/5xx; write latency measured (target p95 ≈ ≤ 1.5 s; record the real number); clear degraded-mode behavior when Sheets fails.
- **Quotas:** document current Google API limits (verify in official docs) vs. expected traffic; avoid heavy client libraries; batch calls; keep API calls per request ≤ 2.
- **Growth & safety:** Sheets cell/row limits and an archival plan for append-only tabs; protected header rows/ranges; data validation dropdowns; "never delete rows, mark CANCELLED" rule; Drive version history and periodic export/backup; access list review; time zone consistency (store and display in one agreed zone, e.g., IST); numeric/currency parsing rules.
- **Standard:** no order/request is ever silently lost; every failure is logged and surfaced to the user in a friendly way.

### B9. Cookies and consent (critical)
1. **Inventory first:** build the real list from the scan: every cookie, `localStorage`/`sessionStorage` key, and third-party script. Classify: **Strictly necessary / Preferences / Analytics / Marketing**. Do not invent entries; if the app sets none beyond the consent record, say so.
2. **Consent banner** shown to first-time visitors with: **Accept all**, **Reject all** (equally prominent and as easy as Accept), and **Manage preferences** (per-category toggles; necessary is always on). Short plain-language text and a link to the Cookie Policy.
3. **No non-essential cookies, storage, or scripts before consent.** Analytics/marketing/third-party scripts load **only after** the matching category is accepted (conditional `next/script`); rejecting stops them and clears related cookies. If Google Analytics/Ads are used, implement **Google Consent Mode v2** defaults (denied until consent).
4. **Store the choice** in a first-party consent record (cookie or storage): `{ version, timestamp, categories }`, `Path=/; SameSite=Lax; Secure`, expiry **6–12 months** (ask the developer). **Re-prompt** when the policy `version` changes.
5. **Withdraw/change anytime:** a persistent "Cookie settings" link (footer) that reopens preferences.
6. **Cookie Policy page** generated from the real inventory (name, purpose, duration, first/third-party, category). No fabricated cookies.
7. **Performance rules (very important):** the banner is a lightweight client component, loaded after hydration/idle, positioned so it **causes no layout shift**, with no render-blocking. **Read consent on the client only**; do **not** read cookies in server layouts or middleware for this purpose, because that makes every page dynamic and uncacheable. Do not set cookies from middleware/proxy on every request. Keep the cookie count and size minimal; static assets must not carry cookies.
8. **Maintainability:** a single module/config holds the cookie inventory, categories, consent version and defaults, so future changes are made in one place; tests cover accept, reject, partial, version bump, and "no script before consent".
9. **Regional note:** ask the developer which regions' visitors must be covered; the agent does not certify legal compliance.

### B10. Performance and UX responsiveness
- **Budgets (confirm with developer):** Lighthouse mobile ≥ 95 on key pages; LCP < 2.0–2.5 s, CLS < 0.05–0.1, INP < 150–200 ms; record first-load JS per route (from build output) and reduce the largest.
- **Check:** `'use client'` overuse; JS-based responsive layout (use CSS); statically imported heavy modals/drawers (use `next/dynamic`); un-memoized context values causing re-renders; client-side data fetching for data that could be server-rendered; whole-library icon imports; unoptimized/oversized images, missing `sizes`, missing dimensions/aspect ratios, `priority` misuse; fonts via `next/font` with limited weights; blocking third-party scripts; layout shift from late-loading banners/images/fonts; hydration mismatches; waterfalls; missing `loading.tsx`/skeletons; slow route transitions (prefetch).
- **Interaction:** every action responds visibly within ~100 ms (pending state), forms prevent double submission, optimistic UI only where safe, navigation never blocks on data that could be cached.
- **Accessibility:** keyboard navigation, focus states, labels, contrast, `alt` text, reduced motion; automated axe checks.
- **Standard:** measured numbers recorded in `docs/audit-report.md` (before) and `progress.md` (after).

### B11. Architecture, structure and maintainability
- Clean, **predictable folder structure** (features/domains or layered), documented in `docs/architecture.md` and enforced in `docs/rules.md`: where routes, components, server code, validators, config, content, tests, scripts, generated files go.
- Clear **server/client boundaries** (`server-only`/`client-only` where useful); shared zod schemas between client and server; typed env access (one module); constants/config centralized; no circular imports; no deep relative-import chains (use path aliases); consistent naming; small focused files; no duplicate helpers.
- Lint/format/type-check strictness (`strict` TS, ESLint rules for hooks and floating promises), pre-commit hooks optional (ask).
- Good README: setup, env vars, scripts, architecture pointer, deploy, troubleshooting.
- **Standard:** a new developer can find any feature in under a minute using `<AppName>.md` and `docs/architecture.md`.

### B12. Observability and operations
- Structured server logs with levels and request IDs, PII-safe.
- Error tracking (e.g., Sentry) **(ask; must respect cookie consent for client-side parts)**.
- Uptime monitoring + alerts for: site down, Sheets/backend failing, order-write failures, `429` spikes, build failures, cost spikes.
- Protected health endpoint that reports dependency status without secrets.
- **Runbook** in `docs/architecture.md`: how to roll back, rotate secrets/keys, restore data from backup, handle a bot flood, change the public WhatsApp/contact number (and whether a redeploy is needed because `NEXT_PUBLIC_*` values are inlined at build time), and renew the domain/SSL.

### B13. Deployment readiness
- Reproducible build (pinned Node, lockfile, no machine-specific paths), single source for build/base/publish settings (no contradictory settings between host dashboard and config file), production env validation, preview environments `noindex`, redirects and custom 404/500 pages, favicon/manifest, correct canonical domain and HTTPS/HSTS, `www`/apex handling, analytics only after consent.

### B14. Pre-mortem: future failures to prevent
For each item, record **likelihood, impact, existing mitigation, new mitigation, status**:

quota exhaustion · spreadsheet/cell limit reached · service-account key leaked/expired/revoked · sheet header renamed or column reordered · admin deletes/edits rows or formulas · duplicate or lost orders · stale cache showing wrong price/stock · concurrent ID collisions · timezone/rounding errors · oversell/out-of-stock race · bot/scraper floods and bandwidth bills · hosting plan limits (bandwidth, function invocations, build minutes) · Next.js/Node/dependency major upgrades and EOL · unpinned dependencies breaking builds · env var missing or dummy in production · build-time-inlined public values needing redeploy · image/asset case-sensitivity (Windows vs Linux) · oversized images · consent policy changes · data-subject requests · employee/account access removal (single owner Google account) · domain/SSL expiry · third-party outage (WhatsApp deep-link behavior, fonts, analytics) · long URLs breaking deep links · logs leaking personal data · no rollback plan · no backups · no monitoring · docs drifting from code.

---

## 6. PHASE 4: Fix Plan & Approval Gate

1. Convert every finding into a task in `docs/tasks.md` (ID, severity, files, acceptance criteria, risk, effort).
2. Post a **prioritized plan**: Blockers → High → Medium → Low, grouped into batches that can be verified independently (suggested order: error handling & security basics → data/Sheets safety → rate limiting → tests → CI/CD → cookies/consent → performance → structure/cleanup → observability/docs).
3. List every **developer decision needed** (rate-limit store, CAPTCHA, analytics/error-tracking vendors, coverage thresholds, consent expiry/regions, deploy gating, hosting plan limits) with options and your recommendation.
4. **STOP and wait for approval.** The developer may reply "approve all", select tasks, or change priorities. Record the approval in `docs/memory.md`.

---

## 7. PHASE 5: Implementation Standards

- Work batch by batch; after **each batch** run lint, type-check, tests, build; fix before continuing.
- Keep changes small and reversible; one concern per commit (if git is used).
- Add or update tests **with** each change (no "tests later").
- After each batch update: `docs/progress.md`, `docs/tasks.md`, `docs/memory.md`; and update the affected sections of `<AppName>.md` (and update its scanned commit hash).
- Re-state in `docs/rules.md` any new project rule introduced (e.g., the error pattern, rate-limit pattern, consent module location).
- Do not leave temporary code, TODOs, debug logs, or mock data behind.
- If a fix reveals a business-rule question, stop that item and ask (Section 0.2).

---

## 8. PHASE 6: Final Verification & Report

Run and paste outputs: lint, type-check, unit/integration tests with coverage, e2e tests, production build (with route/bundle table), dependency audit, secret scan, load-test summary (staging), Lighthouse (or **NOT RUN: reason**).

**Final summary (chat + `docs/progress.md`)**:
1. Findings by severity: fixed / deferred / won't-fix (with reason).
2. Before/after metrics (bundle sizes, Lighthouse, latency, coverage).
3. New and changed files tree (before/after structure) and added/modified/deleted/moved lists.
4. What remains **NOT VERIFIED** and what the developer must do manually (secrets, DNS, plan limits, legal review, real-device WhatsApp/consent testing).
5. Residual risks, honestly stated (including the real measured capacity, not the target).
6. Updated `<AppName>.md`, `docs/*`.

---

## 9. Living Documentation Protocol (every future task, forever)

**At the start of any task, the agent must read, in this order:** `docs/memory.md` → `docs/rules.md` → `<AppName>.md` (relevant sections) → `docs/tasks.md` → the last 10 entries of `docs/progress.md`. If the repo changed since the scanned commit hash (changes made outside the agent), run a **delta scan** (changed files only) and update `<AppName>.md` before starting.

**Decision protocol:** Section 0.2. Never decide alone when information is missing. Never contradict `docs/memory.md` without asking.

**At the end of any task the agent must:**
1. Add a `docs/progress.md` entry (template in Appendix H): files added/modified/deleted/moved, logic/refactor/requirement changes, tests run and results, follow-ups.
2. Update `docs/tasks.md` (status; new tasks discovered).
3. Update `docs/memory.md`: new confirmed facts, developer answers, decisions (append; mark superseded items instead of deleting), "do not change" additions.
4. Update the affected parts of `<AppName>.md` and refresh the scanned commit hash.
5. Tell the developer in chat what was changed, what was verified, and what is not verified.

---

# APPENDICES

## Appendix A: Scan Coverage Table (template)

| Area | Files total | Files read | Skipped (reason) |
|------|-------------|-----------|------------------|
| Routes / pages | | | |
| Components | | | |
| Lib / utils / hooks / state | | | |
| API routes / server actions | | | |
| Config / scripts / CI | | | |
| Content / data / public assets | | | |
| Tests | | | |

## Appendix B: Useful Evidence Commands (adapt; cross-platform)

- Dependency and script inventory: read `package.json`; unused deps: `npx depcheck` or `npx knip`.
- Route table and bundle sizes: `npm run build` output.
- Bundle analysis: `@next/bundle-analyzer`.
- Search patterns (use your editor/ripgrep or a Node script): `TODO|FIXME|console\.log|setTimeout\(|Math\.random\(|dangerouslySetInnerHTML|catch\s*\(\w*\)\s*\{\s*\}|eval\(|NEXT_PUBLIC_|localStorage|sessionStorage|document\.cookie|fetch\(|axios`.
- Security: `npm audit --omit=dev`, a secret scanner (e.g., gitleaks) on the working tree **and** history.
- Headers: `curl -I <url>` to verify caching and security headers.

## Appendix C: CI Workflow Template (GitHub Actions; adapt to the repo's package manager and scripts)

```yaml
name: CI
on:
  pull_request:
  push:
    branches: [main]

jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 15
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npm run lint
      - run: npm run typecheck          # add the script if missing
      - run: npm test -- --coverage     # enforce thresholds in the test config
      - run: npm run build
        env:
          # Use test/placeholder values ONLY for build validation; never real secrets here
          NEXT_PUBLIC_SITE_URL: https://example.test
      - run: npm audit --omit=dev --audit-level=high

  e2e:
    needs: verify
    runs-on: ubuntu-latest
    timeout-minutes: 20
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version-file: .nvmrc
          cache: npm
      - run: npm ci
      - run: npx playwright install --with-deps chromium
      - run: npm run build
      - run: npm run test:e2e           # starts the built app against a TEST sheet/mocks

  secrets-scan:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: gitleaks/gitleaks-action@v2
```
*Adjust to the real scripts. If the host auto-deploys on push, configure required status checks on the protected branch or deploy from CI so failing checks cannot ship.*

## Appendix D: Capacity & Rate-Limit Tables (templates)

**Request-path classification**

| Path | Type (static/ISR/dynamic) | Cache | Expected share of traffic | Bottleneck | Protection | Fallback |
|------|---------------------------|-------|---------------------------|-----------|------------|----------|

**Rate limits**

| Endpoint | Method | Limit (per IP / window) | Burst | Key | On exceed | UI message | Fail mode if limiter down |
|----------|--------|-------------------------|-------|-----|-----------|------------|---------------------------|

## Appendix E: Cookie / Storage Inventory (template)

| Name | Type (cookie/localStorage/…) | Purpose | Category | Set by (file) | Duration | First/third-party | Needs consent? |
|------|-----------------------------|---------|----------|---------------|----------|-------------------|----------------|

## Appendix F: Standard Error Handling Pattern

- App error class: `AppError(code, publicMessage, httpStatus, cause?)`.
- Route handler wrapper: validate → run → map known errors to the standard response shape → map unknown errors to `INTERNAL_ERROR` with a generic message; always attach `requestId`; log details server-side.
- Client wrapper for calls: timeout, parse, map error codes to friendly messages from **one** message dictionary, expose `{ status: idle|pending|success|error }`.
- Error codes at minimum: `VALIDATION_FAILED`, `RATE_LIMITED`, `NOT_FOUND`, `UNAVAILABLE` (dependency down), `CONFLICT` (duplicate), `INTERNAL_ERROR`.

## Appendix G: Load Test Plan (k6 template, staging only)

- **Scenarios:** (1) read path: home, category, item page, catalog data, static assets; (2) write path: order and support submissions at a **realistic, much lower** rate with a **test sheet**; (3) abuse: burst against rate limits to confirm `429`s.
- **Stages:** ramp 1 → 10 → 100 → 1,000 → 10,000 virtual users (and higher only with distributed generators and the developer's consent about cost); hold each stage 3–5 minutes.
- **Thresholds:** error rate < 1 %; read p95 < 500 ms at the edge; write p95 per B8; CDN cache-hit ratio target ≥ 95 % on public paths.
- **Report:** p50/p95/p99, throughput, errors by type, cache-hit ratio, the point of degradation, and which limit was hit (platform, Sheets, app).
- **Never** run against production data or the production Sheet; tell the developer the platform cost implications before large tests.

## Appendix H: Templates for `docs/` Living Files

**`docs/memory.md` entry types**
```
## Confirmed Facts
- [F-001] <fact> — source: <file or developer answer> — date

## Decision Log (append-only)
- [D-001] <date> — Question: … — Options: A/B/C — Decision: … — Decided by: <developer> — Status: active | superseded by D-0xx

## Do-Not-Change List
- <thing> — reason — source

## Known Pitfalls
- <pitfall> — how to avoid

## Current State Summary
- Scanned commit: <hash> — last task: <ID> — open blockers: …
```

**`docs/tasks.md` entry**
```
### T-014 — <title>   [Priority: Blocker|High|Medium|Low]  [Status: Todo|In progress|Blocked|Done]
- Source: <finding ID / developer request>
- Acceptance criteria: …
- Files likely affected: …
- Risks / dependencies: …
- Done in: progress entry <P-0xx>
```

**`docs/progress.md` entry**
```
## P-023 — <date/time> — <task ID(s)> — <title>
- Summary:
- Files ADDED: path — why
- Files MODIFIED: path — what changed
- Files DELETED: path — why, proof of non-use
- Files MOVED/RENAMED: old → new
- Logic / refactor / new requirement notes:
- Folder-structure change (tree diff, if any):
- Verification: commands run + results (or NOT VERIFIED: reason)
- Memory updates: D-0xx, F-0xx
- Follow-ups:
```

---

## Final Instruction to the Agent

On trigger, begin **Phase 1** immediately. Read the repository completely, generate `<AppName>.md`, build the `docs/` knowledge base, audit against Section 5, present the plan, wait for approval, implement, verify with evidence, and keep every document current. **When anything is unclear, ask the developer. Never guess. Never invent. Never claim what you did not run.**
