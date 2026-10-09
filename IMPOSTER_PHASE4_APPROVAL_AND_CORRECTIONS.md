# IMPOSTER: Phase 4 Response — Developer Answers, Corrections & Approved Plan (Ficcado)

> **To the agent:** This file is the developer's reply to your Phase 1–4 output (`Ficcado-Website.md`, `docs/*`). Follow `IMPOSTER.md` Section 0 (no guessing, no invention, evidence only).
> **Do not start implementing until you have done Part B (corrections) and posted the corrected `docs/audit-report.md` and `docs/tasks.md`.**
> **Any decision marked `PENDING` in Part C is not approved. Do not decide it yourself; work on other items and wait.**
> **Never push or deploy.** The developer pushes.

---

## PART A: Answers to Section 28 of `Ficcado-Website.md`

| # | Question | Developer answer | Extra conditions |
|---|----------|------------------|------------------|
| 1 | Catalog read caching | **Option A: ISR (`revalidate = 60`)** | Also see B-05 and B-03: the whole catalog must come from **one shared cache**, including inside `/api/orders` and `/api/delivery-options`. ISR alone will not protect the quota |
| 2 | `BACKLINK_PLAN.md` test | **Option A:** restore the file into `docs/` | Re-run the whole suite and paste the output |
| 3 | Upgrade Next.js | **Option A: upgrade** | **Verify the patched version yourself**: paste `npm view next dist-tags`, the advisory's patched range, and `npm audit --omit=dev` before and after. Do not trust the "16.3.8+/16.3.9" figure from memory. Then run build, tests, lint. Also run `npm ls source-map-js` to see which package pulls it in |
| 4 | CI/CD | **Option A: add GitHub Actions** | Gating approach is decision D7 in Part C |

---

## PART B: Corrections the Agent Must Make (found when reviewing your output)

For each item: **verify in code → fix or prove not applicable → record in `docs/progress.md`**. Each becomes a task in `docs/tasks.md` with an ID.

### B-A. Audit errors (categories wrongly marked "Pass" or missing findings)

