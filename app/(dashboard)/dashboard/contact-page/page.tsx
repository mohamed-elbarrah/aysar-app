"use client";

import { useState, useRef, useEffect } from "react";
import { Input, Textarea } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { Checkbox } from "@/components/ui/checkbox";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { DynamicList } from "@/app/components/dashboard/DynamicList";
import { CONTACT_HERO, CONTACT_INFO, CHANNELS } from "@/app/lib/dashboard/placeholders";
import { ScrollText, ChevronUp } from "lucide-react";

const sections = [
  { id: "banner", label: "البانر" },
  { id: "form", label: "النموذج" },
  { id: "channels", label: "القنوات" },
];

export default function ContactPageEditor() {
  const [lastSaved, setLastSaved] = useState<string>();
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
    const el = document.getElementById(id);
    if (el && pageRef.current) {
      pageRef.current.scrollTo({ top: el.offsetTop - 16, behavior: "smooth" });
    }
  };

  return (
    <div className="flex gap-6 h-[calc(100vh-120px)]">
      <div ref={pageRef} className="flex-1 overflow-y-auto pr-2 -mr-2">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-[#0c2954] mb-1">صفحة التواصل</h1>
          <p className="text-sm text-[#6b7a94]">تعديل البانر، نموذج التواصل، وقنوات الاتصال</p>
        </div>
        <div className="space-y-6 pb-24">
          <BannerSection onSave={(t) => setLastSaved(t)} />
          <FormSection onSave={(t) => setLastSaved(t)} />
          <ChannelsSection onSave={(t) => setLastSaved(t)} />
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

function BannerSection({ onSave }: { onSave: (t: string) => void }) {
  const [data, setData] = useState(CONTACT_HERO);
  return (
    <section id="banner">
      <ContentCard title="البانر" subtitle="عنوان صفحة التواصل">
        <div className="form-grid-2">
          <Input label="الشارة" value={data.badge} onChange={(e) => setData({ ...data, badge: e.target.value })} />
          <Input label="العنوان (السطر الأول)" value={data.titleLine1} onChange={(e) => setData({ ...data, titleLine1: e.target.value })} />
          <Input label="العنوان (السطر الثاني)" value={data.titleLine2} onChange={(e) => setData({ ...data, titleLine2: e.target.value })} />
          <Textarea label="الوصف" value={data.subtitle} onChange={(e) => setData({ ...data, subtitle: e.target.value })} rows={3} />
        </div>
        <div className="mt-5 flex justify-end"><DashboardButton onClick={() => onSave(new Date().toLocaleTimeString("ar-SA"))}>حفظ التغييرات</DashboardButton></div>
      </ContentCard>
    </section>
  );
}

function FormSection({ onSave }: { onSave: (t: string) => void }) {
  const [successMessage, setSuccessMessage] = useState("تم إرسال رسالتك بنجاح! سنتواصل معك خلال 24 ساعة.");
  const [inquiryTypes, setInquiryTypes] = useState([
    { value: "demo", label: "طلب عرض تجريبي" },
    { value: "pricing", label: "استفسار عن الأسعار" },
    { value: "support", label: "دعم فني" },
    { value: "partnership", label: "شراكة أو تعاون" },
    { value: "other", label: "أخرى" },
  ]);
  const [fields, setFields] = useState({ name: true, phone: true, email: true, type: true, message: true });

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
            <DynamicList items={inquiryTypes.map((o) => o.label)} onChange={(items) => { setInquiryTypes(items.map((label, i) => ({ value: `type_${i}`, label }))); }} />
          </div>
        </div>
        <div className="mt-5 flex justify-end"><DashboardButton onClick={() => onSave(new Date().toLocaleTimeString("ar-SA"))}>حفظ التغييرات</DashboardButton></div>
      </ContentCard>
    </section>
  );
}

function ChannelsSection({ onSave }: { onSave: (t: string) => void }) {
  const [channels, setChannels] = useState(CHANNELS);
  const [info, setInfo] = useState(CONTACT_INFO);

  return (
    <section id="channels">
      <ContentCard title="قنوات التواصل" subtitle="بيانات التواصل والقنوات المباشرة">
        <div className="space-y-4">
          {channels.map((ch, idx) => (
            <div key={ch.id} className="rounded-lg border border-[#e8edf5] p-4 bg-[#fafbfc]">
              <p className="text-sm font-bold text-[#0c2954] mb-3">{ch.name}</p>
              <div className="form-grid-2">
                <Input label="اسم القناة" value={ch.name} onChange={(e) => { const n = [...channels]; n[idx].name = e.target.value; setChannels(n); }} />
                <Input label="القيمة" value={ch.value} onChange={(e) => { const n = [...channels]; n[idx].value = e.target.value; setChannels(n); }} />
                <Input label="الرابط" value={ch.href} onChange={(e) => { const n = [...channels]; n[idx].href = e.target.value; setChannels(n); }} />
                <Input label="نص الزر" value={ch.actionLabel} onChange={(e) => { const n = [...channels]; n[idx].actionLabel = e.target.value; setChannels(n); }} />
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
        <div className="mt-5 flex justify-end"><DashboardButton onClick={() => onSave(new Date().toLocaleTimeString("ar-SA"))}>حفظ التغييرات</DashboardButton></div>
      </ContentCard>
    </section>
  );
}
