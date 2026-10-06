# Task Backlog & Implementation Tracker — Ficcado

**Purpose:** Comprehensive tracking of all production audit findings, architectural enhancements, security fixes, and documentation updates.  
**Last Updated:** 2026-10-06  
**Audited Commit:** `90c3da4b63cec8406526a6e91f28e9de0a867def`  

---

## 1. Finding-ID ↔ Task-ID Mapping Table & Deduplication

### 1.1 Task ID Transition / Alias Table (Old ID → New ID)
| Old Task ID (Initial Draft) | New Canonical ID | Audit Finding | Description |
|---|---|---|---|
| `T-002` (draft Next upgrade) | `T-029` | SEC-01 | Upgrade Next.js & eslint-config-next to 16.3.8 |
| `T-003` (draft source-map override) | `T-030` | SEC-02 | Add source-map-js ^1.2.2 package override |
| `TEST-01` | `T-031` | TEST-01 | Restore docs/BACKLINK_PLAN.md for test suite pass |
| `CI-01` | `T-032` | CI-01 | Add GitHub Actions CI workflow |
| `OBS-01` | `T-033` | OBS-01 | Centralized structured logging & monitoring |
| `CODE-01` | `T-034` | CODE-01 | Remove redundant content/faq.ts |
| `CODE-02` | `T-035` | CODE-02 | Replace Math.random with crypto UUIDs |

### 1.2 Comprehensive Finding & Task Register

