# AGENT BRIEF 2: Fikado Team – Catalog Simplification, WhatsApp Ordering & Checkout Refactor

> **Prerequisite:** Complete everything in `AGENT_BRIEF.md` first (project audit, `EXPANSION.md`, image structure, Google Sheets data layer, performance, Netlify prep).
> This brief builds on that work. **Where this brief conflicts with `AGENT_BRIEF.md`, this brief wins.** Specifically: checkout is **no longer** saved as an "order request" in Google Sheets. Orders now go to **WhatsApp** (see Section 7).

**Read this whole file before editing code.** Do not redesign the UI. Keep the current look, spacing, branding and components. Only change what is listed here.

---

## 1. Product Direction (Why These Changes)

The Fikado website is now a **showcase + order-intent site**, not a full e-commerce platform:

- Visitors browse new designs, latest drops, and products.
- They add items to a **Bag**, fill in delivery details, and click **Place Order**.
- **Place Order opens WhatsApp** with a pre-filled message to the official Fikado WhatsApp number. The Fikado team continues the order, payment and confirmation **inside WhatsApp**.
- **No accounts, no login, no payment, no OTP, no order-status tracking on the site.**
- The brand is **unisex**: products are for all genders and all ages.

---

## 2. Required Working Method

1. **Re-scan the codebase** (it changed during Brief 1). Build an inventory of every file touching the items below. Use search (`grep`/ripgrep) for the keywords in Section 11, not just file names.
2. **Update `EXPANSION.md`** with a new section "Phase 2: Catalog, Ordering & Checkout Refactor" describing the plan *before* implementing.
3. Implement the changes in the order of Sections 3 → 9.
4. Run lint, type-check and build after each major section.
5. At the end, create **`REFACTOR_AND_UPDATION_COMPLETED.md`** (spec in Section 12).
6. If something is ambiguous, ask a short, specific question and continue with the other work. Do **not** guess on anything that changes user-facing behavior beyond what is written here.

---

## 3. Support Page – "Help Regarding Order"

**Location:** the Support page, the "Help regarding order" section.

**Current:** the user picks an order from a **"Select order"** dropdown/list.

**Required:**
1. **Remove the "Select order" control completely** – the component, its state, its data source, any mock/hard-coded orders, and any backend/API calls feeding it.
2. **Replace it with an "Enter Order ID" text input**:
   - Label: "Order ID", placeholder showing the format (e.g., `FKD-240101-AB12`; match the real format from Section 7.4).
   - Required field, trimmed, uppercase-normalized, max length, only allowed characters (letters, digits, hyphen).
   - Inline validation errors and accessible labels (`aria-describedby`, etc.).
3. Keep the rest of the flow as it is today: the issue-type selection / description / details fields and the continue/submit behavior. The Order ID now travels with the rest of the form.
4. **Submission handling:** the existing flow must continue to work *without* any removed backend. Route the submission to the same Google Sheets `Inquiries` write endpoint built in Brief 1 (`type = order-support`, include `order_id` in a dedicated column; add the column to the sheet schema docs/seed). **If the old "continue" step led somewhere else (e.g., a WhatsApp handoff or a confirmation screen), preserve that destination and tell me what you chose.**
5. There is no order database, so the site cannot verify an Order ID exists. Validate **format only**, and make the success message wording honest ("We received your request, our team will check order FKD-… and contact you").

---

## 4. Footer Cleanup

- **Remove "Track Live Order" and "Saved Items"** links from the footer.
- Also delete everything that only existed for them: their pages/routes, components, context/state, API calls, sitemap entries, and any internal links elsewhere pointing to them.
- Check for broken spacing/alignment in the footer columns after removal; keep the layout visually balanced.
- If anyone visits the old URLs (`/track-order`, `/saved`, etc. – use the real paths you find), **redirect them** (via `next.config` or `netlify.toml`) to the Support page or Home. Document the redirects.

---

## 5. Unisex Model – Remove Men / Women / Kids

