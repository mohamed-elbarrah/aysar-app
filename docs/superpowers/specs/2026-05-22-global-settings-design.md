# Global Settings Architecture — Design Spec

**Date:** 2026-05-22  
**Status:** Approved

## Problem

Global business info (social media links, email, phone, WhatsApp, platform URLs, location, work hours) is scattered across 6+ files with heavy duplication. WhatsApp appears in 6 places, platform registration URLs in 5+. The existing `SiteSettings` DB model centralizes social links, app links, footer columns, and nav links — but Navbar hardcodes platform URLs, ContactInfoCard hardcodes social links with CDN images, and CTA sections hardcode WhatsApp/platform URLs.

## Solution

Extend the existing `SiteSettings` model with 3 new JSON fields (`contactInfo`, `platformLinks`, `workHours`), add 3 new dashboard settings tabs, create a shared icon registry, refactor all consumers to read from centralized settings, and support admin-uploaded custom social icons.

## Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Architecture | Extend SiteSettings (Approach 1) | Matches existing pattern, minimal migration |
| Dashboard structure | Separate tabs, add missing ones | User preference for modular tabs |
| Social icons | lucide-react + custom SVGs | User preference; Instagram/TikTok/WhatsApp need custom SVGs |
| Custom icon upload | Local `/public/uploads/social/` | Simple, no external dependency |
| Policy pages | Skip — keep hardcoding as-is | User preference; focus on other pages |
| WhatsApp placement | Move from `socialLinks` to `contactInfo` | WhatsApp is a contact channel, not social media |
| `socialLinks` structure | Array of objects with `iconUrl` | Enables admin to add/remove/reorder platforms and upload custom icons |

---

## 1. Data Model

### 1.1 Prisma Schema Changes

Add 3 new JSON columns to `SiteSettings`:

```prisma
model SiteSettings {
  id               String   @id @default("SETTINGS")
  siteTitle        String   @default("") @map("site_title")
  siteDescription  String   @default("") @map("site_description")
  faviconUrl       String?  @map("favicon_url")
  seoKeywords      String   @default("") @map("seo_keywords")
  navLinks         Json     @default("[]") @map("nav_links")
  socialLinks      Json     @default("[]") @map("social_links")
  appLinks         Json     @default("{}") @map("app_links")
  footerColumns    Json     @default("[]") @map("footer_columns")
  contactInfo      Json     @default("{}") @map("contact_info")
  platformLinks    Json     @default("{}") @map("platform_links")
  workHours        Json     @default("{}") @map("work_hours")
  updatedAt        DateTime @updatedAt @map("updated_at")

  @@map("site_settings")
}
```

**Breaking change:** `socialLinks` changes from `{ xUrl, instagramUrl, tiktokUrl, whatsappNumber }` to an array of `SocialLink[]` objects. Migration must convert existing data.

### 1.2 TypeScript Interfaces

```ts
// Social link — now an array with optional custom icon
interface SocialLink {
  key: string;          // slug like "x", "instagram", "tiktok", or custom
  label: string;        // display name "X (Twitter)"
  url: string;          // "https://x.com/aysar_ksa"
  iconUrl?: string;     // path to uploaded icon, e.g. "/uploads/social/x.svg"
}

// Contact business info
interface ContactInfo {
  phone: string;           // "+966125101107"
  email: string;           // "support@aysar.sa"
  legalEmail: string;      // "legal@aysar.sa"
  whatsappNumber: string;  // "966125101107"
  location: string;        // "جدة، المملكة العربية السعودية"
}

// Platform URLs
interface PlatformLinks {
  loginUrl: string;         // "https://platform.aysar.sa/"
  registerUrl: string;      // "https://platform.aysar.sa/ar/company/dashboard/register"
  supportCenterUrl: string; // "https://support.aysar.sa/"
}

// Work hours
interface WorkHours {
  days: string;             // "الأحد – الخميس"
  time: string;             // "10:00 ص – 5:00 م"
}
```

### 1.3 Defaults (in `placeholders.ts`)

```ts
export const SOCIAL_LINKS: SocialLink[] = [
  { key: "x", label: "X (Twitter)", url: "https://x.com/aysar_ksa" },
  { key: "instagram", label: "Instagram", url: "https://instagram.com/aysar_ksa" },
  { key: "tiktok", label: "TikTok", url: "https://tiktok.com/@aysar_sa" },
];

export const CONTACT_INFO: ContactInfo = {
  phone: "+966125101107",
  email: "support@aysar.sa",
  legalEmail: "legal@aysar.sa",
  whatsappNumber: "966125101107",
  location: "جدة، المملكة العربية السعودية",
};

export const PLATFORM_LINKS: PlatformLinks = {
  loginUrl: "https://platform.aysar.sa/",
  registerUrl: "https://platform.aysar.sa/ar/company/dashboard/register",
  supportCenterUrl: "https://support.aysar.sa/",
};

export const WORK_HOURS: WorkHours = {
  days: "الأحد – الخميس",
  time: "10:00 ص – 5:00 م",
};
```

