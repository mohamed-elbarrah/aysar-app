"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/app/components/ui/Input";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { SaveBar } from "@/app/components/dashboard/SaveBar";
import { Loader2 } from "lucide-react";
import { PLATFORM_LINKS } from "@/app/lib/dashboard/placeholders";
import type { PlatformLinks } from "@/app/lib/settings-data";

export default function PlatformSettingsPage() {
  const [data, setData] = useState<PlatformLinks>({ ...PLATFORM_LINKS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [savedData, setSavedData] = useState<PlatformLinks>({ ...PLATFORM_LINKS });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.platformLinks) {
          setData(json.data.platformLinks);
          setSavedData(JSON.parse(JSON.stringify(json.data.platformLinks)));
        }
      } catch { /* keep defaults */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(savedData) !== JSON.stringify(data),
    [savedData, data]
  );

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
        setSavedData(JSON.parse(JSON.stringify(data)));
        setLastSaved(new Date().toLocaleTimeString("ar-SA"));
        setTimeout(() => setLastSaved(null), 5000);
      }
    } catch { /* silent */ }
    setSaving(false);
  }, [data]);

  const handleReset = useCallback(() => {
    setData(JSON.parse(JSON.stringify(savedData)));
  }, [savedData]);

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
      <SaveBar
        isDirty={isDirty}
        isSubmitting={saving}
        onSave={handleSave}
        onReset={handleReset}
        lastSaved={lastSaved}
      />
    </ContentCard>
  );
}