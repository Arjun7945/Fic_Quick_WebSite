# Task Backlog & Implementation Tracker — Ficcado

**Purpose:** Comprehensive inventory of findings, enhancements, fixes, and their implementation status.  
**Last Updated:** 2026-10-06  
**Source:** Phase 1 Deep Scan (`Ficcado-Website.md`) & Production Audit  

---

## Task Summary

| ID | Title | Severity | Status | Assigned Batch |
|---|---|---|---|---|
| **T-001** | Fix failing integration test in `phase2-discoverability.test.mjs` | **Blocker** | **Todo** | Batch 1 (Test Suite Fixes) |
| **T-002** | Upgrade Next.js to 16.3.8+ to resolve Critical RCE Advisory GHSA-vcvr-r3jv-pc5j | **Blocker** | **Todo** | Batch 2 (Security & Dependencies) |
| **T-003** | Resolve high vulnerability in `source-map-js` | **High** | **Todo** | Batch 2 (Security & Dependencies) |
| **T-004** | Implement ISR caching on high-traffic read routes (`/` & `/categories/[slug]`) | **High** | **Todo** | Batch 3 (Scale & Rate Limits) |
| **T-005** | Consolidate duplicate `content/faq.ts` and `src/content/faq.ts` files | **Low** | **Todo** | Batch 4 (Cleanup & Architecture) |
| **T-006** | Create GitHub Actions CI workflow for automated testing and builds | **Medium** | **Todo** | Batch 5 (CI/CD Pipeline) |
| **T-007** | Replace `Math.random()` in ID generation with cryptographic UUID/randomBytes | **Low** | **Todo** | Batch 4 (Cleanup & Architecture) |
| **T-008** | Implement Cookie Consent Banner and preferences manager per B9 standard | **Medium** | **Todo** | Batch 6 (Consent & Privacy) |

---

## Detailed Task Specifications

### T-001 — Fix failing integration test in `phase2-discoverability.test.mjs` [Priority: Blocker] [Status: Todo]
- **Source:** Phase 1 test execution finding (`npm test`).
- **Location:** `ficcado-website-frontend/scripts/tests/phase2-discoverability.test.mjs:L82-90`.
- **Issue:** Test looks for `docs/BACKLINK_PLAN.md`, but file was moved to `documents-1/BACKLINK_PLAN.md`.
- **Acceptance Criteria:** `npm test` runs with 100% passing tests (29/29 passing).
- **Files Affected:** `docs/BACKLINK_PLAN.md` or `scripts/tests/phase2-discoverability.test.mjs`.

### T-002 — Upgrade Next.js to 16.3.8+ to resolve Critical RCE Advisory GHSA-vcvr-r3jv-pc5j [Priority: Blocker] [Status: Todo]
- **Source:** Phase 1 `npm audit --omit=dev`.
- **Location:** `ficcado-website-frontend/package.json`.
- **Issue:** Next.js 16.3.5 is vulnerable to Remote Code Execution via ImageResponse.
- **Acceptance Criteria:** `npm audit --omit=dev` reports 0 critical vulnerabilities. `npm run build` succeeds cleanly.
- **Files Affected:** `package.json`, `package-lock.json`.

### T-003 — Resolve high vulnerability in `source-map-js` [Priority: High] [Status: Todo]
- **Source:** Phase 1 `npm audit --omit=dev`.
- **Location:** `ficcado-website-frontend/package.json`.
- **Issue:** `source-map-js` allows event-loop denial of service (GHSA-68fv-2mgg-jv7q).
- **Acceptance Criteria:** Vulnerability patched or mitigated.
- **Files Affected:** `package-lock.json`.

### T-004 — Implement ISR caching on high-traffic read routes (`/` & `/categories/[slug]`) [Priority: High] [Status: Todo]
- **Source:** Phase 1 Audit (Section B5 & B8).
- **Location:** `src/app/page.tsx`, `src/app/categories/[slug]/page.tsx`, `src/app/api/products/route.ts`.
- **Issue:** Dynamic `force-dynamic` with `revalidate = 0` queries Google Sheets on every visitor hit, which will crash under 100,000 visitors with 429 quota exhaustion.
- **Acceptance Criteria:** Routes are CDN-cacheable with `revalidate = 60` or ISR, eliminating per-visitor Google API reads.
- **Files Affected:** `src/app/page.tsx`, `src/app/categories/[slug]/page.tsx`.

### T-005 — Consolidate duplicate `content/faq.ts` and `src/content/faq.ts` [Priority: Low] [Status: Todo]
- **Source:** Phase 1 Audit (Section B1).
- **Location:** `ficcado-website-frontend/content/faq.ts` and `ficcado-website-frontend/src/content/faq.ts`.
- **Issue:** Duplicate file in two separate directory trees.
- **Acceptance Criteria:** Exactly one canonical FAQ source file is imported across the application.
- **Files Affected:** `content/faq.ts`, `src/content/faq.ts`.

### T-006 — Create GitHub Actions CI workflow [Priority: Medium] [Status: Todo]
- **Source:** Phase 1 Audit (Section B4).
- **Location:** `.github/workflows/ci.yml`.
- **Issue:** No automated pull request validation or build test gate prior to production deploy.
- **Acceptance Criteria:** `.github/workflows/ci.yml` runs typecheck, lint, brand check, unit tests, and build on push/PR.
- **Files Affected:** `.github/workflows/ci.yml`.

### T-007 — Replace `Math.random()` in ID generation with cryptographic randomness [Priority: Low] [Status: Todo]
- **Source:** Phase 1 Audit (Section B1).
- **Location:** `src/lib/referenceId.ts`, `src/app/api/inquiry/route.ts`.
- **Issue:** `Math.random()` used for ticket IDs and offline fallback IDs instead of Node `crypto.randomBytes`.
- **Acceptance Criteria:** `crypto.randomBytes` or `crypto.randomUUID` used for all server-generated identifiers.
- **Files Affected:** `src/lib/referenceId.ts`, `src/app/api/inquiry/route.ts`.

### T-008 — Implement lightweight Cookie Consent Banner & Preferences [Priority: Medium] [Status: Todo]
- **Source:** Phase 1 Audit (Section B9).
- **Location:** `src/components/layout/AppShell.tsx`, `src/config/cookies.ts`.
- **Issue:** App stores data in `localStorage` without explicit user consent preferences banner.
- **Acceptance Criteria:** Zero layout-shift consent banner with Accept All / Reject All / Manage Preferences; persistent settings link in footer.
- **Files Affected:** `src/components/ui/CookieBanner.tsx`, `src/components/layout/DesktopFooter.tsx`.
