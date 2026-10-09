# Google Sheets Database Schema Specification — Ficcado Clothings

This document is the **Single Source of Truth** for the Google Spreadsheet serving as the backend database for **Ficcado Clothings**.

- **Spreadsheet URL**: [Ficcado Database](https://docs.google.com/spreadsheets/d/1U1bdFZH68Seg3OcV3Wtucmsqg8JL5i3MIGECglu_hfs/edit?gid=0#gid=0)
- **Spreadsheet ID**: `1U1bdFZH68Seg3OcV3Wtucmsqg8JL5i3MIGECglu_hfs`
- **Authorized Service Account**: `ficcado-quick-webapp@ficcado-quick-website.iam.gserviceaccount.com`
- **Auto-Bootstrap Script**: `npm run sheets:bootstrap` (idempotent, freezes headers, formats, seeds catalog)

The spreadsheet contains **four dedicated operational tabs**:
1. `Item Management` (Catalog items, prices, ratings, review counts, inventory)
2. `Courier Partners` (Courier accounts, per-delivery rates, status)
3. `New Sale Request` (Server-verified customer orders; primary key: `reference_id`)
4. `Support Requests` (Contact tickets, feedback, order support inquiries)

---

## 1. Tab: `Item Management`

Contains all storefront products and catalog settings. The application reads columns **by header name** (not by position) to ensure admin column reordering is safe.

| Column Header | Data Type | Validation Rules | Description |
|---|---|---|---|
| `id` | String / Number | Required, Unique, Stable | Stable product identifier. |
| `item_name` | String | Required, 2–100 chars | Customer-facing product name (e.g. Colorado Heavyweight Tee). |
| `type` | String | Required, Dropdown | Exactly one of the six categories: `T-Shirts`, `Combos`, `Shirts`, `Hoodies`, `Pants`, `Sneakers` (Jeans treated as `Pants`). |
| `price` | Number | Integer ≥ 0 | Price in INR (tolerant parser accepts `₹1,499` or `1499`). |
| `sizes` | String | Comma-separated | Uppercase, deduplicated sizes (e.g. `S,M,L,XL` or `UK-7,UK-8,UK-9,UK-10`). |
| `average_rating` | Number | 0.0 – 5.0 (1 decimal) | Customer rating shown on cards & modals (e.g. `4.8`). |
| `review_count` | Number | Integer ≥ 0 | Admin-edited count of verified reviews (e.g. `42`). |
| `colors` | String | Comma-separated hex/names | Color swatches (e.g. `#9FD2C7,#2B62C6,#111827`). |
| `description` | String | Free text | Fabric weight, silhouette, and craft details. |
| `slug` | String | Kebab-case | Matches image directory `public/images/items/<slug>/`. Derived if omitted. |
| `in_stock` | Boolean | `TRUE` / `FALSE` | Stock availability. If false, ordering is disabled. |
| `featured` | Boolean | `TRUE` / `FALSE` | Display on storefront featured drops. |
| `active` | Boolean | `TRUE` / `FALSE` | Soft delete. If false, item is hidden from storefront. |
| `sort_order` | Number | Integer | Display ordering (lower numbers appear first). |

---

## 2. Tab: `Courier Partners`

Configures all delivery speed options available at checkout per PART 2 Section R4. Each active row constitutes one selectable delivery option.

| Column Header | Data Type | Validation Rules | Description |
|---|---|---|---|
| `partner_id` | String / Number | Required, Unique | Partner option identifier (e.g. `bluedart-express`, `delhivery-std`). |
| `partner_name` | String | Required | Customer-facing delivery option label (e.g. `Bluedart Priority`, `Delhivery Surface`). |
| `partner_phone` | String | Optional | Partner dispatch contact number. |
| `partner_address` | String | Optional | Hub address / sorting facility. |
| `rate_per_delivery` | Number | Integer ≥ 0 | Delivery fee in INR. If `0`, checkout displays **"Free"**. |
| `created_at` | DateTime | ISO / IST Date | Timestamp when courier row was added. |
| `updated_at` | DateTime | ISO / IST Date | Timestamp when courier row was last modified. |
| `status` | String | `ACTIVE` / `INACTIVE` | Only active partner rows are presented as delivery options at checkout. |
| `delivery_time` | String | Optional free text | Optional delivery timeframe (e.g. `2–3 business days`). Shown only if provided; never invented. |

*Delivery Options Rules (Section R4):*
- Each active courier partner row = one delivery option.
- Options are sorted by charge ascending, then name. First option is pre-selected.
- If `rate_per_delivery = 0`, the fee displays as "Free".
- If the sheet has no valid active partners, checkout shows a notice ("Delivery options are currently unavailable. Please contact us on WhatsApp.") and Place Order is disabled.
- Server (`POST /api/orders`) strictly looks up `courier_partner_id`, recomputes delivery fee and total, and rejects unknown or inactive partners.

---

## 3. Tab: `New Sale Request`

Append-only ledger of customer order requests generated on checkout. The **`reference_id` is the primary key**. All financial amounts are **computed by the server**.

| Column Header | Data Type | Description |
|---|---|---|
| `reference_id` | String | **Primary Key.** Format: `FIC-A0001` (temporary reference). |
| `created_at` | String | Server timestamp in Indian Standard Time (IST). |
| `status` | String | Order status: `NEW` on creation. (NEW, CONFIRMED, PACKED, SHIPPED, DELIVERED, CANCELLED). |
| `final_order_id` | String | **Empty on creation.** Ficcado team populates after confirming with customer. |
| `customer_name` | String | Customer's full name. |
| `customer_email` | String | Customer's email address. |
| `customer_phone` | String | Customer's 10-digit mobile number. |
| `address_line1` | String | House/Flat, building, and street address. |
| `address_line2` | String | Area, locality, or sector. |
| `city` | String | Destination city. |
| `state` | String | Destination Indian state. |
| `pincode` | String | 6-digit Indian postal PIN code. |
| `landmark` | String | Nearby landmark for delivery agent. |
| `courier_partner_id` | String | Selected courier partner identifier from `Courier Partners` tab. |
| `courier_partner_name` | String | Name of the selected courier partner. |
| `delivery_charge` | Number | Server-computed delivery charge (₹0 if Free). |
| `subtotal` | Number | Server-verified sum of line item subtotals. |
| `total_amount` | Number | Server-verified final total: `subtotal + delivery_charge`. |
| `item_count` | Number | Total quantity of garments ordered. |
| `items_summary` | String | Formatted text itemizing ordered goods. |
| `items_json` | String | Machine-readable JSON string array of order items. |
| `submission_id` | String | Unique client UUID to prevent duplicate rows on network retries. |

---

## 4. Tab: `Support Requests`

Stores customer contact messages, product inquiries, and post-order support tickets.

| Column Header | Data Type | Description |
|---|---|---|
| `timestamp` | String | Server timestamp in IST. |
| `inquiry_id` | String | Unique ticket ID (e.g. `FIC-INQ-2026-84920`). |
| `type` | String | Classification: `order-support`, `product-inquiry`, `contact`, etc. |
| `order_id` | String | Customer Reference ID (`FIC-A0001`) or team Order ID. |
| `name` | String | Customer's full name. |
| `email` | String | Contact email address. |
| `phone` | String | Contact phone number. |
| `category` | String | Inquiry topic. |
| `message` | String | Message description. |
| `status` | String | `NEW` by default. |

---

## 5. Security & Anti-Formula Injection

To prevent CSV and Spreadsheet Formula Injection, all incoming text cells starting with `=`, `+`, `-`, or `@` are automatically escaped with a leading single quote (`'`) via `sanitizeCell()` in `src/lib/sheets/client.ts`.
