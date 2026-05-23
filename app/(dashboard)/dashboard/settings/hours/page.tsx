"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { Loader2 } from "lucide-react";
import { WORK_HOURS } from "@/app/lib/dashboard/placeholders";
import type { WorkHours } from "@/app/lib/settings-data";

export default function HoursSettingsPage() {
  const [data, setData] = useState<WorkHours>({ ...WORK_HOURS });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.workHours) {
          setData(json.data.workHours);
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
        body: JSON.stringify({ workHours: data }),
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
    <ContentCard title="ساعات العمل" subtitle="أوقات العمل المعروضة في صفحة الاتصال">
      <div className="form-grid-2">
        <Input label="أيام العمل" value={data.days} onChange={(e) => setData({ ...data, days: e.target.value })} placeholder="الأحد – الخميس" />
        <Input label="ساعات العمل" value={data.time} onChange={(e) => setData({ ...data, time: e.target.value })} placeholder="10:00 ص – 5:00 م" />
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