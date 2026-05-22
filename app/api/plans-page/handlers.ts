import type { Response } from "express";
import { prisma } from "@/app/lib/db";
import { plansPageUpdateSchema } from "@/app/lib/shared-types";
import type { AuthenticatedRequest, ApiResponse } from "@/app/lib/shared-types";
import { PLANS, COMPARE_ROWS, FAQ_ITEMS } from "@/lib/plans-data";

const PLANS_HERO_DEFAULTS = {
  badge: "الأسعار والباقات",
  title: "اختر الباقة",
  titleAccent: "المناسبة لك",
  subtitle: "باقات مرنة تساعدك على إدارة مشاريعك العقارية بكفاءة عالية — ابدأ مجاناً وطوّر متى تريد.",
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

export async function getPlansPageHandler(
  _req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> {
  let page = await prisma.plansPage.findUnique({ where: { id: "PLANS" } });

  if (!page) {
    res.json({
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
    return;
  }

  res.json({ success: true, data: page });
}

export async function updatePlansPageHandler(
  req: AuthenticatedRequest,
  res: Response<ApiResponse>
): Promise<void> {
  const parsed = plansPageUpdateSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(422).json({ success: false, error: "بيانات غير صالحة" });
    return;
  }

  const existing = await prisma.plansPage.findUnique({ where: { id: "PLANS" } });
  const current = existing ?? {
    hero: PLANS_HERO_DEFAULTS,
    plans: PLANS,
    compareRows: COMPARE_ROWS,
    faqItems: FAQ_ITEMS,
  };

  const merged = deepMerge(current as unknown as Record<string, unknown>, parsed.data as Record<string, unknown>);

  const page = await prisma.plansPage.upsert({
    where: { id: "PLANS" },
    create: { id: "PLANS", ...merged },
    update: merged,
  });

  res.json({ success: true, data: page });
}
