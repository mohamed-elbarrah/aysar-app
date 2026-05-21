"use client";

import { useState, useRef, useEffect } from "react";
import { Input, Textarea } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { DynamicList } from "@/app/components/dashboard/DynamicList";
import { SITE_SETTINGS, NAV_LINKS, SOCIAL_LINKS } from "@/app/lib/dashboard/placeholders";
import { ScrollText, ChevronUp } from "lucide-react";

const sections = [
  { id: "metadata", label: "معلومات الموقع" },
  { id: "navbar", label: "شريط التنقل" },
  { id: "footer", label: "تذييل الموقع" },
  { id: "socials", label: "وسائل التواصل" },
  { id: "apps", label: "روابط التطبيق" },
];

export default function SettingsPage() {
  const [lastSaved, setLastSaved] = useState<string>();
  const [activeSection, setActiveSection] = useState("metadata");
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
          <h1 className="text-xl font-bold text-[#0c2954] mb-1">الإعدادات العامة</h1>
          <p className="text-sm text-[#6b7a94]">تعديل إعدادات الموقع والتنقل والروابط</p>
        </div>
        <div className="space-y-6 pb-24">
          <MetadataSection onSave={(t) => setLastSaved(t)} />
          <NavbarSection onSave={(t) => setLastSaved(t)} />
          <FooterSection onSave={(t) => setLastSaved(t)} />
          <SocialsSection onSave={(t) => setLastSaved(t)} />
          <AppsSection onSave={(t) => setLastSaved(t)} />
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

function MetadataSection({ onSave }: { onSave: (t: string) => void }) {
  const [data, setData] = useState(SITE_SETTINGS);
  return (
    <section id="metadata">
      <ContentCard title="معلومات الموقع" subtitle="عنوان ووصف الموقع والSEO">
        <div className="form-grid-2">
          <Input label="عنوان الموقع" value={data.siteTitle} onChange={(e) => setData({ ...data, siteTitle: e.target.value })} />
          <Input label="Favicon" value={data.faviconUrl} onChange={(e) => setData({ ...data, faviconUrl: e.target.value })} />
          <Textarea label="وصف الموقع" value={data.siteDescription} onChange={(e) => setData({ ...data, siteDescription: e.target.value })} rows={3} />
          <Textarea label="كلمات مفتاحية (SEO)" value={data.seoKeywords} onChange={(e) => setData({ ...data, seoKeywords: e.target.value })} rows={2} />
        </div>
        <div className="mt-5 flex justify-end"><DashboardButton onClick={() => onSave(new Date().toLocaleTimeString("ar-SA"))}>حفظ التغييرات</DashboardButton></div>
      </ContentCard>
    </section>
  );
}

function NavbarSection({ onSave }: { onSave: (t: string) => void }) {
  const [links, setLinks] = useState(NAV_LINKS);
  return (
    <section id="navbar">
      <ContentCard title="شريط التنقل" subtitle="روابط شريط التنقل العلوي">
        <DynamicList items={links.map((l) => `${l.label} | ${l.href}`)} onChange={(items) => { setLinks(items.map((item) => { const [label, href] = item.split(" | "); return { label: label || "", href: href || "" }; })); }} placeholder="الاسم | الرابط" />
        <div className="mt-5 flex justify-end"><DashboardButton onClick={() => onSave(new Date().toLocaleTimeString("ar-SA"))}>حفظ التغييرات</DashboardButton></div>
      </ContentCard>
    </section>
  );
}

function FooterSection({ onSave }: { onSave: (t: string) => void }) {
  const [copyright, setCopyright] = useState("© 2026 مؤسسة أيسر المتطورة لتقنية المعلومات · رقم السجل التجاري: 4030620045");
  return (
    <section id="footer">
      <ContentCard title="تذييل الموقع" subtitle="نص حقوق النشر">
        <Textarea label="نص حقوق النشر" value={copyright} onChange={(e) => setCopyright(e.target.value)} rows={2} />
        <div className="mt-5 flex justify-end"><DashboardButton onClick={() => onSave(new Date().toLocaleTimeString("ar-SA"))}>حفظ التغييرات</DashboardButton></div>
      </ContentCard>
    </section>
  );
}

function SocialsSection({ onSave }: { onSave: (t: string) => void }) {
  const [data, setData] = useState(SOCIAL_LINKS);
  return (
    <section id="socials">
      <ContentCard title="وسائل التواصل الاجتماعي" subtitle="روابط حسابات التواصل الاجتماعي">
        <div className="form-grid-2">
          <Input label="X (Twitter)" value={data.xUrl} onChange={(e) => setData({ ...data, xUrl: e.target.value })} />
          <Input label="Instagram" value={data.instagramUrl} onChange={(e) => setData({ ...data, instagramUrl: e.target.value })} />
          <Input label="TikTok" value={data.tiktokUrl} onChange={(e) => setData({ ...data, tiktokUrl: e.target.value })} />
          <Input label="رقم WhatsApp" value={data.whatsappNumber} onChange={(e) => setData({ ...data, whatsappNumber: e.target.value })} />
        </div>
        <div className="mt-5 flex justify-end"><DashboardButton onClick={() => onSave(new Date().toLocaleTimeString("ar-SA"))}>حفظ التغييرات</DashboardButton></div>
      </ContentCard>
    </section>
  );
}

function AppsSection({ onSave }: { onSave: (t: string) => void }) {
  const [data, setData] = useState({ appStoreUrl: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar\u0026platform=iphone", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.aysar.application" });
  return (
    <section id="apps">
      <ContentCard title="روابط التطبيق" subtitle="روابط تحميل التطبيق من المتاجر">
        <div className="form-grid-2">
          <Input label="App Store" value={data.appStoreUrl} onChange={(e) => setData({ ...data, appStoreUrl: e.target.value })} />
          <Input label="Google Play" value={data.googlePlayUrl} onChange={(e) => setData({ ...data, googlePlayUrl: e.target.value })} />
        </div>
        <div className="mt-5 flex justify-end"><DashboardButton onClick={() => onSave(new Date().toLocaleTimeString("ar-SA"))}>حفظ التغييرات</DashboardButton></div>
      </ContentCard>
    </section>
  );
}
