"use client";

import { useState, useEffect, useCallback } from "react";
import { Input } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { Loader2 } from "lucide-react";
import { SITE_CONTACT_INFO } from "@/app/lib/dashboard/placeholders";
import type { ContactInfo } from "@/app/lib/settings-data";

export default function ContactSettingsPage() {
  const [data, setData] = useState<ContactInfo>({ ...SITE_CONTACT_INFO });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.contactInfo) {
          setData(json.data.contactInfo);
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
        body: JSON.stringify({ contactInfo: data }),
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
    <ContentCard title="معلومات الاتصال" subtitle="بيانات الاتصال الأساسية المعروضة في الموقع">
      <div className="form-grid-2">
        <Input label="رقم الهاتف" value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} placeholder="+966..." />
        <Input label="البريد الإلكتروني" value={data.email} onChange={(e) => setData({ ...data, email: e.target.value })} placeholder="support@example.com" />
        <Input label="البريد القانوني" value={data.legalEmail} onChange={(e) => setData({ ...data, legalEmail: e.target.value })} placeholder="legal@example.com" />
        <Input label="رقم WhatsApp" value={data.whatsappNumber} onChange={(e) => setData({ ...data, whatsappNumber: e.target.value })} placeholder="966..." />
      </div>
      <div className="mt-2">
        <Input label="الموقع" value={data.location} onChange={(e) => setData({ ...data, location: e.target.value })} placeholder="المدينة، البلد" />
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