| ID | Problem | Required action |
|----|---------|-----------------|
| **B-01** | **B8 marked Pass, but the flow is read-then-append.** `architecture.md §2.2` says the server reads recent rows, computes the next Reference ID and the idempotency check, then appends. Two orders arriving at the same moment (or on two serverless instances) can both read the same last ID and **write duplicate Reference IDs**; two clicks with the same `submission_id` can both pass the idempotency check. `IMPOSTER.md` B8 requires an **atomic** ID with a lock/counter. | Reproduce with a **concurrent test against a TEST sheet** (e.g., 20 parallel requests) and paste the result. Re-grade B8 (expected **Blocker/High**). Implement the strategy chosen in **D1**. Also confirm what "recent rows" means (how many rows are read) and that the max-ID lookup stays correct as the tab grows |
| **B-02** | **Sheets calls per request are not counted.** An order appears to cost several Sheets calls (catalog read, courier read, recent-rows read, append). Google's per-minute limits (verify in current Google docs) mean the order route could throttle at a low number of orders per minute, long before any "1 lakh" figure. | Add a table to `docs/architecture.md`: **Sheets API calls per page view / per API route / per order**, the quota figures with a link to the official doc, and the **calculated maximum orders per minute**. Then reduce calls (use the shared cache for catalog + couriers inside `/api/orders`; bound the read used for ID/idempotency) |
| **B-03** | **Public quota-burning endpoints.** `GET /api/products` and `GET /api/delivery-options` are `force-dynamic`, `no-store`, unauthenticated. Anyone can call them in a loop and exhaust the Sheets quota, which then breaks checkout for everyone. This is a **DoS-on-quota** and also contradicts "minimize API surface". | Check whether the UI actually calls each one. Unused → **delete**. Used (likely delivery options at checkout) → serve from the shared cache with `s-maxage` + `stale-while-revalidate`, rate-limit it, and return minimal data. Add as a finding (High) |
| **B-04** | **Runtime disk cache on serverless.** `src/generated/products-cache.json` is described as a runtime fallback cache. On Netlify, the deployed filesystem is read-only/ephemeral and is not shared across instances. A runtime write may fail or silently do nothing, so the "fallback" may not exist when it is needed. | Prove what actually happens (read the code that writes it; test in a Netlify deploy preview or `netlify dev`). If it is not reliable, replace it with a platform cache (Next data cache / Netlify Blobs) or a **read-only snapshot generated at build time**. Confirm `src/generated/` is git-ignored |
| **B-05** | **ISR prerequisites not checked.** Setting `revalidate = 60` does nothing if the Sheets client's `fetch` uses `cache: 'no-store'`, or if anything in the render tree reads `cookies()`/`headers()`/`searchParams`. `/categories/[slug]` also needs `generateStaticParams`. | Inspect `src/lib/sheets/client.ts` fetch options and the tree; after the change, paste the `next build` route table showing the routes as static/ISR, and after a preview deploy paste `curl -I` showing cache hits. **Checkout must re-validate prices** against fresh data and show a notice if something changed, because pages can now be up to ~60 s stale |
| **B-06** | **Rate limiting scope too narrow.** RATE-01 covers only `/api/orders`. `/api/inquiry` only has a honeypot; the two GET endpoints have nothing. | Cover **every** route in `src/app/api/` using the store chosen in **D2**. Fill the Appendix D limits table (route, limit, burst, response, UI message, fail mode) and implement friendly `429` messages in the UI |
| **B-07** | **Two `netlify.toml` files** (root: `base`, `command`, `publish = ".next"`; frontend: security + cache headers). Netlify may read only one, so the **security and caching headers might not be applied at all**. A manual `publish` for Next.js can also conflict with the Netlify Next.js runtime. | Determine which file Netlify reads (current Netlify docs), merge into **one** file, remove contradictions, check whether a manual `publish` is needed. After a deploy preview, paste `curl -I` for `/`, a static asset and an image proving the headers |
| **B-08** | **Security headers incomplete.** No `Content-Security-Policy`. `X-XSS-Protection` is obsolete. HSTS uses `includeSubDomains; preload`, which is hard to undo and affects every subdomain. No Origin check on POST routes. | Propose a CSP that does **not** force pages to become dynamic (a nonce-based CSP does; compare with hash-based or a pragmatic policy and **ask me via D13**). Remove `X-XSS-Protection`. Keep HSTS `preload` only if I confirm (D13). Add same-origin checks on POST routes |
| **B-09** | **B2 marked Pass without evidence.** No list of try/catch sites, no check for `error.tsx` / `global-error.tsx` / `not-found.tsx` / `loading.tsx`, no timeout/retry review for Sheets reads (only the order write has an 8 s guard). Response shapes are inconsistent: `docs/rules.md` says `{ success:false, error }`, while the code returns `{ ok:true, options }`. | Produce the full table: every `try/catch`, `.catch`, `await fetch` with file:line and verdict. Pick **one** response shape (include `requestId` and an error `code`), implement it in one helper, update `rules.md`. Add timeouts and retry-with-backoff+jitter for transient Sheets errors on reads |
| **B-10** | **Secrets not actually verified.** The audit says "verify `.gitignore`" but never ran the checks. A real service-account key file exists at `credentials/`, and a git repo exists. | Run and paste: `git ls-files credentials`, `git log --all --oneline -- credentials`, a secret scan over the **working tree and full history**. Confirm `.gitignore` covers it. If it was **ever** committed or pushed, tell me immediately (D11) so the key is rotated. Also ask whether the Sheet is shared only with the service account and owner (not "anyone with the link") |
| **B-11** | **Audit tasks missing from `tasks.md`.** `SEC-03`, `RATE-01`, `OBS-01` have no task. Only 8 of 11 findings are tracked, and none of the new B-items. | Every finding gets a task (finding ID ↔ task ID, both directions). Re-issue `tasks.md` |
| **B-12** | **Test coverage is far below `IMPOSTER.md` B3.** Only two Node test files; no API-route tests, no component tests, no end-to-end test, no coverage thresholds, no concurrency test. The audit only reports the one failing test. | Add tasks for: API-route tests for `/api/orders` (validation, idempotency, offline fallback, 8 s timeout, tampered prices ignored) and `/api/inquiry`; Sheets row-parser tests; rate-limit tests; consent tests; one Playwright end-to-end journey (browse → bag → checkout → order → WhatsApp URL) using a **fake Sheets client** (never the real sheet); coverage thresholds from **D6** |
| **B-13** | **Several categories marked Pass without numbers.** B10 says "bundle sizes: Pass (compiled cleanly)", which is not a measurement. B13, B14, B11 also lack evidence. B14 (pre-mortem) is three lines instead of the required likelihood/impact/mitigation table. There is **no "NOT VERIFIED" section** even though Lighthouse, load test, header checks and secret scan were not run. | Paste the per-route first-load JS sizes from the build; run Lighthouse or write `NOT RUN: reason`; complete the B14 table; add a **NOT VERIFIED** section listing everything not run |
| **B-14** | **Overstated legal conclusion.** PRIV-01 says localStorage "without consent" is "non-compliance with DPDP/GDPR". The protocol says the agent does not give legal conclusions, and strictly-necessary storage is often treated differently. | Reword as: "Developer requested a consent banner; legal review of requirements is the developer's responsibility." Keep the banner task (T-008) |

