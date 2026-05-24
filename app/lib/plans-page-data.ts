import { supabase } from "@/app/lib/db";
import { PLANS, COMPARE_ROWS, FAQ_ITEMS } from "@/lib/plans-data";
import { isOldCompareFormat, migrateCompareRows } from "@/lib/plans-data";
import type { Plan, CompareTableData, FAQItem } from "@/lib/plans-data";

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
  compareRows: CompareTableData;
  faqItems: FAQItem[];
  updatedAt: string;
}

export async function getPlansPageData(): Promise<PlansPageResponse> {
  const { data: page } = await supabase
    .from("plans_page")
    .select("*")
    .eq("id", "PLANS")
    .single();

  if (!page) {
    return {
      id: "PLANS",
      hero: { ...PLANS_HERO_DEFAULTS },
      plans: [...PLANS],
      compareRows: { ...COMPARE_ROWS, rows: [...COMPARE_ROWS.rows], columns: [...COMPARE_ROWS.columns] },
      faqItems: [...FAQ_ITEMS],
      updatedAt: new Date().toISOString(),
    };
  }

  const rawCompareRows = page.compare_rows as unknown;

  return {
    id: page.id,
    hero: page.hero as PlansPageResponse["hero"],
    plans: page.plans as unknown as PlansPageResponse["plans"],
    compareRows: isOldCompareFormat(rawCompareRows)
      ? migrateCompareRows(rawCompareRows)
      : (rawCompareRows as CompareTableData),
    faqItems: page.faq_items as unknown as PlansPageResponse["faqItems"],
    updatedAt: page.updated_at,
  };
}