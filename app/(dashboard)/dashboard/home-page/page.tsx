"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input, Textarea } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { Badge } from "@/components/ui/badge";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { SaveBar } from "@/app/components/dashboard/SaveBar";
import { DynamicList } from "@/app/components/dashboard/DynamicList";
import {
  HOME_HERO,
  FEATURE_SECTIONS,
  BENTO_FEATURES,
  PROJECT_OVERVIEW,
  APP_SECTION,
  CTA_SECTION,
} from "@/app/lib/dashboard/placeholders";
import { ScrollText, ChevronUp, Loader2 } from "lucide-react";

const sections = [
  { id: "banner", label: "البانر الرئيسي" },
  { id: "features", label: "المميزات الرئيسية" },
  { id: "bento", label: "شبكة المميزات" },
  { id: "overview", label: "نظرة على المشروع" },
  { id: "app", label: "قسم التطبيق" },
  { id: "cta", label: "دعوة للعمل" },
];

interface HomePageData {
  hero: typeof HOME_HERO;
  featureSections: typeof FEATURE_SECTIONS;
  bentoFeatures: typeof BENTO_FEATURES;
  projectOverview: typeof PROJECT_OVERVIEW;
  appSection: typeof APP_SECTION;
  ctaSection: typeof CTA_SECTION;
}

const DEFAULTS: HomePageData = {
  hero: HOME_HERO,
  featureSections: FEATURE_SECTIONS,
  bentoFeatures: BENTO_FEATURES,
  projectOverview: PROJECT_OVERVIEW,
  appSection: APP_SECTION,
  ctaSection: CTA_SECTION,
};