### B-B. Facts in the new docs that need a source (anti-hallucination)

`prd.md`, `memory.md`, `Ficcado-Website.md` contain statements that may be correct but must be traceable. For each, cite the **file path** it comes from or mark it `ASSUMPTION`; anything you cannot source goes to the question list, and nothing unsourced stays in the docs:

| ID | Statement | Action |
|----|-----------|--------|
| **B-15** | Founders' **names**, **"founded in 2025"**, **230 GSM combed cotton**, drop-shoulder / anti-sag collar, "radical textile honesty", "small-batch capsule drops", colour packs (Colorado, Citrus, Monochrome) | Cite the source file for each. I confirm in **D10** which are owner-approved. Approved facts go to `memory.md` as `source: developer`. Unapproved ones are removed from the docs **and from the site** if the site displays them |
| **B-16** | `prd.md §2` personas ("evidenced in codebase") and target-audience wording | Personas are inference, not evidence. Label as `ASSUMPTION` or remove. Add a **Success metrics** section marked `UNKNOWN: ask developer` |
| **B-17** | `architecture.md` ADR dates (2026-09-15/20/28), "~50 MB" size claim for `googleapis`, "Netlify 10–26 s function limit" | Source from git history / official docs, or remove the numbers |
| **B-18** | **Combos status contradiction.** `prd.md`/`memory.md F-006` say only T-Shirts is live and Combos is "coming-soon". The earlier requirement had **both** live. | Don't decide. Confirm with me (**D9**), then fix `prd.md`, `memory.md`, FAQ copy and category config consistently |
| **B-19** | Real **Sheet ID** and real service-account **key filename** printed in `Ficcado-Website.md` and `memory.md` | Replace with placeholders (`<44-char sheet id>`, `<key file name>`) unless I say otherwise (**D14**) |

### B-C. Knowledge-base completeness and sync

| ID | Problem | Action |
|----|---------|--------|
| **B-20** | `rules.md` is missing items required by `IMPOSTER.md §4`: folder rules, logging rules, cookie/consent rules, testing rules, performance rules, commit/PR rules, an app-specific **never-do** list, and how to update memory/progress. | Complete it |
| **B-21** | `design.md` has tokens only. Missing: component inventory with variants, loading/empty/error patterns, accessibility rules, image rules (item folder structure), content tone. | Complete it from the code. Describe, don't redesign |
| **B-22** | `progress.md` stops at P-002; Phase 3 (audit) is unlogged. `memory.md` still says "Proceeding to Phase 3". | Add P-003 (audit) and P-004 (this response + corrections); update `memory.md` current state to "Phase 3 complete; corrections in progress"; record my answers (Part A, Part C) as decisions **D-003…** with date and "Decided by: developer" |
| **B-23** | `Ficcado-Website.md §28` listed only four questions. The protocol requires asking about rate-limit store, CAPTCHA, error tracking, coverage numbers, consent expiry/regions, deploy gating, hosting plan, expected traffic split. | Those are now in Part C. After my answers, update `Ficcado-Website.md §28` to show answered/pending |

---

### B-D. Privacy, consent and cache safety (added after the developer's legal question; **P0, before launch**)

> The agent does **not** certify legal compliance. These items reduce risk and make the app's behavior match what the Privacy Policy says. A lawyer reviews the final wording (see D15).

