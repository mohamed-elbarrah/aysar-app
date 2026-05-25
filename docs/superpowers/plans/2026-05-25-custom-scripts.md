# Custom Scripts Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add custom script injection feature allowing admin to add HTML/JS code to public page head and body sections via dashboard settings.

**Architecture:** Extend existing `site_settings` table with `head_scripts` and `body_scripts` columns. Create new dashboard settings tab. Modify public layout to inject scripts using `dangerouslySetInnerHTML`.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase, Tailwind CSS

---

## File Structure

**Database:**
- `scripts/add-custom-scripts-columns.sql` - Migration to add columns

**Backend:**
- `app/api/settings/route.ts` - Extend GET/PATCH handlers
- `app/lib/settings-data.ts` - Update types and getSiteSettings function

**Frontend (Public):**
- `app/(public)/layout.tsx` - Inject scripts into head and body

**Frontend (Dashboard):**
- `app/(dashboard)/dashboard/settings/layout.tsx` - Add new tab
- `app/(dashboard)/dashboard/settings/scripts/page.tsx` - New settings page

---

## Task 1: Database Migration

**Files:**
- Create: `scripts/add-custom-scripts-columns.sql`

**Goal:** Add `head_scripts` and `body_scripts` columns to `site_settings` table

- [ ] **Step 1: Create migration file**

```sql
-- Add custom scripts columns to site_settings table
-- Run this in Supabase SQL Editor

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS head_scripts TEXT DEFAULT '';

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS body_scripts TEXT DEFAULT '';

-- Verify columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'site_settings' 
AND column_name IN ('head_scripts', 'body_scripts');
```

- [ ] **Step 2: Apply migration to database**

Run the SQL in Supabase SQL Editor or execute via psql.

**Verification:**
```sql
SELECT head_scripts, body_scripts FROM site_settings WHERE id = 'SETTINGS';
-- Should return empty strings (not null)
```

- [ ] **Step 3: Commit migration file**

```bash
git add scripts/add-custom-scripts-columns.sql
git commit -m "chore: add custom scripts columns to site_settings table"
```

---

## Task 2: Update Settings Data Types

**Files:**
- Modify: `app/lib/settings-data.ts`

**Goal:** Add `head_scripts` and `body_scripts` to TypeScript interfaces and data functions

- [ ] **Step 1: Update SiteSettingsResponse interface**

Add these fields to the interface (around line 35):

```typescript
export interface SiteSettingsResponse {
  id: string;
  siteTitle: string;
  siteDescription: string;
  faviconUrl: string | null;
  seoKeywords: string;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  appLinks: AppLinkInfo;
  footerColumns: FooterColumn[];
  contactInfo: ContactInfo;
  platformLinks: PlatformLinks;
  workHours: WorkHours;
  headScripts: string;  // NEW
  bodyScripts: string;  // NEW
  updatedAt: string;
}
```

- [ ] **Step 2: Update getSiteSettings function - default return**

Update the default return object (around line 81) to include the new fields:

```typescript
if (!row) {
  return {
    id: "SETTINGS",
    siteTitle: SITE_SETTINGS.siteTitle,
    siteDescription: SITE_SETTINGS.siteDescription,
    faviconUrl: SITE_SETTINGS.faviconUrl,
    seoKeywords: SITE_SETTINGS.seoKeywords,
    navLinks: [...NAV_LINKS],
    socialLinks: [...SOCIAL_LINKS],
    appLinks: { ...APP_LINKS_DEFAULTS },
    footerColumns: [...DEFAULT_FOOTER_COLUMNS],
    contactInfo: { ...SITE_CONTACT_INFO },
    platformLinks: { ...PLATFORM_LINKS },
    workHours: { ...WORK_HOURS },
    headScripts: "",  // NEW
    bodyScripts: "",  // NEW
    updatedAt: new Date().toISOString(),
  };
}
```

- [ ] **Step 3: Update getSiteSettings function - data mapping**

Update the return statement at the end (around line 98) to map the new fields:

```typescript
return {
  id: row.id,
  siteTitle: row.site_title,
  siteDescription: row.site_description,
  faviconUrl: row.favicon_url,
  seoKeywords: row.seo_keywords,
  navLinks: safeJsonArray<NavLink>(row.nav_links, NAV_LINKS),
  socialLinks: normalizeSocialLinks(row.social_links),
  appLinks: (row.app_links && typeof row.app_links === "object" && !Array.isArray(row.app_links)
    ? row.app_links
    : APP_LINKS_DEFAULTS) as unknown as AppLinkInfo,
  footerColumns: safeJsonArray<FooterColumn>(row.footer_columns, DEFAULT_FOOTER_COLUMNS),
  contactInfo: safeJsonField<ContactInfo>(row.contact_info, SITE_CONTACT_INFO),
  platformLinks: safeJsonField<PlatformLinks>(row.platform_links, PLATFORM_LINKS),
  workHours: safeJsonField<WorkHours>(row.work_hours, WORK_HOURS),
  headScripts: row.head_scripts || "",  // NEW
  bodyScripts: row.body_scripts || "",  // NEW
  updatedAt: row.updated_at,
};
```

