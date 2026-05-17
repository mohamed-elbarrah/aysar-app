# AGENTS.md — Aysar App

## Project Context

- **Goal**: Migrate hardcoded HTML pages into a Next.js App Router application with a unified global design system, responsive layouts, and best practices.
- **Reference pages** (design source-of-truth): `/refrences/home.html`, `/refrences/plans.html`, `/refrences/contact.html`, `/refrences/privacy-policy.html`, `/refrences/terms-of-use.html`, `/refrences/return-policy.html`.
- **Reference asset**: `/refrences/image/Aysarlogo.png`.

## Tech Stack & Tooling

- **Framework**: Next.js 16 (App Router), React 19, TypeScript (strict).
- **Styling**: Tailwind CSS v4 (`@tailwindcss/postcss`). Custom theme lives in `globals.css`.
- **Package manager**: `pnpm`. Use `pnpm install`, `pnpm dev`, `pnpm build`.
- **Lint**: `eslint` script runs ESLint 9 with `eslint-config-next`.
- **No existing test suite**.

## Design System (extracted from references)

- **Language**: Arabic (`lang="ar"`, `dir="rtl"`). All UI text is Arabic.
- **Font**: `Noto Kufi Arabic` (Google Fonts). Weights: 300, 400, 500, 600, 700.
- **Palette**:
  - Navy: `#0c2954`
  - Indigo: `#2d2e83`
  - Green: `#1a9a5a`
  - Background: `#f5f6f9`
  - Text: `#0c1829`
  - Muted: `#6b7a94`
  - Border: `rgba(0,0,0,.08)` / `#e8edf5`
- **Layout**: max-width containers at `1200px`, generous section padding (`96px 40px`).
- **Components to systematize**:
  1. **Navbar** — fixed, glassmorphism on scroll, two variants: dark-on-hero vs light-on-pages.
  2. **Hero** — gradient background (`linear-gradient(160deg, #0c2954, #0f1e3d, #1a1f4e)`), glow orbs, noise texture overlay.
  3. **Footer** — navy background, 4-column grid, social icons, copyright line.
  4. **CTA Section** — same gradient as hero, centered text, primary + WhatsApp buttons.
  5. **Page container** — consistent max-width + padding for content pages.

## Page Inventory (to build in Next.js)

| Page | Route | Source |
|---|---|---|
| Home (Landing) | `/` | `refrences/home.html` |
| Pricing / Plans | `/plans` | `refrences/plans.html` |
| Contact | `/contact` | `refrences/contact.html` |
| Privacy Policy | `/privacy-policy` | `refrences/privacy-policy.html` |
| Terms of Use | `/terms-of-use` | `refrences/terms-of-use.html` |
| Return Policy | `/return-policy` | `refrences/return-policy.html` |

## Shared External Links (preserve exactly)

- Platform login: `https://platform.aysar.sa/`
- Registration: `https://platform.aysar.sa/ar/company/dashboard/register`
- Support center: `https://support.aysar.sa/`
- WhatsApp: `http://wa.me/966125101107`
- App Store: `https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone`
- Google Play: `https://play.google.com/store/apps/details?id=com.aysar.application`
- Social: X (`@aysar_ksa`), Instagram (`@aysar_ksa`), TikTok (`@aysar_sa`)

## Architecture Rules

- App Router convention: one `page.tsx` per route inside `app/{route}/`.
- Reusable components belong in `app/components/` or a top-level `components/` directory.
- Shared layout (`app/layout.tsx`) should load the Arabic font, set `dir="rtl"`, and render the Navbar + Footer so every page inherits them.
- Extract Tailwind custom colors in `globals.css` (`@theme inline`) — do not hardcode hex values in JSX.
- Responsive breakpoints: `sm:` ~640px, `md:` ~768px, `lg:` ~1024px, `xl:` ~1280px. Reference pages mostly use `max-width:900px` media queries; map these to `lg:`.
- Static assets (logo, phone mockups, screenshots) go in `/public/`.

## Common Gotchas

- The HTML references contain **inline SVG icons** and **inline data-URI images** — extract these into standalone SVG files in `/public/icons/` or inline React components for clarity.
- The `home.html` hero includes a **complex dashboard mockup** (sidebar + topbar + KPI cards + rating) — this is a static visual, not a functional app. Build it as a composed set of presentational components.
- The `plans.html` page has **interactive billing toggle** (monthly/yearly) and **FAQ accordion** — implement with React state.
- The `contact.html` page has a **form with client-side validation and success state** — implement as a controlled form component.
- Policy pages (`privacy-policy`, `terms-of-use`, `return-policy`) share the same layout: hero banner with breadcrumb, sticky TOC sidebar, numbered sections, alert cards, footer bar. Build one reusable policy page template.
- Do **not** delete or modify files in `/refrences/` — they are the design specification.

## Commands

```bash
# Install dependencies
pnpm install

# Dev server
pnpm dev        # http://localhost:3000

# Production build
pnpm build

# Lint
pnpm lint
```