async function saveSection(section: string, data: unknown): Promise<boolean> {
  try {
    const res = await fetch("/api/home-page", {
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

export default function HomePageEditor() {
  const [data, setData] = useState<HomePageData>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string>();
  const [activeSection, setActiveSection] = useState("banner");
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/home-page");
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setData({
            hero: d.hero || DEFAULTS.hero,
            featureSections: d.featureSections || DEFAULTS.featureSections,
            bentoFeatures: d.bentoFeatures || DEFAULTS.bentoFeatures,
            projectOverview: d.projectOverview || DEFAULTS.projectOverview,
            appSection: d.appSection || DEFAULTS.appSection,
            ctaSection: d.ctaSection || DEFAULTS.ctaSection,
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
          <h1 className="text-xl font-bold text-[#0c2954] mb-1">الصفحة الرئيسية</h1>
          <p className="text-sm text-[#6b7a94]">تعديل محتوى الصفحة الرئيسية — البانر، المميزات، شبكة المميزات، وغيرها</p>
          {fetchError && <p className="text-xs text-amber-600 mt-1">{fetchError}</p>}
        </div>
        <div className="space-y-6 pb-24">
          <BannerSection data={data.hero} saving={saving === "hero"} onSave={(d) => handleSectionSave("hero", d)} />
          <FeaturesSection data={data.featureSections} saving={saving === "featureSections"} onSave={(d) => handleSectionSave("featureSections", d)} />
          <BentoSection data={data.bentoFeatures} saving={saving === "bentoFeatures"} onSave={(d) => handleSectionSave("bentoFeatures", d)} />
          <OverviewSection data={data.projectOverview} saving={saving === "projectOverview"} onSave={(d) => handleSectionSave("projectOverview", d)} />
          <AppSectionEditor data={data.appSection} saving={saving === "appSection"} onSave={(d) => handleSectionSave("appSection", d)} />
          <CTASectionEditor data={data.ctaSection} saving={saving === "ctaSection"} onSave={(d) => handleSectionSave("ctaSection", d)} />
        </div>
        {lastSaved && <SaveBar isDirty={true} isSubmitting={false} onReset={() => {}} lastSaved={lastSaved} />}
      </div>
      <div className="hidden xl:block w-[200px] shrink-0">
        <div className="sticky top-0">
          <div className="bg-white rounded-xl border border-[#e8edf5] p-4">
            <p className="text-xs font-bold text-[#0c2954] mb-3 flex items-center gap-1.5">
              <ScrollText className="w-3.5 h-3.5" /> الأقسام
            </p>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button key={s.id} onClick={() => scrollTo(s.id)}
                  className={`w-full text-right text-xs py-1.5 px-2 rounded-md transition-colors ${activeSection === s.id ? "bg-[#0c2954]/5 text-[#0c2954] font-medium" : "text-[#6b7a94] hover:text-[#0c2954] hover:bg-[#f5f6f9]"}`}
                >{s.label}</button>
              ))}
            </nav>
            <button onClick={() => pageRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-3 w-full flex items-center justify-center gap-1 text-[10px] text-[#6b7a94] hover:text-[#0c2954] py-1.5 rounded-md hover:bg-[#f5f6f9] transition-colors"
            ><ChevronUp className="w-3 h-3" /> العودة للأعلى</button>
          </div>
        </div>
      </div>
    </div>
  );
}

function BannerSection({ data: initial, saving, onSave }: { data: typeof HOME_HERO; saving: boolean; onSave: (d: typeof HOME_HERO) => void }) {
  const [data, setData] = useState(initial);
  return (
    <section id="banner">
      <ContentCard title="البانر الرئيسي" subtitle="عنوان الصفحة الرئيسية والوصف والأزرار">
        <div className="form-grid-2">
          <Input label="الشارة (Badge)" value={data.badge || ""} onChange={(e) => setData({ ...data, badge: e.target.value })} />
          <Input label="العنوان الرئيسي" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
          <Input label="عنوان مميز" value={data.titleAccent || ""} onChange={(e) => setData({ ...data, titleAccent: e.target.value })} />
          <Textarea label="الوصف" value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} rows={3} />
          <Input label="زر رئيسي — النص" value={data.primaryCtaLabel || ""} onChange={(e) => setData({ ...data, primaryCtaLabel: e.target.value })} />
          <Input label="زر رئيسي — الرابط" value={data.primaryCtaHref || ""} onChange={(e) => setData({ ...data, primaryCtaHref: e.target.value })} />
          <Input label="زر ثانوي — النص" value={data.secondaryCtaLabel || ""} onChange={(e) => setData({ ...data, secondaryCtaLabel: e.target.value })} />
          <Input label="زر ثانوي — الرابط" value={data.secondaryCtaHref || ""} onChange={(e) => setData({ ...data, secondaryCtaHref: e.target.value })} />
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

function FeaturesSection({ data: initial, saving, onSave }: { data: typeof FEATURE_SECTIONS; saving: boolean; onSave: (d: typeof FEATURE_SECTIONS) => void }) {
  const [sectionsData, setSectionsData] = useState(initial);
  return (
    <section id="features">
      <ContentCard title="المميزات الرئيسية" subtitle="4 أقسام مميزات رئيسية للمنصة">
        <div className="space-y-6">
          {sectionsData.map((sec, idx) => (
            <div key={idx} className="rounded-lg border border-[#e8edf5] p-4 bg-[#fafbfc]">
              <div className="flex items-center gap-2 mb-3">
                <Badge variant="outline" className="text-[10px]">{sec.eyebrow.split(" — ")[0]}</Badge>
                <span className="text-sm font-bold text-[#0c2954]">{sec.title}</span>
              </div>
              <div className="form-grid-2">
                <Input label="العنوان الفرعي" value={sec.eyebrow} onChange={(e) => { const n = [...sectionsData]; n[idx] = { ...n[idx], eyebrow: e.target.value }; setSectionsData(n); }} />
                <Input label="العنوان" value={sec.title} onChange={(e) => { const n = [...sectionsData]; n[idx] = { ...n[idx], title: e.target.value }; setSectionsData(n); }} />
                <Input label="عنوان مميز" value={sec.titleAccent || ""} onChange={(e) => { const n = [...sectionsData]; n[idx] = { ...n[idx], titleAccent: e.target.value }; setSectionsData(n); }} />
                <div className="form-group-contact">
                  <label>لون التمييز</label>
                  <div className="flex items-center gap-2">
                    <input className="form-control-contact" value={sec.accentColor} onChange={(e) => { const n = [...sectionsData]; n[idx] = { ...n[idx], accentColor: e.target.value }; setSectionsData(n); }} />
                    <div className="w-6 h-6 rounded border border-[#e8edf5] shrink-0" style={{ backgroundColor: sec.accentColor }} />
                  </div>
                </div>
                <Textarea label="الوصف" value={sec.description} onChange={(e) => { const n = [...sectionsData]; n[idx] = { ...n[idx], description: e.target.value }; setSectionsData(n); }} rows={2} />
              </div>
              <div className="mt-3">
                <DynamicList
                  label="نقاط المميزات"
                  items={sec.features}
                  onChange={(items) => { const n = [...sectionsData]; n[idx] = { ...n[idx], features: items }; setSectionsData(n); }}
                />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <DashboardButton disabled={saving} onClick={() => onSave(sectionsData)}>
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}

function BentoSection({ data: initial, saving, onSave }: { data: typeof BENTO_FEATURES; saving: boolean; onSave: (d: typeof BENTO_FEATURES) => void }) {
  const [features, setFeatures] = useState(initial);
  return (
    <section id="bento">
      <ContentCard title="شبكة المميزات (Bento)" subtitle="8 بطاقات مميزة في الشبكة">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feat, idx) => (
            <div key={idx} className="rounded-lg border border-[#e8edf5] p-4 bg-[#fafbfc]">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-md flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: feat.iconColor }}>
                  {feat.iconName[0]}
                </div>
                <span className="text-sm font-bold text-[#0c2954]">{feat.title}</span>
              </div>
              <div className="form-grid-2">
                <Input label="الأيقونة" value={feat.iconName} onChange={(e) => { const n = [...features]; n[idx] = { ...n[idx], iconName: e.target.value }; setFeatures(n); }} />
                <Input label="العنوان" value={feat.title} onChange={(e) => { const n = [...features]; n[idx] = { ...n[idx], title: e.target.value }; setFeatures(n); }} />
                <Input label="الوصف" value={feat.description} onChange={(e) => { const n = [...features]; n[idx] = { ...n[idx], description: e.target.value }; setFeatures(n); }} />
                <div className="form-group-contact">
                  <label>لون الخلفية</label>
                  <div className="flex items-center gap-2">
                    <input className="form-control-contact" value={feat.iconBg} onChange={(e) => { const n = [...features]; n[idx] = { ...n[idx], iconBg: e.target.value }; setFeatures(n); }} />
                    <div className="w-6 h-6 rounded border border-[#e8edf5] shrink-0" style={{ backgroundColor: feat.iconBg }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-5 flex justify-end">
          <DashboardButton disabled={saving} onClick={() => onSave(features)}>
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}

function OverviewSection({ data: initial, saving, onSave }: { data: typeof PROJECT_OVERVIEW; saving: boolean; onSave: (d: typeof PROJECT_OVERVIEW) => void }) {
  const [data, setData] = useState(initial);
  return (
    <section id="overview">
      <ContentCard title="نظرة على المشروع" subtitle="قسم النظرة العامة مع إحصائيات المشاريع">
        <div className="form-grid-2">
          <Input label="العنوان الفرعي" value={data.eyebrow} onChange={(e) => setData({ ...data, eyebrow: e.target.value })} />
          <Input label="العنوان" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
          <Input label="عنوان مميز" value={data.titleAccent} onChange={(e) => setData({ ...data, titleAccent: e.target.value })} />
          <Textarea label="الوصف" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} rows={3} />
          <Input label="نص الرابط" value={data.linkLabel} onChange={(e) => setData({ ...data, linkLabel: e.target.value })} />
          <Input label="الرابط" value={data.linkHref} onChange={(e) => setData({ ...data, linkHref: e.target.value })} />
        </div>
        <div className="mt-5">
          <DynamicList
            label="نقاط المميزات"
            items={data.checkItems.map((i) => `${i.bold} — ${i.detail}`)}
            onChange={(items) => {
              const parsed = items.map((item) => {
                const parts = item.split(" — ");
                return { bold: parts[0] || "", detail: parts[1] || "" };
              });
              setData({ ...data, checkItems: parsed });
            }}
          />
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

function AppSectionEditor({ data: initial, saving, onSave }: { data: typeof APP_SECTION; saving: boolean; onSave: (d: typeof APP_SECTION) => void }) {
  const [data, setData] = useState(initial);
  return (
    <section id="app">
      <ContentCard title="قسم التطبيق" subtitle="روابط تحميل تطبيق أيسَر">
        <div className="form-grid-2">
          <Input label="العنوان الفرعي" value={data.eyebrow} onChange={(e) => setData({ ...data, eyebrow: e.target.value })} />
          <Input label="العنوان" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
          <Input label="عنوان مميز" value={data.titleAccent} onChange={(e) => setData({ ...data, titleAccent: e.target.value })} />
          <Textarea label="الوصف" value={data.description} onChange={(e) => setData({ ...data, description: e.target.value })} rows={3} />
          <Input label="App Store" value={data.appStoreUrl} onChange={(e) => setData({ ...data, appStoreUrl: e.target.value })} />
          <Input label="Google Play" value={data.googlePlayUrl} onChange={(e) => setData({ ...data, googlePlayUrl: e.target.value })} />
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

function CTASectionEditor({ data: initial, saving, onSave }: { data: typeof CTA_SECTION; saving: boolean; onSave: (d: typeof CTA_SECTION) => void }) {
  const [data, setData] = useState(initial);
  return (
    <section id="cta">
      <ContentCard title="دعوة للعمل (CTA)" subtitle="القسم الأخير في الصفحة الرئيسية">
        <div className="form-grid-2">
          <Input label="العنوان" value={data.title} onChange={(e) => setData({ ...data, title: e.target.value })} />
          <Textarea label="الوصف" value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} rows={2} />
          <Input label="زر رئيسي — النص" value={data.primaryCtaLabel} onChange={(e) => setData({ ...data, primaryCtaLabel: e.target.value })} />
          <Input label="زر رئيسي — الرابط" value={data.primaryCtaHref} onChange={(e) => setData({ ...data, primaryCtaHref: e.target.value })} />
          <Input label="زر ثانوي — النص" value={data.secondaryCtaLabel} onChange={(e) => setData({ ...data, secondaryCtaLabel: e.target.value })} />
          <Input label="زر ثانوي — الرابط" value={data.secondaryCtaHref} onChange={(e) => setData({ ...data, secondaryCtaHref: e.target.value })} />
          <Input label="ملاحظة" value={data.note || ""} onChange={(e) => setData({ ...data, note: e.target.value })} />
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