### 1.4 Zod Schemas (in `schemas.ts`)

```ts
export const socialLinkSchema = z.object({
  key: requiredString,
  label: requiredString,
  url: z.string().url("رابط غير صالح"),
  iconUrl: optionalString,
});

export const contactInfoSchema = z.object({
  phone: requiredString,
  email: z.string().email("بريد إلكتروني غير صالح"),
  legalEmail: z.string().email("بريد إلكتروني غير صالح"),
  whatsappNumber: requiredString,
  location: requiredString,
});

export const platformLinksSchema = z.object({
  loginUrl: z.string().url("رابط غير صالح"),
  registerUrl: z.string().url("رابط غير صالح"),
  supportCenterUrl: z.string().url("رابط غير صالح"),
});

export const workHoursSchema = z.object({
  days: requiredString,
  time: requiredString,
});
```

### 1.5 Database Migration

A SQL migration to:
1. Add `contact_info`, `platform_links`, `work_hours` columns to `site_settings` table
2. Convert existing `social_links` JSON from `{ xUrl, instagramUrl, tiktokUrl, whatsappNumber }` to `[ { key: "x", label: "X (Twitter)", url: "..." }, ... ]`
3. Extract `whatsappNumber` from old `social_links` into new `contact_info`

---

## 2. Server Data Flow

### 2.1 `getSiteSettings()` Enhancement

The `SiteSettingsResponse` interface adds:

```ts
export interface SiteSettingsResponse {
  // ...existing fields...
  contactInfo: ContactInfo;
  platformLinks: PlatformLinks;
  workHours: WorkHours;
}
```

`getSiteSettings()` in `settings-data.ts` merges DB values with defaults for the 3 new fields, same pattern as existing fields.

### 2.2 API Handler Changes

The `DEFAULTS` object in `handlers.ts` adds:

```ts
const DEFAULTS = {
  ...existingDefaults,
  contactInfo: CONTACT_INFO,
  platformLinks: PLATFORM_LINKS,
  workHours: WORK_HOURS,
};
```

No API schema changes needed — `settingsUpdateSchema` already accepts any JSON.

### 2.3 Icon Upload API

New endpoint: `POST /api/settings/upload-icon`

- Accepts `multipart/form-data` with a file + `key` field
- Validates file type (SVG, PNG, JPG, WEBP)
- Validates file size (max 100KB for SVG, 500KB for raster)
- Saves to `/public/uploads/social/{key}.{ext}`
- Returns `{ iconUrl: "/uploads/social/{key}.{ext}" }`
- Overwrites existing file for same key (cache-bust via query param `?v=timestamp`)

---

## 3. Dashboard UI

### 3.1 New Tabs

Add to `SettingsLayout` TABS array:

```ts
const TABS = [
  { href: "/dashboard/settings/metadata", label: "معلومات الموقع" },
  { href: "/dashboard/settings/navbar", label: "شريط التنقل" },
  { href: "/dashboard/settings/footer", label: "تذييل الموقع" },
  { href: "/dashboard/settings/social", label: "وسائل التواصل" },
  { href: "/dashboard/settings/apps", label: "روابط التطبيق" },
  { href: "/dashboard/settings/contact", label: "معلومات الاتصال" },    // NEW
  { href: "/dashboard/settings/platform", label: "روابط المنصة" },     // NEW
  { href: "/dashboard/settings/hours", label: "ساعات العمل" },          // NEW
];
```

### 3.2 Social Settings Page — Redesigned

Changes from 4 fixed fields to a **dynamic list** with icon upload:

Each row has:
- Platform label (editable)
- URL input
- Icon upload button (accepts SVG/PNG)
- Preview of current icon (built-in or uploaded)
- Delete button

Built-in platforms (x, instagram, tiktok) show their default icon from the registry. If admin uploads a custom icon, it overrides the built-in one.

### 3.3 Contact Info Settings Page

Fields: phone, email, legalEmail, whatsappNumber, location

### 3.4 Platform Links Settings Page

Fields: loginUrl, registerUrl, supportCenterUrl

### 3.5 Work Hours Settings Page

Fields: days, time

---

## 4. Icon Registry

### 4.1 File Structure

