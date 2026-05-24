import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
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
  siteTitle: SITE_SETTINGS.siteTitle,
  siteDescription: SITE_SETTINGS.siteDescription,
  faviconUrl: SITE_SETTINGS.faviconUrl,
  seoKeywords: SITE_SETTINGS.seoKeywords,
  navLinks: NAV_LINKS,
  socialLinks: SOCIAL_LINKS,
  appLinks: APP_LINKS_DEFAULTS,
  footerColumns: DEFAULT_FOOTER_COLUMNS,
  contactInfo: SITE_CONTACT_INFO,
  platformLinks: PLATFORM_LINKS,
  workHours: WORK_HOURS,
};

export async function GET() {
  const row = await prisma.siteSettings.findUnique({ where: { id: "SETTINGS" } });

  if (!row) {
    const data = { ...DEFAULTS, id: "SETTINGS", updatedAt: new Date().toISOString(), socialLinks: [...SOCIAL_LINKS] };
    return NextResponse.json({ success: true, data });
  }

  return NextResponse.json({
    success: true,
    data: {
      id: row.id,
      siteTitle: row.siteTitle,
      siteDescription: row.siteDescription,
      faviconUrl: row.faviconUrl,
      seoKeywords: row.seoKeywords,
      navLinks: Array.isArray(row.navLinks) ? row.navLinks : [...NAV_LINKS],
      socialLinks: normalizeSocialLinks(row.socialLinks),
      appLinks: normalizeObjectField(row.appLinks, APP_LINKS_DEFAULTS),
      footerColumns: Array.isArray(row.footerColumns) ? row.footerColumns : [...DEFAULT_FOOTER_COLUMNS],
      contactInfo: normalizeObjectField(row.contactInfo, SITE_CONTACT_INFO),
      platformLinks: normalizeObjectField(row.platformLinks, PLATFORM_LINKS),
      workHours: normalizeObjectField(row.workHours, WORK_HOURS),
      updatedAt: row.updatedAt.toISOString(),
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

  const existing = await prisma.siteSettings.findUnique({ where: { id: "SETTINGS" } });
  const current = existing ? (existing as unknown as Record<string, unknown>) : (DEFAULTS as unknown as Record<string, unknown>);

  const merged = deepMerge(current, parsed.data as Record<string, unknown>);

  const page = await prisma.siteSettings.upsert({
    where: { id: "SETTINGS" },
    create: { id: "SETTINGS", ...merged },
    update: merged,
  });

  return NextResponse.json({
    success: true,
    data: {
      id: page.id,
      siteTitle: page.siteTitle,
      siteDescription: page.siteDescription,
      faviconUrl: page.faviconUrl,
      seoKeywords: page.seoKeywords,
      navLinks: Array.isArray(page.navLinks) ? page.navLinks : [...NAV_LINKS],
      socialLinks: normalizeSocialLinks(page.socialLinks),
      appLinks: normalizeObjectField(page.appLinks, APP_LINKS_DEFAULTS),
      footerColumns: Array.isArray(page.footerColumns) ? page.footerColumns : [...DEFAULT_FOOTER_COLUMNS],
      contactInfo: normalizeObjectField(page.contactInfo, SITE_CONTACT_INFO),
      platformLinks: normalizeObjectField(page.platformLinks, PLATFORM_LINKS),
      workHours: normalizeObjectField(page.workHours, WORK_HOURS),
      updatedAt: page.updatedAt.toISOString(),
    },
  });
}