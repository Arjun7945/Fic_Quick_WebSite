# Persistent Agent Memory & Decision Log — Ficcado

**Purpose:** Persistent agent memory recording confirmed facts, decision logs, developer preferences, constraints, pitfalls, and current state.  
**Last Updated:** 2026-10-06  
**Source:** Phase 1 Deep Scan + Project Invariants  

---

## 1. Confirmed Facts

- **[F-001]** The brand name is strictly **Ficcado** (Capital F). Typos like `fikado`, `fkd`, `fik`, `ficado`, `ficcdo`, `ficcodo` are forbidden by `scripts/check-brand.mjs`. — Source: `scripts/check-brand.mjs` — 2026-10-06
- **[F-002]** The official Reference ID sequence starts with `FIC-A0001` and rolls over at `9999` to `FIC-B0001` ... `FIC-Z9999` → `FIC-AA0001`. — Source: `src/lib/referenceId.ts` — 2026-10-06
- **[F-003]** Google Sheets target spreadsheet ID is `1U1bdFZH68Seg3OcV3Wtucmsqg8JL5i3MIGECglu_hfs` with four required tabs: `'Item Management'`, `'Courier Partners'`, `'New Sale Request'`, and `'Support Requests'`. — Source: `src/lib/sheets/schema.ts` — 2026-10-06
- **[F-004]** Delivery charge of ₹0 represents Free Delivery per Section R4. — Source: `src/lib/couriers.ts` — 2026-10-06
- **[F-005]** The application sets zero cookies. All client state is stored in `localStorage` (`ficcado-bag-v3`, `ficcado-checkout-form-draft`, `ficcado-recent-searches`) and `sessionStorage` (`ficcado-last-order`, `fc_is_ios`). — Source: Phase 1 Code Scan — 2026-10-06
- **[F-006]** The currently live clothing category is exclusively `T-Shirts` (`t-shirts`). Categories `combos`, `shirts`, `hoodies`, `pants`, and `sneakers` are marked `coming-soon` and render the dedicated "Roadmap" page. — Source: `src/config/categories.ts` — 2026-10-06

---

## 2. Decision Log (Append-Only)

- **[D-001]** 2026-10-06 — **Question:** How should the project knowledge base be structured? — **Options:** A: Overwrite old documents; B: Preserve previous docs in `documents-1/` and generate standard IMPOSTER.md files in `docs/`. — **Decision:** Preserved historical docs in `documents-1/` and built fresh, evidence-backed living knowledge base in `docs/`. — **Decided by:** Agent per IMPOSTER.md protocol — **Status:** active
- **[D-002]** 2026-10-06 — **Question:** How should the application document be named? — **Options:** A: `Ficcado.md`; B: `Ficcado-Website.md`. — **Decision:** Named `Ficcado-Website.md` per exact example in IMPOSTER.md Section 3.1. — **Decided by:** Agent — **Status:** active

---

## 3. Do-Not-Change List

- Do not alter the brand name "Ficcado" or prefix "FIC-".
- Do not change the 230 GSM fabric specification or unisex positioning without explicit instruction.
- Do not alter the 4 Google Sheets tab names: `'Item Management'`, `'Courier Partners'`, `'New Sale Request'`, `'Support Requests'`.
- Do not replace the assisted WhatsApp checkout model with an unapproved payment gateway SDK.

---

## 4. Known Pitfalls & How to Avoid

- **Google Sheets API Rate Limits:** Google limits requests to 60/min. Avoid `force-dynamic` reads on high-traffic visitor paths. Use ISR or cache headers.
- **Formula Injection:** Never write raw user input to Google Sheets without passing it through `sanitizeCell()`.
- **Reference ID Rollover:** Ensure rollover correctly advances from `Z` to `AA`, `AB`, etc., rather than looping back to `A`.

---

## 5. Current State Summary
- **Scanned Commit:** `77b18781d892e0201a52338ba22bec58cff0acc2`
- **Phase Status:** Phase 1 (Deep Scan) Complete; Phase 2 (Knowledge Base) Complete; Proceeding to Phase 3 (Audit Report).
- **Open Blockers:** 1 failing test (`BACKLINK_PLAN.md`), 1 critical security advisory on Next.js 16.3.5.
