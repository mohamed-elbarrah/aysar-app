"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Input } from "@/app/components/ui/Input";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { SaveBar } from "@/app/components/dashboard/SaveBar";
import { Loader2 } from "lucide-react";
import { SITE_CONTACT_INFO } from "@/app/lib/dashboard/placeholders";
import type { ContactInfo } from "@/app/lib/settings-data";

export default function ContactSettingsPage() {
  const [data, setData] = useState<ContactInfo>({ ...SITE_CONTACT_INFO });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [savedData, setSavedData] = useState<ContactInfo>({ ...SITE_CONTACT_INFO });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.contactInfo) {
          setData(json.data.contactInfo);
          setSavedData(JSON.parse(JSON.stringify(json.data.contactInfo)));
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
        body: JSON.stringify({ contactInfo: data }),
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