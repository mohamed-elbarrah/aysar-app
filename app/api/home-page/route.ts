import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { homePageUpdateSchema } from "@/app/lib/shared-types";
import { deepMerge, requireAdmin } from "@/app/lib/api-utils";
import {
  HOME_HERO,
  FEATURE_SECTIONS,
  BENTO_FEATURES,
  PROJECT_OVERVIEW,
  APP_SECTION,
  CTA_SECTION,
} from "@/app/lib/dashboard/placeholders";

const DEFAULTS = {
  hero: HOME_HERO,
  featureSections: FEATURE_SECTIONS,
  bentoFeatures: BENTO_FEATURES,
  projectOverview: PROJECT_OVERVIEW,
  appSection: APP_SECTION,
  ctaSection: CTA_SECTION,
};

export async function GET() {
  const page = await prisma.homePage.findUnique({ where: { id: "HOME" } });

  if (!page) {
    return NextResponse.json({
      success: true,
      data: { id: "HOME", ...DEFAULTS, updatedAt: new Date().toISOString() },
    });
  }

  return NextResponse.json({ success: true, data: page });
}

export async function PATCH(request: NextRequest) {
  const adminResult = requireAdmin(request);
  if (adminResult instanceof NextResponse) return adminResult;

  const body = await request.json();
  const parsed = homePageUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "بيانات غير صالحة" }, { status: 422 });
  }

  const existing = await prisma.homePage.findUnique({ where: { id: "HOME" } });
  const current = existing ?? DEFAULTS;

  const merged = deepMerge(
    current as unknown as Record<string, unknown>,
    parsed.data as Record<string, unknown>
  );

  const page = await prisma.homePage.upsert({
    where: { id: "HOME" },
    create: { id: "HOME", ...merged },
    update: merged,
  });

  return NextResponse.json({ success: true, data: page });
}