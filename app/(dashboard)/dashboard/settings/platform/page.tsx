"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { Loader2 } from "lucide-react";
import { PLATFORM_LINKS } from "@/app/lib/dashboard/placeholders";
import type { PlatformLinks } from "@/app/lib/settings-data";

export default function PlatformSettingsPage() {
  const [data, setData] = useState<PlatformLinks>({ ...PLATFORM_LINKS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.platformLinks) {
          setData(json.data.platformLinks);
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
        body: JSON.stringify({ platformLinks: data }),
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
    <ContentCard title="روابط المنصة" subtitle="روابط منصة أيسر (تسجيل الدخول، التسجيل، مركز المساعدة)">
      <div className="space-y-2">
        <Input label="رابط تسجيل الدخول" value={data.loginUrl} onChange={(e) => setData({ ...data, loginUrl: e.target.value })} placeholder="https://platform.aysar.sa/" />
        <Input label="رابط التسجيل" value={data.registerUrl} onChange={(e) => setData({ ...data, registerUrl: e.target.value })} placeholder="https://platform.aysar.sa/.../register" />
        <Input label="مركز المساعدة" value={data.supportCenterUrl} onChange={(e) => setData({ ...data, supportCenterUrl: e.target.value })} placeholder="https://support.aysar.sa/" />
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