# Aysar Dashboard CMS — Design Specification

**Date:** 2026-05-20
**Project:** Aysar App — Content Management Dashboard
**Approach:** B (Content-Type CMS)

---

## 1. Feature Summary

A content management dashboard (`/dashboard`) that allows an admin to edit all text, pricing, features, policies, and settings across the 6 public-facing pages of the Aysar website. Built as a separate route group with its own layout, using shadcn/ui components, Zod validation, React Hook Form, and ReactQuill for rich text editing.

---

## 2. Primary User Action

The single most important action is **editing page content and saving changes**. Every page editor must make it obvious what can be changed, validate inputs, and confirm successful saves.

---

## 3. Design Direction

**Feel:** Professional, calm, efficient. The dashboard should feel like a premium admin tool — clean whites, subtle shadows, and generous spacing. The dark navy sidebar provides visual contrast and hierarchy.

**Aesthetic:** Match the reference image exactly — card-based layout, colored accent borders on stat cards, filter bars above tables, and a consistent `#f5f6f9` background.

**RTL-first:** All text is Arabic, layout is RTL, forms stack labels above inputs.

---

## 4. Layout Strategy

### Route Group Architecture
```
app/
├── layout.tsx              ← Public layout (Navbar + Footer)
├── (dashboard)/            ← Isolated route group
│   ├── layout.tsx          ← Dashboard layout (no public Nav/Footer)
│   ├── dashboard/
│   │   └── page.tsx        ← Overview / stats
│   ├── home-page/
│   │   └── page.tsx        ← 5 tabs: Banner / Features / Overview / App / CTA
│   ├── plans-page/
│   │   └── page.tsx        ← 4 tabs: Banner / Plans / Compare / FAQ
│   ├── contact-page/
│   │   └── page.tsx        ← 3 tabs: Banner / Form / Channels
│   ├── policies/
│   │   └── page.tsx        ← 3 tabs: Privacy / Terms / Return
│   ├── messages/
│   │   └── page.tsx        ← Contact submissions table
│   └── settings/
│       └── page.tsx        ← 5 tabs: Metadata / Navbar / Footer / Socials / App Links
```

### Layout Structure
- **Fixed right sidebar** (260px): Dark navy `#0c2954`, full height, scrollable if needed
- **Main content area**: Light `#f5f6f9`, fills remaining width, scrollable
- **Topbar inside main area**: White card with page title, date, breadcrumb
- **Content below topbar**: Max-width container (none — full width like the reference image)

---

## 5. Sidebar Navigation

```
أيسَر (Logo + icon)
─────────────────
📊  لوحة التحكم
🏠  الصفحة الرئيسية
💰  صفحة الخطط
📞  صفحة التواصل
📄  الصفحات القانونية
💬  رسائل التواصل  [badge with count]
⚙️  الإعدادات العامة
─────────────────
🌐  عرض الموقع  →  opens /
─────────────────
👤  مدير النظام
    تسجيل الخروج
```

**Active state:** Slightly lighter background (`#1a3a6a`), left border accent (`#5ddfb8` mint), icon and text turn white.
**Hover state:** Subtle background change, transition 150ms.
**Mobile:** Sidebar becomes a slide-out sheet from right, triggered by hamburger menu in topbar.

---

## 6. Dashboard Overview Page (`/dashboard`)

### Stat Cards (5 cards, matching image)
Row of cards with colored top borders:

| Card | Color | Icon | Value (placeholder) |
|------|-------|------|---------------------|
| **إجمالي الصفحات** | Navy `#0c2954` | LayoutGrid | 6 |
| **رسائل جديدة** | Green `#1a9a5a` | MessageCircle | 3 |
| **أقسام المحتوى** | Orange `#f97316` | Layers | 24 |
| **آخر تحديث** | Indigo `#2d2e83` | Clock | "14/05/2026" |
| **الباقات النشطة** | Mint `#5ddfb8` | CreditCard | 3 |

### Quick Access Section
Below stat cards: 3-4 shortcut cards leading to the most-used editors (Home page, Plans, Messages, Settings).

---

## 7. Content Editor Pages

### Shared Editor Patterns
- Each editor page has **tabs** at the top (shadcn Tabs)
- Each tab contains a **white card** with the form inside
- Forms use **React Hook Form + Zod** for validation
- Every form has a **"حفظ التغييرات"** (Save Changes) button at the bottom
- All fields are **pre-filled with current live content** as placeholders

### 7.1 Home Page Editor (`/dashboard/home-page`)

**Tab: البانر الرئيسي**
- Badge text (input)
- Main title (input)
- Title accent (input)
- Subtitle (textarea)
- Primary CTA label + link (2 inputs)
- Secondary CTA label + link (2 inputs)

