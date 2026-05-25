"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { SaveBar } from "@/app/components/dashboard/SaveBar";
import { CodeEditor } from "@/app/components/dashboard/CodeEditor";
import { Loader2, Code, AlertTriangle } from "lucide-react";

export default function ScriptsSettingsPage() {
  const [data, setData] = useState({
    headScripts: "",
    bodyScripts: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [savedData, setSavedData] = useState(data);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data) {
          const loaded = {
            headScripts: json.data.headScripts || "",
            bodyScripts: json.data.bodyScripts || "",
          };
          setData(loaded);
          setSavedData(loaded);
        }
      } catch {
        /* keep defaults */
      } finally {
        setLoading(false);
      }
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
        body: JSON.stringify({
          headScripts: data.headScripts,
          bodyScripts: data.bodyScripts,
        }),
      });
      if (res.ok) {
        setSavedData(JSON.parse(JSON.stringify(data)));
        setLastSaved(new Date().toLocaleTimeString("ar-SA"));
        setTimeout(() => setLastSaved(null), 5000);
      }
    } catch {
      /* silent */
    }
    setSaving(false);
  }, [data]);

  const handleReset = useCallback(() => {
    setData(JSON.parse(JSON.stringify(savedData)));
  }, [savedData]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Security Warning */}
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">
            تحذير أمني
          </p>
          <p className="text-sm text-amber-700 mt-1">
            الكود المخصص يسمح بتنفيذ أي JavaScript في المتصفح. تأكد من فهم ما تقوم بلصقه هنا.
            {" "}
            <strong>لا تنسخ كوداً من مصادر غير موثوقة.</strong>
          </p>
        </div>
      </div>

      <ContentCard title="كود مخصص" subtitle="أضف أكواد JavaScript أو HTML مخصصة للصفحات العامة">
        <div className="space-y-6">
          {/* Head Scripts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-[#0c2954]">
                <Code className="w-4 h-4" />
                أكواد في الهيد (Head)
              </label>
              <span className="text-xs text-[#6b7a94]">
                يُحقن قبل &lt;/head&gt;
              </span>
            </div>
            <div dir="ltr">
              <CodeEditor
                value={data.headScripts}
                onChange={(value) =>
                  setData((prev) => ({ ...prev, headScripts: value }))
                }
              />
            </div>
            <p className="text-xs text-[#6b7a94]">
              استخدم هذا لإضافة أكواد التتبع، الميتا تاغ، أو CSS مخصص
            </p>
          </div>

          {/* Body Scripts */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium text-[#0c2954]">
                <Code className="w-4 h-4" />
                أكواد في نهاية الصفحة (Body)
              </label>
              <span className="text-xs text-[#6b7a94]">
                يُحقن قبل &lt;/body&gt;
              </span>
            </div>
            <div dir="ltr">
              <CodeEditor
                value={data.bodyScripts}
                onChange={(value) =>
                  setData((prev) => ({ ...prev, bodyScripts: value }))
                }
              />
            </div>
            <p className="text-xs text-[#6b7a94]">
              استخدم هذا لإضافة ودجت الدردشة، النوافذ المنبثقة، أو أكواد بعد تحميل الصفحة
            </p>
          </div>
        </div>

        <SaveBar
          isDirty={isDirty}
          isSubmitting={saving}
          onSave={handleSave}
          onReset={handleReset}
          lastSaved={lastSaved}
        />
      </ContentCard>

      {/* Help Section */}
      <div className="bg-[#f5f6f9] rounded-lg p-4">
        <h4 className="text-sm font-medium text-[#0c2954] mb-2">أمثلة على الاستخدام:</h4>
        <ul className="text-sm text-[#6b7a94] space-y-1 list-disc list-inside">
          <li>Google Analytics أو Google Tag Manager</li>
          <li>Facebook Pixel للتتبع</li>
          <li>ودجت دردشة (WhatsApp, Intercom, tawk.to)</li>
          <li>أكواد SEO مخصصة (Schema markup)</li>
          <li>CSS مخصص لتغيير مظهر الموقع</li>
        </ul>
      </div>
    </div>
  );
}
