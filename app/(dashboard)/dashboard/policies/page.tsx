"use client";

import { useState, useEffect, useCallback } from "react";
import { Input, Textarea } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { RichTextEditor } from "@/app/components/dashboard/RichTextEditor";
import { PRIVACY_POLICY, TERMS_OF_USE, RETURN_POLICY } from "@/app/lib/dashboard/placeholders";
import { SaveBar } from "@/app/components/dashboard/SaveBar";
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

async function savePolicy(type: PolicyType, data: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch(`/api/policies/${type}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch { return false; }
}

export default function PoliciesEditor() {
  const [data, setData] = useState<Record<PolicyType, PolicyData>>(FALLBACKS);
  const [loading, setLoading] = useState(true);
  const [activeType, setActiveType] = useState<PolicyType>("privacy");
  const [saving, setSaving] = useState<PolicyType | "all" | null>(null);
  const [feedback, setFeedback] = useState("");
  const [lastSaved, setLastSaved] = useState<string | undefined>(undefined);
  const [globalDirty, setGlobalDirty] = useState(false);

  const markDirty = useCallback(() => setGlobalDirty(true), []);

  useEffect(() => {
    async function load() {
      try {
        const results = await Promise.all(POLICY_TYPES.map(async (type) => {
          const res = await fetch(`/api/policies/${type}`);
          const json = await res.json();
          return { type, data: (json.success && json.data) ? json.data : FALLBACKS[type] };
        }));
        const map = {} as Record<PolicyType, PolicyData>;
        results.forEach((r) => { map[r.type] = r.data; });
        setData(map);
      } catch { /* keep fallbacks */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleSave = useCallback(async (type: PolicyType, policyData: PolicyData) => {
    setSaving(type);
    const ok = await savePolicy(type, policyData as unknown as Record<string, unknown>);
    if (ok) {
      setData((prev) => ({ ...prev, [type]: policyData }));
      setGlobalDirty(false);
      setFeedback("تم الحفظ بنجاح");
      setLastSaved(new Date().toLocaleTimeString("ar-SA"));
      setTimeout(() => setFeedback(""), 3000);
      setTimeout(() => setLastSaved(undefined), 5000);
    }
    setSaving(null);
  }, []);

  const handleGlobalSave = useCallback(async () => {
    setGlobalDirty(false);
    setSaving("all");
    const sectionsToSave: [PolicyType, PolicyData][] = [
      ["privacy", data.privacy],
      ["terms", data.terms],
      ["returns", data.returns],
    ];
    let allOk = true;
    for (const [key, sectionData] of sectionsToSave) {
      const ok = await savePolicy(key, sectionData as unknown as Record<string, unknown>);
      if (!ok) allOk = false;
    }
    setSaving(null);
    if (allOk) {
      setLastSaved(new Date().toLocaleTimeString("ar-SA"));
      setTimeout(() => setLastSaved(undefined), 5000);
    }
  }, [data]);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]"><div className="text-center"><Loader2 className="w-8 h-8 animate-spin text-[#2d2e83] mx-auto mb-3" /><p className="text-sm text-[#6b7a94]">جارٍ تحميل البيانات...</p></div></div>
  );

  const current = data[activeType];

  return (
    <div className="space-y-6 pb-24">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-[#0c2954] mb-1">الصفحات القانونية</h1>
        <p className="text-sm text-[#6b7a94]">تعديل المحتوى — كل جزء له عنوان + محتوى بنص غني. جدول المحتويات يُستخرج تلقائياً من العناوين.</p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {POLICY_TYPES.map((type) => (
          <button key={type} onClick={() => setActiveType(type)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeType === type ? "bg-[#0c2954] text-white" : "bg-white border border-[#e8edf5] text-[#6b7a94] hover:bg-[#f5f6f9]"}`}>
            {POLICY_LABELS[type]}
          </button>
        ))}
      </div>

      <PolicyEditor data={current} type={activeType} saving={saving === activeType} onSave={(d) => handleSave(activeType, d)} feedback={feedback} onDirty={markDirty} />
      <SaveBar isDirty={globalDirty} isSubmitting={saving === "all"} onSave={handleGlobalSave} lastSaved={lastSaved ?? null} />
    </div>
  );
}

