# Production Audit Report ("Phase-10 Audit") — Ficcado

**Purpose:** Comprehensive production-readiness audit evaluating stability, scale (100,000 concurrent user readiness), error resilience, data integrity, security, and privacy compliance.  
**Audited Commit:** `90c3da4b63cec8406526a6e91f28e9de0a867def` (updated post-Phase 4 review)  
**Generated Date:** 2026-10-06  
**Reference Map:** `Ficcado-Website.md`  

---

## 1. Executive Summary & Scorecard

| Category | Status | Provisional Severity | Findings Count | Core Issue |
|---|---|---|---|---|
| **B1. Boilerplate & Dead Code** | **Fail** | Low | 2 | Redundant `content/faq.ts`, `Math.random()` in server IDs |
| **B2. Error Handling** | **Fail** | Medium | 1 | No unified API error helper, missing `global-error.tsx`/`not-found.tsx` |
| **B3. Automated Tests** | **Fail** | **Blocker** | 1 | Missing `docs/BACKLINK_PLAN.md` breaks test suite (28 pass, 1 fail) |
| **B4. CI/CD Pipeline** | **Fail** | Medium | 1 | No automated GitHub Actions CI workflow gating production |
| **B5. Scale (100k Target)** | **Fail** | **High** | 2 | `revalidate = 0` on visitor routes; Sheets quota collapse under load |
| **B6. Rate Limiting** | **Fail** | Medium | 1 | Missing IP-based rate limiting across all `/api/*` endpoints |
| **B7. Security** | **Fail** | **Blocker** | 3 | Next.js RCE (GHSA-vcvr-r3jv-pc5j); `source-map-js` DoS; secrets review |
| **B8. Data Integrity (Sheets)** | **Fail** | **Provisional: Blocker** *(finalize after concurrency test)* | 1 | Read-then-append race condition yields duplicate Reference IDs |
| **B9. Cookies & Consent** | **Fail** | **High (P0)** | 2 | PII in `localStorage` without consent banner; Privacy policy mismatch |
| **B10. Performance & UX** | **Pass** | Low | 0 | Responsive shell, Turbopack bundle compiled cleanly |
| **B11. Architecture & Cleanliness**| **Pass** | Low | 0 | Strict TypeScript, feature-aligned path aliases |
| **B12. Observability & Ops** | **Fail** | Medium | 1 | Console logging only; no centralized error telemetry |
| **B13. Deployment Readiness** | **Fail** | Medium | 1 | Two conflicting `netlify.toml` files |
| **B14. Pre-Mortem** | **Pass** | Low | 0 | Evaluated 25+ failure vectors with mitigation strategies |

---

## 2. Findings Register & Evidence Table

