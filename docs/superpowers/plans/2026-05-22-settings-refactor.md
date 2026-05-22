# Settings Page Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the dashboard settings page from a single-page vertical stack into URL-based sub-pages with separate name/link inputs for navbar items, dynamic footer columns with separate name/link fields, and a clean tab navigation layout.

**Architecture:** Replace the single `/dashboard/settings/page.tsx` with a Next.js App Router nested layout at `/dashboard/settings/layout.tsx` plus 5 sub-pages (metadata, navbar, footer, social, apps). Replace `footerQuickLinks`/`footerHelpLinks`/`footerTagline`/`footerCopyright` DB columns with a single `footerColumns` JSON column. Create a reusable `LinkListEditor` component for both navbar and footer link editing. Update the public `Footer.tsx` to render dynamic columns from data instead of fixed props.

**Tech Stack:** Next.js 16 (App Router), React 19, TypeScript, Prisma 7, Zod, Tailwind CSS v4, shadcn/ui

---

## File Map

| File | Action | Purpose |
|------|--------|---------|
| `prisma/schema.prisma` | Modify | Replace `footerQuickLinks`, `footerHelpLinks`, `footerTagline`, `footerCopyright` with `footerColumns` |
| `app/lib/settings-data.ts` | Modify | Update types, defaults, and `getSiteSettings()` for new column structure |
| `app/lib/dashboard/placeholders.ts` | Modify | Add footer column defaults |
| `app/lib/shared-types.ts` | No change | Uses generic `jsonValueSchema` already |
| `app/lib/dashboard/schemas.ts` | No change | Keep for client-side validation if needed |
| `app/api/settings/handlers.ts` | Modify | Update DEFAULTS and handler for new structure |
| `app/components/Navbar.tsx` | No change | Navbar already receives `navLinks: NavLinkItem[]` |
| `app/components/Footer.tsx` | Modify | Accept `columns` prop instead of fixed props, render dynamically |
| `app/components/dashboard/DynamicList.tsx` | No change | Keep for non-link list usage |
| `app/components/dashboard/LinkListEditor.tsx` | Create | Reusable component for separated name/link inputs |
| `app/components/dashboard/DashboardSidebar.tsx` | Modify | Update settings subItems to use real routes |
| `app/(dashboard)/dashboard/settings/page.tsx` | Modify | Redirect to `/dashboard/settings/metadata` |
| `app/(dashboard)/dashboard/settings/layout.tsx` | Create | Shared layout with tab navigation |
| `app/(dashboard)/dashboard/settings/metadata/page.tsx` | Create | Metadata settings sub-page |
| `app/(dashboard)/dashboard/settings/navbar/page.tsx` | Create | Navbar links sub-page |
| `app/(dashboard)/dashboard/settings/footer/page.tsx` | Create | Footer columns sub-page |
| `app/(dashboard)/dashboard/settings/social/page.tsx` | Create | Social links sub-page |
| `app/(dashboard)/dashboard/settings/apps/page.tsx` | Create | App links sub-page |
| `app/(public)/layout.tsx` | Modify | Pass `columns` to Footer instead of fixed props |
| `app/lib/db.ts` | No change | Already exports prisma |

---

### Task 1: Update Prisma Schema & Run Migration

**Files:**
- Modify: `prisma/schema.prisma:68-84`

- [ ] **Step 1: Update the SiteSettings model in the Prisma schema**

Replace the current footer fields (`footerCopyright`, `footerTagline`, `footerQuickLinks`, `footerHelpLinks`) with a single `footerColumns` JSON column.

In `prisma/schema.prisma`, change the `SiteSettings` model from:

```prisma
model SiteSettings {
  id               String   @id @default("SETTINGS")
  siteTitle        String   @default("") @map("site_title")
  siteDescription  String   @default("") @map("site_description")
  faviconUrl       String?  @map("favicon_url")
  seoKeywords      String   @default("") @map("seo_keywords")
  navLinks         Json     @default("[]") @map("nav_links")
  socialLinks      Json     @default("{}") @map("social_links")
  appLinks         Json     @default("{}") @map("app_links")
  footerCopyright  String   @default("") @map("footer_copyright")
  footerTagline    String   @default("") @map("footer_tagline")
  footerQuickLinks Json     @default("[]") @map("footer_quick_links")
  footerHelpLinks  Json     @default("[]") @map("footer_help_links")
  updatedAt        DateTime @updatedAt @map("updated_at")

  @@map("site_settings")
}
```

to:

```prisma
model SiteSettings {
  id               String   @id @default("SETTINGS")
  siteTitle        String   @default("") @map("site_title")
  siteDescription  String   @default("") @map("site_description")
  faviconUrl       String?  @map("favicon_url")
  seoKeywords      String   @default("") @map("seo_keywords")
  navLinks         Json     @default("[]") @map("nav_links")
  socialLinks      Json     @default("{}") @map("social_links")
  appLinks         Json     @default("{}") @map("app_links")
  footerColumns    Json     @default("[]") @map("footer_columns")
  updatedAt        DateTime @updatedAt @map("updated_at")

  @@map("site_settings")
}
```

- [ ] **Step 2: Create the Prisma migration**

