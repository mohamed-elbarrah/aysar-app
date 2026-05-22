"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { Loader2 } from "lucide-react";
import { APP_LINKS_DEFAULTS } from "@/app/lib/dashboard/placeholders";

interface AppLinkInfo { appStoreUrl: string; googlePlayUrl: string }

export default function AppsSettingsPage() {
  const [data, setData] = useState<AppLinkInfo>(APP_LINKS_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.appLinks) {
          setData(json.data.appLinks);
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
        body: JSON.stringify({ appLinks: data }),
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
    <ContentCard title="روابط التطبيق" subtitle="روابط تحميل التطبيق من المتاجر">
      <div className="form-grid-2">
        <Input label="App Store" value={data.appStoreUrl} onChange={(e) => setData({ ...data, appStoreUrl: e.target.value })} />
        <Input label="Google Play" value={data.googlePlayUrl} onChange={(e) => setData({ ...data, googlePlayUrl: e.target.value })} />
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