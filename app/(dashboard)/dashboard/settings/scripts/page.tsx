"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { SaveBar } from "@/app/components/dashboard/SaveBar";
import { Loader2, Plus, Trash2, Code, AlertTriangle, ChevronDown } from "lucide-react";
import {
  type HtmlBlockRecord,
  type BlockLocation,
  createDefaultHtmlBlock,
} from "@/app/lib/scripts";

const LOCATION_OPTIONS: { value: BlockLocation; label: string; hint: string }[] = [
  { value: "head", label: "Head", hint: "يُنفذ قبل تحميل الصفحة" },
  { value: "body", label: "Body", hint: "يُنفذ بعد تحميل الصفحة" },
];

function BlockCard({
  record,
  index,
  onChange,
  onRemove,
}: {
  record: HtmlBlockRecord;
  index: number;
  onChange: (index: number, updated: HtmlBlockRecord) => void;
  onRemove: (index: number) => void;
}) {
  const locationOption = LOCATION_OPTIONS.find((l) => l.value === record.location);

  return (
    <div className="border border-[#e8edf5] rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-[#2d2e83]" />
          <span className="text-sm font-medium text-[#0c2954]">
            كود #{index + 1}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#eef5ff] text-[#2d2e83]">
            {locationOption?.label || record.location}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onRemove(index)}
          className="text-red-400 hover:text-red-600 transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      <div className="max-w-[200px]">
        <label className="block text-xs font-medium text-[#6b7a94] mb-1">الموقع</label>
        <div className="relative">
          <select
            value={record.location}
            onChange={(e) =>
              onChange(index, {
                ...record,
                location: e.target.value as BlockLocation,
              })
            }
            className="w-full appearance-none border border-[#e8edf5] rounded-lg px-3 py-2 text-sm bg-white text-[#0c2954] focus:outline-none focus:ring-2 focus:ring-[#2d2e83]/20 focus:border-[#2d2e83]"
          >
            {LOCATION_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-[#6b7a94] absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#6b7a94] mb-1">الكود</label>
        <textarea
          value={record.content}
          onChange={(e) =>
            onChange(index, { ...record, content: e.target.value })
          }
          dir="ltr"
          rows={6}
          placeholder={`<!-- مثال: Google Analytics -->\n<script async src="https://www.googletagmanager.com/gtag/js?id=GA_ID"></script>\n<script>\n  window.dataLayer = window.dataLayer || [];\n  function gtag(){dataLayer.push(arguments);}\n  gtag('js', new Date());\n  gtag('config', 'GA_ID');\n</script>`}
          className="w-full border border-[#e8edf5] rounded-lg px-3 py-2 text-sm font-mono bg-[#1e1e2e] text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-[#2d2e83]/20 focus:border-[#2d2e83] resize-y"
        />
      </div>
    </div>
  );
}

export default function ScriptsSettingsPage() {
  const [blocks, setBlocks] = useState<HtmlBlockRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [savedBlocks, setSavedBlocks] = useState<HtmlBlockRecord[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data) {
          const loaded = json.data.scripts || [];
          setBlocks(loaded);
          setSavedBlocks(loaded);
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
    () => JSON.stringify(savedBlocks) !== JSON.stringify(blocks),
    [savedBlocks, blocks]
  );

  const handleAddBlock = useCallback(() => {
    setBlocks((prev) => [
      ...prev,
      createDefaultHtmlBlock("head"),
    ]);
  }, []);

  const handleUpdateBlock = useCallback(
    (index: number, updated: HtmlBlockRecord) => {
      setBlocks((prev) => {
        const next = [...prev];
        next[index] = updated;
        return next;
      });
    },
    []
  );

  const handleRemoveBlock = useCallback((index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ scripts: blocks }),
      });
      const json = await res.json();

      if (res.ok) {
        const saved = json.data?.scripts || blocks;
        setBlocks(saved);
        setSavedBlocks(saved);
        setLastSaved(new Date().toLocaleTimeString("ar-SA"));
        setTimeout(() => setLastSaved(null), 5000);
      }
    } catch {
      /* silent */
    }
    setSaving(false);
  }, [blocks]);

  const handleReset = useCallback(() => {
    setBlocks(JSON.parse(JSON.stringify(savedBlocks)));
  }, [savedBlocks]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-medium text-amber-800">تحذير أمني</p>
          <p className="text-sm text-amber-700 mt-1">
            الكود المخصص يسمح بتنفيذ JavaScript في المتصفح. تأكد من فهم ما تضيفه هنا.{" "}
            <strong>لا تضف كوداً من مصادر غير موثوقة.</strong>
          </p>
        </div>
      </div>

      <ContentCard
        title="كود مخصص"
        subtitle="إضافة أكواد HTML/CSS/JavaScript مخصصة — تعمل مثل عنصر HTML Block"
      >
        <div className="space-y-4">
          {blocks.length === 0 && (
            <div className="text-center py-8 text-[#6b7a94]">
              <Code className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">لا توجد أكواد مخصصة</p>
              <p className="text-xs mt-1">
                أضف كود للتتبع، التحليلات، ودجت الدردشة، وغيرها
              </p>
            </div>
          )}

          {blocks.map((record, index) => (
            <BlockCard
              key={record.id}
              record={record}
              index={index}
              onChange={handleUpdateBlock}
              onRemove={handleRemoveBlock}
            />
          ))}

          <button
            type="button"
            onClick={handleAddBlock}
            className="w-full border-2 border-dashed border-[#e8edf5] hover:border-[#2d2e83] rounded-lg p-4 flex items-center justify-center gap-2 text-sm text-[#6b7a94] hover:text-[#2d2e83] transition-colors"
          >
            <Plus className="w-4 h-4" />
            إضافة كود
          </button>
        </div>

        <SaveBar
          isDirty={isDirty}
          isSubmitting={saving}
          onSave={handleSave}
          onReset={handleReset}
          lastSaved={lastSaved}
        />
      </ContentCard>

      <div className="bg-[#f5f6f9] rounded-lg p-4">
        <h4 className="text-sm font-medium text-[#0c2954] mb-2">
          أمثلة على الاستخدام:
        </h4>
        <ul className="text-sm text-[#6b7a94] space-y-1 list-disc list-inside">
          <li>
            <strong>Google Analytics</strong> — الصق كود gtag.js كاملاً
          </li>
          <li>
            <strong>Facebook Pixel</strong> — الصق كود البيكسل كاملاً
          </li>
          <li>
            <strong>ودجت الدردشة</strong> — Tawk.to, Intercom, Zopim
          </li>
          <li>
            <strong>CSS مخصص</strong> — أضف وسم &lt;style&gt; مع أنماطك
          </li>
          <li>
            <strong>أي كود HTML</strong> — يدعم HTML, CSS, JavaScript معاً
          </li>
        </ul>
      </div>
    </div>
  );
}