The store is **unisex**. Remove the gender/age-segment concept entirely:

- **Navigation:** remove Men / Women / Kids menu items, mega-menu sections, mobile menu entries, and landing pages.
- **Routes:** delete `/men`, `/women`, `/kids` (and any similar, e.g., `/boys`, `/girls`, `/collections/men`). Add permanent **301 redirects** to the relevant new category page or `/shop`.
- **Data model:** remove `gender` / `audience` / `ageGroup` fields from product types, mock data, Google Sheets schema (`Products` tab and seed CSV), zod schemas, and filters.
- **UI:** remove gender filters, tabs, badges, size charts or copy that is gender/age specific (e.g., "Kids sizes"). If size guides exist, make them unisex.
- **Copy & SEO:** sweep headings, hero text, banners, product descriptions, alt text, meta titles/descriptions, Open Graph tags, JSON-LD (e.g., `audience`/`gender` properties) and sitemap. Replace with unisex wording (e.g., "for everyone").
- **Image folders:** if any `public/images/` folders are organized by gender, flatten them to the structure from Brief 1.

---

## 6. Category System – Six Categories, Two Live

### 6.1 Official category list (nothing else may exist)

| Category | Slug | Status |
|----------|------|--------|
| T-Shirts | `t-shirts` | **Live** |
| Combos | `combos` | **Live** |
| Shirts | `shirts` | Coming Soon |
| Hoodies | `hoodies` | Coming Soon |
| Pants | `pants` | Coming Soon |
| Sneakers | `sneakers` | Coming Soon |

### 6.2 Remove all legacy categories
Delete every other category/type concept found in the app (e.g., baggy/oversized variants as separate categories, jeans, tops, bedsheets/sheets, or anything else not in the table above). Remove them from menus, filters, routes, types, mock data, Sheets schema, SEO and copy. Where a legacy item is really a **style of T-shirt** (e.g., oversized/baggy tee), it should simply be a **T-Shirt product** (optionally with a `tags` or `fit` attribute), not a category.

### 6.3 Single source of truth
Create one config file (e.g., `config/categories.ts`) exporting the six categories with: `name`, `slug`, `status` (`"live" | "coming-soon"`), short description, and sort order. **Use it everywhere** (nav, footer, filters, category pages, sitemap, static params, validation of the `category` column from Google Sheets). Changing a category from `coming-soon` to `live` later must require changing **only this config** (and adding products in the sheet).

### 6.4 Coming Soon behavior
- Coming-soon categories **remain visible** in menus and category lists (clearly styled, e.g., small "Coming Soon" tag) so visitors see the roadmap.
- Clicking one opens a **designed "Coming Soon" page/state** in the existing visual style: a friendly message such as *"Our [Category] collection is coming soon. Please wait for it!"*, plus buttons back to Live categories (T-Shirts, Combos) and the home page.
- Coming-soon pages must **not** show product grids, "Add to Bag" buttons, or empty/broken listings, and must not 404.
- SEO: set `noindex` on coming-soon pages and exclude them from the sitemap until live.
- **Defensive rule:** if a product in the sheet belongs to a coming-soon category, it must **not** be purchasable (hide it or show it as disabled). Log a warning.
- Optional (ask me first, do not build by default): a "Notify me" email capture that writes to a `Waitlist` sheet tab.

### 6.5 Home page & product copy
Update the homepage sections, category tiles, banners and any "Shop by" blocks so only the six categories appear, and the Live ones are emphasised. The Products tab in Google Sheets uses the six slugs only; update `docs/google-sheets-schema.md` and the seed CSV accordingly.

---

## 7. Remove Authentication & Wishlist; Bag + WhatsApp Ordering

### 7.1 Header / top bar
- **Remove "Sign in" / login / account icons and menus** and the **Wishlist** icon/section from the top banner and top menu (desktop and mobile).
- Keep: logo, navigation (category links per Section 6), search (if present), and the **Bag** icon with item count.