| Finding ID | Severity | Category | Location | What is Wrong | What Breaks in Production | Proposed Fix |
|---|---|---|---|---|---|---|
| **B-01** | **Blocker (Provisional)** | B8 Data Integrity | `src/app/api/orders/route.ts:L218-280` | Read-then-append logic for Reference ID. Reads recent rows, increments, then appends. | Concurrent orders read the same highest ID and create duplicate Reference IDs. Same `submission_id` passes duplicate check. | Google Apps Script lock/counter or atomic row-derived ID (Decision D1). Concurrency test required. |
| **B-02** | **High** | B5 Scale / B8 Sheets | `src/app/api/orders/route.ts` | 3–4 Sheets reads + 1 write per order (catalog + courier + recent rows + append). | 15 orders/minute exhausts Google's 60 req/min quota, triggering 429 errors for all visitors. | Share cached catalog/couriers in `/api/orders`; bound recent row scan. |
| **B-03** | **High** | B5 Scale / B6 Limits | `src/app/api/products`, `src/app/api/delivery-options` | `force-dynamic`, `no-store`, unauthenticated GET endpoints called by UI. | Bot loop directly calls endpoints and exhausts Google Sheets quota, taking down checkout. | Serve from shared cache with `s-maxage` + `stale-while-revalidate`, rate-limit, strip unused fields. |
| **B-04** | **Medium** | B5 Scale | `src/lib/products.ts:L19`, `src/generated/` | Ephemeral runtime disk cache `products-cache.json` on read-only serverless filesystem. | Runtime write fails or vanishes on new instances; fallback is unavailable during outages. | Build-time static snapshot or Netlify Blobs platform cache. |
| **B-05** | **High** | B5 Scale | `src/lib/sheets/client.ts:L199` | `cache: 'no-store'` hardcoded in `getSheetValues` fetch options. | Blocks Next.js ISR from caching pages; `revalidate = 60` on routes is silently ignored. | Remove `no-store` or configure explicit Next.js revalidation cache controls. |
| **B-06** | **Medium** | B6 Rate Limiting | `src/app/api/` (all routes) | Only `/api/orders` had partial abuse guard; `/api/inquiry` only has honeypot; GET endpoints open. | Abuse floods Google Sheets API and mailboxes. | Implement uniform rate limiting across every route in `/api/*` (Decision D2). |
| **B-07** | **Medium** | B13 Deploy | `netlify.toml` (root & frontend) | Two `netlify.toml` files with overlapping directives. | Security & caching headers in frontend file may be skipped; manual `publish` conflicts with runtime. | Consolidate into single root `netlify.toml`, verify runtime defaults. |
| **B-08** | **Medium** | B7 Security | `ficcado-website-frontend/netlify.toml` | Missing CSP, obsolete `X-XSS-Protection`, HSTS `preload` hard to reverse, no Origin check on POST. | Vulnerable to CSRF/XSS; difficult to change subdomains if preloaded. | Pragmatic/hash CSP, drop `preload` (D13), add Origin checks on mutating routes. |
| **B-09** | **Medium** | B2 Error Handling | `src/app/api/`, `src/app/` | Inconsistent API shapes (`{ ok, options }` vs `{ success, error }`), no `global-error.tsx`/`not-found.tsx`. | Inconsistent client error parsing; raw server exceptions unhandled. | Standardize API envelope `{ success, data, error: { code, message, requestId } }`; add Next boundaries. |
| **B-10** | **Blocker** | B7 Security | `credentials/` | Local service account key file in repo workspace. | Potential credential exposure if git tracking or ignore rules fail. | **VERIFIED CLEAN:** 0 commits in git history, covered by `.gitignore`. Must remain untracked. |
| **B-11** | **Low** | B11 Tasks Sync | `docs/tasks.md` | Audit findings previously missing corresponding task IDs. | Untracked tasks drop through the cracks. | Resolved: Full mapping table implemented in `docs/tasks.md`. |
| **B-24** | **High** | B7 / B9 Privacy | `src/app/api/delivery-options`, CDN | Risk of personal data in shared caches; `/api/delivery-options` exposes courier address/phone. | Customer PII leaked to other users via CDN cache; internal vendor contact info leaked. | Set `Cache-Control: no-store` on orders/inquiry; prune courier payload to `id, name, rate, deliveryTime`. |
| **B-25** | **High** | B9 Privacy | `src/app/checkout/page.tsx`, `localStorage` | Indefinite persistence of name, phone, address in `ficcado-checkout-form-draft`. | Personal data sits indefinitely in shared/browser storage without clear expiry. | Reclassify draft as Preferences; clear draft on successful order; clear `ficcado-last-order`. |
| **B-26** | **High (P0)** | B9 Consent | Storefront Layout | No user consent banner for non-essential storage. | Developer requested explicit consent banner before launch. | Implement bottom banner (Accept All / Reject All / Manage Preferences), zero layout shift. |
| **B-27** | **Medium** | B9 Privacy | `src/app/privacy/page.tsx`, `/checkout` | Privacy policy claims differ from real data flows (Google Sheets storage, WhatsApp handoff). | Customer unaware where personal data travels. | Add privacy notice next to Place Order CTA; align Privacy Policy with real data pipelines. |
| **B-28** | **Medium** | B7 / B8 Data at Rest | Google Sheets | Customer orders stored in Google Sheets without documented retention or access review. | Unauthorized Google account access or indefinite data accumulation. | Document access list (service account + owner only); 2FA on Google account; retention/export plan. |
| **SEC-01** | **Blocker** | B7 Security | `package.json` | Next.js 16.3.5 vulnerable to ImageResponse RCE (GHSA-vcvr-r3jv-pc5j). Range: `>=16.2.0 <16.3.6`. | Critical remote code execution vulnerability. | Upgrade to `next@16.3.8` (verified inside patched range `>=16.3.6`). |
| **SEC-02** | **High** | B7 Security | `package.json` | `source-map-js@1.2.1` vulnerable to DoS (GHSA-68fv-2mgg-jv7q). Range: `>=1.0.0 <1.2.2`. | Event-loop denial of service. | Upgrade `source-map-js` to `^1.2.2` via package `overrides`. |
| **TEST-01**| **Blocker** | B3 Tests | `scripts/tests/phase2-discoverability.test.mjs:L83` | Missing `docs/BACKLINK_PLAN.md` fails automated test suite. | `npm test` exits 1. Blocks automated CI verification. | Restore `BACKLINK_PLAN.md` into `docs/`. |
| **CODE-01**| **Low** | B1 Cleanup | `content/faq.ts` & `src/content/faq.ts` | Duplicate FAQ data files. | Code confusion over canonical data source. | Remove redundant `content/faq.ts`. |
| **CODE-02**| **Low** | B1 Cleanup | `src/lib/referenceId.ts`, `api/inquiry` | `Math.random()` used for ticket IDs and offline IDs. | Weak identifier randomness. | Replace with `crypto.randomUUID()` or `crypto.randomBytes()`. |
| **CI-01** | **Medium** | B4 CI/CD | `.github/workflows/` | No GitHub Actions workflow exists. | Commits push to production without automated test verification. | Add `.github/workflows/ci.yml`. |
| **OBS-01** | **Medium** | B12 Observability | `src/app/api/` | Unhandled error telemetry lacks centralized monitoring. | Production failures must be diagnosed from raw host logs. | Configure structured logs and document Sentry/alerting pattern. |

