"use client";

import { useState, useRef, useMemo, useCallback } from "react";
import { icons } from "lucide-react";
import { IconPreview } from "./IconPreview";
import Image from "next/image";
import { Upload, X, Search, Loader2 } from "lucide-react";

const DEFAULT_ICONS = [
  "Bell", "Globe", "Users", "Smartphone",
  "ImageIcon", "Cloud", "LayoutGrid", "MessageCircle",
];

interface IconPickerProps {
  iconName: string;
  iconUrl?: string | null;
  iconColor: string;
  iconBg: string;
  onChange: (iconName: string, iconUrl?: string | null) => void;
  existingUploads?: string[];
}

const allLucideNames = Object.keys(icons).filter(
  (name) => name[0] === name[0].toUpperCase() && name !== "default"
);

export function IconPicker({
  iconName,
  iconUrl,
  iconColor,
  iconBg,
  onChange,
  existingUploads = [],
}: IconPickerProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const hasCurrentIcon = Boolean(iconName || iconUrl);

  const filteredIcons = useMemo(() => {
    if (!search.trim()) return DEFAULT_ICONS;
    const q = search.toLowerCase();
    return allLucideNames
      .filter((name) => name.toLowerCase().includes(q))
      .slice(0, 48);
  }, [search]);

  const handleSelect = useCallback(
    (name: string) => {
      onChange(name, null);
      setOpen(false);
      setSearch("");
    },
    [onChange]
  );

  const handleUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;

      setUploading(true);
      try {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload-bento-icon", { method: "POST", body: formData });
        const data = await res.json();
        if (data.success) {
          onChange("", data.iconUrl);
          setOpen(false);
          setSearch("");
        }
      } catch {
        console.error("Upload failed");
      } finally {
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = "";
      }
    },
    [onChange]
  );

  const uniqueUploads = useMemo(
    () =>
      existingUploads
        .filter((url): url is string => Boolean(url) && url !== iconUrl)
        .filter((url, idx, arr) => arr.indexOf(url) === idx),
    [existingUploads, iconUrl]
  );

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex items-center gap-2.5 w-full px-3 py-2.5 rounded-lg border border-[#e8edf5] bg-white hover:border-[#0c2954]/30 transition-colors text-right"
      >
        {hasCurrentIcon ? (
          <>
            <div
              className="w-8 h-8 rounded-md flex items-center justify-center shrink-0"
              style={{ backgroundColor: iconBg }}
            >
              <IconPreview
                iconName={iconName}
                iconUrl={iconUrl}
                iconColor={iconColor}
                size={16}
              />
            </div>
            <span className="text-xs text-[#0c2954] font-medium truncate">
              {iconUrl ? "أيقونة مرفوعة" : iconName}
            </span>
          </>
        ) : (
          <span className="text-xs text-[#6b7a94]">اختر أيقونة</span>
        )}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => {
            setOpen(false);
            setSearch("");
          }}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-[580px] max-h-[85vh] flex flex-col shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-6 pt-5 pb-3 border-b border-[#e8edf5] shrink-0">
              <h3 className="text-sm font-bold text-[#0c2954]">اختيار أيقونة</h3>
              <button
                onClick={() => {
                  setOpen(false);
                  setSearch("");
                }}
                aria-label="إغلاق"
                className="w-7 h-7 flex items-center justify-center rounded-md hover:bg-[#f5f6f9] transition-colors"
              >
                <X className="w-4 h-4 text-[#6b7a94]" />
              </button>
            </div>

            <div className="flex items-center gap-2 px-6 pt-3 pb-2 shrink-0">
              <div className="relative flex-1">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#6b7a94]" />
                <input
                  type="text"
                  placeholder="ابحث عن أيقونة..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full text-xs pr-8 pl-3 py-2 rounded-lg border border-[#e8edf5] bg-[#fafbfc] focus:outline-none focus:border-[#0c2954]/30 focus:bg-white transition-colors"
                  autoFocus
                />
              </div>
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept=".svg,.png,.jpg,.jpeg,.webp"
                onChange={handleUpload}
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="flex items-center gap-1.5 text-xs px-3 py-2 rounded-lg bg-[#0c2954] text-white hover:bg-[#0c2954]/90 disabled:opacity-50 transition-colors shrink-0"
              >
                {uploading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Upload className="w-3.5 h-3.5" />
                )}
                رفع
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-3">
              {!search.trim() && (
                <>
                  <p className="text-[10px] font-semibold text-[#6b7a94] mb-2 tracking-wider uppercase">
                    الأيقونات المقترحة
                  </p>
                  <div className="grid grid-cols-8 gap-2 mb-5">
                    {DEFAULT_ICONS.map((name) => {
                      const isSelected = name === iconName && !iconUrl;
                      return (
                        <button
                          key={name}
                          onClick={() => handleSelect(name)}
                          title={name}
                          className={`p-2 rounded-lg border transition-colors ${
                            isSelected
                              ? "border-[#0c2954] bg-[#0c2954]/5 ring-1 ring-[#0c2954]/20"
                              : "border-[#e8edf5] hover:border-[#0c2954]/20 hover:bg-[#f5f6f9]"
                          }`}
                        >
                          <div
                            className="w-8 h-8 rounded-md flex items-center justify-center mx-auto"
                            style={{ backgroundColor: iconBg }}
                          >
                            <IconPreview
                              iconName={name}
                              iconColor={iconColor}
                              size={16}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {search.trim() && (
                <>
                  <p className="text-[10px] font-semibold text-[#6b7a94] mb-2 tracking-wider uppercase">
                    نتائج البحث ({filteredIcons.length})
                  </p>
                  <div className="grid grid-cols-8 gap-2 mb-5">
                    {filteredIcons.map((name) => {
                      const isSelected = name === iconName && !iconUrl;
                      return (
                        <button
                          key={name}
                          onClick={() => handleSelect(name)}
                          title={name}
                          className={`p-2 rounded-lg border transition-colors ${
                            isSelected
                              ? "border-[#0c2954] bg-[#0c2954]/5 ring-1 ring-[#0c2954]/20"
                              : "border-[#e8edf5] hover:border-[#0c2954]/20 hover:bg-[#f5f6f9]"
                          }`}
                        >
                          <div className="w-8 h-8 flex items-center justify-center mx-auto">
                            <IconPreview
                              iconName={name}
                              iconColor={iconColor}
                              size={18}
                            />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </>
              )}

              {(uniqueUploads.length > 0 || iconUrl) && (
                <>
                  <p className="text-[10px] font-semibold text-[#6b7a94] mb-2 tracking-wider uppercase">
                    الأيقونات المرفوعة
                  </p>
                  <div className="grid grid-cols-8 gap-2 mb-2">
                    {iconUrl && (
                      <button
                        onClick={() => {
                          onChange("", iconUrl);
                          setOpen(false);
                          setSearch("");
                        }}
                        title="الأيقونة الحالية"
                        className="p-2 rounded-lg border border-[#0c2954] bg-[#0c2954]/5 ring-1 ring-[#0c2954]/20 transition-colors"
                      >
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center mx-auto overflow-hidden"
                          style={{ backgroundColor: iconBg }}
                        >
                          <IconPreview
                            iconName={iconName}
                            iconUrl={iconUrl}
                            iconColor={iconColor}
                            size={18}
                          />
                        </div>
                      </button>
                    )}
                    {uniqueUploads.map((url) => (
                      <button
                        key={url}
                        onClick={() => {
                          onChange("", url);
                          setOpen(false);
                          setSearch("");
                        }}
                        title={url}
                        className="p-2 rounded-lg border border-[#e8edf5] hover:border-[#0c2954]/20 hover:bg-[#f5f6f9] transition-colors"
                      >
                        <div
                          className="w-8 h-8 rounded-md flex items-center justify-center mx-auto overflow-hidden"
                          style={{ backgroundColor: iconBg }}
                        >
                          <Image
                            src={url}
                            alt="أيقونة مرفوعة"
                            width={32}
                            height={32}
                            className="max-w-full max-h-full object-contain"
                            unoptimized
                          />
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