| ID | Problem / requirement | Required action |
|----|----------------------|-----------------|
| **B-24** | **Shared caches (CDN, ISR, data cache) must never hold customer data.** Only public catalog and delivery-option data may be cached. Also, the cached delivery-options response must not expose `partner_phone` or `partner_address` from the Courier Partners tab. | Set `Cache-Control: no-store` on `/api/orders` and `/api/inquiry` and verify responses carry no `Set-Cookie`. Confirm no ISR/static page renders per-visitor data. Reduce the delivery-options payload to only what the UI needs (id, name, charge, delivery time). Confirm server logs contain no names, phones, emails or addresses. Prove with `curl -I` and a code search. Add a rule to `docs/rules.md`: "never cache a response that contains personal data" |
| **B-25** | **Personal data sits in the visitor's browser storage.** `ficcado-checkout-form-draft` (localStorage) stores name, phone, email and address and persists indefinitely. `ficcado-last-order` (sessionStorage) stores the WhatsApp URL, which contains the full order message with the same personal data. The audit classified the draft as "strictly necessary"; that is debatable because it is a convenience feature. | (1) Reclassify the draft as **Preferences** in the storage inventory and `src/config/cookies.ts`, and save it only after the user has accepted Preferences (or stop persisting it; ask the developer which). (2) Clear the draft on successful order. (3) Clear `ficcado-last-order` as soon as `/checkout/whatsapp-continue` has used it, and add a short expiry. (4) Add a visible **"Clear my saved data"** action in cookie settings. (5) Keep `ficcado-bag-v3` as necessary (it holds product ids/sizes, not personal data). (6) Reconsider `fc_is_ios` (a CSS safe-area approach may remove the need for storage) |
| **B-26** | **Consent banner moves from P1 to P0** (task T-008). | Bottom banner, no layout shift, loaded after hydration. **Accept all / Reject all / Manage preferences** with equal prominence. Reject removes the draft and recent-searches data; the bag keeps working. Footer link "Cookie settings" reopens it. Consent record stored with version and timestamp (expiry per **D5**), read **on the client only** so pages stay cacheable. Cookie Policy page generated from the **real** inventory, and it must state that the site sets no cookies and lists the localStorage/sessionStorage keys. Tests: accept, reject, partial, version bump, "nothing optional stored before consent" |
| **B-27** | **Privacy notice at the point of data collection.** The banner covers browser storage, not the customer's name/phone/address that go to Google Sheets and then to WhatsApp. | Compare the existing Privacy Policy page with the **real** data flows: fields collected, Google Sheets as storage, handoff via WhatsApp, courier sharing (only if true). List every mismatch. Add a short notice with a link next to **Place Order** and the support submit button (purpose, what is collected, where it goes, how to ask for correction/deletion). **Do not invent** retention periods, contact emails or grievance details: use `UNKNOWN` until the developer answers **D15** |
| **B-28** | **Personal data at rest in Google Sheets.** | Document who has access to the sheet; confirm only the service account and named owners; confirm 2-step verification on the owning Google account; propose a retention/archival plan for `New Sale Request` and `Support Requests` and a backup/export routine. Mark anything you cannot verify as NOT VERIFIED |

---

## PART C: Developer Decisions (**edit this table before giving the file to the agent**)

> The "Recommended" column is only a suggestion. Replace `PENDING` with your decision. The agent must not proceed on `PENDING` items.

| # | Decision | Options | Recommended | **Developer decision** |
|---|----------|---------|-------------|------------------------|
| **D1** | How to generate **atomic unique Reference IDs** (fixes B-01) | **A.** Google Apps Script web app with a lock and a stored counter (one call: lock → next ID → append → return). **B.** Keep the Sheets API; append the row, then write the ID derived from the row number (needs the sheet protected so rows are never deleted/sorted). **C.** Other | A | PENDING |
| **D2** | **Rate-limit store/provider** (B-06) | **A.** Netlify platform rate limiting (only if my plan supports it; the agent verifies in current docs). **B.** Upstash Redis for app-level limits. **C.** Cloudflare in front of the domain. A + B together is possible | B (plus A if available) | PENDING |
| **D3** | **CAPTCHA** (Cloudflare Turnstile) on order and support forms | Yes / No / Only if abuse appears | Not at launch; add if abuse appears | PENDING |
| **D4** | **Error tracking** (e.g., Sentry) | Yes (agent proposes vendor + consent handling) / No (use structured logs + uptime check only) | Yes, after launch | PENDING |
| **D5** | **Consent**: storage record expiry, regions covered, categories | Expiry 6 or 12 months; India only or also EU/UK; categories Necessary + Preferences (+ Analytics if added later) | 12 months; ______ ; Necessary + Preferences | PENDING |
| **D6** | **Test coverage thresholds** | e.g., ≥ 80 % for server/lib logic, 100 % for money, ID and security-critical code | As suggested | PENDING |
| **D7** | **Deploy gating** | **A.** Protected `main` with required GitHub checks; Netlify auto-deploys only merged code. **B.** Deploy from GitHub Actions with the Netlify CLI and turn off Netlify auto-builds | A | PENDING |
| **D8** | **Netlify plan** and **expected peak traffic** | Plan: ______ . Peak concurrent visitors: ______ . Share placing orders: ______ % . Expected orders/minute at peak: ______ | n/a (fill in) | PENDING |
| **D9** | **Combos**: live or coming-soon? | Live / Coming soon | n/a (fill in) | PENDING |
| **D10** | **Brand facts** (B-15): which are owner-approved? Founders' names / founded 2025 / 230 GSM / drop-shoulder / anti-sag collar / colour packs / other | Yes/No for each | n/a (fill in) | PENDING |
| **D11** | **Credentials**: was this repo ever pushed to a remote? Public or private? Was `credentials/` ever committed? | Answers | n/a (fill in) | PENDING |
| **D12** | `progress.md` location | `docs/progress.md` or project root | `docs/` | PENDING |
| **D13** | **CSP approach and HSTS** | CSP: hash-based/pragmatic policy (keeps pages cacheable) vs nonce-based (stronger, forces dynamic rendering). HSTS `preload`/`includeSubDomains`: keep or drop | Hash/pragmatic CSP; drop `preload` unless I intend it | PENDING |
| **D14** | Replace real Sheet ID / key filename in docs with placeholders | Yes / No | Yes | PENDING |
| **D15** | **Privacy details** the agent must not invent: contact email for data requests/grievances, how long order and support data is kept, whether details are shared with couriers, who reviews the Privacy Policy legally, which regions' visitors you serve | Email: ______ . Retention: ______ . Shared with couriers: yes/no . Legal reviewer: ______ . Regions: ______ | n/a (fill in) | PENDING |