### 7.2 Remove authentication completely
Delete all auth-related code: login/register/forgot-password/profile/account pages, auth context/providers/hooks, NextAuth/JWT/session code, route guards/middleware, API calls, token storage, and related dependencies, env vars, copy ("Sign in to continue", "My account", etc.). No feature may require an account.

### 7.3 Wishlist / Saved Items – assumption to confirm
Since the Wishlist is removed from the header and "Saved Items" is removed from the footer, **remove the wishlist feature entirely** (heart icons on product cards/detail pages, wishlist state/storage/page/routes). **The Bag is the only cart-like feature.** If you believe any wishlist entry point should stay, ask me before keeping it.

### 7.4 Bag
- Product pages and cards offer **Add to Bag** (size and color selection required where applicable; quantity control; clear validation messages).
- The Bag (drawer/page, whichever exists) shows items with name, size, color, quantity, unit price, line total, remove/update controls, subtotal, and a **Checkout** button leading to the checkout page.
- The Bag persists in `localStorage` (hydration-safe: no SSR/CSR mismatch, handle corrupted/old data gracefully, version the storage key, e.g., `fikado-bag-v2`, so old saved data from earlier builds is discarded).
- Prices shown must come from the product data (Google Sheets), not trusted from stale localStorage: on checkout, **re-validate each Bag item** against current product data (exists, active, live category, in stock, price) and show a clear message for anything changed or unavailable.

### 7.5 Order ID
Because the site has no database, generate a **human-friendly order reference** on the client at the moment of placing the order: `FKD-YYMMDD-XXXX` (4 random uppercase alphanumerics, avoiding confusing characters like O/0, I/1). Include it in the WhatsApp message so customers can later quote it on the Support page. Put the format in one shared helper and reuse it for the Support page validation (Section 3).

---

## 8. Checkout Page Refactor

### 8.1 Remove (delete code, state, types and mock data – don't just hide)
- **Hard-coded saved addresses** and any address picker/selector.
- **Payment method box/section** (cards, UPI, COD options, etc.) and anything related.
- **OTP step/screen/modal** and its logic.
- **"Order confirmed" and "Order failed" screens/states** and their routes/components.
- Any backend/API calls, loading states or mock timers simulating payment/order placement.

