"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Input, Textarea } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { DynamicList } from "@/app/components/dashboard/DynamicList";
import { CONTACT_HERO, CONTACT_INFO, CHANNELS } from "@/app/lib/dashboard/placeholders";
import { INQUIRY_OPTIONS } from "@/lib/contact-data";
import type { Channel, InquiryType } from "@/lib/contact-data";
import { ScrollText, ChevronUp, Loader2 } from "lucide-react";

const sections = [
  { id: "banner", label: "البانر" },
  { id: "form", label: "النموذج" },
  { id: "channels", label: "القنوات" },
];

interface ContactSectionData {
  hero: typeof CONTACT_HERO;
  contactInfo: typeof CONTACT_INFO;
  channels: typeof CHANNELS;
  inquiryOptions: typeof INQUIRY_OPTIONS;
  successMessage: string;
  formFields: { name: boolean; phone: boolean; email: boolean; type: boolean; message: boolean };
}

const DEFAULTS: ContactSectionData = {
  hero: CONTACT_HERO,
  contactInfo: CONTACT_INFO,
  channels: CHANNELS,
  inquiryOptions: INQUIRY_OPTIONS,
  successMessage: "تم إرسال رسالتك بنجاح! سنتواصل معك خلال 24 ساعة.",
  formFields: { name: true, phone: true, email: true, type: true, message: true },
};