Run: `cd /home/mohamed/Documents/Apps/aysar-app && npx prisma migrate dev --name refactor_footer_columns`

This will create a migration that drops `footer_copyright`, `footer_tagline`, `footer_quick_links`, `footer_help_links` and adds `footer_columns`.

- [ ] **Step 3: Verify the migration runs successfully**

Run: `cd /home/mohamed/Documents/Apps/aysar-app && npx prisma generate`

---

### Task 2: Update TypeScript Types & Defaults

**Files:**
- Modify: `app/lib/settings-data.ts`
- Modify: `app/lib/dashboard/placeholders.ts`

- [ ] **Step 1: Update `app/lib/settings-data.ts`**

Replace the entire file content with:

```typescript
import { prisma } from "@/app/lib/db";
import { SITE_SETTINGS, NAV_LINKS, SOCIAL_LINKS, DEFAULT_FOOTER_COLUMNS, APP_LINKS_DEFAULTS } from "@/app/lib/dashboard/placeholders";

export interface NavLink { label: string; href: string }
export interface SocialInfo { xUrl: string; instagramUrl: string; tiktokUrl: string; whatsappNumber: string }
export interface AppLinkInfo { appStoreUrl: string; googlePlayUrl: string }
export interface FooterLinkItem { label: string; href: string; external?: boolean }
export interface FooterColumn {
  type: "brand" | "links";
  title: string;
  links?: FooterLinkItem[];
  tagline?: string;
  copyright?: string;
}

export interface SiteSettingsResponse {
  id: string;
  siteTitle: string;
  siteDescription: string;
  faviconUrl: string | null;
  seoKeywords: string;
  navLinks: NavLink[];
  socialLinks: SocialInfo;
  appLinks: AppLinkInfo;
  footerColumns: FooterColumn[];
  updatedAt: string;
}

export async function getSiteSettings(): Promise<SiteSettingsResponse> {
  let row = await prisma.siteSettings.findUnique({ where: { id: "SETTINGS" } });

  if (!row) {
    return {
      id: "SETTINGS",
      siteTitle: SITE_SETTINGS.siteTitle,
      siteDescription: SITE_SETTINGS.siteDescription,
      faviconUrl: SITE_SETTINGS.faviconUrl,
      seoKeywords: SITE_SETTINGS.seoKeywords,
      navLinks: [...NAV_LINKS],
      socialLinks: { ...SOCIAL_LINKS },
      appLinks: { ...APP_LINKS_DEFAULTS },
      footerColumns: DEFAULT_FOOTER_COLUMNS,
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    id: row.id,
    siteTitle: row.siteTitle,
    siteDescription: row.siteDescription,
    faviconUrl: row.faviconUrl,
    seoKeywords: row.seoKeywords,
    navLinks: row.navLinks as NavLink[],
    socialLinks: row.socialLinks as SocialInfo,
    appLinks: row.appLinks as AppLinkInfo,
    footerColumns: row.footerColumns as FooterColumn[],
    updatedAt: row.updatedAt.toISOString(),
  };
}
```

- [ ] **Step 2: Update `app/lib/dashboard/placeholders.ts`**

Add the `DEFAULT_FOOTER_COLUMNS` and `APP_LINKS_DEFAULTS` constants. Add them after the existing `SOCIAL_LINKS` export (around line 159):

```typescript
export const APP_LINKS_DEFAULTS = {
  appStoreUrl: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone",
  googlePlayUrl: "https://play.google.com/store/apps/details?id=com.aysar.application",
};

export const DEFAULT_FOOTER_COLUMNS: import("@/app/lib/settings-data").FooterColumn[] = [
  {
    type: "brand",
    title: "أيسَر",
    tagline: "أيسَر برنامج لإدارة العقارات وتتبع مراحل الإنشاء من أول طوبة لآخر لمسة.",
    copyright: "© 2026 مؤسسة أيسر المتطورة لتقنية المعلومات · رقم السجل التجاري: 4030620045",
  },
  {
    type: "links",
    title: "روابط سريعة",
    links: [
      { label: "الرئيسية", href: "/" },
      { label: "الأسعار", href: "/plans" },
      { label: "اتصل بنا", href: "/contact" },
    ],
  },
  {
    type: "links",
    title: "المساعدة",
    links: [
      { label: "تسجيل دخول", href: "https://platform.aysar.sa/ar/company/dashboard/login", external: true },
      { label: "مركز المساعدة", href: "https://support.aysar.sa/", external: true },
      { label: "التحديثات", href: "https://support.aysar.sa/page/update", external: true },
      { label: "سياسة الخصوصية", href: "/privacy-policy" },
      { label: "شروط الاستخدام", href: "/terms-of-use" },
      { label: "سياسة الاسترجاع", href: "/return-policy" },
    ],
  },
  {
    type: "links",
    title: "التطبيق",
    links: [
      { label: "App Store", href: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.aysar.application" },
    ],
  },
];
```

Note: The circular import is avoided because TypeScript resolves type-only imports at compile time. The `import("@/app/lib/settings-data").FooterColumn` is a type reference, not a runtime import.

Actually, to avoid any circular dependency, use the type inline:

