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
  BentoFeature,
  PROJECT_OVERVIEW,
  APP_SECTION,
  CTA_SECTION,
} from "@/app/lib/dashboard/placeholders";
import { ScrollText, ChevronUp, Loader2, Plus, Trash2 } from "lucide-react";
import { IconPicker } from "@/app/components/dashboard/IconPicker";
import { IconPreview } from "@/app/components/dashboard/IconPreview";
import { ImageUploadWithPreview } from "@/app/components/ImageUploadWithPreview";

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
  const [globalDirty, setGlobalDirty] = useState(false);
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
            featureSections: d.feature_sections || d.featureSections || DEFAULTS.featureSections,
            bentoFeatures: d.bento_features || d.bentoFeatures || DEFAULTS.bentoFeatures,
            projectOverview: d.project_overview || d.projectOverview || DEFAULTS.projectOverview,
            appSection: d.app_section || d.appSection || DEFAULTS.appSection,
            ctaSection: d.cta_section || d.ctaSection || DEFAULTS.ctaSection,
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
    setActiveSection(id);
    const el = document.getElementById(id);
    if (el && pageRef.current) {
      pageRef.current.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
    }
  };

  const markDirty = useCallback(() => setGlobalDirty(true), []);

  const handleSectionSave = useCallback(async (sectionKey: string, sectionData: unknown) => {
    setSaving(sectionKey);
    const ok = await saveSection(sectionKey, sectionData);
    setSaving(null);
    if (ok) {
      setGlobalDirty(false);
      setLastSaved(new Date().toLocaleTimeString("ar-SA"));
      setTimeout(() => setLastSaved(undefined), 5000);
    }
  }, []);

  const handleGlobalSave = useCallback(async () => {
    setGlobalDirty(false);
    setSaving("all");
    const sectionsToSave = [
      ["hero", data.hero],
      ["featureSections", data.featureSections],
      ["bentoFeatures", data.bentoFeatures],
      ["projectOverview", data.projectOverview],
      ["appSection", data.appSection],
      ["ctaSection", data.ctaSection],
    ] as const;
    let allOk = true;
    for (const [key, sectionData] of sectionsToSave) {
      const ok = await saveSection(key, sectionData);
      if (!ok) allOk = false;
    }
    setSaving(null);
    if (allOk) {
      setLastSaved(new Date().toLocaleTimeString("ar-SA"));
      setTimeout(() => setLastSaved(undefined), 5000);
    }
  }, [data]);

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
          <BannerSection data={data.hero} saving={saving === "hero"} onDirty={markDirty} onSave={(d) => handleSectionSave("hero", d)} />
          <FeaturesSection data={data.featureSections} saving={saving === "featureSections"} onDirty={markDirty} onSave={(d) => handleSectionSave("featureSections", d)} />
          <BentoSection data={data.bentoFeatures} saving={saving === "bentoFeatures"} onDirty={markDirty} onSave={(d) => handleSectionSave("bentoFeatures", d)} />
          <OverviewSection data={data.projectOverview} saving={saving === "projectOverview"} onDirty={markDirty} onSave={(d) => handleSectionSave("projectOverview", d)} />
          <AppSectionEditor data={data.appSection} saving={saving === "appSection"} onDirty={markDirty} onSave={(d) => handleSectionSave("appSection", d)} />
          <CTASectionEditor data={data.ctaSection} saving={saving === "ctaSection"} onDirty={markDirty} onSave={(d) => handleSectionSave("ctaSection", d)} />
        </div>
        <SaveBar
          isDirty={globalDirty}
          isSubmitting={saving === "all"}
          onSave={handleGlobalSave}
          lastSaved={lastSaved ?? null}
        />
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