async function saveSection(section: string, data: unknown): Promise<boolean> {
  try {
    const res = await fetch("/api/contact-page", {
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

export default function ContactPageEditor() {
  const [data, setData] = useState<ContactSectionData>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState("");
  const [saving, setSaving] = useState<string | null>(null);
  const [lastSaved, setLastSaved] = useState<string>();
  const [activeSection, setActiveSection] = useState("banner");
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/contact-page");
        const json = await res.json();
        if (json.success && json.data) {
          const d = json.data;
          setData({
            hero: d.hero || DEFAULTS.hero,
            contactInfo: d.contactInfo || DEFAULTS.contactInfo,
            channels: d.channels || DEFAULTS.channels,
            inquiryOptions: d.inquiryOptions || DEFAULTS.inquiryOptions,
            successMessage: d.successMessage || DEFAULTS.successMessage,
            formFields: d.formFields || DEFAULTS.formFields,
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
          <h1 className="text-xl font-bold text-[#0c2954] mb-1">صفحة التواصل</h1>
          <p className="text-sm text-[#6b7a94]">تعديل البانر، نموذج التواصل، وقنوات الاتصال</p>
          {fetchError && <p className="text-xs text-amber-600 mt-1">{fetchError}</p>}
        </div>
        <div className="space-y-6 pb-24">
          <BannerSection data={data.hero} saving={saving === "hero"} onSave={(d) => handleSectionSave("hero", d)} />
          <FormSection data={data} saving={saving === "form"} onSave={(d) => handleFormSave(d)} />
          <ChannelsSection data={data} saving={saving === "channels"} onSave={(d) => handleChannelsSave(d)} />
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

  async function handleFormSave(formData: { inquiryOptions: typeof INQUIRY_OPTIONS; successMessage: string; formFields: typeof DEFAULTS.formFields }) {
    setSaving("form");
    const [a, b] = await Promise.all([
      saveSection("inquiryOptions", formData.inquiryOptions),
      saveSection("successMessage", formData.successMessage),
      saveSection("formFields", formData.formFields),
    ]);
    await saveSection("inquiryOptions", formData.inquiryOptions);
    await saveSection("successMessage", formData.successMessage);
    await saveSection("formFields", formData.formFields);
    setSaving(null);
    setLastSaved(new Date().toLocaleTimeString("ar-SA"));
    setTimeout(() => setLastSaved(undefined), 5000);
  }

  async function handleChannelsSave(chData: { channels: Channel[]; contactInfo: typeof CONTACT_INFO }) {
    setSaving("channels");
    await saveSection("channels", chData.channels);
    await saveSection("contactInfo", chData.contactInfo);
    setSaving(null);
    setLastSaved(new Date().toLocaleTimeString("ar-SA"));
    setTimeout(() => setLastSaved(undefined), 5000);
  }
}

function BannerSection({ data: initial, saving, onSave }: { data: typeof CONTACT_HERO; saving: boolean; onSave: (d: typeof CONTACT_HERO) => void }) {
  const [data, setData] = useState(initial);
  return (
    <section id="banner">
      <ContentCard title="البانر" subtitle="عنوان صفحة التواصل">
        <div className="form-grid-2">
          <Input label="الشارة" value={data.badge} onChange={(e) => setData({ ...data, badge: e.target.value })} />
          <Input label="العنوان (السطر الأول)" value={data.titleLine1} onChange={(e) => setData({ ...data, titleLine1: e.target.value })} />
          <Input label="العنوان (السطر الثاني)" value={data.titleLine2} onChange={(e) => setData({ ...data, titleLine2: e.target.value })} />
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

function FormSection({ data, saving, onSave }: { data: ContactSectionData; saving: boolean; onSave: (d: { inquiryOptions: typeof INQUIRY_OPTIONS; successMessage: string; formFields: typeof DEFAULTS.formFields }) => void }) {
  const [inquiryTypes, setInquiryTypes] = useState(data.inquiryOptions.filter((o) => o.value !== ""));
  const [successMessage, setSuccessMessage] = useState(data.successMessage);
  const [fields, setFields] = useState(data.formFields);

  return (
    <section id="form">
      <ContentCard title="نموذج التواصل" subtitle="إعدادات نموذج الاتصال">
        <div className="space-y-5">
          <div>
            <p className="text-xs font-semibold text-[#3a4a60] mb-2">الحقول المفعلة</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {Object.entries(fields).map(([key, val]) => (
                <label key={key} className="flex items-center gap-2 text-sm"><Checkbox checked={val} onCheckedChange={(v) => setFields({ ...fields, [key]: !!v })} />
                  {key === "name" && "الاسم"}{key === "phone" && "الجوال"}{key === "email" && "البريد"}{key === "type" && "نوع الاستفسار"}{key === "message" && "الرسالة"}
                </label>
              ))}
            </div>
          </div>
          <Textarea label="رسالة النجاح" value={successMessage} onChange={(e) => setSuccessMessage(e.target.value)} rows={2} />
          <div>
            <p className="text-xs font-semibold text-[#3a4a60] mb-2">أنواع الاستفسارات</p>
            <DynamicList items={inquiryTypes.map((o) => o.label)} onChange={(items) => { setInquiryTypes(items.map((label) => ({ value: "" as "" | InquiryType, label }))); }} />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <DashboardButton disabled={saving} onClick={() => onSave({ inquiryOptions: [{ value: "", label: "اختر نوع الاستفسار" }, ...inquiryTypes], successMessage, formFields: fields })}>
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}

function ChannelsSection({ data, saving, onSave }: { data: ContactSectionData; saving: boolean; onSave: (d: { channels: Channel[]; contactInfo: typeof CONTACT_INFO }) => void }) {
  const [channels, setChannels] = useState<Channel[]>(data.channels);
  const [info, setInfo] = useState(data.contactInfo);

  return (
    <section id="channels">
      <ContentCard title="قنوات التواصل" subtitle="بيانات التواصل والقنوات المباشرة">
        <div className="space-y-4">
          {channels.map((ch, idx) => (
            <div key={ch.id} className="rounded-lg border border-[#e8edf5] p-4 bg-[#fafbfc]">
              <p className="text-sm font-bold text-[#0c2954] mb-3">{ch.name}</p>
              <div className="form-grid-2">
                <Input label="اسم القناة" value={ch.name} onChange={(e) => { const n = [...channels]; n[idx] = { ...n[idx], name: e.target.value }; setChannels(n); }} />
                <Input label="القيمة" value={ch.value} onChange={(e) => { const n = [...channels]; n[idx] = { ...n[idx], value: e.target.value }; setChannels(n); }} />
                <Input label="الرابط" value={ch.href} onChange={(e) => { const n = [...channels]; n[idx] = { ...n[idx], href: e.target.value }; setChannels(n); }} />
                <Input label="نص الزر" value={ch.actionLabel} onChange={(e) => { const n = [...channels]; n[idx] = { ...n[idx], actionLabel: e.target.value }; setChannels(n); }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6">
          <ContentCard title="معلومات التواصل الأساسية" className="mt-0">
            <div className="form-grid-2">
              <Input label="الهاتف" value={info.phone} onChange={(e) => setInfo({ ...info, phone: e.target.value })} />
              <Input label="البريد الإلكتروني" value={info.email} onChange={(e) => setInfo({ ...info, email: e.target.value })} />
              <Input label="الموقع" value={info.location} onChange={(e) => setInfo({ ...info, location: e.target.value })} />
              <Input label="أيام العمل" value={info.hoursDays} onChange={(e) => setInfo({ ...info, hoursDays: e.target.value })} />
              <Input label="ساعات العمل" value={info.hoursTime} onChange={(e) => setInfo({ ...info, hoursTime: e.target.value })} />
            </div>
          </ContentCard>
        </div>
        <div className="mt-5 flex justify-end">
          <DashboardButton disabled={saving} onClick={() => onSave({ channels, contactInfo: info })}>
            {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
          </DashboardButton>
        </div>
      </ContentCard>
    </section>
  );
}
