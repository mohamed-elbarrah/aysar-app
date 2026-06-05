"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useDashboard } from "@/app/components/dashboard/DashboardContext";
import { Input, Textarea } from "@/app/components/ui/Input";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { PLANS, FAQ_ITEMS, COMPARE_ROWS } from "@/app/lib/dashboard/placeholders";
import { YEARLY_DISCOUNT_DEFAULT } from "@/lib/plans-data";
import type { Plan, FAQItem, CompareTableData, CompareRow } from "@/lib/plans-data";
import { ScrollText, ChevronUp, Loader2, Plus, Trash2, GripVertical } from "lucide-react";
import { ColorPicker } from "@/app/components/dashboard/ColorPicker";

const sections = [
  { id: "banner", label: "البانر" },
  { id: "plans", label: "الباقات" },
  { id: "compare", label: "جدول المقارنة" },
  { id: "faq", label: "الأسئلة الشائعة" },
];

interface PlansPageData {
  hero: { badge: string; title: string; titleAccent: string; accentColor?: string; accentOpacity?: number; subtitle: string };
  plans: Plan[];
  compareRows: CompareTableData;
  faqItems: FAQItem[];
  yearlyDiscountPercent: number;
}

const DEFAULTS: PlansPageData = {
  hero: { 
    badge: "الأسعار والباقات", 
    title: "اختر الباقة", 
    titleAccent: "المناسبة لك", 
    accentColor: "#ffffff", 
    accentOpacity: 0.5, 
    subtitle: "باقات مرنة تساعدك على إدارة مشاريعك العقارية بكفاءة عالية — ابدأ مجاناً وطوّر متى تريد." 
  },
  plans: PLANS,
  compareRows: COMPARE_ROWS,
  faqItems: FAQ_ITEMS,
  yearlyDiscountPercent: YEARLY_DISCOUNT_DEFAULT,
};