| Finding / Item ID | Primary Task ID | Category | Merged With / Handled How | Priority |
|---|---|---|---|---|
| **B-01** | `T-001` | Data Integrity | Merged with D1 (Atomic Reference ID generation). | **P0 (Blocker)** |
| **B-02** | `T-002` | Quotas & Scaling | Merged with `T-004` (Shared cache for catalog & couriers inside `/api/orders`). | **P0 (High)** |
| **B-03** | `T-003` | Quotas & Surface | Cache & rate-limit `/api/products` and `/api/delivery-options`; strip unneeded courier fields. | **P0 (High)** |
| **B-04** | `T-004` | Scaling / Fallback | Replace fragile runtime disk cache with build-time snapshot or platform cache. | **P0 (High)** |
| **B-05** | `T-005` | Caching / ISR | Remove `cache: 'no-store'` in Sheets client to unblock ISR; verify checkout price check. | **P0 (High)** |
| **B-06** | `T-006` | Rate Limiting | Rate limiting across all `/api/*` endpoints (Decision D2). Merged with `RATE-01`. | **P0 (High)** |
| **B-07** | `T-007` | Deployment | Merge root and frontend `netlify.toml` into single unified configuration. | **P0 (Medium)** |
| **B-08** | `T-008` | Security | Pragmatic CSP, drop obsolete `X-XSS-Protection`, review HSTS `preload` (Decision D13). | **P0 (Medium)** |
| **B-09** | `T-009` | Error Handling | Unified API response envelope `{ success, data, error }`; Next error boundaries. | **P0 (Medium)** |
| **B-10** | `T-010` | Security | **VERIFIED CLEAN:** Git history & remote verified. Key file confirmed git-ignored. | **P0 (Done)** |
| **B-11** | `T-011` | Task Sync | Re-issued `tasks.md` with full bidirectional finding-task mapping. | **P0 (Done)** |
| **B-12** | `T-012` | Testing | Test expansion (API route integration tests, Playwright e2e with fake Sheets client). | **P1 (Medium)** |
| **B-13** | `T-013` | Measurements | Handled via measurements table and `NOT VERIFIED` section in `audit-report.md`. | **P0 (Done)** |
| **B-14** | `T-014` | Legal Text | Handled by re-wording PRIV-01 in `audit-report.md` (no legal advice). | **P0 (Done)** |
| **B-15** | `T-015` | Brand Facts | Sourced facts in `Ficcado-Website.md`, `prd.md`, and `memory.md` (`layout.tsx`, `journal/`). | **P0 (Done)** |
| **B-16** | `T-016` | PRD Personas | Handled by marking personas as `ASSUMPTION` and adding `Success metrics: UNKNOWN`. | **P0 (Done)** |
| **B-17** | `T-017` | Architecture Sync | Sourced ADR details and Netlify serverless limits in `docs/architecture.md`. | **P0 (Done)** |
| **B-18** | `T-018` | Combos Status | Managed via Decision D9 (status: pending developer decision). | **P0 (Pending)** |
| **B-19** | `T-019` | Secrets Sanitization | Sanitized real Sheet ID and service key filename with placeholders in all docs. | **P0 (Done)** |
| **B-20** | `T-020` | Rules Completion | Completed missing folder, logging, testing, and never-do rules in `docs/rules.md`. | **P0 (Done)** |
| **B-21** | `T-021` | Design Tokens | Completed component variants, empty/error states, and asset rules in `docs/design.md`. | **P0 (Done)** |
| **B-22** | `T-022` | Living Logs | Added P-003 and P-004 to `progress.md`; updated state and D-003+ in `memory.md`. | **P0 (Done)** |
| **B-23** | `T-023` | Master Doc Sync | Updated Section 28 of `Ficcado-Website.md` with answered/pending status. | **P0 (Done)** |
| **B-24** | `T-024` | Privacy / Caching | `Cache-Control: no-store` on order/inquiry; prune phone/address from courier options. | **P0 (High)** |
| **B-25** | `T-025` | Privacy / Storage | Reclassify checkout draft as Preferences; clear draft on order; clear `ficcado-last-order`. | **P0 (High)** |
| **B-26** | `T-026` | Consent Banner | Implement zero layout-shift consent banner (Accept All / Reject All / Manage). Merged with `T-008/PRIV-01`. | **P0 (High)** |
| **B-27** | `T-027` | Privacy Notice | Privacy notice next to Place Order CTA; align Privacy Policy with real data flows. | **P0 (Medium)** |
| **B-28** | `T-028` | Data at Rest | Google Sheets access list review, 2FA confirmation, retention/archival documentation. | **P1 (Medium)** |
| **SEC-01** | `T-029` | Security | Upgrade Next.js to 16.3.8 (verified inside patched range `>=16.3.6`). | **P0 (Blocker)** |
| **SEC-02** | `T-030` | Security | Upgrade `source-map-js` to `^1.2.2` via package overrides (verified patched version exists). | **P0 (High)** |
| **TEST-01**| `T-031` | Tests | Restore `docs/BACKLINK_PLAN.md` to achieve 100% test pass rate (29/29). | **P0 (Blocker)** |
| **CI-01** | `T-032` | CI/CD | Add `.github/workflows/ci.yml` running lint, typecheck, brand check, tests, build. | **P1 (Medium)** |
| **OBS-01** | `T-033` | Observability | Configure structured server logging and error alerting documentation (Decision D4). | **P1 (Medium)** |
| **CODE-01**| `T-034` | Cleanup | Delete redundant `content/faq.ts` in root directory. | **P1 (Low)** |
| **CODE-02**| `T-035` | Cleanup | Replace `Math.random()` with `crypto.randomUUID()` in server ID generators. | **P1 (Low)** |

---

## 2. P0: Approved Launch Blockers (Must Complete Before Push)

### `T-031` (Finding TEST-01) — Restore `docs/BACKLINK_PLAN.md` [Severity: Blocker] [Status: Todo]
- **Target Files:** `docs/BACKLINK_PLAN.md`
- **Acceptance Criteria:** `npm test` runs with 29/29 passing tests.

### `T-029` (Finding SEC-01) — Upgrade Next.js to 16.3.8 [Severity: Blocker] [Status: Todo]
- **Target Files:** `package.json`, `package-lock.json`
- **Acceptance Criteria:** `next` and `eslint-config-next` set to `16.3.8`. `npm audit --omit=dev` shows 0 critical vulnerabilities.

### `T-030` (Finding SEC-02) — Patch `source-map-js` via Overrides [Severity: High] [Status: Todo]
- **Target Files:** `package.json`, `package-lock.json`
- **Acceptance Criteria:** Package overrides force `source-map-js: "^1.2.2"`. Re-audit reports 0 high vulnerabilities.