```typescript
interface FooterLinkItem { label: string; href: string; external?: boolean }
interface FooterColumn {
  type: "brand" | "links";
  title: string;
  links?: FooterLinkItem[];
  tagline?: string;
  copyright?: string;
}

export const DEFAULT_FOOTER_COLUMNS: FooterColumn[] = [
  {
    type: "brand",
    title: "أيسَر",
    tagline: "أيسَر برنامج لإدارة العقارات وتتبع مراحل الإنشاء من أول طوبة لآخر لمسة.",
    copyright: "© 2026 مؤسسة أيسر المتطورة لتقنية المعلومات · رقم السجل التجاري: 4030620045",
  },
  {
    type: "links",
    title: "روابط سريعة",
    links: [
      { label: "الرئيسية", href: "/" },
      { label: "الأسعار", href: "/plans" },
      { label: "اتصل بنا", href: "/contact" },
    ],
  },
  {
    type: "links",
    title: "المساعدة",
    links: [
      { label: "تسجيل دخول", href: "https://platform.aysar.sa/ar/company/dashboard/login", external: true },
      { label: "مركز المساعدة", href: "https://support.aysar.sa/", external: true },
      { label: "التحديثات", href: "https://support.aysar.sa/page/update", external: true },
      { label: "سياسة الخصوصية", href: "/privacy-policy" },
      { label: "شروط الاستخدام", href: "/terms-of-use" },
      { label: "سياسة الاسترجاع", href: "/return-policy" },
    ],
  },
  {
    type: "links",
    title: "التطبيق",
    links: [
      { label: "App Store", href: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.aysar.application" },
    ],
  },
];

export const APP_LINKS_DEFAULTS = {
  appStoreUrl: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone",
  googlePlayUrl: "https://play.google.com/store/apps/details?id=com.aysar.application",
};
```

- [ ] **Step 3: Verify types compile**

Run: `cd /home/mohamed/Documents/Apps/aysar-app && npx tsc --noEmit 2>&1 | head -30`

---

### Task 3: Update API Handlers

**Files:**
- Modify: `app/api/settings/handlers.ts`

- [ ] **Step 1: Update the API handlers for the new schema**

Replace the entire `app/api/settings/handlers.ts` with:

```typescript
import type { Response } from "express";
import { prisma } from "@/app/lib/db";
import { settingsUpdateSchema } from "@/app/lib/shared-types";
import type { AuthenticatedRequest, ApiResponse } from "@/app/lib/shared-types";
import { SITE_SETTINGS, NAV_LINKS, SOCIAL_LINKS, APP_LINKS_DEFAULTS, DEFAULT_FOOTER_COLUMNS } from "@/app/lib/dashboard/placeholders";

const DEFAULTS = {
  siteTitle: SITE_SETTINGS.siteTitle,
  siteDescription: SITE_SETTINGS.siteDescription,
  faviconUrl: SITE_SETTINGS.faviconUrl,
  seoKeywords: SITE_SETTINGS.seoKeywords,
  navLinks: NAV_LINKS,
  socialLinks: SOCIAL_LINKS,
  appLinks: APP_LINKS_DEFAULTS,
  footerColumns: DEFAULT_FOOTER_COLUMNS,
};

function deepMerge<T extends Record<string, unknown>>(existing: T, incoming: Partial<T>): T {
  const result = { ...existing };
  for (const key of Object.keys(incoming) as (keyof T)[]) {
    const incomingVal = incoming[key];
    const existingVal = result[key];
    if (
      incomingVal !== null &&
      incomingVal !== undefined &&
      typeof incomingVal === "object" &&
      !Array.isArray(incomingVal) &&
      typeof existingVal === "object" &&
      existingVal !== null &&
      !Array.isArray(existingVal)
    ) {
      result[key] = deepMerge(existingVal as Record<string, unknown>, incomingVal as Record<string, unknown>) as T[keyof T];
    } else if (incomingVal !== undefined) {
      result[key] = incomingVal as T[keyof T];
    }
  }
  return result;
}

export async function getSettingsHandler(
  _req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> {
  let row = await prisma.siteSettings.findUnique({ where: { id: "SETTINGS" } });

  if (!row) {
    res.json({ success: true, data: { ...DEFAULTS, id: "SETTINGS", updatedAt: new Date().toISOString() } });
    return;
  }

  res.json({ success: true, data: row });
}

export async function updateSettingsHandler(
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> {
  const parsed = settingsUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, error: "بيانات غير صالحة" });
    return;
  }

  const existing = await prisma.siteSettings.findUnique({ where: { id: "SETTINGS" } });
  const current = existing ? (existing as unknown as Record<string, unknown>) : (DEFAULTS as unknown as Record<string, unknown>);

  const merged = deepMerge(current, parsed.data as Record<string, unknown>);

  const page = await prisma.siteSettings.upsert({
    where: { id: "SETTINGS" },
    create: { id: "SETTINGS", ...merged },
    update: merged,
  });

  res.json({ success: true, data: page });
}
```

---

### Task 4: Update Footer Component

**Files:**
- Modify: `app/components/Footer.tsx`
- Modify: `app/(public)/layout.tsx`