export default function PlansPageEditor() {
  const { plansData, loading, setPlansData } = useDashboard();
  const [activeSection, setActiveSection] = useState("banner");
  const pageRef = useRef<HTMLDivElement>(null);

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
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el && pageRef.current) {
      pageRef.current.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
    }
  };

  if (loading.plans || !plansData) {
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
        </div>
        <div className="space-y-6 pb-8">
          <BannerSection 
            data={(plansData.hero as PlansPageData["hero"]) || DEFAULTS.hero} 
            onChange={(data) => setPlansData({ hero: data }, "hero")} 
          />
          <PlansSection 
            data={(plansData.plans as Plan[]) || DEFAULTS.plans}
            yearlyDiscountPercent={plansData.yearlyDiscountPercent ?? DEFAULTS.yearlyDiscountPercent}
            onPlansChange={(data) => setPlansData({ plans: data }, "plans")}
            onDiscountChange={(discount) => setPlansData({ yearlyDiscountPercent: discount }, "yearlyDiscountPercent")}
          />
          <CompareSection 
            data={(plansData.compareRows as CompareTableData) || DEFAULTS.compareRows} 
            onChange={(data) => setPlansData({ compareRows: data }, "compareRows")} 
          />
          <FAQSection 
            data={(plansData.faqItems as FAQItem[]) || DEFAULTS.faqItems} 
            onChange={(data) => setPlansData({ faqItems: data }, "faqItems")} 
          />
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

function BannerSection({ data: initial, onChange }: { 
  data: PlansPageData["hero"]; 
  onChange: (d: PlansPageData["hero"]) => void;
}) {
  const [data, setData] = useState(initial);

  const handleChange = useCallback((patch: Partial<PlansPageData["hero"]>) => {
    const newData = { ...data, ...patch };
    setData(newData);
    onChange(newData);
  }, [data, onChange]);

  return (
    <section id="banner">
      <ContentCard title="البانر" subtitle="عنوان صفحة الخطط والأسعار">
        <div className="form-grid-2">
          <Input label="الشارة" value={data.badge} onChange={(e) => handleChange({ badge: e.target.value })} />
          <Input label="العنوان" value={data.title} onChange={(e) => handleChange({ title: e.target.value })} />
          <Input label="عنوان مميز" value={data.titleAccent} onChange={(e) => handleChange({ titleAccent: e.target.value })} />
          <ColorPicker
            label="لون عنوان مميز"
            color={data.accentColor || "#ffffff"}
            onChange={(color) => handleChange({ accentColor: color })}
          />
          <div className="form-group-contact">
            <label>شفافية اللون (%) — {Math.round((data.accentOpacity || 0.5) * 100)}%</label>
            <input type="range" min="0" max="1" step="0.01" value={data.accentOpacity || 0.5} onChange={(e) => handleChange({ accentOpacity: parseFloat(e.target.value) })} className="w-full h-2 bg-[#e8edf5] rounded-lg appearance-none cursor-pointer mt-2" />
          </div>
          <Textarea label="الوصف" value={data.subtitle} onChange={(e) => handleChange({ subtitle: e.target.value })} rows={3} />
        </div>
      </ContentCard>
    </section>
  );
}

function PlansSection({ data: initial, yearlyDiscountPercent, onPlansChange, onDiscountChange }: { 
  data: Plan[];
  yearlyDiscountPercent: number;
  onPlansChange: (d: Plan[]) => void;
  onDiscountChange: (discount: number) => void;
}) {
  const [plans, setPlans] = useState<Plan[]>(initial);
  const [discount, setDiscount] = useState(yearlyDiscountPercent);

  const handleDiscountChange = (v: number) => {
    setDiscount(v);
    onDiscountChange(v);
  };

  const updatePlan = (idx: number, patch: Partial<Plan>) => {
    const newPlans = [...plans];
    newPlans[idx] = { ...newPlans[idx], ...patch };
    setPlans(newPlans);
    onPlansChange(newPlans);
  };

  const updateFeature = (pidx: number, fidx: number, patch: Partial<Plan["features"][number]>) => {
    const newPlans = [...plans];
    newPlans[pidx].features[fidx] = { ...newPlans[pidx].features[fidx], ...patch };
    setPlans(newPlans);
    onPlansChange(newPlans);
  };

  const addFeature = (pidx: number) => {
    const newPlans = [...plans];
    newPlans[pidx].features = [...newPlans[pidx].features, { text: "ميزة جديدة", enabled: true }];
    setPlans(newPlans);
    onPlansChange(newPlans);
  };

  const removeFeature = (pidx: number, fidx: number) => {
    const newPlans = [...plans];
    newPlans[pidx].features = newPlans[pidx].features.filter((_, i) => i !== fidx);
    setPlans(newPlans);
    onPlansChange(newPlans);
  };

  return (
    <section id="plans">
      <ContentCard title="الباقات" subtitle="3 باقات: المجانية، المتقدمة، المميزة">
        <div className="mb-5">
          <Input 
            label="نسبة الخصم المعروضة في الشارة (%)" 
            type="number" 
            min={0} 
            max={100} 
            value={discount} 
            onChange={(e) => handleDiscountChange(e.target.value ? Number(e.target.value) : 0)} 
          />
        </div>
        <div className="space-y-5">
          {plans.map((plan, idx) => (
            <div key={plan.id} className="rounded-xl border border-[#e8edf5] overflow-hidden">
              <div className="px-4 py-3 bg-[#f8f9fb] border-b border-[#e8edf5] flex items-center gap-2">
                <Badge variant={plan.isFeatured ? "default" : "outline"} className={plan.isFeatured ? "bg-[#0c2954] text-white" : ""}>{plan.isFree ? "مجانية" : plan.isFeatured ? "موصى بها" : "مدفوعة"}</Badge>
                <span className="text-sm font-bold text-[#0c2954]">{plan.name}</span>
              </div>
              <div className="p-4 space-y-4">
                <div className="form-grid-2">
                  <Input label="الاسم" value={plan.name} onChange={(e) => updatePlan(idx, { name: e.target.value })} />
                  <Input label="السعر الشهري" type="number" value={plan.priceMonthly ?? ""} onChange={(e) => updatePlan(idx, { priceMonthly: e.target.value ? Number(e.target.value) : null })} />
                </div>
                <div className="form-grid-2">
                  <Input label="السعر السنوي" type="number" value={plan.priceYearly ?? ""} onChange={(e) => updatePlan(idx, { priceYearly: e.target.value ? Number(e.target.value) : null })} />
                </div>
                <Textarea label="الوصف" value={plan.description} onChange={(e) => updatePlan(idx, { description: e.target.value })} rows={2} />
                <div className="flex items-center gap-6">
                  <label className="flex items-center gap-2 text-sm"><Checkbox checked={plan.isFree} onCheckedChange={(v) => updatePlan(idx, { isFree: !!v })} /> مجانية</label>
                  <label className="flex items-center gap-2 text-sm"><Checkbox checked={plan.isFeatured} onCheckedChange={(v) => updatePlan(idx, { isFeatured: !!v })} /> مميزة (موصى بها)</label>
                </div>
                <div className="form-grid-2">
                  <Input label="نص الزر" value={plan.ctaLabel} onChange={(e) => updatePlan(idx, { ctaLabel: e.target.value })} />
                  <Input label="رابط الزر" value={plan.ctaHref} onChange={(e) => updatePlan(idx, { ctaHref: e.target.value })} />
                </div>
                <div className="mt-2">
                  <p className="text-xs font-semibold text-[#3a4a60] mb-2">المميزات</p>
                  <div className="space-y-1.5">
                    {plan.features.map((feat, fidx) => (
                      <div key={fidx} className="flex items-center gap-2 group">
                        <button
                          type="button"
                          onClick={() => removeFeature(idx, fidx)}
                          className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-50 transition-colors shrink-0"
                          title="حذف الميزة"
                        >
                          <Trash2 className="w-3 h-3 text-red-400 hover:text-red-600" />
                        </button>
                        <Checkbox
                          checked={feat.enabled}
                          onCheckedChange={(v) => updateFeature(idx, fidx, { enabled: !!v })}
                        />
                        <input
                          className="form-control-contact flex-1"
                          value={feat.text}
                          onChange={(e) => updateFeature(idx, fidx, { text: e.target.value })}
                        />
                        <label className="flex items-center gap-1 text-xs shrink-0">
                          <Checkbox
                            checked={feat.soon || false}
                            onCheckedChange={(v) => updateFeature(idx, fidx, { soon: !!v })}
                          /> قريباً
                        </label>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addFeature(idx)}
                      className="w-full py-1.5 rounded-md border border-dashed border-[#e8edf5] text-xs text-[#6b7a94] hover:border-[#0c2954]/30 hover:text-[#0c2954] hover:bg-[#f5f6f9] transition-colors flex items-center justify-center gap-1"
                    >
                      <Plus className="w-3 h-3" />
                      إضافة ميزة
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ContentCard>
    </section>
  );
}

function CompareSection({ data: initial, onChange }: { 
  data: CompareTableData; 
  onChange: (d: CompareTableData) => void;
}) {
  const [compare, setCompare] = useState<CompareTableData>(initial);

  const notifyChange = (newData: CompareTableData) => {
    setCompare(newData);
    onChange(newData);
  };

  const addColumn = () => {
    const newId = `col_${compare.columns.length}`;
    const n = { ...compare };
    n.columns = [...n.columns, { id: newId, label: "باقة جديدة" }];
    n.rows = n.rows.map((row) => {
      if (row.type === "feature") {
        return { ...row, values: { ...row.values, [newId]: null } };
      }
      return row;
    });
    notifyChange(n);
  };

  const deleteColumn = (colId: string) => {
    const n = { ...compare };
    n.columns = n.columns.filter((c) => c.id !== colId);
    n.rows = n.rows.map((row) => {
      if (row.type === "feature") {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [colId]: _removed, ...rest } = row.values;
        return { ...row, values: rest };
      }
      return row;
    });
    notifyChange(n);
  };

  const addFeatureAt = (afterIdx: number) => {
    const n = { ...compare };
    const blankValues: Record<string, string | null> = {};
    for (const col of n.columns) blankValues[col.id] = null;
    const newRow: CompareRow = { type: "feature" as const, label: "ميزة جديدة", values: blankValues };
    n.rows = [...n.rows.slice(0, afterIdx + 1), newRow, ...n.rows.slice(afterIdx + 1)];
    notifyChange(n);
  };

  const addSection = () => {
    notifyChange({ ...compare, rows: [...compare.rows, { type: "section" as const, label: "قسم جديد" }] });
  };

  const updateRow = (idx: number, patch: Record<string, unknown>) => {
    const n = { ...compare };
    n.rows = n.rows.map((r, i) => i === idx ? { ...r, ...patch } as CompareRow : r);
    notifyChange(n);
  };

  const updateFeatureValue = (ridx: number, colId: string, value: string | null) => {
    const n = { ...compare };
    n.rows = n.rows.map((r, i) =>
      i === ridx && r.type === "feature"
        ? { ...r, values: { ...r.values, [colId]: value } }
        : r
    );
    notifyChange(n);
  };

  const deleteRow = (idx: number) => {
    const n = { ...compare };
    n.rows = n.rows.filter((_, i) => i !== idx);
    notifyChange(n);
  };

  const updateColumn = (colId: string, label: string) => {
    const n = { ...compare };
    n.columns = n.columns.map((c) => (c.id === colId ? { ...c, label } : c));
    notifyChange(n);
  };

  const updateFeatureLabel = (value: string) => {
    const n = { ...compare, featureLabel: value };
    notifyChange(n);
  };

  return (
    <section id="compare">
      <ContentCard title="جدول المقارنة" subtitle={`${compare.columns.length} باقة — ${compare.rows.length} صف`}>
        <div className="space-y-1">
          <div className="grid gap-2 items-center" style={{ gridTemplateColumns: `1fr repeat(${compare.columns.length}, 1fr) auto` }}>
            <input
              className="form-control-contact text-xs font-bold"
              value={compare.featureLabel}
              onChange={(e) => updateFeatureLabel(e.target.value)}
              placeholder="الميزة"
            />
            {compare.columns.map((col) => (
              <div key={col.id} className="flex items-center gap-1">
                <input
                  className="form-control-contact text-xs font-bold text-center"
                  value={col.label}
                  onChange={(e) => updateColumn(col.id, e.target.value)}
                  placeholder="اسم الباقة"
                />
                <button
                  type="button"
                  onClick={() => deleteColumn(col.id)}
                  className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-50 shrink-0"
                  title="حذف الباقة"
                >
                  <Trash2 className="w-3 h-3 text-red-400 hover:text-red-600" />
                </button>
              </div>
            ))}
            <button
              type="button"
              onClick={addColumn}
              className="flex items-center justify-center gap-1 text-xs text-[#6b7a94] hover:text-[#0c2954] py-1 rounded border border-dashed border-[#e8edf5] hover:border-[#0c2954]/30 transition-colors"
            >
              <Plus className="w-3 h-3" /> إضافة باقة
            </button>
          </div>

          <hr className="border-[#e8edf5]" />

          <div className="space-y-1">
            {compare.rows.map((row, ridx) => (
              <div key={ridx}>
                {row.type === "section" ? (
                  <div className="flex items-center gap-2 py-1.5 px-3 bg-[#f8f9fb] rounded-lg">
                    <input
                      className="form-control-contact font-bold bg-transparent border-0 text-sm flex-1"
                      value={row.label}
                      onChange={(e) => updateRow(ridx, { label: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => deleteRow(ridx)}
                      className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-50 shrink-0"
                      title="حذف القسم"
                    >
                      <Trash2 className="w-3 h-3 text-red-400 hover:text-red-600" />
                    </button>
                    <button
                      type="button"
                      onClick={() => addFeatureAt(ridx)}
                      className="flex items-center justify-center gap-1 text-xs text-[#6b7a94] hover:text-[#0c2954] py-1 px-2 rounded border border-dashed border-[#e8edf5] hover:border-[#0c2954]/30 transition-colors shrink-0"
                    >
                      <Plus className="w-3 h-3" /> إضافة ميزة
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2" style={{ direction: "ltr" }}>
                    <div className="flex-1" style={{ direction: "rtl", display: "grid", gap: "0.5rem", gridTemplateColumns: `1fr repeat(${compare.columns.length}, 1fr)` }}>
                      <input
                        className="form-control-contact text-sm"
                        value={row.label}
                        onChange={(e) => updateRow(ridx, { label: e.target.value })}
                        placeholder="الميزة"
                      />
                      {compare.columns.map((col) => (
                        <input
                          key={col.id}
                          className="form-control-contact text-xs text-center"
                          value={row.values[col.id] ?? ""}
                          onChange={(e) => updateFeatureValue(ridx, col.id, e.target.value || null)}
                          placeholder="—"
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => deleteRow(ridx)}
                      className="w-5 h-5 flex items-center justify-center rounded hover:bg-red-50 shrink-0"
                      title="حذف الميزة"
                    >
                      <Trash2 className="w-3 h-3 text-red-400 hover:text-red-600" />
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={addSection}
            className="mt-2 w-full py-2 rounded-lg border-2 border-dashed border-[#e8edf5] text-xs text-[#6b7a94] hover:border-[#0c2954]/30 hover:text-[#0c2954] hover:bg-[#f5f6f9] transition-colors flex items-center justify-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" /> إضافة قسم
          </button>
        </div>
      </ContentCard>
    </section>
  );
}

function FAQSection({ data: initial, onChange }: { 
  data: FAQItem[]; 
  onChange: (d: FAQItem[]) => void;
}) {
  const [items, setItems] = useState<FAQItem[]>(initial);
  const dragIdx = useRef<number | null>(null);

  const notifyChange = (newItems: FAQItem[]) => {
    setItems(newItems);
    onChange(newItems);
  };

  const handleDragStart = (idx: number) => {
    dragIdx.current = idx;
  };

  const handleDragOver = (e: React.DragEvent, idx: number) => {
    e.preventDefault();
    if (dragIdx.current === null || dragIdx.current === idx) return;
    const n = [...items];
    const [moved] = n.splice(dragIdx.current, 1);
    n.splice(idx, 0, moved);
    dragIdx.current = idx;
    notifyChange(n);
  };

  const handleDragEnd = () => {
    dragIdx.current = null;
  };

  const handleAdd = () => {
    notifyChange([...items, { question: "سؤال جديد", answer: "الإجابة هنا" }]);
  };

  const handleDelete = (idx: number) => {
    notifyChange(items.filter((_, i) => i !== idx));
  };

  const updateItem = (idx: number, patch: Partial<FAQItem>) => {
    const n = [...items];
    n[idx] = { ...n[idx], ...patch };
    notifyChange(n);
  };

  return (
    <section id="faq">
      <ContentCard title="الأسئلة الشائعة" subtitle={`${items.length} سؤال وجواب`}>
        <div className="space-y-4">
          {items.map((item, idx) => (
            <div
              key={idx}
              draggable
              onDragStart={() => handleDragStart(idx)}
              onDragOver={(e) => handleDragOver(e, idx)}
              onDragEnd={handleDragEnd}
              className="rounded-lg border border-[#e8edf5] p-4 bg-[#fafbfc]"
            >
              <div className="flex items-center gap-2 mb-3">
                <button
                  type="button"
                  className="cursor-grab active:cursor-grabbing touch-none"
                  title="سحب لإعادة الترتيب"
                >
                  <GripVertical className="w-3.5 h-3.5 text-[#6b7a94]" />
                </button>
                <Badge variant="outline" className="text-[10px]">#{idx + 1}</Badge>
                <span className="text-sm font-bold text-[#0c2954]">سؤال {idx + 1}</span>
                <button
                  type="button"
                  onClick={() => handleDelete(idx)}
                  className="mr-auto w-6 h-6 flex items-center justify-center rounded hover:bg-red-50 transition-colors"
                  title="حذف السؤال"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
                </button>
              </div>
              <Input
                label="السؤال"
                value={item.question}
                onChange={(e) => updateItem(idx, { question: e.target.value })}
              />
              <Textarea
                label="الإجابة"
                value={item.answer}
                onChange={(e) => updateItem(idx, { answer: e.target.value })}
                rows={4}
              />
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-[#e8edf5] text-sm text-[#6b7a94] hover:border-[#0c2954]/30 hover:text-[#0c2954] hover:bg-[#f5f6f9] transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة سؤال جديد
        </button>
      </ContentCard>
    </section>
  );
}
