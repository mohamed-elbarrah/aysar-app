"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { SaveBar } from "@/app/components/dashboard/SaveBar";
import { Loader2, Plus, Trash2, Code, AlertTriangle, ChevronDown } from "lucide-react";
import {
  type ScriptRecord,
  type ScriptType,
  type ScriptLocation,
  type ScriptStrategy,
  createDefaultScriptRecord,
  sanitizeScripts,
  validateScripts,
} from "@/app/lib/scripts";

const TYPE_OPTIONS: { value: ScriptType; label: string; hint: string }[] = [
  { value: "external", label: "External JS", hint: "Script with src URL" },
  { value: "inline", label: "Inline JS", hint: "JavaScript code block" },
  { value: "link", label: "CSS Link", hint: "External stylesheet" },
  { value: "meta", label: "Meta Tag", hint: "Meta/OG tag (merged into Metadata API)" },
  { value: "iframe", label: "Iframe", hint: "Embedded content (sandboxed)" },
];

const LOCATION_OPTIONS: { value: ScriptLocation; label: string }[] = [
  { value: "head", label: "Head" },
  { value: "body", label: "Body" },
];

const STRATEGY_OPTIONS: { value: ScriptStrategy; label: string; hint: string }[] = [
  { value: "afterInteractive", label: "After Interactive", hint: "Analytics, tracking (default)" },
  { value: "lazyOnload", label: "Lazy Onload", hint: "Chat widgets, low priority" },
  { value: "beforeInteractive", label: "Before Interactive", hint: "Critical polyfills only" },
];

