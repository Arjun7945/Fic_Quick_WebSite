# Engineering Rules & Behavioral Directives — Ficcado

**Purpose:** Comprehensive development rules, security constraints, and operating standards for all developers and AI agents.  
**Last Updated:** 2026-10-06  
**Source:** `IMPOSTER.md` + repository codebase (`commit 77b1878`)  

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

### 2.3 Error Handling Pattern
- Server endpoints must use typed try/catch blocks with friendly public messages.
- Standard API error response format:
  ```json
  { "success": false, "error": "Human-friendly explanation", "details": ... }
  ```
- Never leak stack traces, SQL errors, or internal file paths to the browser.
- UI forms must handle loading, success, and error states gracefully with accessible toast alerts or inline error messages.

### 2.4 Spreadsheet Formula Injection Guard
- Every cell value written to Google Sheets must pass through `sanitizeCell()`.
- Any string beginning with `=`, `+`, `-`, or `@` must be prefixed with a single quote (`'`).

---

## 3. Data Integrity & Persistence Rules

1. **Server-Side Price Authority:**
   - Never trust prices, totals, or item counts sent by the client browser.
   - Always re-fetch product prices from the catalog and re-verify courier rates on the server.
2. **Sequential Reference IDs:**
   - Sequential IDs must follow `FIC-<SERIES><4-DIGIT-NUM>`.
   - Never re-use or reset Reference IDs on server restart. Always scan existing rows to find the maximum sequential ID.
3. **Idempotent Order Creation:**
   - Every order submission must include a client-generated `submission_id`.
   - If a duplicate `submission_id` is received, return the existing order data without writing a new row.

---

## 4. Definition of Done (DoD)

A task or feature is considered **Done** only when:
1. `npm run typecheck` passes with zero errors.
2. `npm run lint` passes with zero warnings or errors.
3. `npm run test` passes with 100% test success.
4. `npm run check:brand` passes with zero brand violations.
5. `npm run build` succeeds cleanly.
6. Documentation in `docs/progress.md` and `docs/memory.md` is updated.
