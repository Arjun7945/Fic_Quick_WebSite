# Product Requirements Document (PRD) — Ficcado

**Purpose:** Comprehensive product definition, user journeys, feature requirements, and business rules.  
**Last Updated:** 2026-10-06  
**Source:** `Ficcado-Website.md` + repository codebase (`commit 77b1878`)  

---

## 1. Product Vision & Target Audience
- **Vision:** Ficcado is an independent contemporary Indian apparel label crafting signature, high-quality 230 GSM combed cotton unisex streetwear.
- **Target Audience:** Streetwear enthusiasts, youth, and young professionals seeking structured architectural silhouettes, heavy fabric weight, and curated capsule drops without extreme designer markups.
- **Brand Ethos:** Radical textile honesty, small-batch capsule drops, transparent founder involvement, and direct human-to-human commerce assistance over WhatsApp.

---

## 2. Personas (Evidenced in Codebase)
1. **The Minimalist Streetwear Enthusiast:** Prioritizes fabric weight (230 GSM), ribbed collar retention, drop-shoulder silhouettes, and neutral color palettes (Colorado, Citrus, Monochrome packs).
2. **The Direct WhatsApp Shopper:** Prefers configuring an order bag online, reviewing verified prices, and finalizing delivery details, questions, and payments directly with a brand representative on WhatsApp.
3. **The Return/Care Customer:** Uses the support portal with their temporary Reference ID or Order ID to request size replacements, delivery status updates, or transit damage care.

---

## 3. Product Goals & Non-Goals

### 3.1 Goals
- Deliver a fast, responsive storefront optimized across mobile, tablet, and desktop viewports.
- Manage live catalog products and courier delivery options dynamically via Google Sheets without requiring redeployments.
- Ensure 100% price and inventory verification on the server prior to generating WhatsApp order messages.
- Generate sequential temporary Reference IDs (`FIC-A0001` through `FIC-Z9999` and beyond) to prevent ID collisions and enable seamless order lookup.
- Protect write endpoints from abuse, spam, and formula injections.

### 3.2 Non-Goals
- Complex customer login/password account management (the store operates on open, guest-first checkout).
- Automated payment gateway SDKs or credit card processing (fulfillment and payment instructions are finalized over WhatsApp).
- Multi-vendor marketplace or arbitrary user-generated product submissions.

---

## 4. Existing Features & Acceptance Criteria

### 4.1 Storefront & Catalog Showcase
- **Acceptance Criteria:**
  - Displays live active products from Google Sheets `'Item Management'`.
  - Hides out-of-stock or inactive items from visitor views.
  - Supports quick-view modal dialog (`ProductModal`) with image galleries, color selection, and size selection (`XS` through `XXL`).
  - Home hero banner and curated category carousels with responsive image loading.

### 4.2 Category System
- **Current Live Category:** `T-Shirts` (`/categories/t-shirts`).
- **Roadmap Categories (Coming Soon):** `Combos` (`/categories/combos`), `Shirts` (`/categories/shirts`), `Hoodies` (`/categories/hoodies`), `Pants` (`/categories/pants`), `Sneakers` (`/categories/sneakers`).
- **Acceptance Criteria:**
  - Clicking a coming-soon category renders a dedicated "Silhouette Roadmap — Coming Soon" page explaining textile engineering progress, with CTAs leading back to live T-Shirts and full categories list.

### 4.3 Shopping Bag & Cart Drawer
- **Acceptance Criteria:**
  - Persists state in `localStorage` (`ficcado-bag-v3`).
  - Supports quantity adjustments, item removal, and subtotal recalculation.
  - Hydration-safe loading preventing SSR flashing or layout shift.
  - Slide-in `CartDrawer` accessible from both desktop header and mobile bottom nav.

### 4.4 Checkout & Server-Verified Order Flow
- **Acceptance Criteria:**
  - Captures customer name, 10-digit mobile number, email, address line 1 & 2, city, state, 6-digit PIN code, and landmark.
  - Dynamically retrieves active courier options from Google Sheets `'Courier Partners'`.
  - Re-fetches catalog from Google Sheets on the server and recalculates subtotal, delivery charges, and total amount.
  - Assigns unique sequential Reference ID (`FIC-A0001`).
  - Enforces idempotency via client `submission_id` to prevent duplicate row creation.
  - Appends sanitized order row to Google Sheets `'New Sale Request'`.
  - Encodes formatted WhatsApp message and directs customer to `https://wa.me/<whatsappNumber>`.
  - Displays `/checkout/whatsapp-continue` with temporary reference ID, copy-text button, and anti-tampering warning.

### 4.5 Customer Support & Ticket Desk
- **Acceptance Criteria:**
  - Category selector for inquiry types (`Help regarding order`, `enquiry on products`, `complaints`, `issue on application`, `other`).
  - When `'Help regarding order'` is chosen, enforces format validation on Order ID / Reference ID.
  - Honeypot protection (`botHp`) drops automated spam submissions.
  - Generates unique inquiry reference (`FIC-INQ-2026-XXXXX`) and appends sanitized row to Google Sheets `'Support Requests'`.

### 4.6 The Ficcado Journal
- **Acceptance Criteria:**
  - Interactive Aura Canvas reacting to 4 color mood buttons.
  - Full editorial articles with popup reading modal via React portal.
  - Drop notification email subscription form.

---

## 5. Business Rules & Specifications

### 5.1 Reference ID Format
- **Standard Sequential Format:** `FIC-<SERIES><4-DIGIT-NUM>` (e.g. `FIC-A0001` to `FIC-A9999`, rolling over to `FIC-B0001` ... `FIC-Z9999` → `FIC-AA0001`).
- **Offline Fallback Format:** `FIC-T<6-ALPHANUMERIC>` (e.g. `FIC-T8X4M2`), used when Google Sheets write times out after 8 seconds.
- **Final Team Order ID:** Team-assigned alphanumeric order code (e.g. `ORD-1042`).

### 5.2 Currency & Pricing Rules
- All prices are in Indian Rupees (INR, ₹).
- Prices are rounded integers (e.g. ₹999, ₹1,299).
- Delivery fee is set by the selected courier partner in Google Sheets (`rate_per_delivery = 0` indicates Free Delivery).

### 5.3 Brand Spelling Enforcement
- Brand name is strictly **Ficcado** (capital F).
- Reference prefix is strictly **FIC-**.
- Forbidden typos enforced by build scripts: `fikado`, `fkd`, `fik`, `ficado`, `ficcdo`, `ficcodo`.

---

## 6. Constraints & Quotas
- **Google Sheets API:** Read/write quota of 60 requests per minute per user/project. High-traffic spikes must be buffered or cached to prevent 429 quota exhaustion.
- **Netlify Serverless Function Limits:** Maximum 10–26 second function execution timeout. Google Sheets writes must complete within 8 seconds or initiate offline fallback.