function BannerSection({ data: initial, saving, onSave, onDirty }: { data: typeof HOME_HERO; saving: boolean; onSave: (d: typeof HOME_HERO) => void; onDirty?: () => void }) {
  const [data, setData] = useState(initial);
  const handleChange = useCallback((patch: Partial<typeof HOME_HERO>) => {
    setData((prev) => ({ ...prev, ...patch }));
    onDirty?.();
  }, [onDirty]);
  return (
    <section id="banner">
      <ContentCard title="البانر الرئيسي" subtitle="عنوان الصفحة الرئيسية والوصف والأزرار">
        <div className="form-grid-2">
          <Input label="الشارة (Badge)" value={data.badge || ""} onChange={(e) => handleChange({ badge: e.target.value })} />
          <Input label="العنوان الرئيسي" value={data.title} onChange={(e) => handleChange({ title: e.target.value })} />
          <Input label="عنوان مميز" value={data.titleAccent || ""} onChange={(e) => handleChange({ titleAccent: e.target.value })} />
          <Textarea label="الوصف" value={data.subtitle} onChange={(e) => handleChange({ subtitle: e.target.value })} rows={3} />
          <Input label="زر رئيسي — النص" value={data.primaryCtaLabel || ""} onChange={(e) => handleChange({ primaryCtaLabel: e.target.value })} />
          <Input label="زر رئيسي — الرابط" value={data.primaryCtaHref || ""} onChange={(e) => handleChange({ primaryCtaHref: e.target.value })} />
          <Input label="زر ثانوي — النص" value={data.secondaryCtaLabel || ""} onChange={(e) => handleChange({ secondaryCtaLabel: e.target.value })} />
          <Input label="زر ثانوي — الرابط" value={data.secondaryCtaHref || ""} onChange={(e) => handleChange({ secondaryCtaHref: e.target.value })} />
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

function FeaturesSection({ data: initial, saving, onSave, onDirty }: { data: typeof FEATURE_SECTIONS; saving: boolean; onSave: (d: typeof FEATURE_SECTIONS) => void; onDirty?: () => void }) {
  const [sectionsData, setSectionsData] = useState(initial);
  const updateSection = useCallback((idx: number, patch: Partial<(typeof FEATURE_SECTIONS)[number]>) => {
    setSectionsData((prev) => {
      const n = [...prev];
      n[idx] = { ...n[idx], ...patch };
      return n;
    });
    onDirty?.();
  }, [onDirty]);
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
                <Input label="العنوان الفرعي" value={sec.eyebrow} onChange={(e) => updateSection(idx, { eyebrow: e.target.value })} />
                <Input label="العنوان" value={sec.title} onChange={(e) => updateSection(idx, { title: e.target.value })} />
                <Input label="عنوان مميز" value={sec.titleAccent || ""} onChange={(e) => updateSection(idx, { titleAccent: e.target.value })} />
                <div className="form-group-contact">
                  <label>لون التمييز</label>
                  <div className="flex items-center gap-2">
                    <input className="form-control-contact" value={sec.accentColor} onChange={(e) => updateSection(idx, { accentColor: e.target.value })} />
                    <div className="w-6 h-6 rounded border border-[#e8edf5] shrink-0" style={{ backgroundColor: sec.accentColor }} />
                  </div>
                </div>
                <Textarea label="الوصف" value={sec.description} onChange={(e) => updateSection(idx, { description: e.target.value })} rows={2} />
              </div>
              <div className="mt-3">
                <DynamicList
                  label="نقاط المميزات"
                  items={sec.features}
                  onChange={(items) => { updateSection(idx, { features: items }); }}
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

const NEW_CARD_TEMPLATE: BentoFeature = {
  iconName: "HelpCircle",
  iconUrl: null,
  title: "بطاقة جديدة",
  description: "وصف البطاقة",
  iconBg: "#f5f6f9",
  iconColor: "#0c2954",
};

function BentoSection({ data: initial, saving, onSave, onDirty }: { data: typeof BENTO_FEATURES; saving: boolean; onSave: (d: typeof BENTO_FEATURES) => void; onDirty?: () => void }) {
  const [features, setFeatures] = useState(initial);

  const existingUploads: string[] = [];
  for (const f of features) {
    if (f.iconUrl) existingUploads.push(f.iconUrl);
  }

  const handleChange = useCallback((idx: number, patch: Partial<BentoFeature>) => {
    setFeatures((prev) => {
      const n = [...prev];
      n[idx] = { ...n[idx], ...patch };
      return n;
    });
    onDirty?.();
  }, [onDirty]);

  const handleIconChange = (idx: number, name: string, url?: string | null) => {
    handleChange(idx, { iconName: name, iconUrl: url ?? null });
  };

  const handleAdd = () => {
    setFeatures((prev) => [...prev, { ...NEW_CARD_TEMPLATE, iconUrl: null }]);
    onDirty?.();
  };

  const handleDelete = (idx: number) => {
    setFeatures((prev) => prev.filter((_, i) => i !== idx));
    onDirty?.();
  };

  return (
    <section id="bento">
      <ContentCard
        title="شبكة المميزات (Bento)"
        subtitle={`${features.length} بطاقة مميزة في الشبكة`}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {features.map((feat, idx) => (
            <div key={idx} className="relative rounded-lg border border-[#e8edf5] p-4 bg-[#fafbfc] group">
              <button
                type="button"
                onClick={() => handleDelete(idx)}
                className="absolute top-2 left-2 w-6 h-6 flex items-center justify-center rounded-md hover:bg-red-50 transition-colors"
                title="حذف البطاقة"
              >
                <Trash2 className="w-3.5 h-3.5 text-red-400 hover:text-red-600" />
              </button>
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
                  style={{ backgroundColor: feat.iconColor }}
                >
                  <IconPreview
                    iconName={feat.iconName}
                    iconUrl={feat.iconUrl}
                    iconColor="#ffffff"
                    size={14}
                  />
                </div>
                <span className="text-sm font-bold text-[#0c2954] truncate">{feat.title}</span>
              </div>
              <div className="form-grid-2">
                <div className="form-group-contact">
                  <label>الأيقونة</label>
                  <IconPicker
                    iconName={feat.iconName}
                    iconUrl={feat.iconUrl}
                    iconColor={feat.iconColor}
                    iconBg={feat.iconBg}
                    onChange={(iconName, iconUrl) => handleIconChange(idx, iconName, iconUrl)}
                    existingUploads={existingUploads}
                  />
                </div>
                <Input label="العنوان" value={feat.title} onChange={(e) => handleChange(idx, { title: e.target.value })} />
                <Input label="الوصف" value={feat.description} onChange={(e) => handleChange(idx, { description: e.target.value })} />
                <div className="form-group-contact">
                  <label>لون الخلفية</label>
                  <div className="flex items-center gap-2">
                    <input className="form-control-contact" value={feat.iconBg} onChange={(e) => handleChange(idx, { iconBg: e.target.value })} />
                    <div className="w-6 h-6 rounded border border-[#e8edf5] shrink-0" style={{ backgroundColor: feat.iconBg }} />
                  </div>
                </div>
                <div className="form-group-contact">
                  <label>لون الأيقونة</label>
                  <div className="flex items-center gap-2">
                    <input className="form-control-contact" value={feat.iconColor} onChange={(e) => handleChange(idx, { iconColor: e.target.value })} />
                    <div className="w-6 h-6 rounded border border-[#e8edf5] shrink-0" style={{ backgroundColor: feat.iconColor }} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={handleAdd}
          className="mt-4 w-full py-3 rounded-xl border-2 border-dashed border-[#e8edf5] text-sm text-[#6b7a94] hover:border-[#0c2954]/30 hover:text-[#0c2954] hover:bg-[#f5f6f9] transition-colors flex items-center justify-center gap-2"
        >
          <Plus className="w-4 h-4" />
          إضافة بطاقة جديدة
        </button>

        <div className="mt-5 flex justify-end">
          <DashboardButton disabled={saving} onClick={() => onSave(features)}>
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}

function OverviewSection({ data: initial, saving, onSave, onDirty }: { data: typeof PROJECT_OVERVIEW; saving: boolean; onSave: (d: typeof PROJECT_OVERVIEW) => void; onDirty?: () => void }) {
  const [data, setData] = useState(initial);
  const handleChange = useCallback((patch: Partial<typeof PROJECT_OVERVIEW>) => {
    setData((prev) => ({ ...prev, ...patch }));
    onDirty?.();
  }, [onDirty]);
  return (
    <section id="overview">
      <ContentCard title="نظرة على المشروع" subtitle="قسم النظرة العامة مع إحصائيات المشاريع">
        <div className="form-grid-2">
          <Input label="العنوان الفرعي" value={data.eyebrow} onChange={(e) => handleChange({ eyebrow: e.target.value })} />
          <Input label="العنوان" value={data.title} onChange={(e) => handleChange({ title: e.target.value })} />
          <Input label="عنوان مميز" value={data.titleAccent} onChange={(e) => handleChange({ titleAccent: e.target.value })} />
          <Textarea label="الوصف" value={data.description} onChange={(e) => handleChange({ description: e.target.value })} rows={3} />
          <Input label="نص الرابط" value={data.linkLabel} onChange={(e) => handleChange({ linkLabel: e.target.value })} />
          <Input label="الرابط" value={data.linkHref} onChange={(e) => handleChange({ linkHref: e.target.value })} />
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
              handleChange({ checkItems: parsed });
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

function AppSectionEditor({ data: initial, saving, onSave, onDirty }: { data: typeof APP_SECTION; saving: boolean; onSave: (d: typeof APP_SECTION) => void; onDirty?: () => void }) {
  const [data, setData] = useState(initial);
  const [leftPhoneImage, setLeftPhoneImage] = useState<string | null>(initial.app_images?.left_phone || null);
  const [rightPhoneImage, setRightPhoneImage] = useState<string | null>(initial.app_images?.right_phone || null);
  const [uploading, setUploading] = useState(false);

  const handleChange = useCallback((patch: Partial<typeof APP_SECTION>) => {
    setData((prev) => ({ ...prev, ...patch }));
    onDirty?.();
  }, [onDirty]);

  const handleLeftPhoneUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("position", "left");

    try {
      const res = await fetch("/api/upload-app-image", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setLeftPhoneImage(result.imageUrl);
        onDirty?.();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleRightPhoneUpload = async (file: File) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("position", "right");

    try {
      const res = await fetch("/api/upload-app-image", {
        method: "POST",
        body: formData,
      });
      const result = await res.json();
      if (result.success) {
        setRightPhoneImage(result.imageUrl);
        onDirty?.();
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Upload failed:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleSave = () => {
    onSave({
      ...data,
      app_images: {
        left_phone: leftPhoneImage,
        right_phone: rightPhoneImage,
      },
    });
  };

  return (
    <section id="app">
      <ContentCard title="قسم التطبيق" subtitle="روابط تحميل تطبيق أيسَر">
        <div className="form-grid-2">
          <Input label="العنوان الفرعي" value={data.eyebrow} onChange={(e) => handleChange({ eyebrow: e.target.value })} />
          <Input label="العنوان" value={data.title} onChange={(e) => handleChange({ title: e.target.value })} />
          <Input label="عنوان مميز" value={data.titleAccent} onChange={(e) => handleChange({ titleAccent: e.target.value })} />
          <Textarea label="الوصف" value={data.description} onChange={(e) => handleChange({ description: e.target.value })} rows={3} />
          <Input label="App Store" value={data.appStoreUrl} onChange={(e) => handleChange({ appStoreUrl: e.target.value })} />
          <Input label="Google Play" value={data.googlePlayUrl} onChange={(e) => handleChange({ googlePlayUrl: e.target.value })} />
        </div>

        {/* Phone Images */}
        <div className="mt-6">
          <h4 className="text-sm font-medium text-navy mb-4">صور الهواتف</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploadWithPreview
              label="صورة الهاتف الأيسر"
              currentImage={leftPhoneImage}
              defaultImage="/app-screenshot.jpg"
              onUpload={handleLeftPhoneUpload}
              onRemove={() => { setLeftPhoneImage(null); onDirty?.(); }}
              aspectRatio={{ width: 9, height: 19.5 }}
            />
            <ImageUploadWithPreview
              label="صورة الهاتف الأيمن"
              currentImage={rightPhoneImage}
              defaultImage="/app-screenshot.jpg"
              onUpload={handleRightPhoneUpload}
              onRemove={() => { setRightPhoneImage(null); onDirty?.(); }}
              aspectRatio={{ width: 9, height: 19.5 }}
            />
          </div>
        </div>

        <div className="mt-5 flex justify-end">
          <DashboardButton disabled={saving || uploading} onClick={handleSave}>
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}

function CTASectionEditor({ data: initial, saving, onSave, onDirty }: { data: typeof CTA_SECTION; saving: boolean; onSave: (d: typeof CTA_SECTION) => void; onDirty?: () => void }) {
  const [data, setData] = useState(initial);
  const handleChange = useCallback((patch: Partial<typeof CTA_SECTION>) => {
    setData((prev) => ({ ...prev, ...patch }));
    onDirty?.();
  }, [onDirty]);
  return (
    <section id="cta">
      <ContentCard title="دعوة للعمل (CTA)" subtitle="القسم الأخير في الصفحة الرئيسية">
        <div className="form-grid-2">
          <Input label="العنوان" value={data.title} onChange={(e) => handleChange({ title: e.target.value })} />
          <Textarea label="الوصف" value={data.subtitle} onChange={(e) => handleChange({ subtitle: e.target.value })} rows={2} />
          <Input label="زر رئيسي — النص" value={data.primaryCtaLabel} onChange={(e) => handleChange({ primaryCtaLabel: e.target.value })} />
          <Input label="زر رئيسي — الرابط" value={data.primaryCtaHref} onChange={(e) => handleChange({ primaryCtaHref: e.target.value })} />
          <Input label="زر ثانوي — النص" value={data.secondaryCtaLabel} onChange={(e) => handleChange({ secondaryCtaLabel: e.target.value })} />
          <Input label="زر ثانوي — الرابط" value={data.secondaryCtaHref} onChange={(e) => handleChange({ secondaryCtaHref: e.target.value })} />
          <Input label="ملاحظة" value={data.note || ""} onChange={(e) => handleChange({ note: e.target.value })} />
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
