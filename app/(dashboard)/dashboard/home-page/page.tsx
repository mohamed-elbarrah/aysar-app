"use client";

import { useEffect, useCallback, useState, useRef } from "react";
import { useDashboard } from "@/app/components/dashboard/DashboardContext";
import { Input, Textarea } from "@/app/components/ui/Input";

import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { DynamicList } from "@/app/components/dashboard/DynamicList";
import { IconPicker } from "@/app/components/dashboard/IconPicker";
import { IconPreview } from "@/app/components/dashboard/IconPreview";
import { ImageUploadWithPreview } from "@/app/components/ImageUploadWithPreview";
import { CodeEditor } from "@/app/components/dashboard/CodeEditor";
import { ColorPicker } from "@/app/components/dashboard/ColorPicker";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Loader2, ScrollText, ChevronUp } from "lucide-react";
import {
  HOME_HERO,
  FEATURE_SECTIONS,
  BENTO_FEATURES,
  PROJECT_OVERVIEW,
  APP_SECTION,
  CTA_SECTION,
  type BentoFeature,
} from "@/app/lib/dashboard/placeholders";

const sections = [
  { id: "banner", label: "البانر الرئيسي" },
  { id: "features", label: "المميزات الرئيسية" },
  { id: "bento", label: "شبكة المميزات" },
  { id: "overview", label: "نظرة على المشروع" },
  { id: "app", label: "قسم التطبيق" },
  { id: "cta", label: "دعوة للعمل" },
];

const NEW_CARD_TEMPLATE: BentoFeature = {
  iconName: "HelpCircle",
  iconUrl: null,
  title: "بطاقة جديدة",
  description: "وصف البطاقة",
  iconBg: "#f5f6f9",
  iconColor: "#0c2954",
};

