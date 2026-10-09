# Engineering Rules & Behavioral Directives — Ficcado

**Purpose:** Comprehensive development rules, security constraints, and operating standards for all developers and AI agents.  
**Last Updated:** 2026-10-06  
**Audited Commit:** `90c3da4b63cec8406526a6e91f28e9de0a867def`  
**Source:** `IMPOSTER.md` + repository codebase  

---

## 1. Prime Directives & Anti-Hallucination Protocol

1. **Source Hierarchy for Facts:**
   - 1. Active code and configuration in the repository.
   - 2. `Ficcado-Website.md`, `docs/memory.md`, and `docs/rules.md`.
   - 3. Explicit answers from the developer.
   - 4. Official documentation for the installed package versions.
   - *Anything outside these four is not a fact.*
2. **Never Invent:** Business rules, prices, URLs, secret keys, or test results. If something is unknown, label it `UNKNOWN: ask developer` and seek confirmation.
3. **No Silent Scope Creep:** Do not alter the UI aesthetic, change colors, rename components, or modify business logic unless explicitly requested.
4. **Never Print Secrets:** Never log or display sensitive private keys or tokens. Show variable names only.

---

## 2. Brand & Coding Conventions

### 2.1 Brand Name Spelling
- The brand name is strictly **Ficcado** (Capital F).
- The reference prefix is strictly **FIC-**.
- Running `npm run check:brand` MUST pass with zero violations before committing changes.

### 2.2 Server vs Client Boundaries
- Next.js Server Components are the default for page shells and data reading.
- Add `'use client'` strictly when interactive hooks (`useState`, `useEffect`, `useReducer`, `useContext`) or browser DOM APIs are necessary.
- Do not import client-only packages or UI components into server utilities.

---

## 3. Directory & Folder Placement Rules

- **Routes & Pages:** Place exclusively in `ficcado-website-frontend/src/app/`.
- **Reusable Components:** Place in `src/components/` structured by domain (`layout/`, `modals/`, `ui/`, `home/`).
- **State & Contexts:** Place in `src/context/`.
- **Domain Logic & Integrations:** Place in `src/lib/` (Sheets client in `src/lib/sheets/`).
- **Configuration & Constants:** Place in `src/config/`.
- **Static Assets:** Place images exclusively in `public/images/` under designated subfolders (`brand_logo/`, `categories/`, `hero/`, `items/<sku>/`, `founders/`, `journal/`). Never store mock/dummy images.
- **Tests:** Place in `scripts/tests/` (unit & integration) or `tests/` (Playwright e2e). Tests must never be imported by runtime production code.

---

## 4. Security & Privacy Rules (P0)

1. **Spreadsheet Formula Injection Guard:**
   - Every cell value written to Google Sheets must pass through `sanitizeCell()`.
   - Any string beginning with `=`, `+`, `-`, or `@` must be prefixed with a single quote (`'`).
2. **Personal Data Isolation in Caches:**
   - **Never cache a response that contains personal data.**
   - Mutating routes (`/api/orders`, `/api/inquiry`) must set `Cache-Control: no-store, no-cache, must-revalidate` and must never emit `Set-Cookie`.
   - Delivery options payloads must expose only public data (`id`, `name`, `rate`, `deliveryTime`). Never expose courier partner phone numbers or physical addresses.
3. **Logging Privacy:**
   - Server logs must never print customer names, mobile numbers, emails, or street addresses.
   - Logs must include only route, timestamp, error code, and short `requestId`.

---

## 5. Storage & Cookie Consent Rules

1. **Storage Classification:**
   - `ficcado-bag-v3` (`localStorage`): **Strictly Necessary**. Holds SKU IDs, sizes, quantities. Does not contain personal data.
   - `ficcado-checkout-form-draft` (`localStorage`): **Preferences / Convenience**. Must be saved only after user has accepted Preferences. Must be cleared automatically upon successful order submission.
   - `ficcado-last-order` (`sessionStorage`): Temporary handoff data. Cleared when `/checkout/whatsapp-continue` has rendered or session ends.
   - `ficcado-recent-searches` (`localStorage`): **Functional / Preferences**.
2. **Consent Behavior:**
   - Banner must load after hydration without causing layout shift.
   - Equal prominence for **Accept all**, **Reject all**, and **Manage preferences**.
   - If user selects "Reject all", clear optional stored data immediately. The shopping bag remains functional.

---

## 6. Performance & Scale Rules (1 Lakh Users Readiness)

1. **Zero Visitor Reads to Google Sheets in Steady State:**
   - Public pages (`/`, `/categories/[slug]`) must use ISR (`revalidate = 60`) or CDN edge caching.
   - Never use `force-dynamic` with `revalidate = 0` on visitor-facing read paths.
2. **No Per-Request Cookie Reads on Static Paths:**
   - Never read cookies or headers in root layouts or shared shells that would silently force pages to become dynamically rendered.
3. **Bound Serverless Write Latencies:**
   - Mutating Google Sheets operations must be bounded by an 8-second timeout guard. If unfulfilled, trigger offline fallback (`FIC-T...`).

---

## 7. App-Specific "Never Do" List

- **NEVER** write prices or item totals from the client directly to Google Sheets; always recompute on the server.
- **NEVER** commit or track files in `credentials/` to Git.
- **NEVER** load heavy Google Cloud client libraries (`googleapis`, `google-auth-library`) into serverless bundles; use pure Node RS256 JWT auth.
- **NEVER** run load tests against the production Google Spreadsheet.
- **NEVER** silently delete rows in Google Sheets; rows are append-only.
- **NEVER** push commits or trigger deployments; git push is reserved for the developer.

---

## 8. Definition of Done (DoD)

A task or batch is considered **Done** only when:
1. `npm run typecheck` passes with zero errors.
2. `npm run lint` passes with zero errors.
3. `npm run test` passes with 100% test success.
4. `npm run check:brand` passes with zero brand violations.
5. `npm run build` succeeds cleanly.
6. Documentation in `docs/progress.md` and `docs/memory.md` is updated.
