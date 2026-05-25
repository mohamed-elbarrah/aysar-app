"use client";

import { useState, useEffect, useCallback } from "react";
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
        type={activeType} 
        onChange={(data) => setPoliciesData(activeType, data)} 
      />
    </div>
  );
}

function PolicyEditor({ data: initial, type, onChange }: {
  data: PolicyData; 
  type: PolicyType; 
  onChange: (d: PolicyData) => void;
}) {
  const [data, setData] = useState<PolicyData>(initial);

  useEffect(() => { 
    setData(initial); 
  }, [initial, type]);

  const updateParts = (parts: PolicyPart[]) => {
    const newData = { ...data, parts };
    setData(newData);
    onChange(newData);
  };

  const updateHero = (hero: Partial<PolicyData>) => {
    const newData = { ...data, ...hero };
    setData(newData);
    onChange(newData);
  };

  const updateVersion = (version: Partial<PolicyData>) => {
    const newData = { ...data, ...version };
    setData(newData);
    onChange(newData);
  };

  const updateSidebar = (sidebarCard: PolicyData["sidebarCard"]) => {
    const newData = { ...data, sidebarCard };
    setData(newData);
    onChange(newData);
  };

  const updateFooter = (footer: { footerText: string; footerActions: PolicyData["footerActions"] }) => {
    const newData = { ...data, footerText: footer.footerText, footerActions: footer.footerActions };
    setData(newData);
    onChange(newData);
  };

  return (
    <div className="space-y-6">
      <HeroSection data={data} onChange={updateHero} />
      <VersionSection data={data} onChange={updateVersion} />
      <PartsSection parts={data.parts} onChange={updateParts} />
      <SidebarSection data={data} onChange={updateSidebar} />
      <FooterSection data={data} onChange={updateFooter} />
    </div>
  );
}

function HeroSection({ data, onChange }: { data: PolicyData; onChange: (hero: Partial<PolicyData>) => void }) {
  const [badge, setBadge] = useState(data.badge);
  const [breadcrumb, setBreadcrumb] = useState(data.breadcrumb);
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);

  useEffect(() => { 
    setBadge(data.badge); 
    setBreadcrumb(data.breadcrumb); 
    setTitle(data.title); 
    setDescription(data.description); 
  }, [data]);

  const handleApply = () => {
    onChange({ badge, breadcrumb, title, description });
  };

  return (
    <ContentCard title="البانر الرئيسي" subtitle="الشارة، العنوان، والوصف">
      <div className="form-grid-2">
        <Input label="الشارة (Badge)" value={badge} onChange={(e) => { setBadge(e.target.value); }} />
        <Input label="مسار التنقل (Breadcrumb)" value={breadcrumb} onChange={(e) => { setBreadcrumb(e.target.value); }} />
        <Input label="العنوان" value={title} onChange={(e) => { setTitle(e.target.value); }} />
        <Textarea label="الوصف" value={description} onChange={(e) => { setDescription(e.target.value); }} rows={2} />
      </div>
      <div className="mt-3 flex justify-end">
        <DashboardButton variant="secondary" size="sm" onClick={handleApply}>تطبيق</DashboardButton>
      </div>
    </ContentCard>
  );
}

