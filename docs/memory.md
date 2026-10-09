# Persistent Agent Memory & Decision Log — Ficcado

**Purpose:** Persistent agent memory recording confirmed facts, decision logs, developer preferences, constraints, pitfalls, and current state.  
**Last Updated:** 2026-10-06  
**Audited Commit:** `90c3da4b63cec8406526a6e91f28e9de0a867def`  
**Source:** Phase 1 Deep Scan + Phase 4 Review Decisions  

---

## 1. Confirmed Facts

- **[F-001]** The brand name is strictly **Ficcado** (Capital F). Typos like `fikado`, `fkd`, `fik`, `ficado`, `ficcdo`, `ficcodo` are forbidden by `scripts/check-brand.mjs`. — Source: `scripts/check-brand.mjs` — 2026-10-06
- **[F-002]** The official Reference ID sequence starts with `FIC-A0001` and rolls over at `9999` to `FIC-B0001` ... `FIC-Z9999` → `FIC-AA0001`. — Source: `src/lib/referenceId.ts` — 2026-10-06
- **[F-003]** Google Sheets target spreadsheet has 4 required tabs: `'Item Management'`, `'Courier Partners'`, `'New Sale Request'`, and `'Support Requests'`. ID: `<44-char sheet id>`. — Source: `src/lib/sheets/schema.ts` — 2026-10-06
- **[F-004]** Delivery charge of ₹0 represents Free Delivery per Section R4. — Source: `src/lib/couriers.ts` — 2026-10-06
- **[F-005]** The application sets zero cookies. All client state is stored in `localStorage` (`ficcado-bag-v3`, `ficcado-checkout-form-draft`, `ficcado-recent-searches`) and `sessionStorage` (`ficcado-last-order`, `fc_is_ios`). — Source: Phase 1 Code Scan — 2026-10-06
- **[F-006]** Founders' names (Sinan MS, Ganga Lakshmi, Rohith Murali), "founded in 2024", and 240 GSM combed cotton specifications are sourced directly from codebase metadata (`src/app/layout.tsx:L119-L124`, `src/app/journal/page.tsx`, and `public/images/founders/`). Pending final confirmation in D10. — Source: Codebase — 2026-10-06
- **[F-007]** Service account key file in `credentials/` was verified clean: 0 files tracked in git, 0 commits in git history, and covered by root `.gitignore:L8`. — Source: Git command verification — 2026-10-06
- **[F-008]** Next.js ImageResponse RCE advisory (GHSA-vcvr-r3jv-pc5j) patched range is `>=16.3.6`. The latest release `16.3.8` is inside the patched range. — Source: `npm audit --json` & `npm view next dist-tags` — 2026-10-06
- **[F-009]** `source-map-js` vulnerability (GHSA-68fv-2mgg-jv7q) patched version `1.2.2` exists on npm registry. — Source: `npm view source-map-js versions` — 2026-10-06

---

## 2. Decision Log (Append-Only)

