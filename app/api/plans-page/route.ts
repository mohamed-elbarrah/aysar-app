import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/db";
import { plansPageUpdateSchema } from "@/app/lib/shared-types";
import { deepMerge, requireAdmin } from "@/app/lib/api-utils";
import { PLANS, COMPARE_ROWS, FAQ_ITEMS, isOldCompareFormat, migrateCompareRows } from "@/lib/plans-data";

const PLANS_HERO_DEFAULTS = {
  badge: "الأسعار والباقات",
  title: "اختر الباقة",
  titleAccent: "المناسبة لك",
  subtitle: "باقات مرنة تساعدك على إدارة مشاريعك العقارية بكفاءة عالية — ابدأ مجاناً وطوّر متى تريد.",
};

export async function GET() {
  const page = await prisma.plansPage.findUnique({ where: { id: "PLANS" } });

  if (!page) {
    return NextResponse.json({
      success: true,
      data: {
        id: "PLANS",
        hero: PLANS_HERO_DEFAULTS,
        plans: PLANS,
        compareRows: COMPARE_ROWS,
        faqItems: FAQ_ITEMS,
        updatedAt: new Date().toISOString(),
      },
    });
  }

  const data = page as unknown as Record<string, unknown>;
  if (isOldCompareFormat(data.compareRows)) {
    data.compareRows = migrateCompareRows(data.compareRows as Parameters<typeof migrateCompareRows>[0]);
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

  const existing = await prisma.plansPage.findUnique({ where: { id: "PLANS" } });

  let current: Record<string, unknown>;
  if (existing) {
    current = existing as unknown as Record<string, unknown>;
    if (isOldCompareFormat(current.compareRows)) {
      current.compareRows = migrateCompareRows(current.compareRows as Parameters<typeof migrateCompareRows>[0]);
    }
  } else {
    current = {
      hero: PLANS_HERO_DEFAULTS,
      plans: PLANS,
      compareRows: COMPARE_ROWS,
      faqItems: FAQ_ITEMS,
    } as unknown as Record<string, unknown>;
  }

  const merged = deepMerge(current, parsed.data as Record<string, unknown>);

  const page = await prisma.plansPage.upsert({
    where: { id: "PLANS" },
    create: { id: "PLANS", ...merged },
    update: merged,
  });

  return NextResponse.json({ success: true, data: page });
}