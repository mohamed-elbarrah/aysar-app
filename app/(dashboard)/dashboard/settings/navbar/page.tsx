"use client";

import { useState, useEffect, useCallback } from "react";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { LinkListEditor } from "@/app/components/dashboard/LinkListEditor";
import { Loader2 } from "lucide-react";
import { NAV_LINKS } from "@/app/lib/dashboard/placeholders";

interface NavLinkItem { label: string; href: string }

export default function NavbarSettingsPage() {
  const [links, setLinks] = useState<NavLinkItem[]>(NAV_LINKS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.navLinks) {
          setLinks(json.data.navLinks);
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
        body: JSON.stringify({ navLinks: links }),
      });
      if (res.ok) {
        setFeedback("تم الحفظ بنجاح");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch { /* silent */ }
    setSaving(false);
  }, [links]);

  if (loading) return (
    <div className="flex items-center justify-center h-[40vh]">
      <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83]" />
    </div>
  );

  return (
    <ContentCard title="شريط التنقل" subtitle="روابط شريط التنقل العلوي — كل رابط له اسم ورابط منفصلين">
      <LinkListEditor items={links} onChange={setLinks} addLabel="إضافة رابط" />
      <div className="mt-5 flex items-center justify-between">
        <span className="text-xs text-[#1a9a5a]">{feedback}</span>
        <DashboardButton disabled={saving} onClick={handleSave}>
          {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </DashboardButton>
      </div>
    </ContentCard>
  );
}