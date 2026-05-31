"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input, Textarea } from "@/app/components/ui/Input";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { SaveBar } from "@/app/components/dashboard/SaveBar";
import { Loader2, Upload, ImageIcon, X } from "lucide-react";
import { SITE_SETTINGS } from "@/app/lib/dashboard/placeholders";

export default function MetadataSettingsPage() {
  const [data, setData] = useState({
    siteTitle: SITE_SETTINGS.siteTitle,
    siteDescription: SITE_SETTINGS.siteDescription,
    faviconUrl: SITE_SETTINGS.faviconUrl || "",
    logoUrl: SITE_SETTINGS.logoUrl || "",
    seoKeywords: SITE_SETTINGS.seoKeywords,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [savedData, setSavedData] = useState(data);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data) {
          const loaded = {
            siteTitle: json.data.siteTitle || "",
            siteDescription: json.data.siteDescription || "",
            faviconUrl: json.data.faviconUrl || "",
            logoUrl: json.data.logoUrl || "",
            seoKeywords: json.data.seoKeywords || "",
          };
          setData(loaded);
          setSavedData(loaded);
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

  useEffect(() => {
    const href = data.faviconUrl || "/logo.png";
    const cleanUrl = href.split("?")[0].toLowerCase();
    let type: string | undefined;
    let sizes: string | undefined;
    if (cleanUrl.endsWith(".svg")) { type = "image/svg+xml"; sizes = "any"; }
    else if (cleanUrl.endsWith(".png")) { type = "image/png"; sizes = "32x32"; }
    else if (cleanUrl.endsWith(".jpg") || cleanUrl.endsWith(".jpeg")) { type = "image/jpeg"; sizes = "32x32"; }
    else if (cleanUrl.endsWith(".webp")) { type = "image/webp"; sizes = "32x32"; }
    else if (cleanUrl.endsWith(".ico")) { type = "image/x-icon"; }

    document.querySelectorAll('link[rel="icon"], link[rel="shortcut icon"], link[rel="apple-touch-icon"]').forEach(el => el.remove());
    const link = document.createElement("link");
    link.rel = "icon";
    link.href = href;
    if (type) link.type = type;
    if (sizes) link.sizes = sizes;
    document.head.appendChild(link);
  }, [data.faviconUrl]);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          siteTitle: data.siteTitle,
          siteDescription: data.siteDescription,
          faviconUrl: data.faviconUrl,
          logoUrl: data.logoUrl,
          seoKeywords: data.seoKeywords,
        }),
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

  const handleFaviconUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("previousUrl", data.faviconUrl || "");
    try {
      const res = await fetch("/api/settings/upload-favicon", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        setData(prev => ({ ...prev, faviconUrl: json.faviconUrl }));
      }
    } catch { /* silent */ }
    setUploading(false);
    e.target.value = "";
  }, [data.faviconUrl]);

  const handleLogoUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingLogo(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("previousUrl", data.logoUrl || "");
    try {
      const res = await fetch("/api/settings/upload-logo", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      if (res.ok) {
        const json = await res.json();
        setData(prev => ({ ...prev, logoUrl: json.logoUrl }));
      }
    } catch { /* silent */ }
    setUploadingLogo(false);
    e.target.value = "";
  }, [data.logoUrl]);

  if (loading) return (
    <div className="flex items-center justify-center h-[40vh]">
      <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83]" />
    </div>
  );

  return (
    <ContentCard title="معلومات الموقع" subtitle="عنوان ووصف الموقع والSEO">
      <div className="form-grid-2">
        <Input label="عنوان الموقع" value={data.siteTitle} onChange={(e) => setData({ ...data, siteTitle: e.target.value })} />
        <div />

        <div className="form-group-contact full">
          <label>شعار الموقع (Logo)</label>
          <div className="flex items-center gap-4">
            <div
              className="relative w-40 h-16 rounded-xl border-2 border-dashed border-[#e8edf5] flex items-center justify-center overflow-hidden bg-white cursor-pointer hover:border-[#2d2e83] transition-colors group shrink-0"
              onClick={() => (document.getElementById("logo-upload") as HTMLInputElement)?.click()}
            >
              {uploadingLogo ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#6b7a94]" />
              ) : (
                <>
                  <img
                    src={data.logoUrl || "/logo.png"}
                    alt="Logo"
                    className="max-w-[140px] max-h-[48px] object-contain"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = "none";
                      (img.nextElementSibling as HTMLElement)?.classList.remove("hidden");
                    }}
                  />
                  <ImageIcon className="w-8 h-8 text-[#6b7a94] hidden" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                </>
              )}
              <input
                id="logo-upload"
                type="file"
                accept=".svg,.png,.jpg,.jpeg,.webp"
                className="hidden"
                onChange={handleLogoUpload}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#6b7a94]">انقر لرفع شعار الموقع</span>
              <span className="text-[10px] text-[#6b7a94]">SVG, PNG, JPG, WEBP — حد أقصى 2MB</span>
              {data.logoUrl && data.logoUrl !== "/logo.png" && (
                <button
                  type="button"
                  className="text-xs text-red-500 hover:text-red-700 transition-colors text-right mt-1"
                  onClick={() => setData(prev => ({ ...prev, logoUrl: "" }))}
                >
                  <X className="w-3 h-3 inline ml-1" />
                  إزالة المخصص
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="form-group-contact full">
          <label>أيقونة الموقع (Favicon)</label>
          <div className="flex items-center gap-4">
            <div
              className="relative w-16 h-16 rounded-xl border-2 border-dashed border-[#e8edf5] flex items-center justify-center overflow-hidden bg-white cursor-pointer hover:border-[#2d2e83] transition-colors group shrink-0"
              onClick={() => (document.getElementById("favicon-upload") as HTMLInputElement)?.click()}
            >
              {uploading ? (
                <Loader2 className="w-6 h-6 animate-spin text-[#6b7a94]" />
              ) : (
                <>
                  <img
                    src={data.faviconUrl || "/logo.png"}
                    alt="Favicon"
                    className="w-10 h-10 object-contain"
                    onError={(e) => {
                      const img = e.target as HTMLImageElement;
                      img.style.display = "none";
                      (img.nextElementSibling as HTMLElement)?.classList.remove("hidden");
                    }}
                  />
                  <ImageIcon className="w-6 h-6 text-[#6b7a94] hidden" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
                    <Upload className="w-5 h-5 text-white" />
                  </div>
                </>
              )}
              <input
                id="favicon-upload"
                type="file"
                accept=".svg,.png,.jpg,.jpeg,.webp,.ico"
                className="hidden"
                onChange={handleFaviconUpload}
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-xs text-[#6b7a94]">انقر لرفع أيقونة الموقع</span>
              <span className="text-[10px] text-[#6b7a94]">SVG, PNG, ICO — حد أقصى 500KB</span>
              {data.faviconUrl && (
                <button
                  type="button"
                  className="text-xs text-red-500 hover:text-red-700 transition-colors text-right mt-1"
                  onClick={() => setData(prev => ({ ...prev, faviconUrl: "" }))}
                >
                  <X className="w-3 h-3 inline ml-1" />
                  إزالة المخصص
                </button>
              )}
            </div>
          </div>
        </div>

        <Textarea label="وصف الموقع" value={data.siteDescription} onChange={(e) => setData({ ...data, siteDescription: e.target.value })} rows={3} />
        <Textarea label="كلمات مفتاحية (SEO)" value={data.seoKeywords} onChange={(e) => setData({ ...data, seoKeywords: e.target.value })} rows={2} />
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