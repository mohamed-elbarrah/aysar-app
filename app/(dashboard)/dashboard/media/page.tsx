"use client";

import { useEffect, useRef, useState } from "react";
import { Copy, FileVideo, Image as ImageIcon, Trash2, Upload } from "lucide-react";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";

type MediaAsset = {
  id: string;
  original_name: string;
  public_url: string;
  mime_type: string;
  file_size: number;
  created_at: string;
};

type ApiResponse = { success: boolean; data?: { items: MediaAsset[] }; error?: string };

function formatSize(size: number) {
  if (size < 1024 * 1024) return `${Math.round(size / 1024)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

export default function MediaLibraryPage() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [items, setItems] = useState<MediaAsset[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [message, setMessage] = useState("");

  async function loadMedia() {
    setLoading(true);
    const response = await fetch("/api/media", { cache: "no-store" });
    const result: ApiResponse = await response.json();
    if (result.success) setItems(result.data?.items ?? []);
    else setMessage(result.error ?? "تعذر تحميل الملفات");
    setLoading(false);
  }

  useEffect(() => {
    const timer = window.setTimeout(() => { void loadMedia(); }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  async function upload(file: File) {
    setUploading(true);
    setMessage("");
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetch("/api/media", { method: "POST", body: formData });
    const result = await response.json();
    if (!response.ok || !result.success) setMessage(result.error ?? "فشل رفع الملف");
    else await loadMedia();
    setUploading(false);
    if (inputRef.current) inputRef.current.value = "";
  }

  async function remove(id: string) {
    if (!window.confirm("هل تريد حذف هذا الملف؟")) return;
    const response = await fetch(`/api/media/${id}`, { method: "DELETE" });
    const result = await response.json();
    if (!response.ok || !result.success) setMessage(result.error ?? "فشل حذف الملف");
    else setItems((current) => current.filter((item) => item.id !== id));
  }

  async function copyUrl(id: string, url: string) {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    window.setTimeout(() => setCopiedId((current) => current === id ? null : current), 2000);
  }

  return (
    <section dir="rtl" className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#0c2954]">مكتبة الوسائط</h2>
          <p className="mt-1 text-sm text-[#6b7a94]">ارفع الملفات واستخدم روابطها داخل الموقع أو خارجه.</p>
        </div>
        <div>
          <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml,video/mp4,video/webm,application/pdf" hidden onChange={(event) => { const file = event.target.files?.[0]; if (file) void upload(file); }} />
          <DashboardButton onClick={() => inputRef.current?.click()} disabled={uploading}>
            <Upload className="h-4 w-4" /> {uploading ? "جاري الرفع..." : "رفع ملف"}
          </DashboardButton>
        </div>
      </div>

      {message && <div className="rounded-xl border border-[#e8edf5] bg-white px-4 py-3 text-sm text-[#0c2954]">{message}</div>}

      {loading ? <p className="text-sm text-[#6b7a94]">جاري التحميل...</p> : items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-[#cfd8e6] bg-white p-12 text-center text-sm text-[#6b7a94]">لا توجد ملفات بعد.</div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => (
            <article key={item.id} className="overflow-hidden rounded-2xl border border-[#e8edf5] bg-white shadow-sm">
              <div className="flex h-44 items-center justify-center bg-[#f5f6f9]">
                {item.mime_type.startsWith("image/") ? <img src={item.public_url} alt={item.original_name} className="h-full w-full object-contain" /> : item.mime_type.startsWith("video/") ? <FileVideo className="h-12 w-12 text-[#0c2954]" /> : <ImageIcon className="h-12 w-12 text-[#6b7a94]" />}
              </div>
              <div className="space-y-3 p-4">
                <p className="truncate text-sm font-semibold text-[#0c1829]" title={item.original_name}>{item.original_name}</p>
                <p className="text-xs text-[#6b7a94]">{formatSize(item.file_size)} · {item.mime_type}</p>
                <div className="flex gap-2">
                  <DashboardButton variant={copiedId === item.id ? "success" : "secondary"} size="sm" className="flex-1" onClick={() => void copyUrl(item.id, item.public_url)}><Copy className="h-3.5 w-3.5" /> {copiedId === item.id ? "تم النسخ" : "نسخ الرابط"}</DashboardButton>
                  <DashboardButton variant="danger" size="sm" onClick={() => void remove(item.id)} aria-label="حذف"><Trash2 className="h-3.5 w-3.5" /></DashboardButton>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
