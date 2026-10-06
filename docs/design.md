# Design System & Aesthetic Specification — Ficcado

**Purpose:** Comprehensive inventory of brand design tokens, color palette, typography, responsive breakpoints, layout containers, and interaction patterns.  
**Last Updated:** 2026-10-06  
**Source:** `src/app/globals.css`, Tailwind v4 configuration, `Ficcado-Website.md`  

---

## 1. Design Philosophy

Ficcado’s visual aesthetic balances architectural minimalism with high-energy streetwear cues. The interface emphasizes generous white space, curated high-contrast typography, rounded container cards, tactile hover micro-interactions, and a clean blue accent palette that complements our apparel fabrics.

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
  
  /* Radius */
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

## 3. Typography System

- **Font Family:** `Plus Jakarta Sans` (`--font-plus-jakarta`), loaded via `next/font/google`.
- **Weights:**
  - `300` (Light)
  - `400` (Regular)
  - `500` (Medium)
  - `600` (Semi-bold)
  - `700` (Bold)
  - `800` (Extra-bold)
  - `900` (Black)
- **Hierarchy:**
  - Page Headings: `font-900 tracking-tight text-3xl sm:text-4xl md:text-5xl`
  - Section Titles: `font-800 text-xl md:text-2xl`
  - Card Titles: `font-800 text-base md:text-lg`
  - Body Copy: `font-normal text-xs md:text-sm text-[var(--text-secondary)]`
  - Monospace Identifiers (IDs & References): `font-mono font-bold tracking-wider`

---

## 4. Responsive Viewports & Layout Shell

| Device | Width Range | Layout Behavior |
|---|---|---|
| **Mobile** | `< 768px` | Single-column grids, fixed `BottomNav`, slide-out drawer menus, top mobile header with back button. |
| **Tablet** | `768px – 1023px` | 2-3 column grids, desktop header enabled, bottom nav hidden. |
| **Desktop** | `≥ 1024px` | 4-column product grids, sticky desktop header with search input, full multi-column footer. Max width: `7xl` (1280px). |

---

## 5. Micro-Animations & Interactions

- **Hover Card Elevate:** Product and category cards scale subtly (`hover:scale-[1.02]`) with smooth drop-shadow transitions.
- **Button Feedback:** Interactive buttons utilize `active:scale-95` tactile click feedback.
- **Modal Transitions:** Fade-in backdrop (`animate-backdrop-in`) with scale-up dialog (`animate-modal-in`).
- **Aura Ambient Canvas:** Smooth SVG blob rotation with customizable duration (18s gentle float vs 2s dynamic pulse).