**Tab: المميزات الرئيسية**
- 4 feature sections, each with:
  - Eyebrow label (input)
  - Title (input)
  - Title accent (input)
  - Description (textarea)
  - Feature bullets: 3-4 items, each is a text input
  - Layout direction (select: text-left / text-right)
  - Accent color (color picker or select)

**Tab: شبكة المميزات (Bento)**
- 8 feature cards, each with:
  - Icon name (select from lucide icons)
  - Title (input)
  - Description (input)
  - Icon background color (color input)
  - Icon color (color input)

**Tab: نظرة على المشروع**
- Section eyebrow (input)
- Title (input)
- Title accent (input)
- Description (textarea)
- Check items: 4 items, each has bold text + detail text
- Dashboard link label + URL (2 inputs)

**Tab: قسم التطبيق**
- Eyebrow (input)
- Title (input)
- Title accent (input)
- Description (textarea)
- App Store URL (input)
- Google Play URL (input)

**Tab: دعوة للعمل (CTA)**
- Title (input)
- Subtitle (textarea)
- Primary CTA label + link (2 inputs)
- Secondary CTA label + link (2 inputs)
- Note text (input)
- Variant (select: dark / light)

### 7.2 Plans Page Editor (`/dashboard/plans-page`)

**Tab: البانر**
- Badge (input)
- Title (input)
- Title accent (input)
- Subtitle (textarea)

**Tab: الباقات**
- 3 pricing plans, each collapsible card with:
  - Plan name (input)
  - Description (input)
  - Monthly price (number input, nullable for free)
  - Yearly price (number input, nullable)
  - Is free (checkbox)
  - Is featured/highlighted (checkbox)
  - CTA label (input)
  - CTA link (input)
  - Features list: dynamic array of {text, enabled, soon}

**Tab: جدول المقارنة**
- Dynamic table editor: add/remove rows
- Each row: label, free value, advanced value, featured value
- Section headers (non-data rows)

**Tab: الأسئلة الشائعة**
- Dynamic list: add/remove FAQ items
- Each item: question (input) + answer (textarea)

### 7.3 Contact Page Editor (`/dashboard/contact-page`)

**Tab: البانر**
- Badge (input)
- Title line 1 (input)
- Title line 2 (input)
- Subtitle (textarea)

**Tab: نموذج التواصل**
- Form fields configuration (checkboxes to enable/disable)
- Success message (textarea)
- Inquiry types: dynamic list of {value, label}

**Tab: قنوات التواصل**
- 3 channels, each with:
  - Name (input)
  - Value (input)
  - URL/href (input)
  - Action label (input)
  - Icon background color (color input)
- Contact info card: phone, email, location, hours

### 7.4 Policies Page Editor (`/dashboard/policies`)

**Tab: سياسة الخصوصية**
- Full rich text editor (ReactQuill) with all content pre-filled
- Version (input)
- Effective date (input)

**Tab: شروط الاستخدام**
- Full rich text editor
- Same meta fields

**Tab: سياسة الإرجاع**
- Full rich text editor
- Same meta fields

### 7.5 Messages Page (`/dashboard/messages`)

**Table with filters (matching image):**
- Filter bar: search (name/email/phone), type dropdown, status dropdown, date from/to, reset button, search button
- Columns: #, Type, Name, Email, Phone, Message, Date, Status, Actions
- Status badges: new (blue), read (green), replied (navy)
- Actions: view detail modal, mark as read, delete
- Pagination or "load more"

**Placeholder data:** 5-10 sample submissions with realistic Arabic names

### 7.6 Settings Page (`/dashboard/settings`)

**Tab: معلومات الموقع**
- Site title (input)
- Site description (textarea)
- Favicon URL (input)
- SEO keywords (textarea)

**Tab: شريط التنقل**
- Navbar links: dynamic array of {label, href}
- CTA button config: label, href, variant

**Tab: تذييل الموقع**
- Footer columns: 4 columns, each with title + links array
- Copyright text (textarea)

**Tab: وسائل التواصل**
- X (Twitter) URL (input)
- Instagram URL (input)
- TikTok URL (input)
- WhatsApp number (input)

**Tab: روابط التطبيق**
- App Store URL (input)
- Google Play URL (input)

---

## 8. Component Inventory

### shadcn/ui Components (to install)
- `sidebar` — Main navigation shell
- `card` — Stat cards, form containers
- `table` — Messages table, compare table
- `button` — Primary, secondary, ghost, danger
- `input` — Text inputs
- `textarea` — Multi-line text
- `badge` — Status badges, counters
- `avatar` — User profile in sidebar footer
- `tabs` — Page section navigation
- `sheet` — Mobile sidebar drawer
- `dialog` — Confirmation modals, detail views
- `dropdown-menu` — Actions menus
- `tooltip` — Icon explanations
- `select` — Dropdowns
- `separator` — Visual dividers
- `scroll-area` — Scrollable sidebar
- `collapsible` — Expandable plan cards, FAQ items
- `label` — Form labels
- `form` — React Hook Form integration wrapper