- [ ] **Step 4: Commit changes**

```bash
git add app/lib/settings-data.ts
git commit -m "feat(settings): add head_scripts and body_scripts to types"
```

---

## Task 3: Update API Endpoints

**Files:**
- Modify: `app/api/settings/route.ts`

**Goal:** Extend GET and PATCH handlers to include script fields

- [ ] **Step 1: Read current API file**

```bash
cat app/api/settings/route.ts
```

- [ ] **Step 2: Update GET handler response**

Add `headScripts` and `bodyScripts` to the response object in the GET handler:

```typescript
return NextResponse.json({
  success: true,
  data: {
    siteTitle: settings.siteTitle,
    siteDescription: settings.siteDescription,
    faviconUrl: settings.faviconUrl,
    seoKeywords: settings.seoKeywords,
    navLinks: settings.navLinks,
    socialLinks: settings.socialLinks,
    appLinks: settings.appLinks,
    footerColumns: settings.footerColumns,
    contactInfo: settings.contactInfo,
    platformLinks: settings.platformLinks,
    workHours: settings.workHours,
    headScripts: settings.headScripts,  // NEW
    bodyScripts: settings.bodyScripts,  // NEW
  },
});
```

- [ ] **Step 3: Update PATCH handler**

Add script fields to the destructuring and upsert operation:

Find the destructuring (around where body is parsed):
```typescript
const {
  siteTitle,
  siteDescription,
  faviconUrl,
  seoKeywords,
  navLinks,
  socialLinks,
  appLinks,
  footerColumns,
  contactInfo,
  platformLinks,
  workHours,
  headScripts,  // NEW
  bodyScripts,  // NEW
} = body;
```

Update the upsert data object:
```typescript
const upsertData: Record<string, unknown> = {
  id: "SETTINGS",
  site_title: siteTitle,
  site_description: siteDescription,
  favicon_url: faviconUrl,
  seo_keywords: seoKeywords,
  nav_links: navLinks,
  social_links: socialLinks,
  app_links: appLinks,
  footer_columns: footerColumns,
  contact_info: contactInfo,
  platform_links: platformLinks,
  work_hours: workHours,
  head_scripts: headScripts || "",  // NEW
  body_scripts: bodyScripts || "",  // NEW
};
```

- [ ] **Step 4: Commit changes**

```bash
git add app/api/settings/route.ts
git commit -m "feat(api): support head_scripts and body_scripts in settings endpoints"
```

---

## Task 4: Update Public Layout to Inject Scripts

**Files:**
- Modify: `app/(public)/layout.tsx`
- Create: `app/components/CustomScripts.tsx` (optional - if using client component approach)

**Goal:** Inject custom scripts into public pages head and body

- [ ] **Step 1: Read current public layout**

```bash
cat app/(public)/layout.tsx
```

- [ ] **Step 2: Update imports and make layout async**

Update the layout to be async and import `getSiteSettings`:

```typescript
import type { Metadata } from "next";
import { Noto_Kufi_Arabic } from "next/font/google";
import "../globals.css";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import { getSiteSettings } from "../lib/settings-data";

export const dynamic = "force-dynamic";

const notoKufi = Noto_Kufi_Arabic({
  variable: "--font-noto-kufi",
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings.siteTitle,
    description: settings.siteDescription,
    keywords: settings.seoKeywords,
    icons: settings.faviconUrl ? { icon: settings.faviconUrl } : undefined,
  };
}
```

- [ ] **Step 3: Update layout component to async and inject scripts**

Make the layout async and add script injection:

```typescript
export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSiteSettings();

  return (
    <html lang="ar" dir="rtl" className={`${notoKufi.variable} h-full antialiased`}>
      <head>
        {/* Inject custom head scripts */}
        {settings.headScripts && (
          <script dangerouslySetInnerHTML={{ __html: settings.headScripts }} />
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        
        {/* Inject custom body scripts at the end */}
        {settings.bodyScripts && (
          <script dangerouslySetInnerHTML={{ __html: settings.bodyScripts }} />
        )}
      </body>
    </html>
  );
}
```

**Note:** If the current layout doesn't have `Navbar` and `Footer`, keep the existing structure and just add the script injection points.

- [ ] **Step 4: Commit changes**