---

## PART D: Approved Work Order

The developer's goal is to push to production **today**. Work in this order. After **each batch**: lint, type-check, tests, build; then update `progress.md`, `tasks.md`, `memory.md`, and the affected parts of `Ficcado-Website.md`.

### P0: Before the push (blocks launch)
1. **B-10** secret/history verification (and tell me the result first).
2. **T-002 / T-003** dependency security (with verified versions).
3. **T-001** failing test fixed; suite green.
4. **B-02, B-03, B-04, B-05 + T-004**: shared catalog/courier cache, remove or cache the public GET endpoints, ISR that actually works, checkout price re-validation.
5. **B-01 + D1**: atomic Reference ID and a concurrency test. *(If D1 is PENDING at push time, tell me honestly what risk remains: duplicate IDs under simultaneous orders.)*
6. **B-06 + D2 (minimum)**: rate limiting on every API route. *(If D2 is PENDING, ship with honeypot + payload limits + cached reads, and state the residual risk plainly.)*
7. **B-07 / B-08**: one Netlify config; headers verified with `curl -I` on a preview deploy.
8. **B-09 (minimum)**: one error response shape and friendly messages; `error.tsx` / `global-error.tsx` / `not-found.tsx` present.
9. **B-24 / B-25 / B-26 (T-008)**: no personal data in shared caches; personal data minimized in browser storage; consent banner, "Cookie settings" link and Cookie Policy page live (**D5**).
10. **B-27**: privacy notice next to Place Order and the support submit button, and the Privacy Policy compared with the real data flows (wording per **D15**; nothing invented).

### P1: Within the first days after launch
`T-006` CI + **D7** gating; **B-28** sheet access/retention/backup follow-through; **B-12** test expansion; `OBS-01` + **D4**; `T-005`, `T-007`; B-15–B-23 documentation corrections; B-13 measurements (Lighthouse, load test on staging with a test sheet).

### Revised acceptance criteria
- [ ] Every audit finding and every B-item has a task and a final status with evidence.
- [ ] 20 parallel test orders produce 20 unique Reference IDs and no duplicate rows (paste output).
- [ ] The documented Sheets-calls-per-order table exists and the maximum orders/minute is stated with the quota source.
- [ ] Visitor page views cause **zero** Sheets calls in steady state (show how you verified).
- [ ] `curl -I` output proves security and cache headers on the deployed preview.
- [ ] `npm audit --omit=dev` shows no critical/high issues (or each remaining one is explained).
- [ ] `curl -I` on `/api/orders` and `/api/inquiry` shows `no-store`; no cacheable response contains personal data or `Set-Cookie`.
- [ ] The checkout draft and last-order data are cleared after a successful order; "Reject all" removes optional stored data; the bag still works.
- [ ] The consent banner appears on first visit without layout shift, and "Cookie settings" reopens it; nothing optional is stored before consent.
- [ ] A privacy notice appears next to Place Order and the support submit button, and every mismatch between the Privacy Policy and the real data flows is listed.
- [ ] Final report lists **NOT VERIFIED** items and the real measured limits (not the 1 lakh target).

---

## Final Instruction

Post a short acknowledgement and your plan for **Part B → corrected `audit-report.md` and `tasks.md`**, then wait for the developer's go-ahead on the P0 batch. **Ask, don't guess. Never claim what you did not run.**
