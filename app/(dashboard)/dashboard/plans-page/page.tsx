"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input, Textarea } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { PLANS, FAQ_ITEMS, COMPARE_ROWS } from "@/app/lib/dashboard/placeholders";
import type { Plan, FAQItem, CompareRowData } from "@/lib/plans-data";
import { ScrollText, ChevronUp, Loader2 } from "lucide-react";

const sections = [
  { id: "banner", label: "البانر" },
  { id: "plans", label: "الباقات" },
  { id: "compare", label: "جدول المقارنة" },
  { id: "faq", label: "الأسئلة الشائعة" },
];

interface PlansPageData {
  hero: { badge: string; title: string; titleAccent: string; subtitle: string };
  plans: Plan[];
  compareRows: CompareRowData[];
  faqItems: FAQItem[];
}

const DEFAULTS: PlansPageData = {
  hero: { badge: "الأسعار والباقات", title: "اختر الباقة", titleAccent: "المناسبة لك", subtitle: "باقات مرنة تساعدك على إدارة مشاريعك العقارية بكفاءة عالية — ابدأ مجاناً وطوّر متى تريد." },
  plans: PLANS,
  compareRows: COMPARE_ROWS,
  faqItems: FAQ_ITEMS,
};

async function saveSection(section: string, data: unknown): Promise<boolean> {
  try {
    const res = await fetch("/api/plans-page", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ [section]: data }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export default function PlansPageEditor() {
  const [data, setData] = useState<PlansPageData>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string>();
  const [activeSection, setActiveSection] = useState("banner");
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/plans-page");
        const json = await res.json();
        if (json.success && json.data) {
          setData({
            hero: json.data.hero || DEFAULTS.hero,
            plans: json.data.plans || DEFAULTS.plans,
            compareRows: json.data.compareRows || DEFAULTS.compareRows,
            faqItems: json.data.faqItems || DEFAULTS.faqItems,
          });
        }
      } catch {
        setFetchError("تعذر تحميل البيانات، تم استخدام القيم الافتراضية");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (!pageRef.current) return;
      const els = sections.map((s) => document.getElementById(s.id));
      const scrollY = pageRef.current.scrollTop + 100;
      for (let i = els.length - 1; i >= 0; i--) {
        const el = els[i];
        if (el && el.offsetTop <= scrollY) {
          setActiveSection(sections[i].id);
          break;
        }
      }
    };
    const el = pageRef.current;
    el?.addEventListener("scroll", handleScroll);
    return () => el?.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el && pageRef.current) {
      pageRef.current.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
    }
  };

  const handleSectionSave = useCallback(async (sectionKey: string, sectionData: unknown) => {
    setSaving(sectionKey);
    const ok = await saveSection(sectionKey, sectionData);
    setSaving(null);
    if (ok) {
      setLastSaved(new Date().toLocaleTimeString("ar-SA"));
      setTimeout(() => setLastSaved(undefined), 5000);
    }
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83] mx-auto mb-3" />
          <p className="text-sm text-[#6b7a94]">جارٍ تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      <div ref={pageRef} className="flex-1 overflow-y-auto pr-2 -mr-2">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#0c2954] mb-1">صفحة الخطط والأسعار</h1>
          <p className="text-sm text-[#6b7a94]">تعديل الباقات، جدول المقارنة، والأسئلة الشائعة</p>
          {fetchError && <p className="text-xs text-amber-600 mt-1">{fetchError}</p>}
        </div>
        <div className="space-y-6 pb-24">
          <BannerSection data={data.hero} saving={saving === "hero"} onSave={(d) => handleSectionSave("hero", d)} />
          <PlansSection data={data.plans} saving={saving === "plans"} onSave={(d) => handleSectionSave("plans", d)} />
          <CompareSection data={data.compareRows} saving={saving === "compareRows"} onSave={(d) => handleSectionSave("compareRows", d)} />
          <FAQSection data={data.faqItems} saving={saving === "faqItems"} onSave={(d) => handleSectionSave("faqItems", d)} />
        </div>
      </div>
      <div className="hidden xl:block w-[200px] shrink-0">
        <div className="sticky top-0">
          <div className="bg-white rounded-xl border border-[#e8edf5] p-4">
            <p className="text-xs font-bold text-[#0c2954] mb-3 flex items-center gap-1.5"><ScrollText className="w-3.5 h-3.5" /> الأقسام</p>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button key={s.id} onClick={() => scrollTo(s.id)} className={`w-full text-right text-xs py-1.5 px-2 rounded-md transition-colors ${activeSection === s.id ? "bg-[#0c2954]/5 text-[#0c2954] font-medium" : "text-[#6b7a94] hover:text-[#0c2954] hover:bg-[#f5f6f9]"}`}>{s.label}</button>
              ))}
            </nav>
            <button onClick={() => pageRef.current?.scrollTo({ top: 0, behavior: "smooth" })} className="mt-3 w-full flex items-center justify-center gap-1 text-[10px] text-[#6b7a94] hover:text-[#0c2954] py-1.5 rounded-md hover:bg-[#f5f6f9] transition-colors"><ChevronUp className="w-3 h-3" /> العودة للأعلى</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BannerSection({ data: initial, saving, onSave }: { data: PlansPageData["hero"]; saving: boolean; onSave: (d: PlansPageData["hero"]) => void }) {
  const [data, setData] = useState(initial);
  return (
    <section id="banner">
      <ContentCard title="البانر" subtitle="عنوان صفحة الخطط والأسعار">
        <div className="form-grid-2">
          <Input label="الشارة" value={data.badge} onChange={(e) => setData({ ...data, badge: e.target.value })} />
          <Input label="العنوان" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
          <Input label="عنوان مميز" value={data.titleAccent} onChange={(e) => setData({ ...data, titleAccent: e.target.value })} />
          <Textarea label="الوصف" value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} rows={3} />
        </div>
        <div className="mt-5 flex justify-end">
          <DashboardButton disabled={saving} onClick={() => onSave(data)}>
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}