```bash
git add app/(public)/layout.tsx
git commit -m "feat(layout): inject custom scripts in public pages"
```

---

## Task 5: Add Scripts Tab to Settings Navigation

**Files:**
- Modify: `app/(dashboard)/dashboard/settings/layout.tsx`

**Goal:** Add "كود مخصص" (Custom Code) tab to settings navigation

- [ ] **Step 1: Read current layout file**

```bash
cat app/(dashboard)/dashboard/settings/layout.tsx
```

- [ ] **Step 2: Add new tab to TABS array**

Add the scripts tab to the TABS array. Suggested position: after "ساعات العمل" (hours):

```typescript
const TABS = [
  { href: "/dashboard/settings/metadata", label: "معلومات الموقع" },
  { href: "/dashboard/settings/navbar", label: "شريط التنقل" },
  { href: "/dashboard/settings/footer", label: "تذييل الموقع" },
  { href: "/dashboard/settings/social", label: "وسائل التواصل" },
  { href: "/dashboard/settings/apps", label: "روابط التطبيق" },
  { href: "/dashboard/settings/contact", label: "معلومات الاتصال" },
  { href: "/dashboard/settings/platform", label: "روابط المنصة" },
  { href: "/dashboard/settings/hours", label: "ساعات العمل" },
  { href: "/dashboard/settings/scripts", label: "كود مخصص" },  // NEW
];
```

- [ ] **Step 3: Commit changes**

```bash
git add app/(dashboard)/dashboard/settings/layout.tsx
git commit -m "feat(settings): add custom code tab to settings navigation"
```

---

## Task 6: Create Scripts Settings Page

**Files:**
- Create: `app/(dashboard)/dashboard/settings/scripts/page.tsx`

**Goal:** Create dashboard page for editing custom scripts

- [ ] **Step 1: Create the page file with full implementation**

