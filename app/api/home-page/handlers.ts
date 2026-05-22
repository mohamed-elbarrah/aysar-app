import type { Response } from "express";
import { prisma } from "@/app/lib/db";
import { homePageUpdateSchema } from "@/app/lib/shared-types";
import type { AuthenticatedRequest, ApiResponse } from "@/app/lib/shared-types";
import {
  HOME_HERO,
  FEATURE_SECTIONS,
  BENTO_FEATURES,
  PROJECT_OVERVIEW,
  APP_SECTION,
  CTA_SECTION,
} from "@/app/lib/dashboard/placeholders";

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

export async function getHomePageHandler(
  _req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> {
  let page = await prisma.homePage.findUnique({ where: { id: "HOME" } });

  if (!page) {
    res.json({
      success: true,
      data: {
        id: "HOME",
        hero: HOME_HERO,
        featureSections: FEATURE_SECTIONS,
        bentoFeatures: BENTO_FEATURES,
        projectOverview: PROJECT_OVERVIEW,
        appSection: APP_SECTION,
        ctaSection: CTA_SECTION,
        updatedAt: new Date().toISOString(),
      },
    });
    return;
  }

  res.json({ success: true, data: page });
}

export async function updateHomePageHandler(
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> {
  const parsed = homePageUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, error: "بيانات غير صالحة" });
    return;
  }

  const existing = await prisma.homePage.findUnique({ where: { id: "HOME" } });
  const current = existing ?? {
    hero: HOME_HERO,
    featureSections: FEATURE_SECTIONS,
    bentoFeatures: BENTO_FEATURES,
    projectOverview: PROJECT_OVERVIEW,
    appSection: APP_SECTION,
    ctaSection: CTA_SECTION,
  };

  const merged = deepMerge(current as unknown as Record<string, unknown>, parsed.data as Record<string, unknown>);

  const page = await prisma.homePage.upsert({
    where: { id: "HOME" },
    create: { id: "HOME", ...merged },
    update: merged,
  });

  res.json({ success: true, data: page });
}