function PolicyEditor({ data: initial, type, saving, onSave, feedback, onDirty }: {
  data: PolicyData; type: PolicyType; saving: boolean; onSave: (d: PolicyData) => void; feedback: string; onDirty?: () => void;
}) {
  const [data, setData] = useState<PolicyData>(initial);
  useEffect(() => { setData(initial); }, [initial, type]);

  const updateParts = (parts: PolicyPart[]) => setData({ ...data, parts });

  return (
    <div className="space-y-6">
      <HeroSection data={data} onChange={(hero) => setData({ ...data, ...hero })} onDirty={onDirty} />
      <VersionSection data={data} onChange={(v) => setData({ ...data, ...v })} onDirty={onDirty} />
      <PartsSection parts={data.parts} onChange={updateParts} onDirty={onDirty} />
      <SidebarSection data={data} onChange={(sidebarCard) => setData({ ...data, sidebarCard: sidebarCard || undefined })} onDirty={onDirty} />
      <FooterSection data={data} onChange={(f) => setData({ ...data, footerText: f.footerText, footerActions: f.footerActions })} onDirty={onDirty} />

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#1a9a5a]">{feedback}</span>
        <DashboardButton disabled={saving} onClick={() => onSave(data)}>
          {saving ? (<>جاري الحفظ...</>) : (<>حفظ سياسة {POLICY_LABELS[type]}</>)}
        </DashboardButton>
      </div>
    </div>
  );
}

function HeroSection({ data, onChange, onDirty }: { data: PolicyData; onChange: (partial: Partial<PolicyData>) => void; onDirty?: () => void }) {
  const [badge, setBadge] = useState(data.badge);
  const [breadcrumb, setBreadcrumb] = useState(data.breadcrumb);
  const [title, setTitle] = useState(data.title);
  const [description, setDescription] = useState(data.description);
  useEffect(() => { setBadge(data.badge); setBreadcrumb(data.breadcrumb); setTitle(data.title); setDescription(data.description); }, [data]);
  return (
    <ContentCard title="البانر الرئيسي" subtitle="الشارة، العنوان، والوصف">
      <div className="form-grid-2">
        <Input label="الشارة (Badge)" value={badge} onChange={(e) => { setBadge(e.target.value); onDirty?.(); }} />
        <Input label="مسار التنقل (Breadcrumb)" value={breadcrumb} onChange={(e) => { setBreadcrumb(e.target.value); onDirty?.(); }} />
        <Input label="العنوان" value={title} onChange={(e) => { setTitle(e.target.value); onDirty?.(); }} />
        <Textarea label="الوصف" value={description} onChange={(e) => { setDescription(e.target.value); onDirty?.(); }} rows={2} />
      </div>
      <div className="mt-3 flex justify-end">
        <DashboardButton variant="secondary" size="sm" onClick={() => onChange({ badge, breadcrumb, title, description })}>تطبيق</DashboardButton>
      </div>
    </ContentCard>
  );
}

function VersionSection({ data, onChange, onDirty }: { data: PolicyData; onChange: (partial: Partial<PolicyData>) => void; onDirty?: () => void }) {
  const [version, setVersion] = useState(data.version || "2.1");
  const [effectiveDate, setEffectiveDate] = useState(data.effectiveDate || "1 مايو 2025");
  const [entity, setEntity] = useState(data.entity || "شركة أيسَر للبرمجيات");
  useEffect(() => { setVersion(data.version || "2.1"); setEffectiveDate(data.effectiveDate || "1 مايو 2025"); setEntity(data.entity || "شركة أيسَر للبرمجيات"); }, [data]);
  return (
    <ContentCard title="الإصدار والتاريخ" subtitle="رقم الإصدار وتاريخ السريان">
      <div className="form-grid-2">
        <Input label="رقم الإصدار" value={version} onChange={(e) => { setVersion(e.target.value); onDirty?.(); }} />
        <Input label="تاريخ السريان" value={effectiveDate} onChange={(e) => { setEffectiveDate(e.target.value); onDirty?.(); }} />
        <Input label="اسم الجهة" value={entity} onChange={(e) => { setEntity(e.target.value); onDirty?.(); }} />
      </div>
      <div className="mt-3 flex justify-end">
        <DashboardButton variant="secondary" size="sm" onClick={() => onChange({ version, effectiveDate, entity })}>تطبيق</DashboardButton>
      </div>
    </ContentCard>
  );
}

