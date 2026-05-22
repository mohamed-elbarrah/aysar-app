"use client";

import { useState, useEffect, useCallback } from "react";
import { Input, Textarea } from "@/app/components/ui/Input";
import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { ContentCard } from "@/app/components/dashboard/ContentCard";
import { LinkListEditor } from "@/app/components/dashboard/LinkListEditor";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { DEFAULT_FOOTER_COLUMNS } from "@/app/lib/dashboard/placeholders";
import type { FooterColumn, FooterLinkItem } from "@/app/lib/settings-data";

export default function FooterSettingsPage() {
  const [columns, setColumns] = useState<FooterColumn[]>(DEFAULT_FOOTER_COLUMNS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/settings");
        const json = await res.json();
        if (json.success && json.data?.footerColumns) {
          setColumns(json.data.footerColumns);
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
        body: JSON.stringify({ footerColumns: columns }),
      });
      if (res.ok) {
        setFeedback("تم الحفظ بنجاح");
        setTimeout(() => setFeedback(""), 3000);
      }
    } catch { /* silent */ }
    setSaving(false);
  }, [columns]);

  const addColumn = () => {
    setColumns([...columns, { type: "links", title: "", links: [] }]);
  };

  const removeColumn = (idx: number) => {
    setColumns(columns.filter((_, i) => i !== idx));
  };

  const updateColumn = (idx: number, updated: FooterColumn) => {
    const next = [...columns];
    next[idx] = updated;
    setColumns(next);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-[40vh]">
      <Loader2 className="w-8 h-8 animate-spin text-[#2d2e83]" />
    </div>
  );

  return (
    <div className="space-y-6">
      {columns.map((col, idx) => (
        <ContentCard
          key={idx}
          title={col.type === "brand" ? `العمود ${idx + 1} — ${col.title} (شعار)` : `العمود ${idx + 1} — ${col.title || "بدون عنوان"}`}
          subtitle={col.type === "brand" ? "الشعار والتعريف وحقوق النشر" : `${(col.links || []).length} رابط`}
        >
          <div className="space-y-4">
            <div className="form-grid-2">
              <Input
                label="عنوان العمود"
                value={col.title}
                onChange={(e) => updateColumn(idx, { ...col, title: e.target.value })}
              />
              <div className="form-group">
                <label className="form-label">نوع العمود</label>
                <select
                  value={col.type}
                  onChange={(e) => updateColumn(idx, { ...col, type: e.target.value as "brand" | "links" })}
                  className="form-control w-full px-3 py-2 rounded-lg border border-[#e8edf5] bg-white text-sm text-[#0c1829] focus:outline-none focus:ring-2 focus:ring-[#2d2e83]/20 focus:border-[#2d2e83]"
                >
                  <option value="brand">شعار وتعريف</option>
                  <option value="links">روابط</option>
                </select>
              </div>
            </div>

            {col.type === "brand" && (
              <>
                <Textarea
                  label="نص التعريف أسفل الشعار"
                  value={col.tagline || ""}
                  onChange={(e) => updateColumn(idx, { ...col, tagline: e.target.value })}
                  rows={2}
                />
                <Textarea
                  label="نص حقوق النشر"
                  value={col.copyright || ""}
                  onChange={(e) => updateColumn(idx, { ...col, copyright: e.target.value })}
                  rows={2}
                />
              </>
            )}

            {(col.type === "links" || (col.type === "brand" && col.links && col.links.length > 0)) && (
              <div>
                <p className="text-xs font-semibold text-[#3a4a60] mb-2">
                  {col.type === "brand" ? "روابط إضافية" : "الروابط"}
                </p>
                <LinkListEditor
                  items={col.links || []}
                  onChange={(links: FooterLinkItem[]) => updateColumn(idx, { ...col, links })}
                  showExternalToggle={true}
                  addLabel="إضافة رابط"
                />
              </div>
            )}
          </div>

          <div className="mt-5 flex items-center justify-end">
            <DashboardButton variant="danger" size="sm" onClick={() => removeColumn(idx)}>
              <Trash2 className="w-4 h-4" />
              حذف العمود
            </DashboardButton>
          </div>
        </ContentCard>
      ))}

      <DashboardButton variant="outline" onClick={addColumn} className="w-full">
        <Plus className="w-4 h-4" />
        إضافة عمود جديد
      </DashboardButton>

      <div className="flex items-center justify-between pt-4 border-t border-[#e8edf5]">
        <span className="text-xs text-[#1a9a5a]">{feedback}</span>
        <DashboardButton disabled={saving} onClick={handleSave}>
          {saving ? "جاري الحفظ..." : "حفظ جميع الأعمدة"}
        </DashboardButton>
      </div>
    </div>
  );
}