- [ ] **Step 1: Update `app/components/Footer.tsx`**

Replace the entire file with:

```tsx
"use client";

import Link from "next/link";
import Image from "next/image";
import type { SocialInfo, AppLinkInfo, FooterColumn, FooterLinkItem } from "@/app/lib/settings-data";

interface FooterProps {
  columns: FooterColumn[];
  socialLinks: SocialInfo;
  appLinks: AppLinkInfo;
}

function WhatsAppIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>;
}
function XIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}
function InstagramIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>;
}
function TikTokIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.89 2.89 2.89 0 012.88-2.89c.3 0 .58.05.85.13V9.4a6.37 6.37 0 00-.85-.06A6.34 6.34 0 003 15.68a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.06a8.16 8.16 0 004.77 1.53V7.14a4.82 4.82 0 01-1.46-.45z" /></svg>;
}

const SOCIAL_ICONS: Record<string, { label: string; href: (s: SocialInfo) => string }> = {
  whatsapp: { label: "واتساب", href: (s) => `https://wa.me/${s.whatsappNumber}` },
  x: { label: "X", href: (s) => s.xUrl },
  instagram: { label: "إنستغرام", href: (s) => s.instagramUrl },
  tiktok: { label: "تيك توك", href: (s) => s.tiktokUrl },
};

const SOCIAL_ICON_MAP: Record<string, typeof WhatsAppIcon> = {
  whatsapp: WhatsAppIcon,
  x: XIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
};