### Custom Components (to build)
- `DashboardLayout` — Root dashboard wrapper
- `DashboardSidebar` — Sidebar with nav items, active states, mobile sheet
- `DashboardTopbar` — Page title, date, mobile toggle
- `StatCard` — Stat card with colored top border
- `ContentCard` — White card wrapper for form sections
- `SectionTabs` — Tab wrapper with consistent styling
- `RichTextEditor` — ReactQuill wrapper with Arabic toolbar
- `DynamicList` — Reusable add/remove list (for features, FAQ, channels, etc.)
- `ColorInput` — Simple color picker input
- `MessagesTable` — Filterable data table
- `MessageDetailDialog` — View full submission
- `SaveBar` — Sticky bottom bar with save/cancel/last-saved info

---

## 9. Data Flow

### Placeholder Data Strategy
All content is currently hardcoded in the public pages. The dashboard will:
1. Import the same constants from `lib/` files as default values
2. Allow editing via forms
3. Store changes in React state (for now, no database)
4. Display a "تم الحفظ" toast on save (state update only)

### Future Integration
When database is connected:
1. Replace state with API calls (fetch default content from DB)
2. Save button triggers `PUT /api/content/:section`
3. Revalidate public pages via Next.js ISR

---

## 10. Form Validation (Zod)

### Common Schemas
- `requiredString`: min(1, "هذا الحقل مطلوب")
- `optionalString`: z.string().optional()
- `urlString`: z.string().url("رابط غير صالح").optional()
- `emailString`: z.string().email("بريد إلكتروني غير صالح")

### Page-Specific Schemas
- **HeroSection**: badge, title, subtitle required; URLs validated
- **FeatureSection**: title, description required; feature items min(1)
- **PricingPlan**: name, description required; prices positive number or null
- **ContactChannel**: name, value, href required
- **PolicyContent**: rich text required (min 10 chars)
- **Settings**: site title required; URLs validated if provided

---

## 11. Key States

| State | UI Treatment |
|-------|-------------|
| **Default / loaded** | Forms pre-filled, save button disabled until dirty |
| **Dirty (unsaved changes)** | Save button enabled, "*" indicator on tab |
| **Saving** | Save button loading spinner, "جاري الحفظ..." |
| **Success** | Toast: "تم حفظ التغييرات بنجاح", save button disabled |
| **Validation error** | Red border on field, error message below |
| **Empty list** | "لا توجد عناصر" with add button |
| **Loading** | Skeleton cards on dashboard overview |
| **Mobile sidebar** | Sheet slides from right, overlay backdrop |

---

## 12. Tech Stack Additions

| Package | Purpose |
|---------|---------|
| `zod` | Schema validation |
| `react-hook-form` | Form state management |
| `@hookform/resolvers` | Zod resolver for RHF |
| `react-quill` | Rich text editor |
| `date-fns` | Date formatting (Arabic locale) |

---

## 13. Colors (from existing globals.css)

| Token | Value | Usage |
|-------|-------|-------|
| `--color-navy` | `#0c2954` | Sidebar bg, primary text, stat card border |
| `--color-indigo` | `#2d2e83` | Accent, links, stat card border |
| `--color-green` | `#1a9a5a` | Success, stat card border, status badge |
| `--color-mint` | `#5ddfb8` | Active sidebar indicator, accent |
| `--color-bg` | `#f5f6f9` | Main content background |
| `--color-surface` | `#ffffff` | Cards, tables, topbar |
| `--color-text` | `#0c1829` | Primary text |
| `--color-muted` | `#6b7a94` | Secondary text, labels |
| `--color-border` | `#e8edf5` | Borders, dividers |

---

## 14. Responsive Breakpoints

| Breakpoint | Behavior |
|-----------|----------|
| `< 1024px` | Sidebar hidden, hamburger menu opens sheet; main content full width |
| `≥ 1024px` | Sidebar fixed 260px; main content `mr-[260px]` |
| `< 768px` | Stat cards 2-column; tables horizontal scroll; forms full width |
| `≥ 768px` | Stat cards row; tables full width; forms in 2-column grids where applicable |

---

## 15. Accessibility

- All form inputs have associated `<label>`
- Focus states visible (ring-2 ring-navy/20)
- Color contrast meets WCAG AA (navy on white, white on navy)
- RTL keyboard navigation supported
- `dir="rtl"` on dashboard html element

---

## 16. Open Questions

1. **Authentication:** Should we add a simple login gate now, or is the dashboard open? (Defer to later phase)
2. **Image uploads:** Feature mockups and app screenshots — editable image URLs or uploads? (Defer to later)
3. **Multi-language:** Only Arabic for now, but structure should support i18n keys
4. **Preview mode:** Should edits reflect immediately on public site, or require explicit "Publish"? (For now: state-only, no public site update)

---

**Status:** APPROVED — Ready for implementation planning.
