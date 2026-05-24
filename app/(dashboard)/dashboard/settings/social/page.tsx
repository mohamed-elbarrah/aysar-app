"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { SaveBar } from "@/app/components/dashboard/SaveBar";
import { Loader2, Trash2, Plus, Upload, Globe } from "lucide-react";
import { SOCIAL_LINKS } from "@/app/lib/dashboard/placeholders";
import type { SocialLink } from "@/app/lib/settings-data";

export default function SocialSettingsPage() {
  const [links, setLinks] = useState<SocialLink[]>([...SOCIAL_LINKS]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [savedData, setSavedData] = useState<SocialLink[]>([...SOCIAL_LINKS]);
  const [uploadingKey, setUploadingKey] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.socialLinks) {
          setLinks(json.data.socialLinks);
          setSavedData(JSON.parse(JSON.stringify(json.data.socialLinks)));
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
        body: JSON.stringify({ socialLinks: links }),
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

  const handleIconUpload = useCallback(async (key: string, file: File) => {
    setUploadingKey(key);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("key", key);
    try {
      const res = await fetch("/api/settings/upload-icon", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        setLinks(prev => prev.map(l => l.key === key ? { ...l, iconUrl: json.iconUrl } : l));
      }
    } catch { /* silent */ }
    setUploadingKey(null);
  }, []);

  const addLink = () => {
    setLinks(prev => [...prev, { key: `custom-${Date.now()}`, label: "", url: "" }]);
  };

  const removeLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };

  const updateLink = (index: number, field: keyof SocialLink, value: string) => {
    setLinks(prev => prev.map((l, i) => i === index ? { ...l, [field]: value } : l));
  };

  function extractDomain(url: string): string {
    try { return new URL(url).hostname; } catch { return ""; }
  }

  function iconPreviewUrl(url: string, iconUrl?: string): string | null {
    if (iconUrl) return iconUrl;
    const domain = extractDomain(url);
    return domain ? `https://www.google.com/s2/favicons?domain=${domain}&sz=40` : null;
  }

  if (loading) return (
    <div className="flex items-center justify-center h-[40vh]">
      <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83]" />
    </div>
  );

  return (
    <ContentCard title="وسائل التواصل الاجتماعي" subtitle="روابط حسابات التواصل الاجتماعي وأيقوناتها">
      <div className="space-y-4">
        {links.map((link, index) => (
          <div key={link.key} className="flex flex-col lg:flex-row items-start gap-3 p-3 rounded-lg border border-[#e8edf5]">
            <Input
              label="اسم المنصة"
              value={link.label}
              onChange={(e) => updateLink(index, "label", e.target.value)}
              placeholder="مثال: X (Twitter)"
              wrapperClassName="w-full lg:w-[180px]"
            />
            <Input
              label="الرابط"
              value={link.url}
              onChange={(e) => updateLink(index, "url", e.target.value)}
              placeholder="https://..."
              wrapperClassName="w-full lg:flex-1"
            />
            <div className="flex items-center gap-2 self-start lg:self-center pt-[18px] lg:pt-0">
              <div className="relative w-9 h-9 rounded-lg border border-[#e8edf5] flex items-center justify-center overflow-hidden bg-white shrink-0">
                {uploadingKey === link.key ? (
                  <Loader2 className="w-4 h-4 animate-spin text-[#6b7a94]" />
                ) : (
                  <>
                    <Globe className="w-4 h-4 text-[#6b7a94]" />
                    {(() => {
                      const src = iconPreviewUrl(link.url, link.iconUrl);
                      return src ? (
                        <img
                          src={src}
                          alt=""
                          className="absolute inset-0 w-full h-full object-contain p-1.5"
                          onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                        />
                      ) : null;
                    })()}
                  </>
                )}
              </div>
              <label className="flex items-center gap-1 text-xs text-[#6b7a94] cursor-pointer hover:text-[#0c2954] transition-colors whitespace-nowrap">
                <Upload className="w-3.5 h-3.5" />
                {uploadingKey === link.key ? "..." : "أيقونة"}
                <input
                  type="file"
                  accept=".svg,.png,.jpg,.jpeg,.webp"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleIconUpload(link.key, file);
                  }}
                />
              </label>
              {link.iconUrl && (
                <span className="text-[10px] text-[#1a9a5a] whitespace-nowrap">مخصصة</span>
              )}
            </div>
            <DashboardButton
              variant="danger"
              size="icon-sm"
              onClick={() => removeLink(index)}
              aria-label="حذف"
              className="self-end lg:self-center"
            >
              <Trash2 className="w-4 h-4" />
            </DashboardButton>
          </div>
        ))}
      </div>

      <DashboardButton
        variant="secondary"
        size="sm"
        className="mt-4"
        onClick={addLink}
      >
        <Plus className="w-4 h-4 ml-1" />
        إضافة منصة
      </DashboardButton>

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