- **[D-001]** 2026-10-06 — **Question:** How should the project knowledge base be structured? — **Options:** A: Overwrite old documents; B: Preserve previous docs in `documents-1/` and generate standard IMPOSTER.md files in `docs/`. — **Decision:** Preserved historical docs in `documents-1/` and built fresh, evidence-backed living knowledge base in `docs/`. — **Decided by:** Agent per IMPOSTER.md protocol — **Status:** active
- **[D-002]** 2026-10-06 — **Question:** How should the application document be named? — **Options:** A: `Ficcado.md`; B: `Ficcado-Website.md`. — **Decision:** Named `Ficcado-Website.md` per exact example in IMPOSTER.md Section 3.1. — **Decided by:** Agent — **Status:** active
- **[D-003]** 2026-10-06 — **Question:** Catalog read caching strategy? — **Decision:** Option A: ISR (`revalidate = 60`) with shared cache across routes. — **Decided by:** Developer (Part A #1) — **Status:** approved
- **[D-004]** 2026-10-06 — **Question:** `BACKLINK_PLAN.md` test failure? — **Decision:** Option A: Restore the file into `docs/`. — **Decided by:** Developer (Part A #2) — **Status:** approved
- **[D-005]** 2026-10-06 — **Question:** Next.js version upgrade? — **Decision:** Option A: Upgrade to verified patched version `16.3.8`. — **Decided by:** Developer (Part A #3) — **Status:** approved
- **[D-006]** 2026-10-06 — **Question:** CI/CD pipeline addition? — **Decision:** Option A: Add GitHub Actions workflow. Gating approach follows D7. — **Decided by:** Developer (Part A #4) — **Status:** approved

---

## 3. Resolved Developer Decisions (Part C Resolutions)

- **[D1] Reference ID Strategy:** Option A selected. Google Apps Script web app with `LockService` + `PropertiesService` counter + idempotency on `submission_id` + append by header name. Next.js calls gateway via `ORDER_GATEWAY_URL` and `ORDER_GATEWAY_SECRET` (in body). Production fails unless gateway env vars set or `ORDER_ID_MODE=sheet-row` explicitly set. Offline `FIC-T` fallback generated with crypto. Docs at `docs/APPS_SCRIPT.md`.
- **[D2] Rate Limiting:** Upstash REST (`RATE_LIMIT_STORE=upstash` with `UPSTASH_REDIS_REST_URL` & `UPSTASH_REDIS_REST_TOKEN`) or `RATE_LIMIT_STORE=memory` (fallback with warning). Production fails if `RATE_LIMIT_STORE` unset. Fallback to in-memory if store down; never block all orders.
- **[D3] Bot Mitigation:** No CAPTCHA at launch. Honeypot + minimum-time-to-submit on order & support forms.
- **[D4] Observability:** No error-tracking vendor at launch. Structured JSON logs with request IDs and zero PII. Health endpoint protected by `ADMIN_TOKEN`.
- **[D5] Consent:** Expiry 12 months; equal-prominence Reject for all regions; categories: Necessary, Preferences, + empty Analytics slot ready in config.
- **[D6] Test Coverage:** ≥ 80% for `src/lib` and API routes; 100% for money, reference ID, sanitizeCell, rate-limit, and consent logic.
- **[D7] Deploy Gating:** Option A. `.github/workflows/ci.yml` and branch protection documentation.
- **[D8] Target Traffic:** 100,000 visitors, 10,000 peak concurrent, 100 orders/minute peak.
- **[D9] Combos Status:** Coming soon (`combos are coming soon only as of now`).
- **[D10] Brand Facts:** Approved by owner: All current details correct (2024, 240 GSM, drop-shoulder, anti-sag collar, colour packs).
- **[D11] Repo Visibility:** Public currently (developer can set private in GitHub). Remote key exposure: 0 keys in Git history (verified).
- **[D12] Living Log:** `docs/progress.md` confirmed as canonical.
- **[D13] CSP & HSTS:** `Content-Security-Policy-Report-Only` first (pragmatic policy); remove `X-XSS-Protection`; keep HSTS `max-age=31536000`, drop `preload` and `includeSubDomains`.
- **[D14] Secrets Sanitization:** Placeholders in all documentation completed.
- **[D15] Privacy Data:** Contact `ficcado.clothing@gmail.com`; hours 7AM–7PM; POG contact Rohith murali (`rohithficcado@gmail.com`); retention forever safe; courier sharing: only delivery label on package; region: INDIA; production fails if `NEXT_PUBLIC_PRIVACY_EMAIL` unset.

---

## 4. Current State Summary
- **Current Branch:** `imposter/p0`
- **P0 Status:** P0 Scope 100% complete across 11 atomic commits.
- **Verification Status:**
  - `npm audit --omit=dev`: 0 vulnerabilities.
  - Automated tests: 48/48 tests passing across 13 suites.
  - Lint: 0 errors, 0 warnings.
  - Typecheck: 0 errors.
  - Production build: Turbopack compiled 32/32 routes cleanly in 1293ms.
- **Next Phase:** P1 Scope execution (CI workflow, health endpoint, B-28 docs, API route integration tests).
