import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/app/lib/db";
import { plansPageUpdateSchema } from "@/app/lib/shared-types";
import { deepMerge, requireAdmin } from "@/app/lib/api-utils";
import { PLANS, COMPARE_ROWS, FAQ_ITEMS, isOldCompareFormat, migrateCompareRows } from "@/lib/plans-data";

const PLANS_HERO_DEFAULTS = {
  badge: "الأسعار والباقات",
  title: "اختر الباقة",
  titleAccent: "المناسبة لك",
  subtitle: "باقات مرنة تساعدك على إدارة مشاريعك العقارية بكفاءة عالية — ابدأ مجاناً وطوّر متى تريد.",
};

function toSnakeCase(data: Record<string, unknown>): Record<string, unknown> {
  const map: Record<string, string> = {
    compareRows: "compare_rows",
    faqItems: "faq_items",
  };
  const result: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(data)) {
    result[map[key] || key] = val;
  }
  return result;
}

export async function GET() {
  const { data: page } = await supabase
    .from("plans_page")
    .select("*")
    .eq("id", "PLANS")
    .single();

  if (!page) {
    return NextResponse.json({
      success: true,
      data: {
        id: "PLANS",
        hero: PLANS_HERO_DEFAULTS,
        plans: PLANS,
        compare_rows: COMPARE_ROWS,
        faq_items: FAQ_ITEMS,
        updated_at: new Date().toISOString(),
      },
    });
  }

  const data = page as unknown as Record<string, unknown>;
  if (isOldCompareFormat(data.compare_rows)) {
    data.compare_rows = migrateCompareRows(data.compare_rows as Parameters<typeof migrateCompareRows>[0]);
  }

  return NextResponse.json({ success: true, data });
}

export async function PATCH(request: NextRequest) {
  const adminResult = requireAdmin(request);
  if (adminResult instanceof NextResponse) return adminResult;

  const body = await request.json();
  const parsed = plansPageUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "بيانات غير صالحة" }, { status: 422 });
  }

  const { data: existing } = await supabase
    .from("plans_page")
    .select("*")
    .eq("id", "PLANS")
    .single();

  let current: Record<string, unknown>;
  if (existing) {
    current = existing as unknown as Record<string, unknown>;
    if (isOldCompareFormat(current.compare_rows)) {
      current.compare_rows = migrateCompareRows(current.compare_rows as Parameters<typeof migrateCompareRows>[0]);
    }
  } else {
    current = {
      hero: PLANS_HERO_DEFAULTS,
      plans: PLANS,
      compare_rows: COMPARE_ROWS,
      faq_items: FAQ_ITEMS,
    } as unknown as Record<string, unknown>;
  }

  const merged = deepMerge(current, toSnakeCase(parsed.data as Record<string, unknown>));

  const { data: page, error } = await supabase
    .from("plans_page")
    .upsert({ id: "PLANS", ...merged }, { onConflict: "id" })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data: page });
}