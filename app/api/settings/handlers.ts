import type { Response } from "express";
import { prisma } from "@/app/lib/db";
import { settingsUpdateSchema } from "@/app/lib/shared-types";
import type { AuthenticatedRequest, ApiResponse } from "@/app/lib/shared-types";
import { SITE_SETTINGS, NAV_LINKS, SOCIAL_LINKS, APP_LINKS_DEFAULTS, DEFAULT_FOOTER_COLUMNS, SITE_CONTACT_INFO, PLATFORM_LINKS, WORK_HOURS } from "@/app/lib/dashboard/placeholders";

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
  const row = await prisma.siteSettings.findUnique({ where: { id: "SETTINGS" } });

  if (!row) {
    const data = { ...DEFAULTS, id: "SETTINGS", updatedAt: new Date().toISOString(), socialLinks: [...SOCIAL_LINKS] };
    res.json({ success: true, data });
    return;
  }

  res.json({
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

  res.json({
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