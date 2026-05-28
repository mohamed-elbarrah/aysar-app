"use client";

import { useState, useEffect } from "react";
import { useDashboard } from "@/app/components/dashboard/DashboardContext";
import { Input, Textarea } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { RichTextEditor } from "@/app/components/dashboard/RichTextEditor";
import { PRIVACY_POLICY, TERMS_OF_USE, RETURN_POLICY } from "@/app/lib/dashboard/placeholders";
import type { PolicyData, PolicyPart } from "@/lib/policy-data";
import { Plus, Trash2, Loader2 } from "lucide-react";

const POLICY_TYPES = ["privacy", "terms", "returns"] as const;
type PolicyType = (typeof POLICY_TYPES)[number];

const POLICY_LABELS: Record<PolicyType, string> = {
  privacy: "سياسة الخصوصية",
  terms: "شروط الاستخدام",
  returns: "سياسة الاسترجاع",
};

const FALLBACKS: Record<PolicyType, PolicyData> = {
  privacy: PRIVACY_POLICY,
  terms: TERMS_OF_USE,
  returns: RETURN_POLICY,
};

export default function PoliciesEditor() {
  const { policiesData, loading, setPoliciesData } = useDashboard();
  const [activeType, setActiveType] = useState<PolicyType>("privacy");

  if (loading.policies || !policiesData) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83] mx-auto mb-3" />
          <p className="text-sm text-[#6b7a94]">جارٍ تحميل البيانات...</p>
        </div>
      </div>
    );
  }

  const current = policiesData[activeType] || FALLBACKS[activeType];

  return (
    <div className="space-y-6 pb-8">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0c2954] mb-1">الصفحات القانونية</h1>
        <p className="text-sm text-[#6b7a94]">تعديل المحتوى — كل جزء له عنوان + محتوى بنص غني. جدول المحتويات يُستخرج تلقائياً من العناوين.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {POLICY_TYPES.map((type) => (
          <button 
            key={type} 
            onClick={() => setActiveType(type)} 
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              activeType === type 
                ? "bg-[#0c2954] text-white" 
                : "bg-white border border-[#e8edf5] text-[#6b7a94] hover:bg-[#f5f6f9]"
            }`}
          >
            {POLICY_LABELS[type]}
          </button>
        ))}
      </div>

      <PolicyEditor 
        data={current as PolicyData} 
        onChange={(data) => setPoliciesData(activeType, data)} 
      />
    </div>
  );
}

function PolicyEditor({ data: current, onChange }: {
  data: PolicyData; 
  onChange: (d: PolicyData) => void;
}) {
  const updateParts = (parts: PolicyPart[]) => {
    onChange({ ...current, parts });
  };

  const updateHero = (hero: Partial<PolicyData>) => {
    onChange({ ...current, ...hero });
  };

  const updateVersion = (version: Partial<PolicyData>) => {
    onChange({ ...current, ...version });
  };

  const updateSidebar = (sidebarCard: PolicyData["sidebarCard"]) => {
    onChange({ ...current, sidebarCard });
  };

  const updateFooter = (footer: { footerText: string; footerActions: PolicyData["footerActions"] }) => {
    onChange({ ...current, footerText: footer.footerText, footerActions: footer.footerActions });
  };

  return (
    <div className="space-y-6">
      <HeroSection data={current} onChange={updateHero} />
      <VersionSection data={current} onChange={updateVersion} />
      <PartsSection parts={current.parts} onChange={updateParts} />
      <SidebarSection data={current} onChange={updateSidebar} />
      <FooterSection data={current} onChange={updateFooter} />
    </div>
  );
}

function HeroSection({ data, onChange }: { data: PolicyData; onChange: (hero: Partial<PolicyData>) => void }) {
  return (
    <ContentCard title="البانر الرئيسي" subtitle="الشارة، العنوان، والوصف">
      <div className="form-grid-2">
        <Input label="الشارة (Badge)" value={data.badge} onChange={(e) => { onChange({ ...data, badge: e.target.value }); }} />
        <Input label="مسار التنقل (Breadcrumb)" value={data.breadcrumb} onChange={(e) => { onChange({ ...data, breadcrumb: e.target.value }); }} />
        <Input label="العنوان" value={data.title} onChange={(e) => { onChange({ ...data, title: e.target.value }); }} />
        <Textarea label="الوصف" value={data.description} onChange={(e) => { onChange({ ...data, description: e.target.value }); }} rows={2} />
      </div>
    </ContentCard>
  );
}

function VersionSection({ data, onChange }: { data: PolicyData; onChange: (v: Partial<PolicyData>) => void }) {
  return (
    <ContentCard title="الإصدار والتاريخ" subtitle="رقم الإصدار وتاريخ السريان">
      <div className="form-grid-2">
        <Input label="رقم الإصدار" value={data.version || ""} onChange={(e) => { onChange({ ...data, version: e.target.value }); }} />
        <Input label="تاريخ السريان" value={data.effectiveDate || ""} onChange={(e) => { onChange({ ...data, effectiveDate: e.target.value }); }} />
        <Input label="اسم الجهة" value={data.entity || ""} onChange={(e) => { onChange({ ...data, entity: e.target.value }); }} />
      </div>
    </ContentCard>
  );
}

function PartsSection({ parts, onChange }: { parts: PolicyPart[]; onChange: (parts: PolicyPart[]) => void }) {
  const [local, setLocal] = useState<PolicyPart[]>(parts);

  useEffect(() => { setLocal(parts); }, [parts]);

  const addPart = () => {
    const num = local.length + 1;
    const id = `part-${num}`;
    const newParts = [...local, { id, headline: "", content: "" }];
    setLocal(newParts);
    onChange(newParts);
  };

  const removePart = (idx: number) => {
    const newParts = local.filter((_, i) => i !== idx);
    setLocal(newParts);
    onChange(newParts);
  };

  const updatePart = (idx: number, patch: Partial<PolicyPart>) => {
    const newParts = [...local];
    newParts[idx] = { ...newParts[idx], ...patch };
    setLocal(newParts);
    onChange(newParts);
  };

  return (
    <ContentCard title="المحتوى" subtitle={`${local.length} جزء — كل جزء له عنوان رئيسي + نص غني. جدول المحتويات يُستخرج تلقائياً من العناوين.`}>
      <div className="space-y-4">
        {local.map((part, idx) => (
          <div key={`${part.id}-${idx}`} className="rounded-lg border border-[#e8edf5] p-4 bg-[#fafbfc]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-bold text-[#0c2954]">جزء {idx + 1}</span>
              <DashboardButton variant="danger" size="icon-sm" onClick={() => removePart(idx)}>
                <Trash2 className="w-4 h-4" />
              </DashboardButton>
            </div>
            <Input
              label="العنوان الرئيسي (يُستخدم في جدول المحتويات)"
              value={part.headline}
              onChange={(e) => updatePart(idx, { headline: e.target.value })}
            />
            <div className="mt-3">
              <label className="text-xs font-semibold text-[#3a4a60] mb-2 block">المحتوى (نص غني)</label>
              <RichTextEditor
                value={part.content}
                onChange={(v) => updatePart(idx, { content: v })}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <DashboardButton variant="ghost" size="sm" onClick={addPart}>
          <Plus className="w-4 h-4" /> إضافة جزء
        </DashboardButton>
      </div>
    </ContentCard>
  );
}

function SidebarSection({ data, onChange }: { data: PolicyData; onChange: (sidebarCard: PolicyData["sidebarCard"]) => void }) {
  const card = data.sidebarCard || {
    title: "هل تحتاج مساعدة؟",
    desc: "فريق الدعم متاح للإجابة عن استفساراتك",
    linkLabel: "تواصل معنا",
    href: "/contact"
  };

  return (
    <ContentCard title="بطاقة الشريط الجانبي" subtitle="بطاقة المساعدة في TocSidebar">
      <div className="form-grid-2">
        <Input label="العنوان" value={card.title} onChange={(e) => { onChange({ ...card, title: e.target.value }); }} />
        <Input label="الوصف" value={card.desc} onChange={(e) => { onChange({ ...card, desc: e.target.value }); }} />
        <Input label="نص الرابط" value={card.linkLabel} onChange={(e) => { onChange({ ...card, linkLabel: e.target.value }); }} />
        <Input label="الرابط" value={card.href} onChange={(e) => { onChange({ ...card, href: e.target.value }); }} />
      </div>
    </ContentCard>
  );
}

function FooterSection({ data, onChange }: { data: PolicyData; onChange: (f: { footerText: string; footerActions: PolicyData["footerActions"] }) => void }) {
  const handleTextChange = (val: string) => {
    onChange({ footerText: val, footerActions: data.footerActions });
  };

  const handleActionChange = (idx: number, patch: Partial<(typeof data.footerActions)[number]>) => {
    const na = [...data.footerActions];
    na[idx] = { ...na[idx], ...patch };
    onChange({ footerText: data.footerText, footerActions: na });
  };

  return (
    <ContentCard title="شريط التذييل" subtitle="نص الحقوق وأزرار الإجراءات">
      <Textarea label="نص الحقوق" value={data.footerText} onChange={(e) => { handleTextChange(e.target.value); }} rows={2} />
      <div className="mt-4">
        <p className="text-xs font-semibold text-[#3a4a60] mb-2">أزرار الإجراءات</p>
        {data.footerActions.map((action, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
            <Input label="النص" value={action.label} onChange={(e) => { handleActionChange(idx, { label: e.target.value }); }} />
            <Input label="الرابط" value={action.href} onChange={(e) => { handleActionChange(idx, { href: e.target.value }); }} />
            <div className="form-group-contact">
              <label>النوع</label>
              <select 
                className="form-control-contact" 
                value={action.variant} 
                onChange={(e) => { handleActionChange(idx, { variant: e.target.value as "primary" | "ghost" }); }}
              >
                <option value="primary">أساسي</option>
                <option value="ghost">شفاف</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </ContentCard>
  );
}