export default function HomePageEditor() {
  const { homeData, loading, setHomeData } = useDashboard();
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

  if (loading.home || !homeData) {
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
        </div>
        <div className="space-y-6 pb-8">
          <BannerSection 
            data={(homeData.hero as typeof HOME_HERO) || HOME_HERO} 
            onChange={(data) => setHomeData({ hero: data }, "hero")} 
          />
          <FeaturesSection 
            data={(homeData.featureSections as typeof FEATURE_SECTIONS) || FEATURE_SECTIONS} 
            onChange={(data) => setHomeData({ featureSections: data }, "featureSections")} 
          />
          <BentoSection 
            data={(homeData.bentoFeatures as typeof BENTO_FEATURES) || BENTO_FEATURES} 
            onChange={(data) => setHomeData({ bentoFeatures: data }, "bentoFeatures")} 
          />
          <OverviewSection 
            data={(homeData.projectOverview as typeof PROJECT_OVERVIEW) || PROJECT_OVERVIEW} 
            onChange={(data) => setHomeData({ projectOverview: data }, "projectOverview")} 
          />
          <AppSectionEditor 
            data={(homeData.appSection as typeof APP_SECTION) || APP_SECTION} 
            onChange={(data) => setHomeData({ appSection: data }, "appSection")} 
          />
          <CTASectionEditor 
            data={(homeData.ctaSection as typeof CTA_SECTION) || CTA_SECTION} 
            onChange={(data) => setHomeData({ ctaSection: data }, "ctaSection")} 
          />
        </div>
      </div>
      
      <div className="hidden xl:block w-[200px] shrink-0">
        <div className="sticky top-0">
          <div className="bg-white rounded-xl border border-[#e8edf5] p-4">
            <p className="text-xs font-bold text-[#0c2954] mb-3 flex items-center gap-1.5">
              <ScrollText className="w-3.5 h-3.5" /> الأقسام
            </p>
            <nav className="space-y-1">
              {sections.map((s) => (
                <button 
                  key={s.id} 
                  onClick={() => scrollTo(s.id)}
                  className={`w-full text-right text-xs py-1.5 px-2 rounded-md transition-colors ${
                    activeSection === s.id 
                      ? "bg-[#0c2954]/5 text-[#0c2954] font-medium" 
                      : "text-[#6b7a94] hover:text-[#0c2954] hover:bg-[#f5f6f9]"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </nav>
            <button 
              onClick={() => pageRef.current?.scrollTo({ top: 0, behavior: "smooth" })}
              className="mt-3 w-full flex items-center justify-center gap-1 text-[10px] text-[#6b7a94] hover:text-[#0c2954] py-1.5 rounded-md hover:bg-[#f5f6f9] transition-colors"
            >
              <ChevronUp className="w-3 h-3" /> العودة للأعلى
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Banner Section Component
function BannerSection({ data: initial, onChange }: { 
  data: typeof HOME_HERO; 
  onChange: (data: typeof HOME_HERO) => void;
}) {
  const [data, setData] = useState(initial);
  const [heroHtml, setHeroHtml] = useState(initial.heroHtml || "");

  const handleChange = useCallback((patch: Partial<typeof HOME_HERO>) => {
    const newData = { ...data, ...patch };
    setData(newData);
    onChange(newData);
  }, [data, onChange]);

  const handleHtmlChange = useCallback((html: string) => {
    setHeroHtml(html);
    handleChange({ heroHtml: html });
  }, [handleChange]);

  return (
    <section id="banner">
      <ContentCard title="البانر الرئيسي" subtitle="عنوان الصفحة الرئيسية والوصف والأزرار">
        <div className="form-grid-2">
          <Input label="الشارة (Badge)" value={data.badge || ""} onChange={(e) => handleChange({ badge: e.target.value })} />
          <Input label="العنوان الرئيسي" value={data.title} onChange={(e) => handleChange({ title: e.target.value })} />
          <Input label="العنوان مميز" value={data.titleAccent || ""} onChange={(e) => handleChange({ titleAccent: e.target.value })} />
          <ColorPicker
            label="لون عنوان مميز"
            color={data.accentColor || "#ffffff"}
            onChange={(color) => handleChange({ accentColor: color })}
          />
          <div className="form-group-contact">
            <label>شفافية اللون (%) — {Math.round((data.accentOpacity || 0.55) * 100)}%</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={data.accentOpacity || 0.55}
              onChange={(e) => handleChange({ accentOpacity: parseFloat(e.target.value) })}
              className="w-full h-2 bg-[#e8edf5] rounded-lg appearance-none cursor-pointer mt-2"
            />
          </div>
          <Textarea label="الوصف" value={data.subtitle} onChange={(e) => handleChange({ subtitle: e.target.value })} rows={3} />
          <Input label="زر رئيسي — النص" value={data.primaryCtaLabel || ""} onChange={(e) => handleChange({ primaryCtaLabel: e.target.value })} />
          <Input label="زر رئيسي — الرابط" value={data.primaryCtaHref || ""} onChange={(e) => handleChange({ primaryCtaHref: e.target.value })} />
          <Input label="زر ثانوي — النص" value={data.secondaryCtaLabel || ""} onChange={(e) => handleChange({ secondaryCtaLabel: e.target.value })} />
          <Input label="زر ثانوي — الرابط" value={data.secondaryCtaHref || ""} onChange={(e) => handleChange({ secondaryCtaHref: e.target.value })} />
        </div>

        <div className="mt-6 pt-6 border-t border-[#e8edf5]">
          <label className="block text-sm font-medium text-navy mb-2">كود HTML للوحة التحكم</label>
          <CodeEditor value={heroHtml} onChange={handleHtmlChange} minHeight="400px" maxHeight="500px" />
        </div>
      </ContentCard>
    </section>
  );
}

// Features Section Component
function FeaturesSection({ data: initial, onChange }: { 
  data: typeof FEATURE_SECTIONS; 
  onChange: (data: typeof FEATURE_SECTIONS) => void;
}) {
  const [sectionsData, setSectionsData] = useState(initial);

  const updateSection = useCallback((idx: number, patch: Partial<(typeof FEATURE_SECTIONS)[number]>) => {
    const newData = [...sectionsData];
    newData[idx] = { ...newData[idx], ...patch };
    setSectionsData(newData);
    onChange(newData);
  }, [sectionsData, onChange]);

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
                <ColorPicker label="لون التمييز" color={sec.accentColor} onChange={(color) => updateSection(idx, { accentColor: color })} />
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
      </ContentCard>
    </section>
  );
}

// Bento Section Component
function BentoSection({ data: initial, onChange }: { 
  data: typeof BENTO_FEATURES; 
  onChange: (data: typeof BENTO_FEATURES) => void;
}) {
  const [features, setFeatures] = useState(initial);

  const handleChange = useCallback((idx: number, patch: Partial<BentoFeature>) => {
    const newData = [...features];
    newData[idx] = { ...newData[idx], ...patch };
    setFeatures(newData);
    onChange(newData);
  }, [features, onChange]);

  const handleAdd = () => {
    const newData = [...features, { ...NEW_CARD_TEMPLATE, iconUrl: null }];
    setFeatures(newData);
    onChange(newData);
  };

  const handleDelete = (idx: number) => {
    const newData = features.filter((_, i) => i !== idx);
    setFeatures(newData);
    onChange(newData);
  };

  const existingUploads = features.filter(f => f.iconUrl).map(f => f.iconUrl as string);

  return (
    <section id="bento">
      <ContentCard title="شبكة المميزات (Bento)" subtitle={`${features.length} بطاقة مميزة في الشبكة`}>
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
                  <IconPreview iconName={feat.iconName} iconUrl={feat.iconUrl} iconColor="#ffffff" size={14} />
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
                    onChange={(iconName, iconUrl) => handleChange(idx, { iconName, iconUrl: iconUrl ?? null })}
                    existingUploads={existingUploads}
                  />
                </div>
                <Input label="العنوان" value={feat.title} onChange={(e) => handleChange(idx, { title: e.target.value })} />
                <Input label="الوصف" value={feat.description} onChange={(e) => handleChange(idx, { description: e.target.value })} />
                <div className="form-group-contact">
                  <label>لون الخلفية</label>
                  <div className="flex items-center gap-2">
                    <input 
                      className="form-control-contact" 
                      value={feat.iconBg} 
                      onChange={(e) => handleChange(idx, { iconBg: e.target.value })} 
                    />
                    <div className="w-6 h-6 rounded border border-[#e8edf5] shrink-0" style={{ backgroundColor: feat.iconBg }} />
                  </div>
                </div>
                <div className="form-group-contact">
                  <label>لون الأيقونة</label>
                  <div className="flex items-center gap-2">
                    <input 
                      className="form-control-contact" 
                      value={feat.iconColor} 
                      onChange={(e) => handleChange(idx, { iconColor: e.target.value })} 
                    />
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
      </ContentCard>
    </section>
  );
}

// Overview Section Component
function OverviewSection({ data: initial, onChange }: { 
  data: typeof PROJECT_OVERVIEW; 
  onChange: (data: typeof PROJECT_OVERVIEW) => void;
}) {
  const [data, setData] = useState(initial);

  const handleChange = useCallback((patch: Partial<typeof PROJECT_OVERVIEW>) => {
    const newData = { ...data, ...patch };
    setData(newData);
    onChange(newData);
  }, [data, onChange]);

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
      </ContentCard>
    </section>
  );
}

// App Section Component
function AppSectionEditor({ data: initial, onChange }: { 
  data: typeof APP_SECTION; 
  onChange: (data: typeof APP_SECTION) => void;
}) {
  const [data, setData] = useState(initial);
  const [leftPhoneImage, setLeftPhoneImage] = useState<string | null>(initial.app_images?.left_phone || null);
  const [rightPhoneImage, setRightPhoneImage] = useState<string | null>(initial.app_images?.right_phone || null);

  const handleChange = useCallback((patch: Partial<typeof APP_SECTION>) => {
    const newData = { ...data, ...patch };
    setData(newData);
    onChange(newData);
  }, [data, onChange]);

  const handleLeftPhoneUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("position", "left");
    if (leftPhoneImage) {
      formData.append("previousUrl", leftPhoneImage);
    }

    const res = await fetch("/api/upload-app-image", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Upload failed");
    }

    setLeftPhoneImage(result.imageUrl);
    onChange({ ...data, app_images: { ...data.app_images, left_phone: result.imageUrl } });
  };

  const handleRightPhoneUpload = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("position", "right");
    if (rightPhoneImage) {
      formData.append("previousUrl", rightPhoneImage);
    }

    const res = await fetch("/api/upload-app-image", {
      method: "POST",
      body: formData,
    });
    const result = await res.json();

    if (!result.success) {
      throw new Error(result.error || "Upload failed");
    }

    setRightPhoneImage(result.imageUrl);
    onChange({ ...data, app_images: { ...data.app_images, right_phone: result.imageUrl } });
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

        <div className="mt-6">
          <h4 className="text-sm font-medium text-navy mb-2">صور الهواتف</h4>
          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700">
              <span className="font-semibold">ملاحظة:</span> يُفضل رفع صور بأبعاد <strong>450 × 975 بكسل</strong> (أو أي أبعاد تحافظ على نسبة 9:19.5) لعرض أفضل في الهواتف الظاهرة في الموقع.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ImageUploadWithPreview
              label="صورة الهاتف الأيسر"
              currentImage={leftPhoneImage}
              defaultImage="/app-screenshot.jpg"
              onUpload={handleLeftPhoneUpload}
              onRemove={async () => {
                if (leftPhoneImage) {
                  try {
                    await fetch("/api/delete-app-image", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ imageUrl: leftPhoneImage }),
                    });
                  } catch (err) {
                    console.error("Failed to delete left image from storage:", err);
                  }
                }
                setLeftPhoneImage(null);
                onChange({ ...data, app_images: { ...data.app_images, left_phone: null } });
              }}
              aspectRatio={{ width: 9, height: 19.5 }}
            />
            <ImageUploadWithPreview
              label="صورة الهاتف الأيمن"
              currentImage={rightPhoneImage}
              defaultImage="/app-screenshot.jpg"
              onUpload={handleRightPhoneUpload}
              onRemove={async () => {
                if (rightPhoneImage) {
                  try {
                    await fetch("/api/delete-app-image", {
                      method: "POST",
                      headers: { "Content-Type": "application/json" },
                      body: JSON.stringify({ imageUrl: rightPhoneImage }),
                    });
                  } catch (err) {
                    console.error("Failed to delete right image from storage:", err);
                  }
                }
                setRightPhoneImage(null);
                onChange({ ...data, app_images: { ...data.app_images, right_phone: null } });
              }}
              aspectRatio={{ width: 9, height: 19.5 }}
            />
          </div>
        </div>
      </ContentCard>
    </section>
  );
}

// CTA Section Component
function CTASectionEditor({ data: initial, onChange }: { 
  data: typeof CTA_SECTION; 
  onChange: (data: typeof CTA_SECTION) => void;
}) {
  const [data, setData] = useState(initial);

  const handleChange = useCallback((patch: Partial<typeof CTA_SECTION>) => {
    const newData = { ...data, ...patch };
    setData(newData);
    onChange(newData);
  }, [data, onChange]);

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
      </ContentCard>
    </section>
  );
}
