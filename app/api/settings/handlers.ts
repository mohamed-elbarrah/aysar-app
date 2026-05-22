import type { Response } from "express";
import { prisma } from "@/app/lib/db";
import { settingsUpdateSchema } from "@/app/lib/shared-types";
import type { AuthenticatedRequest, ApiResponse } from "@/app/lib/shared-types";
import { SITE_SETTINGS, NAV_LINKS, SOCIAL_LINKS } from "@/app/lib/dashboard/placeholders";

const APP_LINKS_DEFAULTS = {
  appStoreUrl: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone",
  googlePlayUrl: "https://play.google.com/store/apps/details?id=com.aysar.application",
};

const FOOTER_DEFAULTS = {
  footerCopyright: "© 2026 مؤسسة أيسر المتطورة لتقنية المعلومات · رقم السجل التجاري: 4030620045",
  footerTagline: "أيسَر برنامج لإدارة العقارات وتتبع مراحل الإنشاء من أول طوبة لآخر لمسة.",
  footerQuickLinks: [
    { label: "الرئيسية", href: "/" },
    { label: "الأسعار", href: "/plans" },
    { label: "اتصل بنا", href: "/contact" },
  ],
  footerHelpLinks: [
    { label: "تسجيل دخول", href: "https://platform.aysar.sa/ar/company/dashboard/login", external: true },
    { label: "مركز المساعدة", href: "https://support.aysar.sa/", external: true },
    { label: "التحديثات", href: "https://support.aysar.sa/page/update", external: true },
    { label: "سياسة الخصوصية", href: "/privacy-policy" },
    { label: "شروط الاستخدام", href: "/terms-of-use" },
    { label: "سياسة الاسترجاع", href: "/return-policy" },
  ],
};

const DEFAULTS = {
  siteTitle: SITE_SETTINGS.siteTitle,
  siteDescription: SITE_SETTINGS.siteDescription,
  faviconUrl: SITE_SETTINGS.faviconUrl,
  seoKeywords: SITE_SETTINGS.seoKeywords,
  navLinks: NAV_LINKS,
  socialLinks: SOCIAL_LINKS,
  appLinks: APP_LINKS_DEFAULTS,
  ...FOOTER_DEFAULTS,
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