```typescript
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Textarea } from "@/app/components/ui/Input";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { SaveBar } from "@/app/components/dashboard/SaveBar";
import { Loader2, Code, AlertTriangle } from "lucide-react";

export default function ScriptsSettingsPage() {
  const [data, setData] = useState({
    headScripts: "",
    bodyScripts: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [savedData, setSavedData] = useState(data);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data) {
          const loaded = {
            headScripts: json.data.headScripts || "",
            bodyScripts: json.data.bodyScripts || "",
          };
          setData(loaded);
          setSavedData(loaded);
        }
      } catch {
        /* keep defaults */
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(savedData) !== JSON.stringify(data),
    [savedData, data]
  );

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          headScripts: data.headScripts,
          bodyScripts: data.bodyScripts,
        }),
      });
      if (res.ok) {
        setSavedData(JSON.parse(JSON.stringify(data)));
        setLastSaved(new Date().toLocaleTimeString("ar-SA"));
        setTimeout(() => setLastSaved(null), 5000);
      }
    } catch {
      /* silent */
    }
    setSaving(false);
  }, [data]);

  const handleReset = useCallback(() => {
    setData(JSON.parse(JSON.stringify(savedData)));
  }, [savedData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">
            تحذير أمني
          </p>
          <p className="text-sm text-amber-700 mt-1">
            الكود المخصص يسمح بتنفيذ أي JavaScript في المتصفح. تأكد من فهم ما تقوم بلصقه هنا.
            
            <strong>لا تنسخ كوداً من مصادر غير موثوقة.</strong>
          </p>
        </div>
      </div>

      <ContentCard title="كود مخصص" subtitle="أضف أكواد JavaScript أو HTML مخصصة للصفحات العامة">
        <div className="space-y-6">
          {/* Head Scripts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-[#0c2954]">
                <Code className="w-4 h-4" />
                أكواد في الهيد (Head)
              </label>
              <span className="text-xs text-[#6b7a94]">
                يُحقن قبل &lt;/head&gt;
              </span>
            </div>
            <Textarea
              value={data.headScripts}
              onChange={(e) =>
                setData((prev) => ({ ...prev, headScripts: e.target.value }))
              }
              rows={8}
              placeholder="&lt;!-- Google Analytics --&gt;
&lt;script async src=&quot;https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID&quot;&gt;&lt;/script&gt;
&lt;script&gt;
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_TRACKING_ID');
&lt;/script&gt;"
              className="font-mono text-sm"
            />
            <p className="text-xs text-[#6b7a94]">
              استخدم هذا لإضافة أكواد التتبع، الميتا تاغ، أو CSS مخصص
            </p>
          </div>

          {/* Body Scripts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-[#0c2954]">
                <Code className="w-4 h-4" />
                أكواد في نهاية الصفحة (Body)
              </label>
              <span className="text-xs text-[#6b7a94]">
                يُحقن قبل &lt;/body&gt;
              </span>
            </div>
            <Textarea
              value={data.bodyScripts}
              onChange={(e) =>
                setData((prev) => ({ ...prev, bodyScripts: e.target.value }))
              }
              rows={8}
              placeholder="&lt;!-- Chat Widget --&gt;
&lt;script&gt;
  // كود ودجت الدردشة هنا
&lt;/script&gt;"
              className="font-mono text-sm"
            />
            <p className="text-xs text-[#6b7a94]">
              استخدم هذا لإضافة ودجت الدردشة، النوافذ المنبثقة، أو أكواد بعد تحميل الصفحة
            </p>
          </div>
        </div>

        <SaveBar
          isDirty={isDirty}
          isSubmitting={saving}
          onSave={handleSave}
          onReset={handleReset}
          lastSaved={lastSaved}
        />
      </ContentCard>

      {/* Help Section */}
      <div className="bg-[#f5f6f9] rounded-lg p-4">
        <h4 className="text-sm font-medium text-[#0c2954] mb-2">أمثلة على الاستخدام:</h4>
        <ul className="text-sm text-[#6b7a94] space-y-1 list-disc list-inside">
          <li>Google Analytics أو Google Tag Manager</li>
          <li>Facebook Pixel للتتبع</li>
          <li>ودجت دردشة (WhatsApp, Intercom, tawk.to)</li>
          <li>أكواد SEO مخصصة (Schema markup)</li>
          <li>CSS مخصص لتغيير مظهر الموقع</li>
        </ul>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Commit the new page**

```bash
git add app/(dashboard)/dashboard/settings/scripts/page.tsx
git commit -m "feat(settings): add custom scripts settings page"
```

---

## Task 7: Testing & Verification

**Files:**
- All modified files

**Goal:** Verify the feature works end-to-end

- [ ] **Step 1: Start development server**

```bash
pnpm dev
```

- [ ] **Step 2: Test the API**

Open browser console or use curl:

```bash
# Test GET endpoint
curl http://localhost:3000/api/settings | jq
# Should include headScripts and bodyScripts (empty strings)
```

- [ ] **Step 3: Test the Dashboard UI**

1. Login to dashboard
2. Navigate to: `/dashboard/settings/scripts`
3. Verify:
   - Page loads without errors
   - Two textarea fields are visible
   - Security warning is displayed
   - Save button is initially disabled

- [ ] **Step 4: Test saving scripts**

1. Paste test script in Head Scripts:
   ```html
   <script>console.log('Head script loaded');</script>
   ```
2. Paste test script in Body Scripts:
   ```html
   <script>console.log('Body script loaded');</script>
   ```
3. Click Save
4. Verify success message appears
5. Refresh page - scripts should persist

- [ ] **Step 5: Verify scripts in public pages**

1. Open a public page (e.g., `/`)
2. Open browser DevTools
3. Check Console - should see "Head script loaded" and "Body script loaded"
4. Check Elements tab:
   - Head script should be in `<head>` section
   - Body script should be at end of `<body>`

- [ ] **Step 6: Test edge cases**

1. Save with empty scripts - should work
2. Save with very long script - should work
3. Save with Arabic text in scripts - should preserve encoding
4. Save with special characters (`<`, `>`, `&`, `"`, `'`) - should work

- [ ] **Step 7: Run build check**

```bash
pnpm build
```

Should complete without errors.

- [ ] **Step 8: Run lint check**

```bash
pnpm lint
```

Should pass without errors.

- [ ] **Step 9: Final commit**

```bash
git add .
git commit -m "feat: custom scripts feature complete

- Add head_scripts and body_scripts columns to site_settings
- Update API to handle script fields
- Inject scripts in public layout
- Add dashboard settings page with security warnings
- Tested and verified working"
```

---

## Summary

After completing all tasks:

1. ✅ Database has two new columns: `head_scripts` and `body_scripts`
2. ✅ API endpoints support reading/writing script fields
3. ✅ Public layout injects scripts into head and body
4. ✅ Dashboard has new "كود مخصص" tab
5. ✅ Admin can add custom HTML/JS code via textarea fields
6. ✅ Security warning displayed to users

**Files Modified:**
- `app/lib/settings-data.ts` - TypeScript types updated
- `app/api/settings/route.ts` - API endpoints updated
- `app/(public)/layout.tsx` - Script injection added
- `app/(dashboard)/dashboard/settings/layout.tsx` - New tab added

**Files Created:**
- `scripts/add-custom-scripts-columns.sql` - Database migration
- `app/(dashboard)/dashboard/settings/scripts/page.tsx` - Settings page

**No Breaking Changes:** All existing functionality continues to work. New fields default to empty strings.