export default function Footer({ columns, socialLinks, appLinks }: FooterProps) {
  return (
    <footer className="bg-[#0c2954] pt-14 pb-0">
      <div className="container-aysar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-10 border-b border-white/[0.08]">
          {columns.map((col, idx) => {
            if (col.type === "brand") {
              return (
                <div key={idx}>
                  <Link href="/" className="inline-block mb-4">
                    <Image
                      src="/logo.png"
                      alt="أيسَر"
                      width={100}
                      height={34}
                      className="h-[34px] w-auto object-contain brightness-[5]"
                      priority
                    />
                  </Link>
                  {col.tagline && (
                    <p className="text-[14px] text-white/45 leading-relaxed max-w-[260px] mb-5">
                      {col.tagline}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    {Object.entries(SOCIAL_ICONS).map(([key, cfg]) => {
                      const IconComp = SOCIAL_ICON_MAP[key];
                      if (!IconComp) return null;
                      return (
                        <a
                          key={key}
                          href={cfg.href(socialLinks)}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={cfg.label}
                          className="w-[34px] h-[34px] rounded-lg bg-white/[0.07] border border-white/[0.1] flex items-center justify-center transition-colors hover:bg-white/[0.14]"
                        >
                          <IconComp className="w-4 h-4 text-white" />
                        </a>
                      );
                    })}
                  </div>
                </div>
              );
            }

            return (
              <div key={idx}>
                <h4 className="text-[11px] font-bold text-white/35 tracking-wide uppercase mb-4">{col.title}</h4>
                {col.links && col.links.length > 0 && (
                  <ul className="flex flex-col gap-2.5">
                    {col.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        {link.external ? (
                          <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/55 hover:text-white transition-colors">
                            {link.label}
                          </a>
                        ) : (
                          <Link href={link.href} className="text-[14px] text-white/55 hover:text-white transition-colors">
                            {link.label}
                          </Link>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom line */}
        <div className="py-5 flex items-center justify-between flex-wrap gap-4">
          <span className="text-[12px] text-white/28">
            {columns.find((c) => c.type === "brand")?.copyright || ""}
          </span>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-[12px] text-white/40 hover:text-white/70 transition-colors">
              الخصوصية
            </Link>
            <Link href="/terms-of-use" className="text-[12px] text-white/40 hover:text-white/70 transition-colors">
              الشروط
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Update `app/(public)/layout.tsx`**

Replace the entire file with:

```typescript
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getSiteSettings } from "@/app/lib/settings-data";

export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <>
      <Navbar navLinks={settings.navLinks} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer
        columns={settings.footerColumns}
        socialLinks={settings.socialLinks}
        appLinks={settings.appLinks}
      />
    </>
  );
}
```

---

### Task 5: Create LinkListEditor Component

**Files:**
- Create: `app/components/dashboard/LinkListEditor.tsx`

- [ ] **Step 1: Create the LinkListEditor component**

Create `app/components/dashboard/LinkListEditor.tsx` with:

```tsx
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { Input } from "@/app/components/ui/Input";
import { Plus, Trash2 } from "lucide-react";

interface LinkItem { label: string; href: string; external?: boolean }

interface LinkListEditorProps {
  items: LinkItem[];
  onChange: (items: LinkItem[]) => void;
  showExternalToggle?: boolean;
  addLabel?: string;
}

export function LinkListEditor({ items, onChange, showExternalToggle = false, addLabel = "إضافة رابط" }: LinkListEditorProps) {
  const add = () => onChange([...items, { label: "", href: "" }]);
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const update = (idx: number, field: keyof LinkItem, value: string | boolean) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-2">
          <div className="flex-1">
            <Input
              value={item.label}
              onChange={(e) => update(idx, "label", e.target.value)}
              placeholder="اسم الرابط"
            />
          </div>
          <div className="flex-1">
            <Input
              value={item.href}
              onChange={(e) => update(idx, "href", e.target.value)}
              placeholder="الرابط"
            />
          </div>
          {showExternalToggle && (
            <label className="flex items-center gap-1.5 pt-2 whitespace-nowrap cursor-pointer">
              <input
                type="checkbox"
                checked={!!item.external}
                onChange={(e) => update(idx, "external", e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[#d1d5db] text-[#0c2954] focus:ring-[#0c2954]"
              />
              <span className="text-xs text-[#6b7a94]">خارجي</span>
            </label>
          )}
          <DashboardButton
            type="button"
            variant="danger"
            size="icon-sm"
            onClick={() => remove(idx)}
          >
            <Trash2 className="w-4 h-4" />
          </DashboardButton>
        </div>
      ))}
      <DashboardButton type="button" variant="outline" size="sm" onClick={add} className="mt-1">
        <Plus className="w-4 h-4" />
        {addLabel}
      </DashboardButton>
    </div>
  );
}
```

---

### Task 6: Create Settings Layout & Redirect Page

**Files:**
- Create: `app/(dashboard)/dashboard/settings/layout.tsx`
- Modify: `app/(dashboard)/dashboard/settings/page.tsx`

- [ ] **Step 1: Create `app/(dashboard)/dashboard/settings/layout.tsx`**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard/settings/metadata", label: "معلومات الموقع" },
  { href: "/dashboard/settings/navbar", label: "شريط التنقل" },
  { href: "/dashboard/settings/footer", label: "تذييل الموقع" },
  { href: "/dashboard/settings/social", label: "وسائل التواصل" },
  { href: "/dashboard/settings/apps", label: "روابط التطبيق" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6 pb-24">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0c2954] mb-1">الإعدادات العامة</h1>
          <p className="text-sm text-[#6b7a94]">تعديل إعدادات الموقع، التنقل، الفوتر، ووسائل التواصل</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === tab.href
                ? "bg-[#0c2954] text-white"
                : "bg-white border border-[#e8edf5] text-[#6b7a94] hover:bg-[#f5f6f9]"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}
```

- [ ] **Step 2: Replace `app/(dashboard)/dashboard/settings/page.tsx` with redirect**

```tsx
import { redirect } from "next/navigation";

export default function SettingsPage() {
  redirect("/dashboard/settings/metadata");
}
```

---

### Task 7: Create Metadata Settings Page

**Files:**
- Create: `app/(dashboard)/dashboard/settings/metadata/page.tsx`

- [ ] **Step 1: Create the metadata settings page**

Create `app/(dashboard)/dashboard/settings/metadata/page.tsx` with:

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Input, Textarea } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { Loader2 } from "lucide-react";

export default function MetadataSettingsPage() {
  const [data, setData] = useState({
    siteTitle: "",
    siteDescription: "",
    faviconUrl: "",
    seoKeywords: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data) {
          setData({
            siteTitle: json.data.siteTitle || "",
            siteDescription: json.data.siteDescription || "",
            faviconUrl: json.data.faviconUrl || "",
            seoKeywords: json.data.seoKeywords || "",
          });
        }
      } catch { /* keep defaults */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          siteTitle: data.siteTitle,
          siteDescription: data.siteDescription,
          faviconUrl: data.faviconUrl,
          seoKeywords: data.seoKeywords,
        }),
      });
      if (res.ok) {
        setFeedback("تم الحفظ بنجاح");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch { /* silent */ }
    setSaving(false);
  }, [data]);

  if (loading) return (
    <div className="flex items-center justify-center h-[40vh]">
      <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83]" />
    </div>
  );

  return (
    <ContentCard title="معلومات الموقع" subtitle="عنوان ووصف الموقع والSEO">
      <div className="form-grid-2">
        <Input label="عنوان الموقع" value={data.siteTitle} onChange={(e) => setData({ ...data, siteTitle: e.target.value })} />
        <Input label="Favicon URL" value={data.faviconUrl} onChange={(e) => setData({ ...data, faviconUrl: e.target.value })} />
        <Textarea label="وصف الموقع" value={data.siteDescription} onChange={(e) => setData({ ...data, siteDescription: e.target.value })} rows={3} />
        <Textarea label="كلمات مفتاحية (SEO)" value={data.seoKeywords} onChange={(e) => setData({ ...data, seoKeywords: e.target.value })} rows={2} />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-[#1a9a5a]">{feedback}</span>
        <DashboardButton disabled={saving} onClick={handleSave}>
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </DashboardButton>
      </div>
    </ContentCard>
  );
}
```

---

### Task 8: Create Navbar Settings Page

**Files:**
- Create: `app/(dashboard)/dashboard/settings/navbar/page.tsx`

- [ ] **Step 1: Create the navbar settings page**

Create `app/(dashboard)/dashboard/settings/navbar/page.tsx` with:

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { LinkListEditor } from "@/app/components/dashboard/LinkListEditor";
import { Loader2 } from "lucide-react";
import { NAV_LINKS } from "@/app/lib/dashboard/placeholders";

interface NavLinkItem { label: string; href: string }

export default function NavbarSettingsPage() {
  const [links, setLinks] = useState<NavLinkItem[]>(NAV_LINKS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.navLinks) {
          setLinks(json.data.navLinks);
        }
      } catch { /* keep defaults */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ navLinks: links }),
      });
      if (res.ok) {
        setFeedback("تم الحفظ بنجاح");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch { /* silent */ }
    setSaving(false);
  }, [links]);

  if (loading) return (
    <div className="flex items-center justify-center h-[40vh]">
      <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83]" />
    </div>
  );

  return (
    <ContentCard title="شريط التنقل" subtitle="روابط شريط التنقل العلوي — كل رابط له اسم ورابط منفصلين">
      <LinkListEditor items={links} onChange={setLinks} addLabel="إضافة رابط" />
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-[#1a9a5a]">{feedback}</span>
        <DashboardButton disabled={saving} onClick={handleSave}>
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </DashboardButton>
      </div>
    </ContentCard>
  );
}
```

---

### Task 9: Create Footer Settings Page

**Files:**
- Create: `app/(dashboard)/dashboard/settings/footer/page.tsx`

- [ ] **Step 1: Create the footer settings page**

Create `app/(dashboard)/dashboard/settings/footer/page.tsx` with:

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Input, Textarea } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { LinkListEditor } from "@/app/components/dashboard/LinkListEditor";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { DEFAULT_FOOTER_COLUMNS } from "@/app/lib/dashboard/placeholders";
import type { FooterColumn, FooterLinkItem } from "@/app/lib/settings-data";

export default function FooterSettingsPage() {
  const [columns, setColumns] = useState<FooterColumn[]>(DEFAULT_FOOTER_COLUMNS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.footerColumns) {
          setColumns(json.data.footerColumns);
        }
      } catch { /* keep defaults */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ footerColumns: columns }),
      });
      if (res.ok) {
        setFeedback("تم الحفظ بنجاح");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch { /* silent */ }
    setSaving(false);
  }, [columns]);

  const addColumn = () => {
    setColumns([...columns, { type: "links", title: "", links: [] }]);
  };

  const removeColumn = (idx: number) => {
    setColumns(columns.filter((_, i) => i !== idx));
  };

  const updateColumn = (idx: number, updated: FooterColumn) => {
    const next = [...columns];
    next[idx] = updated;
    setColumns(next);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[40vh]">
      <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83]" />
    </div>
  );

  return (
    <div className="space-y-6">
      {columns.map((col, idx) => (
        <ContentCard
          key={idx}
          title={col.type === "brand" ? `العمود ${idx + 1} — ${col.title} (شعار)` : `العمود ${idx + 1} — ${col.title || "بدون عنوان"}`}
          subtitle={col.type === "brand" ? "الشعار والتعريف وحقوق النشر" : `${(col.links || []).length} رابط`}
        >
          <div className="space-y-4">
            <div className="form-grid-2">
              <Input
                label="عنوان العمود"
                value={col.title}
                onChange={(e) => updateColumn(idx, { ...col, title: e.target.value })}
              />
              <select
                value={col.type}
                onChange={(e) => updateColumn(idx, { ...col, type: e.target.value as "brand" | "links" })}
                className="form-control-contact text-sm"
              >
                <option value="brand">شعار وتعريف</option>
                <option value="links">روابط</option>
              </select>
            </div>

            {col.type === "brand" && (
              <>
                <Textarea
                  label="نص التعريف أسفل الشعار"
                  value={col.tagline || ""}
                  onChange={(e) => updateColumn(idx, { ...col, tagline: e.target.value })}
                  rows={2}
                />
                <Textarea
                  label="نص حقوق النشر"
                  value={col.copyright || ""}
                  onChange={(e) => updateColumn(idx, { ...col, copyright: e.target.value })}
                  rows={2}
                />
              </>
            )}

            {(col.type === "links" || (col.type === "brand" && col.links && col.links.length > 0)) && (
              <div>
                <p className="text-xs font-semibold text-[#3a4a60] mb-2">
                  {col.type === "brand" ? "روابط إضافية" : "الروابط"}
                </p>
                <LinkListEditor
                  items={col.links || []}
                  onChange={(links: FooterLinkItem[]) => updateColumn(idx, { ...col, links })}
                  showExternalToggle={true}
                  addLabel="إضافة رابط"
                />
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center justify-between">
            <DashboardButton variant="danger" size="sm" onClick={() => removeColumn(idx)}>
              <Trash2 className="w-4 h-4" />
              حذف العمود
            </DashboardButton>
          </div>
        </ContentCard>
      ))}

      <DashboardButton variant="outline" onClick={addColumn} className="w-full">
        <Plus className="w-4 h-4" />
        إضافة عمود جديد
      </DashboardButton>

      <div className="flex items-center justify-between pt-4 border-t border-[#e8edf5]">
        <span className="text-xs text-[#1a9a5a]">{feedback}</span>
        <DashboardButton disabled={saving} onClick={handleSave}>
          {saving ? "جاري الحفظ..." : "حفظ جميع الأعمدة"}
        </DashboardButton>
      </div>
    </div>
  );
}
```

---

### Task 10: Create Social Settings Page

**Files:**
- Create: `app/(dashboard)/dashboard/settings/social/page.tsx`

- [ ] **Step 1: Create the social settings page**

Create `app/(dashboard)/dashboard/settings/social/page.tsx` with:

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { Loader2 } from "lucide-react";
import { SOCIAL_LINKS } from "@/app/lib/dashboard/placeholders";

interface SocialInfo { xUrl: string; instagramUrl: string; tiktokUrl: string; whatsappNumber: string }

export default function SocialSettingsPage() {
  const [data, setData] = useState<SocialInfo>(SOCIAL_LINKS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.socialLinks) {
          setData(json.data.socialLinks);
        }
      } catch { /* keep defaults */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ socialLinks: data }),
      });
      if (res.ok) {
        setFeedback("تم الحفظ بنجاح");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch { /* silent */ }
    setSaving(false);
  }, [data]);

  if (loading) return (
    <div className="flex items-center justify-center h-[40vh]">
      <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83]" />
    </div>
  );

  return (
    <ContentCard title="وسائل التواصل الاجتماعي" subtitle="روابط حسابات التواصل الاجتماعي">
      <div className="form-grid-2">
        <Input label="X (Twitter)" value={data.xUrl} onChange={(e) => setData({ ...data, xUrl: e.target.value })} />
        <Input label="Instagram" value={data.instagramUrl} onChange={(e) => setData({ ...data, instagramUrl: e.target.value })} />
        <Input label="TikTok" value={data.tiktokUrl} onChange={(e) => setData({ ...data, tiktokUrl: e.target.value })} />
        <Input label="رقم WhatsApp" value={data.whatsappNumber} onChange={(e) => setData({ ...data, whatsappNumber: e.target.value })} />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-[#1a9a5a]">{feedback}</span>
        <DashboardButton disabled={saving} onClick={handleSave}>
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </DashboardButton>
      </div>
    </ContentCard>
  );
}
```

---

### Task 11: Create Apps Settings Page

**Files:**
- Create: `app/(dashboard)/dashboard/settings/apps/page.tsx`

- [ ] **Step 1: Create the apps settings page**

Create `app/(dashboard)/dashboard/settings/apps/page.tsx` with:

```tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { Loader2 } from "lucide-react";
import { APP_LINKS_DEFAULTS } from "@/app/lib/dashboard/placeholders";

interface AppLinkInfo { appStoreUrl: string; googlePlayUrl: string }

export default function AppsSettingsPage() {
  const [data, setData] = useState<AppLinkInfo>(APP_LINKS_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.appLinks) {
          setData(json.data.appLinks);
        }
      } catch { /* keep defaults */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ appLinks: data }),
      });
      if (res.ok) {
        setFeedback("تم الحفظ بنجاح");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch { /* silent */ }
    setSaving(false);
  }, [data]);

  if (loading) return (
    <div className="flex items-center justify-center h-[40vh]">
      <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83]" />
    </div>
  );

  return (
    <ContentCard title="روابط التطبيق" subtitle="روابط تحميل التطبيق من المتاجر">
      <div className="form-grid-2">
        <Input label="App Store" value={data.appStoreUrl} onChange={(e) => setData({ ...data, appStoreUrl: e.target.value })} />
        <Input label="Google Play" value={data.googlePlayUrl} onChange={(e) => setData({ ...data, googlePlayUrl: e.target.value })} />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-[#1a9a5a]">{feedback}</span>
        <DashboardButton disabled={saving} onClick={handleSave}>
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </DashboardButton>
      </div>
    </ContentCard>
  );
}
```

---

### Task 12: Update Dashboard Sidebar

**Files:**
- Modify: `app/components/dashboard/DashboardSidebar.tsx:84-95`

- [ ] **Step 1: Update the settings subItems to use real routes**

In `app/components/dashboard/DashboardSidebar.tsx`, change the settings navItem's subItems from:

```typescript
    subItems: [
      { href: "/dashboard/settings#metadata", label: "معلومات الموقع" },
      { href: "/dashboard/settings#navbar", label: "شريط التنقل" },
      { href: "/dashboard/settings#footer", label: "تذييل الموقع" },
      { href: "/dashboard/settings#socials", label: "وسائل التواصل" },
      { href: "/dashboard/settings#apps", label: "روابط التطبيق" },
    ],