function ScriptCard({
  record,
  index,
  onChange,
  onRemove,
}: {
  record: ScriptRecord;
  index: number;
  onChange: (index: number, updated: ScriptRecord) => void;
  onRemove: (index: number) => void;
}) {
  const typeOption = TYPE_OPTIONS.find((t) => t.value === record.type);
  const contentLabel =
    record.type === "external" || record.type === "link"
      ? "URL"
      : record.type === "meta"
        ? "Content (name=value)"
        : record.type === "iframe"
          ? "Src URL"
          : "JavaScript Code";

  const contentPlaceholder =
    record.type === "external"
      ? "https://www.googletagmanager.com/gtag/js?id=GA_ID"
      : record.type === "link"
        ? "https://cdn.example.com/styles.css"
        : record.type === "meta"
          ? "og:title=My Website"
          : record.type === "iframe"
            ? "https://example.com/embed"
            : "window.dataLayer = window.dataLayer || [];";

  return (
    <div className="border border-[#e8edf5] rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Code className="w-4 h-4 text-[#2d2e83]" />
          <span className="text-sm font-medium text-[#0c2954]">
            Script #{index + 1}
          </span>
          <span className="text-xs px-2 py-0.5 rounded-full bg-[#eef5ff] text-[#2d2e83]">
            {typeOption?.label || record.type}
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

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs font-medium text-[#6b7a94] mb-1">Type</label>
          <div className="relative">
            <select
              value={record.type}
              onChange={(e) => {
                const newType = e.target.value as ScriptType;
                onChange(index, {
                  ...record,
                  type: newType,
                  strategy: record.location === "head" ? "afterInteractive" : "lazyOnload",
                });
              }}
              className="w-full appearance-none border border-[#e8edf5] rounded-lg px-3 py-2 text-sm bg-white text-[#0c2954] focus:outline-none focus:ring-2 focus:ring-[#2d2e83]/20 focus:border-[#2d2e83]"
            >
              {TYPE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#6b7a94] absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-[#6b7a94] mb-1">Location</label>
          <div className="relative">
            <select
              value={record.location}
              onChange={(e) => {
                const newLoc = e.target.value as ScriptLocation;
                onChange(index, {
                  ...record,
                  location: newLoc,
                  strategy: newLoc === "head" ? "afterInteractive" : "lazyOnload",
                });
              }}
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
          <label className="block text-xs font-medium text-[#6b7a94] mb-1">Strategy</label>
          <div className="relative">
            <select
              value={record.strategy}
              onChange={(e) =>
                onChange(index, {
                  ...record,
                  strategy: e.target.value as ScriptStrategy,
                })
              }
              className="w-full appearance-none border border-[#e8edf5] rounded-lg px-3 py-2 text-sm bg-white text-[#0c2954] focus:outline-none focus:ring-2 focus:ring-[#2d2e83]/20 focus:border-[#2d2e83]"
            >
              {STRATEGY_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-[#6b7a94] absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-[#6b7a94] mb-1">
          {contentLabel}
        </label>
        {record.type === "inline" ? (
          <textarea
            value={record.content}
            onChange={(e) =>
              onChange(index, { ...record, content: e.target.value })
            }
            dir="ltr"
            rows={4}
            placeholder={contentPlaceholder}
            className="w-full border border-[#e8edf5] rounded-lg px-3 py-2 text-sm font-mono bg-[#1e1e2e] text-[#cdd6f4] focus:outline-none focus:ring-2 focus:ring-[#2d2e83]/20 focus:border-[#2d2e83] resize-y"
          />
        ) : (
          <input
            type="text"
            value={record.content}
            onChange={(e) =>
              onChange(index, { ...record, content: e.target.value })
            }
            dir="ltr"
            placeholder={contentPlaceholder}
            className="w-full border border-[#e8edf5] rounded-lg px-3 py-2 text-sm text-[#0c2954] focus:outline-none focus:ring-2 focus:ring-[#2d2e83]/20 focus:border-[#2d2e83]"
          />
        )}
        {typeOption && (
          <p className="text-xs text-[#6b7a94] mt-1">{typeOption.hint}</p>
        )}
      </div>
    </div>
  );
}

export default function ScriptsSettingsPage() {
  const [scripts, setScripts] = useState<ScriptRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<string | null>(null);
  const [savedScripts, setSavedScripts] = useState<ScriptRecord[]>([]);
  const [warnings, setWarnings] = useState<string[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data) {
          const loaded = json.data.scripts || [];
          setScripts(loaded);
          setSavedScripts(loaded);
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
    () => JSON.stringify(savedScripts) !== JSON.stringify(scripts),
    [savedScripts, scripts]
  );

  const handleAddScript = useCallback(() => {
    setScripts((prev) => [
      ...prev,
      createDefaultScriptRecord("external", "head"),
    ]);
  }, []);

  const handleUpdateScript = useCallback(
    (index: number, updated: ScriptRecord) => {
      setScripts((prev) => {
        const next = [...prev];
        next[index] = updated;
        return next;
      });
    },
    []
  );

  const handleRemoveScript = useCallback((index: number) => {
    setScripts((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleSave = useCallback(async () => {
    setWarnings([]);

    const sanitized = sanitizeScripts(scripts);
    const { valid, warnings: validationWarnings } = validateScripts(sanitized);

    if (validationWarnings.length > 0) {
      setWarnings(validationWarnings);
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ scripts: valid }),
      });
      const json = await res.json();

      if (res.ok) {
        const saved = json.data?.scripts || valid;
        setScripts(saved);
        setSavedScripts(saved);
        setLastSaved(new Date().toLocaleTimeString("ar-SA"));
        setTimeout(() => setLastSaved(null), 5000);
      } else if (json.warnings) {
        setWarnings(json.warnings);
      }
    } catch {
      /* silent */
    }
    setSaving(false);
  }, [scripts]);

  const handleReset = useCallback(() => {
    setScripts(JSON.parse(JSON.stringify(savedScripts)));
    setWarnings([]);
  }, [savedScripts]);

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

      {warnings.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <p className="text-sm font-medium text-red-800 mb-2">تحذيرات التحقق:</p>
          <ul className="text-sm text-red-700 space-y-1 list-disc list-inside">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      <ContentCard
        title="كود مخصص"
        subtitle="إدارة السكريبتات المخصصة للصفحات العامة"
      >
        <div className="space-y-4">
          {scripts.length === 0 && (
            <div className="text-center py-8 text-[#6b7a94]">
              <Code className="w-10 h-10 mx-auto mb-2 opacity-40" />
              <p className="text-sm">لا توجد سكريبتات مخصصة</p>
              <p className="text-xs mt-1">
                أضف سكريبت للتتبع، التحليلات، ودجت الدردشة، وغيرها
              </p>
            </div>
          )}

          {scripts.map((record, index) => (
            <ScriptCard
              key={record.id}
              record={record}
              index={index}
              onChange={handleUpdateScript}
              onRemove={handleRemoveScript}
            />
          ))}

          <button
            type="button"
            onClick={handleAddScript}
            className="w-full border-2 border-dashed border-[#e8edf5] hover:border-[#2d2e83] rounded-lg p-4 flex items-center justify-center gap-2 text-sm text-[#6b7a94] hover:text-[#2d2e83] transition-colors"
          >
            <Plus className="w-4 h-4" />
            إضافة سكريبت
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
            <strong>External JS</strong> — Google Analytics, Facebook Pixel
          </li>
          <li>
            <strong>Inline JS</strong> — gtag config, custom tracking code
          </li>
          <li>
            <strong>CSS Link</strong> — External stylesheets
          </li>
          <li>
            <strong>Meta Tag</strong> — Open Graph, Schema.org (merged into SEO)
          </li>
          <li>
            <strong>Iframe</strong> — Chat widgets (sandboxed)
          </li>
        </ul>
      </div>
    </div>
  );
}