function PlansSection({ data: initial, saving, onSave }: { data: Plan[]; saving: boolean; onSave: (d: Plan[]) => void }) {
  const [plans, setPlans] = useState<Plan[]>(initial);
  return (
    <section id="plans">
      <ContentCard title="الباقات" subtitle="3 باقات: المجانية، المتقدمة، المميزة">
        <div className="space-y-5">
          {plans.map((plan, idx) => (
            <div key={plan.id} className="rounded-xl border border-[#e8edf5] overflow-hidden">
              <div className="px-4 py-3 bg-[#f8f9fb] border-b border-[#e8edf5] flex items-center gap-2">
                <Badge variant={plan.isFeatured ? "default" : "outline"} className={plan.isFeatured ? "bg-[#0c2954] text-white" : ""}>{plan.isFree ? "مجانية" : plan.isFeatured ? "موصى بها" : "مدفوعة"}</Badge>
                <span className="text-sm font-bold text-[#0c2954]">{plan.name}</span>
              </div>
              <div className="p-4 space-y-4">
                <div className="form-grid-2">
                  <Input label="الاسم" value={plan.name} onChange={(e) => { const n = [...plans]; n[idx] = { ...n[idx], name: e.target.value }; setPlans(n); }} />
                  <Input label="السعر الشهري" type="number" value={plan.priceMonthly ?? ""} onChange={(e) => { const n = [...plans]; n[idx] = { ...n[idx], priceMonthly: e.target.value ? Number(e.target.value) : null }; setPlans(n); }} />
                  <Input label="السعر السنوي" type="number" value={plan.priceYearly ?? ""} onChange={(e) => { const n = [...plans]; n[idx] = { ...n[idx], priceYearly: e.target.value ? Number(e.target.value) : null }; setPlans(n); }} />
                </div>
                <Textarea label="الوصف" value={plan.description} onChange={(e) => { const n = [...plans]; n[idx] = { ...n[idx], description: e.target.value }; setPlans(n); }} rows={2} />
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm"><Checkbox checked={plan.isFree} onCheckedChange={(v) => { const n = [...plans]; n[idx] = { ...n[idx], isFree: !!v }; setPlans(n); }} /> مجانية</label>
                  <label className="flex items-center gap-2 text-sm"><Checkbox checked={plan.isFeatured} onCheckedChange={(v) => { const n = [...plans]; n[idx] = { ...n[idx], isFeatured: !!v }; setPlans(n); }} /> مميزة (موصى بها)</label>
                </div>
                <div className="form-grid-2">
                  <Input label="نص الزر" value={plan.ctaLabel} onChange={(e) => { const n = [...plans]; n[idx] = { ...n[idx], ctaLabel: e.target.value }; setPlans(n); }} />
                  <Input label="رابط الزر" value={plan.ctaHref} onChange={(e) => { const n = [...plans]; n[idx] = { ...n[idx], ctaHref: e.target.value }; setPlans(n); }} />
                </div>
                <div className="mt-2">
                  <p className="text-xs font-semibold text-[#3a4a60] mb-2">المميزات</p>
                  <div className="space-y-1.5">{plan.features.map((feat, fidx) => (
                    <div key={fidx} className="flex items-center gap-2">
                      <Checkbox checked={feat.enabled} onCheckedChange={(v) => { const n = [...plans]; n[idx].features[fidx] = { ...n[idx].features[fidx], enabled: !!v }; setPlans(n); }} />
                      <input className="form-control-contact flex-1" value={feat.text} onChange={(e) => { const n = [...plans]; n[idx].features[fidx] = { ...n[idx].features[fidx], text: e.target.value }; setPlans(n); }} />
                      <label className="flex items-center gap-1 text-xs"><Checkbox checked={feat.soon || false} onCheckedChange={(v) => { const n = [...plans]; n[idx].features[fidx] = { ...n[idx].features[fidx], soon: !!v }; setPlans(n); }} /> قريباً</label>
                    </div>
                  ))}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <DashboardButton disabled={saving} onClick={() => onSave(plans)}>
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}

function CompareSection({ data: initial, saving, onSave }: { data: CompareRowData[]; saving: boolean; onSave: (d: CompareRowData[]) => void }) {
  const [rows, setRows] = useState<CompareRowData[]>(initial);
  return (
    <section id="compare">
      <ContentCard title="جدول المقارنة" subtitle="مقارنة المميزات بين الباقات الثلاث">
        <div className="space-y-2">
          {rows.map((row, idx) => {
            if ("section" in row) {
              return <div key={idx} className="py-2 px-3 bg-[#f8f9fb] rounded-lg"><input className="form-control-contact font-bold bg-transparent border-0 text-sm" value={row.section} onChange={(e) => { const n = [...rows]; (n[idx] as { section: string }).section = e.target.value; setRows(n); }} /></div>;
            }
            return (
              <div key={idx} className="grid grid-cols-4 gap-2 items-center">
                <input className="form-control-contact" value={row.label} onChange={(e) => { const n = [...rows]; (n[idx] as { label: string }).label = e.target.value; setRows(n); }} placeholder="الميزة" />
                <input className="form-control-contact" value={row.free ?? ""} onChange={(e) => { const n = [...rows]; (n[idx] as { free: string | null }).free = e.target.value || null; setRows(n); }} placeholder="المجانية" />
                <input className="form-control-contact" value={row.advanced ?? ""} onChange={(e) => { const n = [...rows]; (n[idx] as { advanced: string | null }).advanced = e.target.value || null; setRows(n); }} placeholder="المتقدمة" />
                <input className="form-control-contact" value={row.featured ?? ""} onChange={(e) => { const n = [...rows]; (n[idx] as { featured: string | null }).featured = e.target.value || null; setRows(n); }} placeholder="المميزة" />
              </div>
            );
          })}
        </div>
        <div className="mt-5 flex justify-end">
          <DashboardButton disabled={saving} onClick={() => onSave(rows)}>
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}

function FAQSection({ data: initial, saving, onSave }: { data: FAQItem[]; saving: boolean; onSave: (d: FAQItem[]) => void }) {
  const [items, setItems] = useState<FAQItem[]>(initial);
  return (
    <section id="faq">
      <ContentCard title="الأسئلة الشائعة" subtitle="6 أسئلة وأجوبة شائعة">
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="rounded-lg border border-[#e8edf5] p-4 bg-[#fafbfc]">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-[10px]">#{idx + 1}</Badge>
                <span className="text-sm font-bold text-[#0c2954]">سؤال {idx + 1}</span>
              </div>
              <Input label="السؤال" value={item.question} onChange={(e) => { const n = [...items]; n[idx] = { ...n[idx], question: e.target.value }; setItems(n); }} />
              <Textarea label="الإجابة" value={item.answer} onChange={(e) => { const n = [...items]; n[idx] = { ...n[idx], answer: e.target.value }; setItems(n); }} rows={4} />
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <DashboardButton disabled={saving} onClick={() => onSave(items)}>
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}