### 8.2 Checkout form (new)
Fields, with validation (react-hook-form + zod if already used, otherwise match the project's existing form approach):

| Field | Rules |
|-------|-------|
| Full name | required, 2–80 chars |
| Mobile number | required, valid Indian mobile (10 digits, optional +91, normalize) |
| Email ID | required, valid email |
| Address line 1 | required |
| Address line 2 | optional |
| City | required |
| State | required (dropdown of Indian states is fine) |
| PIN code | required, 6 digits |
| Landmark | optional |

- Inline, accessible error messages; proper `autocomplete` attributes (`name`, `tel`, `email`, `address-line1`, `postal-code`, etc.); numeric keyboards on mobile (`inputMode`).
- Optional: remember form values in `localStorage` for convenience (clear on successful order handoff; no sensitive data beyond what the user typed).

### 8.3 Delivery Speed (keep)
- **Keep the existing "Delivery speed" section and its pricing logic as it is.** Only move any hard-coded options/prices into a single config file (e.g., `config/delivery.ts`) so they are easy to edit later.
- Selection is required; the selected option's charge flows into the order total.

### 8.4 Order summary
- Keep the existing summary: items (name, size, color, qty, price), subtotal, delivery charge (from speed), and **total amount**. Currency formatting through one shared helper.

### 8.5 Place Order → WhatsApp
- The button label stays **"Place Order"** (optionally with a small WhatsApp icon and a one-line note: *"You'll continue your order on WhatsApp"*).
- Validate the form → generate the Order ID → build the message → open WhatsApp.
- **WhatsApp number:** read from an environment variable `NEXT_PUBLIC_WHATSAPP_NUMBER` (international format, digits only, e.g., `919497144795`). **Never hard-code the number.** Add it to `.env.example`, `netlify.toml` notes and `docs/DEPLOYMENT.md`. Fail loudly in development if missing.
- **Link format:** `https://wa.me/<number>?text=<encodeURIComponent(message)>`.
- **Reliability details:**
  - Open the link **directly inside the click handler** (no `await` before it) so mobile browsers/popup blockers don't block it. Use `window.open(url, "_blank", "noopener,noreferrer")` and fall back to `window.location.href` if blocked or on iOS Safari.
  - After the handoff, route to a lightweight **"Continue on WhatsApp" page** that shows the Order ID, a **"Open WhatsApp again"** button (in case the app didn't open) and a **"Copy order details"** button. Clear the Bag **only on this page** (not before the handoff) so a user who returns from a failed handoff doesn't lose their items.
  - Keep the message within safe URL length (aim well under ~1,800 characters of encoded text): use compact line formatting; if a large Bag would exceed the limit, shorten per-item lines and still include a full total.
  - Never include HTML, tracking tokens or internal IDs. Strip/sanitize user-entered text (newlines in address fields are collapsed).

### 8.6 WhatsApp message template
Build via one function (e.g., `lib/whatsapp.ts → buildOrderMessage()`), unit-testable and easy to edit:

```
*New Order – Fikado*
Order ID: FKD-240101-AB12
Date: 01 Jan 2026, 10:32 AM

*Customer*
Name: <name>
Mobile: <phone>
Email: <email>

*Delivery Address*
<line1>, <line2>
<city>, <state> – <pincode>
Landmark: <landmark or –>

*Items*
1) <Product name> | Size: M | Color: Black | Qty: 2 | ₹799 x 2 = ₹1,598
   <product page URL>
2) ...

Subtotal: ₹X
Delivery (<speed name>): ₹Y
*Total: ₹Z*

Please confirm availability and payment details. Thank you!
```

Notes: use the real currency and delivery speed name from config; include the product page link per item so the team sees the exact design; use WhatsApp-compatible formatting (`*bold*`).

### 8.7 Optional logging (ask me, don't build by default)
Offer, but do **not** implement without my confirmation, to also append each placed order into a Google Sheets `Orders` tab (via the secure server endpoint) for record keeping. If I say yes, it must be fire-and-forget (never block or fail the WhatsApp handoff), with the same validation/rate-limit/formula-injection protections from Brief 1.

---

## 9. Cross-Cutting Cleanup

- **Delete dead code**: unused routes, components, hooks, context providers, types, mock data, API clients, CSS, images and dependencies left over from removed features. Run a dependency check (`depcheck` or equivalent) and remove unused packages.
- **Types & schemas**: update TypeScript types, zod schemas and Google Sheets parsers to match the new model (no gender, six categories, no auth/wishlist).
- **Navigation consistency**: header, footer, mobile menu, breadcrumbs, sitemap, internal links and 404 page must reflect the new structure with no broken links (run a link check).
- **Copy sweep**: remove any text promising features that no longer exist, such as "secure online payment", "track your order live", "create an account", "save for later", "login for faster checkout".
- **FAQ / Support / Policies pages**: update text to explain that orders are confirmed and paid via WhatsApp (keep policy content unchanged otherwise; ask me if wording needs business input).
- **Performance & SEO** from Brief 1 must still pass: re-run build and Lighthouse; no regression (LCP/CLS/INP targets, `next/image`, `next/font`, caching headers).
- **Accessibility**: keyboard-navigable Bag and checkout, visible focus states, labeled form fields, sufficient contrast.

---

## 10. Acceptance Criteria (Definition of Done)

**Support page**
- [ ] No "Select order" control anywhere; "Enter Order ID" input works with validation; flow continues as before.

**Footer & header**
- [ ] Footer has no "Track Live Order" or "Saved Items"; old routes redirect.
- [ ] Header has no Sign in, no Wishlist; Bag icon with count works on desktop and mobile.

**Catalog**
- [ ] No Men/Women/Kids anywhere (UI, routes, data, SEO).
- [ ] Only six categories exist; T-Shirts and Combos are live; Shirts, Hoodies, Pants, Sneakers show the Coming Soon experience and are `noindex`.
- [ ] Category status is controlled from one config file.

**Auth & wishlist**
- [ ] No auth code, pages or dependencies remain; no wishlist feature remains.

**Checkout**
- [ ] No hard-coded addresses, no payment box, no OTP, no confirmed/failed screens.
- [ ] Form collects name, mobile, email, full address; delivery speed works; total is correct.
- [ ] Place Order opens WhatsApp with the formatted message to `NEXT_PUBLIC_WHATSAPP_NUMBER`; the "Continue on WhatsApp" page works; the Bag clears only after handoff.
- [ ] Verified on mobile viewport and desktop (WhatsApp Web), including a large Bag and special characters (₹, &, #, emojis, line breaks) in names/addresses.

**Engineering**
- [ ] `npm run lint`, type-check and `npm run build` pass with zero errors.
- [ ] No leftover references found by the keyword sweep in Section 11.
- [ ] `.env.example`, docs and `EXPANSION.md` updated.

---

## 11. Keyword Sweep (search the whole repo before finishing)

`men`, `women`, `kids`, `boys`, `girls`, `gender`, `unisex` (verify usage), `login`, `signin`, `sign-in`, `signup`, `register`, `auth`, `session`, `token`, `jwt`, `account`, `profile`, `wishlist`, `wish list`, `saved`, `favorite`, `track`, `otp`, `payment`, `upi`, `card`, `cod`, `razorpay`/`stripe` (any gateway), `confirmed`, `failed`, `select order`, `localhost`, `axios`, `springboot`, and every legacy category name you find. Report anything intentionally kept.

---

## 12. Final Deliverable: `REFACTOR_AND_UPDATION_COMPLETED.md`

Create this file in the project root **after all work is complete**. It must be accurate, end to end, and written so a non-developer (the client) and a developer can both follow it. Include:

1. **Executive Summary** – what the app was, what it is now, in plain language.
2. **Change Summary Table** – every change with columns: Area | What changed | Files affected | Type (Removed / Refactored / New).
3. **Detailed Sections** (each with before → after):
   - Support page (Order ID input)
   - Footer
   - Header (auth & wishlist removal)
   - Unisex conversion
   - Category system and Coming Soon behavior
   - Bag behavior
   - Checkout (removed items, new form, delivery speed, summary)
   - WhatsApp ordering (number config, message template with a real example, edge cases handled)
   - Order ID generation
   - Redirects added
4. **New Features & New Files** – list with purpose.
5. **Deleted Files, Routes, Components & Dependencies** – full list.
6. **Configuration Reference** – env vars, config files (`categories`, `delivery`, WhatsApp number) and how to change them (e.g., "How to launch the Hoodies category").
7. **Google Sheets Schema Changes** – columns removed/added, seed CSV changes.
8. **SEO / Performance / Accessibility impact** – before/after scores and notes.
9. **Testing Performed** – what was tested, on which viewports/browsers, and results.
10. **Known Limitations & Assumptions** – e.g., Order IDs are not verifiable, no payment/tracking on site, WhatsApp URL length limits.
11. **Open Questions / Items Needing Client Input** – anything you asked or deferred (waitlist, order logging to Sheets, policy wording).
12. **Deployment Notes** – any new env vars to set in Netlify (including `NEXT_PUBLIC_WHATSAPP_NUMBER`).
13. **Future Recommendations** – short, practical list.

Also update `EXPANSION.md` with a pointer to this file.

---

## 13. Final Instruction

Begin by re-scanning the project and posting your inventory + short plan for Phase 2. Then implement Sections 3 → 9, verify against Section 10, and finish with `REFACTOR_AND_UPDATION_COMPLETED.md`.
