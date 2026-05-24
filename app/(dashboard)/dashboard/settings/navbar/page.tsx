"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { SaveBar } from "@/app/components/dashboard/SaveBar";
import { LinkListEditor } from "@/app/components/dashboard/LinkListEditor";
import { Loader2 } from "lucide-react";
import { NAV_LINKS } from "@/app/lib/dashboard/placeholders";

interface NavLinkItem { label: string; href: string }

export default function NavbarSettingsPage() {
  const [links, setLinks] = useState<NavLinkItem[]>(NAV_LINKS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [savedData, setSavedData] = useState<NavLinkItem[]>(NAV_LINKS);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.navLinks) {
          setLinks(json.data.navLinks);
          setSavedData(json.data.navLinks);
        }
      } catch { /* keep defaults */ }
      finally { setLoading(false); }
    }
    load();
  }, []);

  const isDirty = useMemo(
    () => JSON.stringify(savedData) !== JSON.stringify(links),
    [savedData, links]
  );

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
        setSavedData(JSON.parse(JSON.stringify(links)));
        setLastSaved(new Date().toLocaleTimeString("ar-SA"));
        setTimeout(() => setLastSaved(null), 5000);
      }
    } catch { /* silent */ }
    setSaving(false);
  }, [links]);

  const handleReset = useCallback(() => {
    setLinks(JSON.parse(JSON.stringify(savedData)));
  }, [savedData]);

  if (loading) return (
    <div className="flex items-center justify-center h-[40vh]">
      <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83]" />
    </div>
  );

  return (
    <ContentCard title="شريط التنقل" subtitle="روابط شريط التنقل العلوي — كل رابط له اسم ورابط منفصلين">
      <LinkListEditor items={links} onChange={setLinks} addLabel="إضافة رابط" />
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