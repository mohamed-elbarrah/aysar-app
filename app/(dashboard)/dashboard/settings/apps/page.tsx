"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/app/components/ui/Input";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { SaveBar } from "@/app/components/dashboard/SaveBar";
import { Loader2 } from "lucide-react";
import { APP_LINKS_DEFAULTS } from "@/app/lib/dashboard/placeholders";

interface AppLinkInfo { appStoreUrl: string; googlePlayUrl: string }

export default function AppsSettingsPage() {
  const [data, setData] = useState<AppLinkInfo>(APP_LINKS_DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [savedData, setSavedData] = useState<AppLinkInfo>(APP_LINKS_DEFAULTS);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.appLinks) {
          setData(json.data.appLinks);
          setSavedData(JSON.parse(JSON.stringify(json.data.appLinks)));
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
        body: JSON.stringify({ appLinks: data }),
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
    <ContentCard title="روابط التطبيق" subtitle="روابط تحميل التطبيق من المتاجر">
      <div className="form-grid-2">
        <Input label="App Store" value={data.appStoreUrl} onChange={(e) => setData({ ...data, appStoreUrl: e.target.value })} />
        <Input label="Google Play" value={data.googlePlayUrl} onChange={(e) => setData({ ...data, googlePlayUrl: e.target.value })} />
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