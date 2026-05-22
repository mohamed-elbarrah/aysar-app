import { prisma } from "@/app/lib/db";
import { PLANS, COMPARE_ROWS, FAQ_ITEMS } from "@/lib/plans-data";
import type { Plan, CompareRowData, FAQItem } from "@/lib/plans-data";

const PLANS_HERO_DEFAULTS = {
  badge: "الأسعار والباقات",
  title: "اختر الباقة",
  titleAccent: "المناسبة لك",
  subtitle: "باقات مرنة تساعدك على إدارة مشاريعك العقارية بكفاءة عالية — ابدأ مجاناً وطوّر متى تريد.",
};

export interface PlansPageResponse {
  id: string;
  hero: {
    badge: string;
    title: string;
    titleAccent: string;
    subtitle: string;
  };
  plans: Plan[];
  compareRows: CompareRowData[];
  faqItems: FAQItem[];
  updatedAt: string;
}

export async function getPlansPageData(): Promise<PlansPageResponse> {
  let page = await prisma.plansPage.findUnique({ where: { id: "PLANS" } });

  if (!page) {
    return {
      id: "PLANS",
      hero: { ...PLANS_HERO_DEFAULTS },
      plans: [...PLANS],
      compareRows: [...COMPARE_ROWS],
      faqItems: [...FAQ_ITEMS],
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    id: page.id,
    hero: page.hero as PlansPageResponse["hero"],
    plans: page.plans as unknown as PlansPageResponse["plans"],
    compareRows: page.compareRows as unknown as PlansPageResponse["compareRows"],
    faqItems: page.faqItems as unknown as PlansPageResponse["faqItems"],
    updatedAt: page.updatedAt.toISOString(),
  };
}