```
app/components/
  ui/
    SocialIconRegistry.tsx   # maps key → icon component + label
  icons/
    WhatsAppIcon.tsx         # custom SVG
    InstagramIcon.tsx        # custom SVG
    TikTokIcon.tsx           # custom SVG
```

### 4.2 Icon Resolution Logic

```
1. If iconUrl exists → render <img src={iconUrl}> with proper sizing
2. Else if BUILT_IN_SOCIAL_ICONS[key] exists → render the built-in component
3. Else → render Globe icon as fallback
```

Both Footer and ContactInfoCard import from this registry. No duplicate icons, no CDN images.

---

## 5. Consumer Component Changes

### 5.1 Files to Modify

| File | Change |
|------|--------|
| `app/(public)/layout.tsx` | Pass `contactInfo`, `platformLinks`, `workHours` to Navbar + Footer |
| `app/components/Navbar.tsx` | Accept `platformLinks` prop, replace hardcoded URLs |
| `app/components/Footer.tsx` | Accept `contactInfo` prop, use array `socialLinks`, use `SocialIconRegistry` |
| `app/components/ContactInfoCard.tsx` | Remove hardcoded links, use `contactInfo` + `socialLinks` + `CONTACT_ICONS` |
| `app/components/ChannelsGrid.tsx` | Use `contactInfo` for WhatsApp channel |
| `app/(public)/contact/ContactPageContent.tsx` | Use `platformLinks` + `contactInfo` for CTA buttons |
| `app/(public)/plans/PlansPageContent.tsx` | Use `platformLinks` + `contactInfo` for CTA buttons |
| `lib/plans-data.ts` | Replace hardcoded `ctaHref` with `PLATFORM_LINKS.registerUrl` |
| `app/lib/dashboard/placeholders.ts` | Add 3 new default constants, update `SOCIAL_LINKS` to array |
| `app/lib/settings-data.ts` | Add 3 new fields to `SiteSettingsResponse`, `getSiteSettings()` |
| `app/lib/dashboard/schemas.ts` | Add `socialLinkSchema`, `contactInfoSchema`, `platformLinksSchema`, `workHoursSchema` |
| `app/api/settings/handlers.ts` | Add 3 new entries to `DEFAULTS` |
| `app/(dashboard)/dashboard/settings/layout.tsx` | Add 3 new tabs |

### 5.2 New Files

| File | Purpose |
|------|---------|
| `app/(dashboard)/dashboard/settings/contact/page.tsx` | Contact info form |
| `app/(dashboard)/dashboard/settings/platform/page.tsx` | Platform links form |
| `app/(dashboard)/dashboard/settings/hours/page.tsx` | Work hours form |
| `app/components/ui/SocialIconRegistry.tsx` | Icon resolution logic |
| `app/components/icons/WhatsAppIcon.tsx` | Custom SVG |
| `app/components/icons/InstagramIcon.tsx` | Custom SVG |
| `app/components/icons/TikTokIcon.tsx` | Custom SVG |
| `app/api/settings/upload-icon/route.ts` | Icon upload API |
| `public/uploads/social/.gitkeep` | Upload directory for custom icons |

---

## 6. Migration Plan

### Step 1: Prisma Migration
- Add `contact_info`, `platform_links`, `work_hours` columns to `site_settings`
- Convert `social_links` from flat object to array format

### Step 2: Code Updates (in order)
1. Add new types/interfaces to `settings-data.ts`
2. Add defaults to `placeholders.ts`
3. Add Zod schemas to `schemas.ts`
4. Update `getSiteSettings()` to include new fields
5. Update `handlers.ts` DEFAULTS
6. Create icon components
7. Create `SocialIconRegistry.tsx`
8. Update `PublicLayout` to pass new props
9. Update `Navbar.tsx` — accept `platformLinks` prop
10. Update `Footer.tsx` — accept new props, use registry
11. Refactor `ContactInfoCard.tsx` — remove hardcoded data
12. Update `ChannelsGrid.tsx` — use `contactInfo`
13. Update CTA sections in Contact + Plans pages
14. Update `plans-data.ts` defaults
15. Create 3 dashboard settings pages
16. Update settings layout tabs
17. Create icon upload API route

### Step 3: Verify
- All pages render correctly with defaults
- Dashboard can edit and save all new settings
- Uploaded icons appear correctly
- Footer, Contact page, Navbar, CTA sections all use centralized data

---

## 7. Out of Scope

- Policy pages (privacy, terms, return) — keep hardcoded as-is per user request
- Footer columns editing — already exists, no changes
- Navbar links editing — already exists, no changes
- App store links editing — already exists, no changes
- SEO metadata editing — already exists, no changes
