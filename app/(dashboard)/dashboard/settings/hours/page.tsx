"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/app/components/ui/Input";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { SaveBar } from "@/app/components/dashboard/SaveBar";
import { Loader2 } from "lucide-react";
import { WORK_HOURS } from "@/app/lib/dashboard/placeholders";
import type { WorkHours } from "@/app/lib/settings-data";

export default function HoursSettingsPage() {
  const [data, setData] = useState<WorkHours>({ ...WORK_HOURS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [savedData, setSavedData] = useState<WorkHours>({ ...WORK_HOURS });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.workHours) {
          setData(json.data.workHours);
          setSavedData(JSON.parse(JSON.stringify(json.data.workHours)));
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
        body: JSON.stringify({ workHours: data }),
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
    <ContentCard title="ساعات العمل" subtitle="أوقات العمل المعروضة في صفحة الاتصال">
      <div className="form-grid-2">
        <Input label="أيام العمل" value={data.days} onChange={(e) => setData({ ...data, days: e.target.value })} placeholder="الأحد – الخميس" />
        <Input label="ساعات العمل" value={data.time} onChange={(e) => setData({ ...data, time: e.target.value })} placeholder="10:00 ص – 5:00 م" />
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