```

to:

```typescript
    subItems: [
      { href: "/dashboard/settings/metadata", label: "معلومات الموقع" },
      { href: "/dashboard/settings/navbar", label: "شريط التنقل" },
      { href: "/dashboard/settings/footer", label: "تذييل الموقع" },
      { href: "/dashboard/settings/social", label: "وسائل التواصل" },
      { href: "/dashboard/settings/apps", label: "روابط التطبيق" },
    ],
```

Also update the sidebar's active state logic. In the `NavItemComponent`, update the sub-items to properly highlight the active sub-item. Change the `isSubActive` logic from:

```typescript
const isSubActive = false; // Could check hash
```

to:

```typescript
const isSubActive = pathname === sub.href;
```

---

### Task 13: Verify Build & Run Lint

- [ ] **Step 1: Run TypeScript type-check**

Run: `cd /home/mohamed/Documents/Apps/aysar-app && npx tsc --noEmit 2>&1 | head -50`

Fix any type errors found.

- [ ] **Step 2: Run ESLint**

Run: `cd /home/mohamed/Documents/Apps/aysar-app && pnpm lint 2>&1 | head -50`

Fix any lint errors found.

- [ ] **Step 3: Run build**

Run: `cd /home/mohamed/Documents/Apps/aysar-app && pnpm build 2>&1 | tail -30`

Fix any build errors found.

---

### Task 14: Data Migration (Runtime)

If the database already has data in the old `footerQuickLinks`/`footerHelpLinks`/`footerTagline`/`footerCopyright` columns, we need a one-time migration. Since we're removing those columns from the schema, the Prisma migration will handle the DB schema change, but we need to migrate the data first.

**Strategy:** Before running the Prisma migration, create a migration script that:

1. Reads the existing settings row
2. Constructs `footerColumns` from the old data
3. Updates the row with the new `footerColumns` field
4. Then Prisma migration drops the old columns

Since this is a development project and likely has minimal data, we can handle this as a seed script or manual step.

- [ ] **Step 1: Create a migration seed script at `scripts/migrate-footer-columns.ts`**

```typescript
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const FOOTER_QUICK = [
  { label: "الرئيسية", href: "/" },
  { label: "الأسعار", href: "/plans" },
  { label: "اتصل بنا", href: "/contact" },
];

