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

- **Language**: Arabic (`lang="ar"`, `dir="rtl"`). All UI text is Arabic. and chat with ai agent english..
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

| Page            | Route             | Source                          |
| --------------- | ----------------- | ------------------------------- |
| Home (Landing)  | `/`               | `refrences/home.html`           |
| Pricing / Plans | `/plans`          | `refrences/plans.html`          |
| Contact         | `/contact`        | `refrences/contact.html`        |
| Privacy Policy  | `/privacy-policy` | `refrences/privacy-policy.html` |
| Terms of Use    | `/terms-of-use`   | `refrences/terms-of-use.html`   |
| Return Policy   | `/return-policy`  | `refrences/return-policy.html`  |

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

## Component Design System (Atomic Principles)

All visual UI primitives must exist as **reusable React components** in `app/components/ui/` — never hardcode buttons, inputs, badges, cards, or alerts inline in pages. This ensures single-source-of-truth for the design system.

### File structure

```
app/components/
  ui/               # atomic building blocks (no business logic)
    Button.tsx      # primary / secondary / ghost / solid variants
    Input.tsx       # text, textarea, select, with focus states
    Badge.tsx         # hero badge, light badge, dot badge
    Card.tsx          # bento card, feature card, pricing card
    Alert.tsx         # info (blue), success (green), warning (amber)
    Section.tsx       # responsive section wrapper
    Container.tsx     # max-width wrapper
    Eyebrow.tsx       # section label with accent line
    CheckList.tsx     # checklist row with green circle icon
  Navbar.tsx        # organism (composed of ui + layout)
  Footer.tsx        # organism
app/sections/       # page-specific section assemblies
  HeroSection.tsx
  CTASection.tsx
  PlansSection.tsx
  ...
```

### Component rules

- Every UI atom must accept `className` prop for Tailwind overrides.
- Buttons must support both `href` (render `<a>`) and `onClick` (render `<button>`).
- Inputs must be fully controlled with `value` + `onChange`.
- Use `...rest` to forward native attributes (e.g., `type`, `placeholder`, `disabled`).
- Keep business logic (pricing toggle, FAQ state, form validation) in **section or page** components, not in `ui/` atoms.
- Export named components only (no default exports in `ui/` to force explicit imports).

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

# Database
pnpm db:migrate          # Run pending migrations
pnpm db:seed             # Seed DB from prisma/seed-data.json
pnpm db:update-seed      # Refresh seed-data.json from current DB state
pnpm db:dump-sql         # Generate raw SQL dump at scripts/seed-data.sql
pnpm db:studio           # Open Prisma Studio
```

---

## Mockup Component Pattern (DashboardMockup Example)

For static visual mockups (dashboard previews, feature illustrations) that demonstrate the platform UI:

### File Structure

```
app/components/
  DashboardMockup.tsx      # Hero dashboard (9 KPI cards + sidebar + rating)
  FeatureMockups/          # Feature section mockups
    StagesMockup.tsx       # Construction stages tracking
    MaintenanceMockup.tsx  # Maintenance requests table
    BookingsMockup.tsx     # Bookings management table
    TemplatesMockup.tsx    # Stage templates list
```

### Architecture Rules for Mockups

1. **"use client" directive** - Required for Framer Motion animations
2. **Responsive Strategy**:
   - **sm/md**: Full width (`w-full`), simplified layout (hide sidebar, reduce columns)
   - **lg+**: Constrained (`lg:max-w-[1200px] lg:mx-auto`), full desktop layout
3. **Never use Container wrapper** - Mockups control their own responsive behavior
4. **Data as constants** - Define menu items, cards, table rows as top-level const arrays
5. **Icons from lucide-react** - Match reference icons closely (Home, Users, Target, etc.)

### Animation Pattern (Framer Motion)

```tsx
// 1. Scroll-triggered entrance
const containerRef = useRef(null);
const isInView = useInView(containerRef, { once: true, margin: "-100px" });

// 2. Container variants with stagger
const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
      staggerChildren: 0.08,
    },
  },
};

// 3. Item variants
const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

