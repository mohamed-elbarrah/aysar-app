"use client";

import { useState, useEffect, useCallback } from "react";
import { Input, Textarea } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { DynamicList } from "@/app/components/dashboard/DynamicList";
import { Loader2 } from "lucide-react";

interface NavLinkItem { label: string; href: string }
interface FooterLinkItem { label: string; href: string; external?: boolean }
interface SocialInfo { xUrl: string; instagramUrl: string; tiktokUrl: string; whatsappNumber: string }
interface AppLinkInfo { appStoreUrl: string; googlePlayUrl: string }
interface SettingsData {
  siteTitle: string; siteDescription: string; faviconUrl: string; seoKeywords: string;
  navLinks: NavLinkItem[];
  socialLinks: SocialInfo;
  appLinks: AppLinkInfo;
  footerCopyright: string; footerTagline: string;
  footerQuickLinks: FooterLinkItem[]; footerHelpLinks: FooterLinkItem[];
}

const DEFAULTS: SettingsData = {
  siteTitle: "أيسَر — منصة إدارة التطوير العقاري",
  siteDescription: "أيسَر تمنحك لوحة تحكم احترافية لإدارة مشاريعك وعملاءك — من تتبع مراحل الإنشاء وإشعارات فورية، حتى صفحات هبوط واستقبال حجوزات ونظام CRM متكامل.",
  faviconUrl: "/favicon.ico",
  seoKeywords: "تطوير عقاري, إدارة مشاريع, CRM عقاري, تطبيق عقارات, منصة سحابية",
  navLinks: [{ label: "الرئيسية", href: "/" }, { label: "الأسعار", href: "/plans" }, { label: "اتصل بنا", href: "/contact" }],
  socialLinks: { xUrl: "https://x.com/aysar_ksa", instagramUrl: "https://instagram.com/aysar_ksa", tiktokUrl: "https://tiktok.com/@aysar_sa", whatsappNumber: "966125101107" },
  appLinks: { appStoreUrl: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone", googlePlayUrl: "https://play.google.com/store/apps/details?id=com.aysar.application" },
  footerCopyright: "© 2026 مؤسسة أيسر المتطورة لتقنية المعلومات · رقم السجل التجاري: 4030620045",
  footerTagline: "أيسَر برنامج لإدارة العقارات وتتبع مراحل الإنشاء من أول طوبة لآخر لمسة.",
  footerQuickLinks: [{ label: "الرئيسية", href: "/" }, { label: "الأسعار", href: "/plans" }, { label: "اتصل بنا", href: "/contact" }],
  footerHelpLinks: [
    { label: "تسجيل دخول", href: "https://platform.aysar.sa/ar/company/dashboard/login" },
    { label: "مركز المساعدة", href: "https://support.aysar.sa/" },
    { label: "التحديثات", href: "https://support.aysar.sa/page/update" },
    { label: "سياسة الخصوصية", href: "/privacy-policy" },
    { label: "شروط الاستخدام", href: "/terms-of-use" },
    { label: "سياسة الاسترجاع", href: "/return-policy" },
  ],
};

async function saveSettings(data: Record<string, unknown>): Promise<boolean> {
  try {
    const res = await fetch("/api/settings", {
      method: "PATCH", headers: { "Content-Type": "application/json" }, credentials: "include",
      body: JSON.stringify(data),
    });
    return res.ok;
  } catch { return false; }
}

export default function SettingsPage() {
  const [data, setData] = useState<SettingsData>(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data) setData(json.data);
      } catch { /* keep defaults */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleSave = useCallback(async (key: string, val: unknown) => {
    setSaving(key); const ok = await saveSettings({ [key]: val }); setSaving(null);
    if (ok) { setFeedback("تم الحفظ بنجاح"); setTimeout(() => setFeedback(""), 3000); }
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-[60vh]"><div className="text-center"><Loader2 className="w-8 h-8 animate-spin text-[#2d2e83] mx-auto mb-3" /><p className="text-sm text-[#6b7a94]">جارٍ تحميل الإعدادات...</p></div></div>
  );

  return (
    <div className="space-y-6 pb-24">
      <div className="mb-6 flex items-center justify-between">
        <div><h1 className="text-xl font-bold text-[#0c2954] mb-1">الإعدادات العامة</h1><p className="text-sm text-[#6b7a94]">تعديل إعدادات الموقع، التنقل، الفوتر، ووسائل التواصل</p></div>
        {feedback && <span className="text-xs text-[#1a9a5a] bg-[#e9f9f0] px-3 py-1.5 rounded-lg font-medium">{feedback}</span>}
      </div>

      <MetadataSection data={data} saving={saving === "metadata"} onSave={(d) => handleSave("metadata_bulk", d)} />
      <NavbarSection data={data.navLinks} saving={saving === "navLinks"} onSave={(d) => handleSave("navLinks", d)} />

      {/* Footer section - expanded */}
      <ContentCard title="تذييل الموقع" subtitle="نص الحقوق، الشعار، وروابط الفوتر">
        <div className="space-y-5">
          <Textarea label="نص حقوق النشر" value={data.footerCopyright} onChange={(e) => setData({ ...data, footerCopyright: e.target.value })} rows={2} />
          <Textarea label="نص التعريف أسفل الشعار" value={data.footerTagline} onChange={(e) => setData({ ...data, footerTagline: e.target.value })} rows={2} />
          <div>
            <p className="text-xs font-semibold text-[#3a4a60] mb-2">روابط سريعة</p>
            <DynamicList items={data.footerQuickLinks.map(l => `${l.label} | ${l.href}`)} onChange={(items) => { setData({ ...data, footerQuickLinks: items.map(i => { const [label, href] = i.split(" | "); return { label: label || "", href: href || "" }; }) }); }} placeholder="الاسم | الرابط" />
          </div>
          <div>
            <p className="text-xs font-semibold text-[#3a4a60] mb-2">روابط المساعدة</p>
            <DynamicList items={data.footerHelpLinks.map(l => `${l.label} | ${l.href}`)} onChange={(items) => { setData({ ...data, footerHelpLinks: items.map(i => { const [label, href] = i.split(" | "); return { label: label || "", href: href || "" }; }) }); }} placeholder="الاسم | الرابط" />
          </div>
        </div>
        <div className="mt-5 flex justify-end">
          <DashboardButton disabled={saving === "footer"} onClick={() => handleSave("footer_bulk", { footerCopyright: data.footerCopyright, footerTagline: data.footerTagline, footerQuickLinks: data.footerQuickLinks, footerHelpLinks: data.footerHelpLinks })}>
            {saving === "footer" ? "جاري الحفظ..." : "حفظ الفوتر"}
          </DashboardButton>
        </div>
      </ContentCard>

      <SocialsSection data={data.socialLinks} saving={saving === "socialLinks"} onSave={(d) => handleSave("socialLinks", d)} />
      <AppsSection data={data.appLinks} saving={saving === "appLinks"} onSave={(d) => handleSave("appLinks", d)} />
    </div>
  );
}

function MetadataSection({ data, saving, onSave }: { data: SettingsData; saving: boolean; onSave: (d: Record<string, string|null>) => void }) {
  const [local, setLocal] = useState({ siteTitle: data.siteTitle, siteDescription: data.siteDescription, faviconUrl: data.faviconUrl, seoKeywords: data.seoKeywords });
  useEffect(() => { setLocal({ siteTitle: data.siteTitle, siteDescription: data.siteDescription, faviconUrl: data.faviconUrl, seoKeywords: data.seoKeywords }); }, [data]);
  return (
    <ContentCard title="معلومات الموقع" subtitle="عنوان ووصف الموقع والSEO">
      <div className="form-grid-2">
        <Input label="عنوان الموقع" value={local.siteTitle} onChange={(e) => setLocal({ ...local, siteTitle: e.target.value })} />
        <Input label="Favicon URL" value={local.faviconUrl} onChange={(e) => setLocal({ ...local, faviconUrl: e.target.value })} />
        <Textarea label="وصف الموقع" value={local.siteDescription} onChange={(e) => setLocal({ ...local, siteDescription: e.target.value })} rows={3} />
        <Textarea label="كلمات مفتاحية (SEO)" value={local.seoKeywords} onChange={(e) => setLocal({ ...local, seoKeywords: e.target.value })} rows={2} />
      </div>
      <div className="mt-5 flex justify-end">
        <DashboardButton disabled={saving} onClick={() => onSave(local)}>{saving ? "جاري الحفظ..." : "حفظ التغييرات"}</DashboardButton>
      </div>
    </ContentCard>
  );
}

function NavbarSection({ data, saving, onSave }: { data: NavLinkItem[]; saving: boolean; onSave: (d: NavLinkItem[]) => void }) {
  const [links, setLinks] = useState(data);
  useEffect(() => { setLinks(data); }, [data]);
  return (
    <ContentCard title="شريط التنقل" subtitle="روابط شريط التنقل العلوي">
      <DynamicList items={links.map(l => `${l.label} | ${l.href}`)} onChange={(items) => { setLinks(items.map(i => { const [label, href] = i.split(" | "); return { label: label || "", href: href || "" }; })); }} placeholder="الاسم | الرابط" />
      <div className="mt-5 flex justify-end">
        <DashboardButton disabled={saving} onClick={() => onSave(links)}>{saving ? "جاري الحفظ..." : "حفظ التغييرات"}</DashboardButton>
      </div>
    </ContentCard>
  );
}

function SocialsSection({ data, saving, onSave }: { data: SocialInfo; saving: boolean; onSave: (d: SocialInfo) => void }) {
  const [local, setLocal] = useState(data);
  useEffect(() => { setLocal(data); }, [data]);
  return (
    <ContentCard title="وسائل التواصل الاجتماعي" subtitle="روابط حسابات التواصل الاجتماعي">
      <div className="form-grid-2">
        <Input label="X (Twitter)" value={local.xUrl} onChange={(e) => setLocal({ ...local, xUrl: e.target.value })} />
        <Input label="Instagram" value={local.instagramUrl} onChange={(e) => setLocal({ ...local, instagramUrl: e.target.value })} />
        <Input label="TikTok" value={local.tiktokUrl} onChange={(e) => setLocal({ ...local, tiktokUrl: e.target.value })} />
        <Input label="رقم WhatsApp" value={local.whatsappNumber} onChange={(e) => setLocal({ ...local, whatsappNumber: e.target.value })} />
      </div>
      <div className="mt-5 flex justify-end">
        <DashboardButton disabled={saving} onClick={() => onSave(local)}>{saving ? "جاري الحفظ..." : "حفظ التغييرات"}</DashboardButton>
      </div>
    </ContentCard>
  );
}

function AppsSection({ data, saving, onSave }: { data: AppLinkInfo; saving: boolean; onSave: (d: AppLinkInfo) => void }) {
  const [local, setLocal] = useState(data);
  useEffect(() => { setLocal(data); }, [data]);
  return (
    <ContentCard title="روابط التطبيق" subtitle="روابط تحميل التطبيق من المتاجر">
      <div className="form-grid-2">
        <Input label="App Store" value={local.appStoreUrl} onChange={(e) => setLocal({ ...local, appStoreUrl: e.target.value })} />
        <Input label="Google Play" value={local.googlePlayUrl} onChange={(e) => setLocal({ ...local, googlePlayUrl: e.target.value })} />
      </div>
      <div className="mt-5 flex justify-end">
        <DashboardButton disabled={saving} onClick={() => onSave(local)}>{saving ? "جاري الحفظ..." : "حفظ التغييرات"}</DashboardButton>
      </div>
    </ContentCard>
  );
}