function PartsSection({ parts, onChange, onDirty }: { parts: PolicyPart[]; onChange: (parts: PolicyPart[]) => void; onDirty?: () => void }) {
  const [local, setLocal] = useState<PolicyPart[]>(parts);
  useEffect(() => { setLocal(parts); }, [parts]);

  const addPart = () => {
    const num = local.length + 1;
    const id = `part-${num}`;
    setLocal([...local, { id, headline: "", content: "" }]);
    onDirty?.();
  };

  const removePart = (idx: number) => {
    const parts = local.filter((_, i) => i !== idx);
    setLocal(parts);
    onDirty?.();
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
              onChange={(e) => {
                const n = [...local];
                n[idx] = { ...n[idx], headline: e.target.value };
                setLocal(n);
                onDirty?.();
              }}
            />
            <div className="mt-3">
              <label className="text-xs font-semibold text-[#3a4a60] mb-2 block">المحتوى (نص غني)</label>
              <RichTextEditor
                value={part.content}
                onChange={(v) => {
                  const n = [...local];
                  n[idx] = { ...n[idx], content: v };
                  setLocal(n);
                  onDirty?.();
                }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between">
        <DashboardButton variant="ghost" size="sm" onClick={addPart}>
          <Plus className="w-4 h-4" /> إضافة جزء
        </DashboardButton>
        <DashboardButton variant="secondary" size="sm" onClick={() => onChange(local)}>تطبيق الأجزاء</DashboardButton>
      </div>
    </ContentCard>
  );
}

function SidebarSection({ data, onChange, onDirty }: { data: PolicyData; onChange: (sidebarCard: PolicyData["sidebarCard"]) => void; onDirty?: () => void }) {
  const [card, setCard] = useState(data.sidebarCard || { title: "هل تحتاج مساعدة؟", desc: "فريق الدعم متاح للإجابة عن استفساراتك", linkLabel: "تواصل معنا", href: "/contact" });
  useEffect(() => { setCard(data.sidebarCard || { title: "هل تحتاج مساعدة؟", desc: "فريق الدعم متاح للإجابة عن استفساراتك", linkLabel: "تواصل معنا", href: "/contact" }); }, [data]);
  return (
    <ContentCard title="بطاقة الشريط الجانبي" subtitle="بطاقة المساعدة في TocSidebar">
      <div className="form-grid-2">
        <Input label="العنوان" value={card.title} onChange={(e) => { setCard({ ...card, title: e.target.value }); onDirty?.(); }} />
        <Input label="الوصف" value={card.desc} onChange={(e) => { setCard({ ...card, desc: e.target.value }); onDirty?.(); }} />
        <Input label="نص الرابط" value={card.linkLabel} onChange={(e) => { setCard({ ...card, linkLabel: e.target.value }); onDirty?.(); }} />
        <Input label="الرابط" value={card.href} onChange={(e) => { setCard({ ...card, href: e.target.value }); onDirty?.(); }} />
      </div>
      <div className="mt-3 flex justify-end">
        <DashboardButton variant="secondary" size="sm" onClick={() => onChange(card)}>تطبيق</DashboardButton>
      </div>
    </ContentCard>
  );
}

function FooterSection({ data, onChange, onDirty }: { data: PolicyData; onChange: (f: { footerText: string; footerActions: PolicyData["footerActions"] }) => void; onDirty?: () => void }) {
  const [footerText, setFooterText] = useState(data.footerText);
  const [actions, setActions] = useState(data.footerActions);
  useEffect(() => { setFooterText(data.footerText); setActions(data.footerActions); }, [data]);
  return (
    <ContentCard title="شريط التذييل" subtitle="نص الحقوق وأزرار الإجراءات">
      <Textarea label="نص الحقوق" value={footerText} onChange={(e) => { setFooterText(e.target.value); onDirty?.(); }} rows={2} />
      <div className="mt-4">
        <p className="text-xs font-semibold text-[#3a4a60] mb-2">أزرار الإجراءات</p>
        {actions.map((action, idx) => (
          <div key={idx} className="grid grid-cols-3 gap-2 mb-2">
            <Input label="النص" value={action.label} onChange={(e) => { const n = [...actions]; n[idx] = { ...n[idx], label: e.target.value }; setActions(n); onDirty?.(); }} />
            <Input label="الرابط" value={action.href} onChange={(e) => { const n = [...actions]; n[idx] = { ...n[idx], href: e.target.value }; setActions(n); onDirty?.(); }} />
            <div className="form-group-contact"><label>النوع</label><select className="form-control-contact" value={action.variant} onChange={(e) => { const n = [...actions]; n[idx] = { ...n[idx], variant: e.target.value as "primary" | "ghost" }; setActions(n); onDirty?.(); }}><option value="primary">أساسي</option><option value="ghost">شفاف</option></select></div>
          </div>
        ))}
      </div>
      <div className="mt-3 flex justify-end">
        <DashboardButton variant="secondary" size="sm" onClick={() => onChange({ footerText, footerActions: actions })}>تطبيق</DashboardButton>
      </div>
    </ContentCard>
  );
}
