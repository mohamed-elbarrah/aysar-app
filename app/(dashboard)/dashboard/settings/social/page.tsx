"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { Loader2 } from "lucide-react";
import { SOCIAL_LINKS } from "@/app/lib/dashboard/placeholders";

interface SocialInfo { xUrl: string; instagramUrl: string; tiktokUrl: string; whatsappNumber: string }

export default function SocialSettingsPage() {
  const [data, setData] = useState<SocialInfo>(SOCIAL_LINKS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.socialLinks) {
          setData(json.data.socialLinks);
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
        body: JSON.stringify({ socialLinks: data }),
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
    <ContentCard title="وسائل التواصل الاجتماعي" subtitle="روابط حسابات التواصل الاجتماعي">
      <div className="form-grid-2">
        <Input label="X (Twitter)" value={data.xUrl} onChange={(e) => setData({ ...data, xUrl: e.target.value })} />
        <Input label="Instagram" value={data.instagramUrl} onChange={(e) => setData({ ...data, instagramUrl: e.target.value })} />
        <Input label="TikTok" value={data.tiktokUrl} onChange={(e) => setData({ ...data, tiktokUrl: e.target.value })} />
        <Input label="رقم WhatsApp" value={data.whatsappNumber} onChange={(e) => setData({ ...data, whatsappNumber: e.target.value })} />
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