const FOOTER_HELP = [
  { label: "تسجيل دخول", href: "https://platform.aysar.sa/ar/company/dashboard/login", external: true },
  { label: "مركز المساعدة", href: "https://support.aysar.sa/", external: true },
  { label: "التحديثات", href: "https://support.aysar.sa/page/update", external: true },
  { label: "سياسة الخصوصية", href: "/privacy-policy" },
  { label: "شروط الاستخدام", href: "/terms-of-use" },
  { label: "سياسة الاسترجاع", href: "/return-policy" },
];

const DEFAULT_COPYRIGHT = "© 2026 مؤسسة أيسر المتطورة لتقنية المعلومات · رقم السجل التجاري: 4030620045";
const DEFAULT_TAGLINE = "أيسَر برنامج لإدارة العقارات وتتبع مراحل الإنشاء من أول طوبة لآخر لمسة.";

async function main() {
  const existing = await prisma.siteSettings.findUnique({ where: { id: "SETTINGS" } });

  if (!existing) {
    console.log("No existing settings found, creating defaults...");
    await prisma.siteSettings.create({
      data: {
        id: "SETTINGS",
        footerColumns: [
          { type: "brand", title: "أيسَر", tagline: DEFAULT_TAGLINE, copyright: DEFAULT_COPYRIGHT },
          { type: "links", title: "روابط سريعة", links: FOOTER_QUICK },
          { type: "links", title: "المساعدة", links: FOOTER_HELP },
          { type: "links", title: "التطبيق", links: [
            { label: "App Store", href: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone" },
            { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.aysar.application" },
          ] },
        ],
      },
    });
    console.log("Done!");
    return;
  }

  // Construct footerColumns from old data if it exists
  const row = existing as any;
  const quickLinks = row.footerQuickLinks || FOOTER_QUICK;
  const helpLinks = row.footerHelpLinks || FOOTER_HELP;
  const tagline = row.footerTagline || DEFAULT_TAGLINE;
  const copyright = row.footerCopyright || DEFAULT_COPYRIGHT;

  const footerColumns = [
    { type: "brand", title: "أيسَر", tagline, copyright },
    { type: "links", title: "روابط سريعة", links: quickLinks },
    { type: "links", title: "المساعدة", links: helpLinks },
    { type: "links", title: "التطبيق", links: [
      { label: "App Store", href: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone" },
      { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.aysar.application" },
    ] },
  ];

  await prisma.siteSettings.upsert({
    where: { id: "SETTINGS" },
    create: { id: "SETTINGS", footerColumns },
    update: { footerColumns },
  });

  console.log("Migration complete! footerColumns set.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
```

- [ ] **Step 2: Run the migration script BEFORE the Prisma schema change**

Run: `cd /home/mohamed/Documents/Apps/aysar-app && npx tsx scripts/migrate-footer-columns.ts`

Note: This must be run while the old columns still exist in the DB. After this runs, the data is safely in `footerColumns`, and then we can change the Prisma schema.

**IMPORTANT ORDER:**
1. Run the migration script (with old schema still in place, but `footerColumns` added as a new column alongside the old ones)
2. Then update the Prisma schema (remove old columns)
3. Run `prisma migrate dev` to apply the schema change

Actually, we need to do this in two steps:
1. First: Add `footerColumns` column (keep old columns), migrate data
2. Second: Remove old columns

So the approach is:
1. Add `footerColumns Json @default("[]") @map("footer_columns")` to schema WHILE keeping old columns
2. Run `prisma migrate dev` — this adds the new column
3. Run the migration script to populate `footerColumns`
4. Then remove the old columns from schema
5. Run `prisma migrate dev` again — this drops the old columns

We'll simplify this in execution.