"use client";

import { useState, useEffect, useCallback } from "react";
import { Input, Textarea } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { Loader2 } from "lucide-react";
import { SITE_SETTINGS } from "@/app/lib/dashboard/placeholders";

export default function MetadataSettingsPage() {
  const [data, setData] = useState({
    siteTitle: SITE_SETTINGS.siteTitle,
    siteDescription: SITE_SETTINGS.siteDescription,
    faviconUrl: SITE_SETTINGS.faviconUrl || "",
    seoKeywords: SITE_SETTINGS.seoKeywords,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data) {
          setData({
            siteTitle: json.data.siteTitle || "",
            siteDescription: json.data.siteDescription || "",
            faviconUrl: json.data.faviconUrl || "",
            seoKeywords: json.data.seoKeywords || "",
          });
        }
      } catch { /* keep defaults */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          siteTitle: data.siteTitle,
          siteDescription: data.siteDescription,
          faviconUrl: data.faviconUrl,
          seoKeywords: data.seoKeywords,
        }),
      });
      if (res.ok) {
        setFeedback("تم الحفظ بنجاح");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch { /* silent */ }
    setSaving(false);
  }, [data]);

  if (loading) return (
    <div className="flex items-center justify-center h-[40vh]">
      <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83]" />
    </div>
  );

  return (
    <ContentCard title="معلومات الموقع" subtitle="عنوان ووصف الموقع والSEO">
      <div className="form-grid-2">
        <Input label="عنوان الموقع" value={data.siteTitle} onChange={(e) => setData({ ...data, siteTitle: e.target.value })} />
        <Input label="Favicon URL" value={data.faviconUrl} onChange={(e) => setData({ ...data, faviconUrl: e.target.value })} />
        <Textarea label="وصف الموقع" value={data.siteDescription} onChange={(e) => setData({ ...data, siteDescription: e.target.value })} rows={3} />
        <Textarea label="كلمات مفتاحية (SEO)" value={data.seoKeywords} onChange={(e) => setData({ ...data, seoKeywords: e.target.value })} rows={2} />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-[#1a9a5a]">{feedback}</span>
        <DashboardButton disabled={saving} onClick={handleSave}>
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </DashboardButton>
      </div>
    </ContentCard>
  );
}