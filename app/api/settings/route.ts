import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/db";
import { settingsUpdateSchema } from "@/app/lib/shared-types";
import { deepMerge, requireAdmin } from "@/app/lib/api-utils";
import {
  SITE_SETTINGS,
  NAV_LINKS,
  SOCIAL_LINKS,
  APP_LINKS_DEFAULTS,
  DEFAULT_FOOTER_COLUMNS,
  SITE_CONTACT_INFO,
  PLATFORM_LINKS,
  WORK_HOURS,
} from "@/app/lib/dashboard/placeholders";

interface SocialLink { key: string; label: string; url: string; iconUrl?: string }

function normalizeSocialLinks(raw: unknown): SocialLink[] {
  if (Array.isArray(raw)) return raw as SocialLink[];
  if (raw && typeof raw === "object") {
    const old = raw as Record<string, string>;
    const links: SocialLink[] = [];
    if (old.xUrl) links.push({ key: "x", label: "X (Twitter)", url: old.xUrl });
    if (old.instagramUrl) links.push({ key: "instagram", label: "Instagram", url: old.instagramUrl });
    if (old.tiktokUrl) links.push({ key: "tiktok", label: "TikTok", url: old.tiktokUrl });
    if (links.length > 0) return links;
  }
  return [...SOCIAL_LINKS];
}

function normalizeObjectField<T>(value: unknown, fallback: T): T {
  if (value && typeof value === "object" && !Array.isArray(value) && Object.keys(value as object).length > 0) {
    return value as T;
  }
  return { ...fallback };
}

const DEFAULTS = {
  site_title: SITE_SETTINGS.siteTitle,
  site_description: SITE_SETTINGS.siteDescription,
  favicon_url: SITE_SETTINGS.faviconUrl,
  seo_keywords: SITE_SETTINGS.seoKeywords,
  nav_links: NAV_LINKS,
  social_links: SOCIAL_LINKS,
  app_links: APP_LINKS_DEFAULTS,
  footer_columns: DEFAULT_FOOTER_COLUMNS,
  contact_info: SITE_CONTACT_INFO,
  platform_links: PLATFORM_LINKS,
  work_hours: WORK_HOURS,
};

function toSnakeCase(data: Record<string, unknown>): Record<string, unknown> {
  const map: Record<string, string> = {
    siteTitle: "site_title",
    siteDescription: "site_description",
    faviconUrl: "favicon_url",
    seoKeywords: "seo_keywords",
    navLinks: "nav_links",
    socialLinks: "social_links",
    appLinks: "app_links",
    footerColumns: "footer_columns",
    contactInfo: "contact_info",
    platformLinks: "platform_links",
    workHours: "work_hours",
  };
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    result[map[key] || key] = val;
  }
  return result;
}

export async function GET() {
  const { data: row } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "SETTINGS")
    .single();

  if (!row) {
    const data = {
      id: "SETTINGS",
      siteTitle: SITE_SETTINGS.siteTitle,
      siteDescription: SITE_SETTINGS.siteDescription,
      faviconUrl: SITE_SETTINGS.faviconUrl,
      seoKeywords: SITE_SETTINGS.seoKeywords,
      navLinks: NAV_LINKS,
      socialLinks: [...SOCIAL_LINKS],
      appLinks: APP_LINKS_DEFAULTS,
      footerColumns: DEFAULT_FOOTER_COLUMNS,
      contactInfo: SITE_CONTACT_INFO,
      platformLinks: PLATFORM_LINKS,
      workHours: WORK_HOURS,
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json({ success: true, data });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: row.id,
      siteTitle: row.site_title,
      siteDescription: row.site_description,
      faviconUrl: row.favicon_url,
      seoKeywords: row.seo_keywords,
      navLinks: Array.isArray(row.nav_links) ? row.nav_links : [...NAV_LINKS],
      socialLinks: normalizeSocialLinks(row.social_links),
      appLinks: normalizeObjectField(row.app_links, APP_LINKS_DEFAULTS),
      footerColumns: Array.isArray(row.footer_columns) ? row.footer_columns : [...DEFAULT_FOOTER_COLUMNS],
      contactInfo: normalizeObjectField(row.contact_info, SITE_CONTACT_INFO),
      platformLinks: normalizeObjectField(row.platform_links, PLATFORM_LINKS),
      workHours: normalizeObjectField(row.work_hours, WORK_HOURS),
      updatedAt: row.updated_at,
    },
  });
}

export async function PATCH(request: NextRequest) {
  const adminResult = requireAdmin(request);
  if (adminResult instanceof NextResponse) return adminResult;

  const body = await request.json();
  const parsed = settingsUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "بيانات غير صالحة" }, { status: 422 });
  }

  const { data: existing } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "SETTINGS")
    .single();

  const current = existing ? (existing as unknown as Record<string, unknown>) : (DEFAULTS as unknown as Record<string, unknown>);

  const merged = deepMerge(current, toSnakeCase(parsed.data as Record<string, unknown>));

  const { data: page, error } = await supabase
    .from("site_settings")
    .upsert({ id: "SETTINGS", ...merged }, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: page.id,
      siteTitle: page.site_title,
      siteDescription: page.site_description,
      faviconUrl: page.favicon_url,
      seoKeywords: page.seo_keywords,
      navLinks: Array.isArray(page.nav_links) ? page.nav_links : [...NAV_LINKS],
      socialLinks: normalizeSocialLinks(page.social_links),
      appLinks: normalizeObjectField(page.app_links, APP_LINKS_DEFAULTS),
      footerColumns: Array.isArray(page.footer_columns) ? page.footer_columns : [...DEFAULT_FOOTER_COLUMNS],
      contactInfo: normalizeObjectField(page.contact_info, SITE_CONTACT_INFO),
      platformLinks: normalizeObjectField(page.platform_links, PLATFORM_LINKS),
      workHours: normalizeObjectField(page.work_hours, WORK_HOURS),
      updatedAt: page.updated_at,
    },
  });
}