# Aysar App - Dependency Graph

```mermaid
graph LR
  %% ===== STYLE =====
  classDef page fill:#1a9a5a,stroke:#0c2954,color:#fff,font-weight:bold
  classDef layout fill:#2d2e83,stroke:#0c2954,color:#fff,font-weight:bold
  classDef section fill:#f59e0b,stroke:#0c2954,color:#fff
  classDef component fill:#3b82f6,stroke:#0c2954,color:#fff
  classDef ui fill:#8b5cf6,stroke:#0c2954,color:#fff
  classDef lib fill:#6b7280,stroke:#0c2954,color:#fff
  classDef ext fill:#ef4444,stroke:#0c2954,color:#fff

  %% ===== EXTERNAL DEPS =====
  next["next"]:::ext
  react["react"]:::ext
  framer["framer-motion"]:::ext
  lucide["lucide-react"]:::ext
  clsx["clsx"]:::ext
  twMerge["tailwind-merge"]:::ext

  %% ===== LIB =====
  utils("<code>lib/utils.ts</code><br/>cn()"):::lib

  %% ===== UI ATOMS =====
  Button("<code>ui/Button.tsx</code>"):::ui

  %% ===== ORGANISMS =====
  Navbar("<code>components/Navbar.tsx</code>"):::component
  Footer("<code>components/Footer.tsx</code>"):::component
  Container("<code>components/Container.tsx</code>"):::component
  Section("<code>components/Section.tsx</code>"):::component
  FeatureSection("<code>components/FeatureSection.tsx</code>"):::component
  DashboardMockup("<code>components/DashboardMockup.tsx</code>"):::component
  StagesMockup("<code>components/StagesMockup.tsx</code>"):::component
  MaintenanceMockup("<code>components/MaintenanceMockup.tsx</code>"):::component
  BookingsMockup("<code>components/BookingsMockup.tsx</code>"):::component
  TemplatesMockup("<code>components/TemplatesMockup.tsx</code>"):::component

  %% ===== SECTIONS =====
  HeroSection("<code>sections/HeroSection.tsx</code>"):::section
  CTASection("<code>sections/CTASection.tsx</code>"):::section
  FeaturesGrid("<code>sections/FeaturesGrid.tsx</code>"):::section
  ProjectOverview("<code>sections/ProjectOverview.tsx</code>"):::section
  AppSection("<code>sections/AppSection.tsx</code>"):::section

  %% ===== LAYOUT =====
  RootLayout("<code>app/layout.tsx</code>"):::layout

  %% ===== PAGE =====
  HomePage("<code>app/page.tsx</code><br/>Route: /"):::page

  %% ===== EDGES: lib → ui =====
  clsx --> utils
  twMerge --> utils
  utils --> Button

  %% ===== EDGES: ui → organisms =====
  Button --> HeroSection

  %% ===== EDGES: sections → page =====
  HeroSection --> HomePage
  CTASection --> HomePage
  FeaturesGrid --> HomePage
  ProjectOverview --> HomePage
  AppSection --> HomePage

  %% ===== EDGES: organisms → sections =====
  Container --> HeroSection
  Container --> CTASection
  DashboardMockup --> HomePage
  StagesMockup --> HomePage
  MaintenanceMockup --> HomePage
  BookingsMockup --> HomePage
  TemplatesMockup --> HomePage
  FeatureSection --> HomePage

  %% ===== EDGES: organisms → layout =====
  Navbar --> RootLayout
  Footer --> RootLayout

  %% ===== EDGES: ext → organisms =====
  next --> Navbar
  next --> Footer
  next --> ProjectOverview
  next --> AppSection
  react --> Navbar
  react --> Footer
  react --> FeatureSection
  react --> DashboardMockup
  react --> StagesMockup
  react --> MaintenanceMockup
  react --> BookingsMockup
  react --> TemplatesMockup
  react --> FeaturesGrid
  react --> ProjectOverview
  react --> AppSection
  framer --> FeatureSection
  framer --> DashboardMockup
  framer --> StagesMockup
  framer --> MaintenanceMockup
  framer --> BookingsMockup
  framer --> TemplatesMockup
  framer --> FeaturesGrid
  framer --> ProjectOverview
  framer --> AppSection
  lucide --> DashboardMockup
  lucide --> MaintenanceMockup
  lucide --> FeaturesGrid
  lucide --> AppSection
```

## Architecture Layers

```
┌─────────────────────────────────────┐
│          app/layout.tsx              │  ← Shell (Navbar + Footer)
│  ┌─────────────────────────────────┐│
│  │       app/page.tsx (/)           ││  ← Page (assembles sections)
│  │  ┌─────────────────────────────┐ ││
│  │  │    sections/                │ ││  ← Page-level assemblies
│  │  │  HeroSection, CTASection,   │ ││
│  │  │  FeaturesGrid, ProjectOvr,  │ ││
│  │  │  AppSection                 │ ││
│  │  └──────────┬──────────────────┘ ││
│  │  ┌──────────┴──────────────────┐ ││
│  │  │    components/              │ ││  ← Organisms
│  │  │  Navbar, Footer, Container, │ ││
│  │  │  Section, FeatureSection,   │ ││
│  │  │  5× Mockups                 │ ││
│  │  └──────────┬──────────────────┘ ││
│  │  ┌──────────┴──────┐             ││
│  │  │    ui/Button     │             ││  ← Atoms
│  │  └──────────────────┘             ││
│  └────────────────────────────────────┘│
└─────────────────────────────────────────┘
```

## Import Map

| File | Imports From |
|---|---|
| `lib/utils.ts` | `clsx`, `tailwind-merge` |
| `ui/Button.tsx` | `react`, `@/lib/utils` |
| `HeroSection.tsx` | `@/app/components/Container`, `@/app/components/ui/Button` |
| `CTASection.tsx` | `@/app/components/Container` |
| `FeaturesGrid.tsx` | `react`, `framer-motion`, `lucide-react` |
| `ProjectOverview.tsx` | `react`, `framer-motion`, `next/link` |
| `AppSection.tsx` | `react`, `framer-motion`, `next/image`, `lucide-react` |
| `FeatureSection.tsx` | `react`, `framer-motion` |
| `DashboardMockup.tsx` | `react`, `framer-motion`, `next/image`, `lucide-react` |
| `StagesMockup.tsx` | `react`, `framer-motion` |
| `MaintenanceMockup.tsx` | `react`, `framer-motion`, `lucide-react` |
| `BookingsMockup.tsx` | `react`, `framer-motion` |
| `TemplatesMockup.tsx` | `react`, `framer-motion` |
| `Navbar.tsx` | `react`, `next/link`, `next/image`, `next/navigation` |
| `Footer.tsx` | `next/link`, `next/image` |
| `Container.tsx` | (server component — no imports) |
| `Section.tsx` | (server component — no imports) |
| `page.tsx` | All 5 sections + FeatureSection + 5 mockups |
| `layout.tsx` | `next`, `next/font/google`, `Navbar`, `Footer`, `globals.css` |

## Stats

- **18 source files** (tsx/ts), ~3,500 LOC
- **1 page** (of 6 planned)
- **1 UI atom** (of 6 specified: Input, Badge, Card, Alert, Eyebrow, CheckList missing)
- **10 organism components**
- **5 section assemblies**
- **5 missing pages**: `/plans`, `/contact`, `/privacy-policy`, `/terms-of-use`, `/return-policy`
