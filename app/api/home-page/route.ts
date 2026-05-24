import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/db";
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
  feature_sections: FEATURE_SECTIONS,
  bento_features: BENTO_FEATURES,
  project_overview: PROJECT_OVERVIEW,
  app_section: APP_SECTION,
  cta_section: CTA_SECTION,
};

function toSnakeCase(data: Record<string, unknown>): Record<string, unknown> {
  const map: Record<string, string> = {
    featureSections: "feature_sections",
    bentoFeatures: "bento_features",
    projectOverview: "project_overview",
    appSection: "app_section",
    ctaSection: "cta_section",
  };
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    result[map[key] || key] = val;
  }
  return result;
}

export async function GET() {
  const { data: page } = await supabase
    .from("home_page")
    .select("*")
    .eq("id", "HOME")
    .single();

  if (!page) {
    return NextResponse.json({
      success: true,
      data: { id: "HOME", ...DEFAULTS, updated_at: new Date().toISOString() },
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

  const { data: existing } = await supabase
    .from("home_page")
    .select("*")
    .eq("id", "HOME")
    .single();

  const current = existing ?? DEFAULTS;

  const merged = deepMerge(
    current as unknown as Record<string, unknown>,
    toSnakeCase(parsed.data as Record<string, unknown>)
  );

  const { data: page, error } = await supabase
    .from("home_page")
    .upsert({ id: "HOME", ...merged }, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: page });
}