### `T-001` (Finding B-01) — Atomic Reference ID Generation & Concurrency Test [Severity: Blocker] [Status: Blocked on D1]
- **Target Files:** `src/app/api/orders/route.ts`, `src/lib/referenceId.ts`
- **Acceptance Criteria:** 20 parallel test order requests produce 20 unique Reference IDs and no duplicate rows.
- **Dependency:** Pending Decision D1.

### `T-004` & `T-005` (Findings B-02, B-04, B-05) — Shared Cache & ISR Enabled [Severity: High] [Status: Todo]
- **Target Files:** `src/lib/sheets/client.ts`, `src/app/page.tsx`, `src/app/categories/[slug]/page.tsx`
- **Acceptance Criteria:** `cache: 'no-store'` removed from cached reads; `revalidate = 60` operational; visitor page views cause 0 Sheets calls in steady state.

### `T-003` (Finding B-03) — Quota Protection for Public GET Endpoints [Severity: High] [Status: Todo]
- **Target Files:** `src/app/api/products/route.ts`, `src/app/api/delivery-options/route.ts`
- **Acceptance Criteria:** Serve from shared cache with `s-maxage` headers; prune sensitive phone/address fields from delivery options payload.

### `T-006` (Finding B-06) — Rate Limiting on All API Routes [Severity: High] [Status: Blocked on D2]
- **Target Files:** `src/app/api/orders/route.ts`, `src/app/api/inquiry/route.ts`
- **Acceptance Criteria:** Uniform rate limits with friendly 429 UI messages.
- **Dependency:** Pending Decision D2.

### `T-007` & `T-008` (Findings B-07, B-08) — Unified Netlify Configuration & Headers [Severity: Medium] [Status: Todo]
- **Target Files:** `netlify.toml`, `ficcado-website-frontend/netlify.toml`
- **Acceptance Criteria:** Single root `netlify.toml`; pragmatic CSP; obsolete `X-XSS-Protection` removed; Origin checks on POST.

### `T-009` (Finding B-09) — Unified Error Response Envelope [Severity: Medium] [Status: Todo]
- **Target Files:** `src/app/api/`, `src/app/global-error.tsx`, `src/app/not-found.tsx`
- **Acceptance Criteria:** All API endpoints return `{ success, data, error: { code, message, requestId } }`.

### `T-024` & `T-025` (Findings B-24, B-25) — Personal Data Cache & Storage Protection [Severity: High] [Status: Todo]
- **Target Files:** `src/app/checkout/page.tsx`, `src/context/CartContext.tsx`
- **Acceptance Criteria:** `no-store` on mutating endpoints; checkout form draft classified as Preferences and cleared on successful order; `ficcado-last-order` cleared after handoff.

### `T-026` (Finding B-26) — Cookie/Storage Consent Banner [Severity: High] [Status: Blocked on D5]
- **Target Files:** `src/components/ui/CookieBanner.tsx`, `src/components/layout/AppShell.tsx`
- **Acceptance Criteria:** Bottom banner with Accept All, Reject All, and Manage Preferences; zero layout shift; persistent "Cookie settings" footer trigger.
- **Dependency:** Pending Decision D5.

### `T-027` (Finding B-27) — Point-of-Collection Privacy Notice [Severity: Medium] [Status: Blocked on D15]
- **Target Files:** `src/app/checkout/page.tsx`, `src/app/support/page.tsx`, `src/app/privacy/page.tsx`
- **Acceptance Criteria:** Explicit privacy notice link next to Place Order and Support Submit buttons matching real data pipelines.
- **Dependency:** Pending Decision D15.

---

## 3. P1: First Days Post-Launch Backlog

- **`T-032` (CI-01):** Add GitHub Actions CI workflow (Pending Decision D7).
- **`T-012` (B-12):** Expand test suite with Playwright e2e (fake Sheets client) and API route tests.
- **`T-028` (B-28):** Google Sheets access, 2FA, retention, and backup schedule.
- **`T-033` (OBS-01):** Structured server logging and Sentry error monitoring (Pending Decision D4).
- **`T-034` (CODE-01):** Remove redundant root `content/faq.ts`.
- **`T-035` (CODE-02):** Replace `Math.random()` in server identifier helpers.