function VersionSection({ data, onChange }: { data: PolicyData; onChange: (v: Partial<PolicyData>) => void }) {
  const [version, setVersion] = useState(data.version || "2.1");
  const [effectiveDate, setEffectiveDate] = useState(data.effectiveDate || "1 مايو 2025");
  const [entity, setEntity] = useState(data.entity || "شركة أيسَر للبرمجيات");

  useEffect(() => { 
    setVersion(data.version || "2.1"); 
    setEffectiveDate(data.effectiveDate || "1 مايو 2025"); 
    setEntity(data.entity || "شركة أيسَر للبرمجيات"); 
  }, [data]);

  const handleApply = () => {
    onChange({ version, effectiveDate, entity });
  };

  return (
    <ContentCard title="الإصدار والتاريخ" subtitle="رقم الإصدار وتاريخ السريان">
      <div className="form-grid-2">
        <Input label="رقم الإصدار" value={version} onChange={(e) => { setVersion(e.target.value); }} />
        <Input label="تاريخ السريان" value={effectiveDate} onChange={(e) => { setEffectiveDate(e.target.value); }} />
        <Input label="اسم الجهة" value={entity} onChange={(e) => { setEntity(e.target.value); }} />
      </div>
      <div className="mt-3 flex justify-end">
        <DashboardButton variant="secondary" size="sm" onClick={handleApply}>تطبيق</DashboardButton>
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
  const [card, setCard] = useState(data.sidebarCard || { 
    title: "هل تحتاج مساعدة؟", 
    desc: "فريق الدعم متاح للإجابة عن استفساراتك", 
    linkLabel: "تواصل معنا", 
    href: "/contact" 
  });

  useEffect(() => { 
    setCard(data.sidebarCard || { 
      title: "هل تحتاج مساعدة؟", 
      desc: "فريق الدعم متاح للإجابة عن استفساراتك", 
      linkLabel: "تواصل معنا", 
      href: "/contact" 
    }); 
  }, [data]);

  const handleApply = () => {
    onChange(card);
  };

  return (
    <ContentCard title="بطاقة الشريط الجانبي" subtitle="بطاقة المساعدة في TocSidebar">
      <div className="form-grid-2">
        <Input label="العنوان" value={card.title} onChange={(e) => { setCard({ ...card, title: e.target.value }); }} />
        <Input label="الوصف" value={card.desc} onChange={(e) => { setCard({ ...card, desc: e.target.value }); }} />
        <Input label="نص الرابط" value={card.linkLabel} onChange={(e) => { setCard({ ...card, linkLabel: e.target.value }); }} />
        <Input label="الرابط" value={card.href} onChange={(e) => { setCard({ ...card, href: e.target.value }); }} />
      </div>
      <div className="mt-3 flex justify-end">
        <DashboardButton variant="secondary" size="sm" onClick={handleApply}>تطبيق</DashboardButton>
      </div>
    </ContentCard>
  );
}

function FooterSection({ data, onChange }: { data: PolicyData; onChange: (f: { footerText: string; footerActions: PolicyData["footerActions"] }) => void }) {
  const [footerText, setFooterText] = useState(data.footerText);
  const [actions, setActions] = useState(data.footerActions);

  useEffect(() => { 
    setFooterText(data.footerText); 
    setActions(data.footerActions); 
  }, [data]);

  const handleApply = () => {
    onChange({ footerText, footerActions: actions });
  };

  return (
    <ContentCard title="شريط التذييل" subtitle="نص الحقوق وأزرار الإجراءات">
      <Textarea label="نص الحقوق" value={footerText} onChange={(e) => { setFooterText(e.target.value); }} rows={2} />
      <div className="mt-4">
        <p className="text-xs font-semibold text-[#3a4a60] mb-2">أزرار الإجراءات</p>
        {actions.map((action, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
            <Input label="النص" value={action.label} onChange={(e) => { 
              const na = [...actions]; 
              na[idx] = { ...na[idx], label: e.target.value }; 
              setActions(na); 
            }} />
            <Input label="الرابط" value={action.href} onChange={(e) => { 
              const na = [...actions]; 
              na[idx] = { ...na[idx], href: e.target.value }; 
              setActions(na); 
            }} />
            <div className="form-group-contact">
              <label>النوع</label>
              <select 
                className="form-control-contact" 
                value={action.variant} 
                onChange={(e) => { 
                  const na = [...actions]; 
                  na[idx] = { ...na[idx], variant: e.target.value as "primary" | "ghost" }; 
                  setActions(na); 
                }}
              >
                <option value="primary">أساسي</option>
                <option value="ghost">شفاف</option>
              </select>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-end">
        <DashboardButton variant="secondary" size="sm" onClick={handleApply}>تطبيق</DashboardButton>
      </div>
    </ContentCard>
  );
}