---

## 3. Real Measurement & Evidence Records

### 3.1 First-Load Bundle Sizes by Route (from `npm run build`)
- Framework / Shared Runtime JS: ~110 kB
- Route `/`: Dynamic SSR (`ƒ`) — Server rendered
- Route `/categories/[slug]`: Dynamic SSR (`ƒ`) — Server rendered
- Route `/checkout`: Static Client (`○`) — 31.4 kB source bundle
- Route `/search`: Static Client (`○`) — 13.2 kB source bundle
- Route `/journal`: Static Client (`○`) — 26.6 kB source bundle
- Route `/support`: Static Client (`○`) — 23.4 kB source bundle
- Route `/about`: Static Pre-rendered (`○`) — Minimal static HTML
- Route `/faq`: Static Pre-rendered (`○`) — Minimal static HTML

### 3.2 Google Sheets Calls Per Journey (Measured from Code)
- **Visitor Page View (`/` or `/categories/[slug]`):** 1 call (`Item Management` read). Steady state target after ISR: **0 calls**.
- **Checkout View (`/checkout`):** 1 call (`Courier Partners` read via `/api/delivery-options`). Target after shared cache: **0 calls**.
- **Order Placement (`POST /api/orders`):**
  - Current: 1 catalog read + 1 courier read + 1 cold-start schema check + 1 recent rows read + 1 row append = **4–5 API calls**.
  - Target: 0 catalog read (from shared cache) + 0 courier read (from shared cache) + 1 atomic create/append = **1 API call**.
- **Official Google API Quotas:** 60 read requests per minute per user / 300 per project. 60 write requests per minute per user.
- **Calculated Maximum Order Rate (Current):** Saturated at ~12–15 orders/minute before quota failure. With single-call atomic append: **60 orders/minute**.

---

## 4. NOT VERIFIED Section (Explicitly Unmeasured)

The following items could not be measured in this environment and must be verified before declaring final production readiness:
1. **Lighthouse Mobile Score:** `NOT RUN: headless Chrome/Lighthouse CLI not configured in local Node runner`. Must be run against deployed preview.
2. **Real-Device WhatsApp Deep Link:** `NOT RUN: requires physical iOS and Android devices with WhatsApp installed`.
3. **Staging k6 Load Test:** `NOT RUN: requires deployed staging URL and isolated test spreadsheet`. Load-testing production spreadsheet is strictly prohibited.
4. **Deployed Preview HTTP Response Headers:** `NOT RUN: requires live Netlify preview URL to test with curl -I`.
5. **Legal Compliance Certification:** `NOT RUN: legal compliance under DPDP Act 2023 / GDPR requires formal counsel review`.
6. **Dedicated Secret Scanner:** `NOT VERIFIED: gitleaks/trufflehog binary not installed in local environment`. (Manual git log regex and commit inspection proved 0 real keys in history; strings are 3-char `...` placeholders).
7. **GitHub Repo Visibility:** `NOT VERIFIED: currently public on GitHub web interface; requires owner action in GitHub repository settings to make private`.
8. **Google Sheet Sharing Settings:** `NOT VERIFIED: exact ACLs and link-sharing status on the production sheet require manual Google Drive UI inspection by the owner`.
9. **Netlify Runtime Filesystem Behavior:** `NOT VERIFIED: behavior of ephemeral local disk cache under multi-instance Netlify serverless execution cannot be validated locally`.
10. **Netlify Plan Limits:** `NOT VERIFIED: whether active Netlify plan quotas (bandwidth, function invocations, execution minutes) accommodate 100,000 visitors requires account dashboard verification`.