// 4. Card hover variants
const cardHoverVariants = {
  rest: { y: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.04)" },
  hover: { y: -4, boxShadow: "0 12px 28px rgba(0,0,0,0.08)" },
};
```

### Key Components

1. **AnimatedNumber** - Counts up from 0 when in view
2. **AnimatedProgressBar** - Width animates from 0 to target percentage
3. **useInView** from "framer-motion" - Trigger animations on scroll

### Styling Guidelines

- **Colors**: Match exact hex values from reference (#eef5ff, #3b82f6, etc.)
- **Shadows**: Use inline styles for complex gradients/box-shadows
- **Spacing**: Scale down on mobile (px-2/py-2 → px-5/py-4)
- **Text**: Truncate long labels (`truncate` class)
- **RTL**: Add `style={{ direction: "rtl" }}` to dashboard content areas

### Example: DashboardMockup Structure

```tsx
"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Home, Users, Eye } from "lucide-react";

const statCards = [
  { icon: Home, color: "#3b82f6", bg: "#eef5ff", value: 7, label: "العقارات" },
  // ... more cards
];

export function DashboardMockup() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div ref={ref} className="w-full lg:max-w-[1200px] lg:mx-auto">
      {/* Browser chrome with topbar */}
      {/* Sidebar (hidden lg:flex) */}
      {/* Stats grid (grid-cols-2 lg:grid-cols-3) */}
      {/* Rating card with animated progress bars */}
    </motion.div>
  );
}
```

### Integration in HeroSection

```tsx
// HeroSection.tsx - NO Container wrapper for mockup
{children && (
  <div className="relative z-[1] mt-12 w-full">
    {children}
  </div>
)}

// page.tsx
<HeroSection ...>
  <DashboardMockup />
</HeroSection>
```

### Reference Implementation

See `DashboardMockup.tsx` for complete working example with:

- Topbar with logo and user avatar
- 10-item sidebar with hover states
- 9 KPI stat cards with color-coded icons
- Customer rating card with 5-star breakdown
- Smooth entrance animations with stagger
- Hover lift effects on cards
- Animated number counting
- Animated progress bars

---

## Feature Section Pattern (Split Layout)

For feature sections that alternate between text-content + mockup visuals:

### File Structure

```
app/components/
  FeatureSection.tsx       # Reusable split layout component
  StagesMockup.tsx         # Feature 1: Construction progress
  MaintenanceMockup.tsx    # Feature 2: Maintenance table
  BookingsMockup.tsx       # Feature 3: Bookings table
  TemplatesMockup.tsx      # Feature 4: Stage templates
```

### Architecture Rules

1. **"use client" directive** - Required for Framer Motion
2. **Layout direction**: `layout="text-left"` or `layout="text-right"` prop
3. **Background colors**: Alternate between `bg-white` and `bg-[#f7f8fa]`
4. **Container**: Uses `section-aysar` and `sec-inner` classes
5. **Data structure**: Pass features as array with icon color

### FeatureSection Props

```tsx
interface FeatureSectionProps {
  eyebrow: string; // "01 — Feature name"
  title: string; // Main title (before <br />)
  titleAccent: string; // Colored accent text
  description: string; // Paragraph text
  features: {
    // Checklist items
    iconColor: string; // Hex color for check circle
    text: string; // "Bold text — description"
  }[];
  mockup: ReactNode; // The mockup component
  layout: "text-left" | "text-right";
  bgColor?: string; // Section background
}
```

### Animation Pattern

```tsx
const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};
```

### Usage Example

```tsx
// page.tsx
<FeatureSection
  eyebrow="01 — تتبع مراحل الإنشاء"
  title="تتبع مراحل الإنشاء"
  titleAccent="خطوة بخطوة"
  description="..."
  features={[
    { iconColor: "#1a9a5a", text: "صور وفيديو — من الموقع" },
    { iconColor: "#1a9a5a", text: "إشعارات فورية — عند كل تحديث" },
  ]}
  mockup={<StagesMockup />}
  layout="text-left"
  bgColor="bg-white"
/>
```

### Mockup Guidelines

Each mockup follows the DashboardMockup pattern:

- **Gradient background** matching feature theme color
- **Browser chrome** with navy header
- **Table/card content** with scroll-triggered animations
- **Progress bars** animate from 0 to target width
- **Rows stagger** in with delay

### Reference Implementation

See existing mockups:

- `StagesMockup.tsx` - Progress bars + KPI cards
- `MaintenanceMockup.tsx` - Data table with status badges
- `BookingsMockup.tsx` - Booking management table
- `TemplatesMockup.tsx` - Stage templates with progress
