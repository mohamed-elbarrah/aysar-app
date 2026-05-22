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
  const row = await prisma.siteSettings.findUnique({ where: { id: "SETTINGS" } });

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