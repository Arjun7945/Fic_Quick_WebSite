# Design System & Aesthetic Specification — Ficcado

**Purpose:** Comprehensive inventory of brand design tokens, color palette, typography, responsive breakpoints, layout containers, and interaction patterns.  
**Last Updated:** 2026-10-06  
**Audited Commit:** `90c3da4b63cec8406526a6e91f28e9de0a867def`  
**Source:** `src/app/globals.css`, Tailwind v4 configuration, `Ficcado-Website.md`  

---

## 1. Design Philosophy & Content Tone

Ficcado’s aesthetic balances architectural minimalism with high-energy streetwear cues. The interface emphasizes generous negative space, curated high-contrast typography, rounded container cards, tactile hover micro-interactions, and a clean blue accent palette that complements our apparel fabrics.

**Content Tone:**
- Confident, understated, authentic, and technically precise.
- Speaks directly about fabric weight ("240 GSM combed cotton"), collar construction ("anti-bacon double-ribbed weave"), and silhouette drape.
- Avoids generic discount hype, flash sale countdown timers, or spammy marketing copy.

---

## 2. Color Palette & Design Tokens

Defined in `src/app/globals.css`:

```css
:root {
  /* Brand Accents */
  --primary: #2B62C6;            /* Signature Ficcado Royal Blue */
  --primary-hover: #1e4bb5;      /* Darker primary for active/hover states */
  --primary-light: #B4D1EF;      /* Soft pastel blue for badges & backgrounds */
  
  /* WhatsApp & Success Accents */
  --accent-green: #10B981;       /* Verification & success checkmarks */
  --whatsapp-green: #25D366;     /* WhatsApp button background */
  --whatsapp-dark: #128C7E;      /* WhatsApp badge text */
  --whatsapp-light: #E8F8F5;     /* WhatsApp badge background */
  
  /* Surface & Background */
  --bg-app: #F8FAFC;             /* App canvas background (Slate-50) */
  --bg-page: #F8FAFC;            /* Page background */
  --bg-surface: #FFFFFF;         /* Card surface */
  --bg-surface-alt: #F1F5F9;     /* Secondary card surface (Slate-100) */
  
  /* Borders */
  --border-light: #E2E8F0;       /* Card borders & dividers (Slate-200) */
  --border-medium: #CBD5E1;      /* Input borders (Slate-300) */
  
  /* Text */
  --text-main: #0F172A;          /* Headings and primary text (Slate-900) */
  --text-secondary: #334155;     /* Body copy (Slate-700) */
  --text-muted: #64748B;         /* Secondary captions & timestamps (Slate-500) */
  --text-light: #94A3B8;         /* Subtle icons & placeholders (Slate-400) */
  
  /* Radius Tokens */
  --radius-sm: 0.5rem;           /* 8px */
  --radius-md: 0.75rem;          /* 12px */
  --radius-lg: 1rem;             /* 16px */
  --radius-xl: 1.5rem;           /* 24px */
  --radius-2xl: 2rem;            /* 32px */
  
  /* Z-Index Hierarchy */
  --z-header: 40;
  --z-bottom-nav: 45;
  --z-modal: 50;
  --z-toast: 60;
}
```

---

## 3. Typography Hierarchy

- **Font Family:** `Plus Jakarta Sans` (`--font-plus-jakarta`), loaded self-hosted via `next/font/google`.
- **Scale:**
  - Page Headings: `font-900 tracking-tight text-3xl sm:text-4xl md:text-5xl`
  - Section Titles: `font-800 text-xl md:text-2xl`
  - Card Titles: `font-800 text-base md:text-lg`
  - Body Copy: `font-normal text-xs md:text-sm text-[var(--text-secondary)]`
  - Monospace Identifiers (Reference IDs): `font-mono font-bold tracking-wider`

---

## 4. Component Inventory & Variants

### 4.1 Buttons
- **`btn-primary`:** Full royal blue background (`--primary`), white text, rounded 12px/16px, subtle drop shadow, `active:scale-95`.
- **`btn-ghost`:** Transparent background, slate border (`--border-light`), slate text (`--text-main`), hover border darkens.
- **`btn-icon`:** Square rounded container (36px–40px) with centered SVG icon.

### 4.2 Product Cards (`src/components/ui/ProductCard.tsx`)
- **Default State:** Aspect ratio 3:4 image, price formatted as `₹<amount>`, category label, quick view trigger.
- **Hover State:** Image scales smoothly (`scale-105`), card elevates with shadow.
- **Out-of-Stock Variant:** Disabled badge, grayscale image treatment, CTA indicates "Sold Out".

### 4.3 Modals & Drawers (`src/components/modals/`)
- **`ProductModal`:** Centered dialog on desktop; bottom sheet on mobile. Image carousel on left, sizing chips and add-to-bag on right.
- **`CartDrawer`:** Right slide-in drawer (380px–420px wide on desktop; 100% width on mobile). Scrollable item list, subtotal breakdown, direct "Proceed to Checkout" button.
- **`MobileNavDrawer`:** Left slide-in drawer on mobile screens with category links and brand information.

---

## 5. Loading, Empty & Error Patterns

- **Loading State:**
  - Page level: `src/app/loading.tsx` renders animated pulse skeleton screens (`GhostLoadingScreen`).
  - Async actions (Checkout submit, Search): Inline spinning `Loader2` icon with disabled button opacity.
- **Empty State:**
  - Search no-results: Centered magnifying glass illustration with message and "Browse All Drops" action.
  - Empty Shopping Bag: Centered bag icon with message "Your bag is empty" and link to live drops.
- **Error State:**
  - Form validation: Crimson border (`border-red-500`) and red inline error text below field.
  - Server errors: Error toast via `ToastContext` with clear human guidance.

---

## 6. Accessibility & Keyboard Navigation Rules

- All interactive buttons and links have distinct focus outlines (`focus-visible:ring-2`).
- Modals trap focus, dismiss on `Escape` key, and restore background scroll on unmount.
- Color contrast meets WCAG AA standards (minimum 4.5:1 for body copy).
- Images require meaningful `alt` attributes; decorative icons include `aria-hidden="true"`.

---

## 7. Public Image Asset Rules

- **Folder Hierarchy:**
  ```
  public/images/
  ├── brand_logo/      # Favicons, apple touch icons, brand badges
  ├── categories/      # Category banner images (t-shirts.jpg, combos.jpg, etc.)
  ├── founders/        # Portrait photographs (Sinan, Ganga, Rohith)
  ├── hero/            # Main storefront banner images
  ├── items/<sku>/     # SKU folders containing image-1.webp, image-2.webp
  └── journal/         # Editorial photography
  ```
- **Image Optimization:** All product images are WebP/AVIF format with dimensions proportional to responsive containers. Manifest compiled automatically during prebuild via `scripts/build-item-image-manifest.mjs`.
