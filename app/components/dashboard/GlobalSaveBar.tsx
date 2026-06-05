"use client";

import { useDashboard } from "./DashboardContext";
import { DashboardButton } from "./DashboardButton";
import { Loader2, Check, AlertCircle } from "lucide-react";
import { useState, useCallback } from "react";

const PAGE_LABELS: Record<string, string> = {
  home: "الصفحة الرئيسية",
  plans: "صفحة الخطط",
  contact: "صفحة التواصل",
  policies: "الصفحات القانونية",
  settings: "الإعدادات",
};

export function GlobalSaveBar() {
  const {
    hasUnsavedChanges,
    dirtyPages,
    dirtySections,
    isSaving,
    lastSaved,
    saveAll,
    discardChanges,
  } = useDashboard();

  const [showConfirmDiscard, setShowConfirmDiscard] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSave = useCallback(async () => {
    setSaveError(null);
    setShowSuccess(false);
    
    const result = await saveAll();
    
    if (result.success) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 5000);
    } else {
      const failedCount = result.results.filter(r => !r.success).length;
      setSaveError(`فشل حفظ ${failedCount} قسم. يرجى المحاولة مرة أخرى.`);
    }
  }, [saveAll]);

  const handleDiscard = useCallback(() => {
    discardChanges();
    setShowConfirmDiscard(false);
    setSaveError(null);
  }, [discardChanges]);

  // Don't render if no unsaved changes and not showing last saved
  if (!hasUnsavedChanges && !lastSaved && !saveError) {
    return null;
  }

  // Format dirty pages text
  const dirtyPagesText = dirtyPages.map(p => PAGE_LABELS[p] || p).join("، ");
  const dirtySectionsCount = dirtySections.length;

  return (
    <>
      {/* Main Save Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-[100] bg-white/95 backdrop-blur-sm border-t border-[#e8edf5] px-6 py-4 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]">
        <div className="max-w-[1600px] mx-auto flex items-center justify-between">
          {/* Status */}
          <div className="flex items-center gap-3 min-w-0">
            {isSaving ? (
              <span className="text-sm text-[#6b7a94] flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                <span>جاري حفظ التغييرات...</span>
              </span>
            ) : showSuccess ? (
              <span className="text-sm text-[#1a9a5a] flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>تم حفظ جميع التغييرات بنجاح</span>
              </span>
            ) : saveError ? (
              <span className="text-sm text-red-600 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{saveError}</span>
              </span>
            ) : hasUnsavedChanges ? (
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shrink-0 animate-pulse" />
                <span className="text-sm text-amber-700 font-medium">
                  {dirtySectionsCount} تغيير غير محفوظ
                </span>
                {dirtyPages.length > 0 && (
                  <span className="text-xs text-[#6b7a94] hidden sm:inline">
                    في: {dirtyPagesText}
                  </span>
                )}
              </div>
            ) : lastSaved ? (
              <span className="text-sm text-[#1a9a5a] flex items-center gap-2">
                <Check className="w-4 h-4 shrink-0" />
                <span>تم الحفظ الساعة {lastSaved}</span>
              </span>
            ) : null}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 shrink-0">
            {hasUnsavedChanges && (
              <>
                <DashboardButton
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowConfirmDiscard(true)}
                  disabled={isSaving}
                >
                  تجاهل التغييرات
                </DashboardButton>
                <DashboardButton
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      جاري الحفظ...
                    </>
                  ) : (
                    "حفظ جميع التغييرات"
                  )}
                </DashboardButton>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Discard Confirmation Dialog */}
      {showConfirmDiscard && (
        <div className="fixed inset-0 z-[101] bg-black/50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-start gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                <AlertCircle className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <h3 className="font-bold text-[#0c2954] mb-1">تجاهل التغييرات؟</h3>
                <p className="text-sm text-[#6b7a94]">
                  لديك {dirtySectionsCount} تغيير غير محفوظ في {dirtyPages.length} صفحة.
                  هل أنت متأكد من رغبتك في تجاهل هذه التغييرات؟
                </p>
                <div className="mt-3 text-xs text-[#6b7a94] bg-[#f5f6f9] p-2 rounded">
                  {dirtyPagesText}
                </div>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <DashboardButton
                variant="secondary"
                size="sm"
                onClick={() => setShowConfirmDiscard(false)}
              >
                إلغاء
              </DashboardButton>
              <DashboardButton
                variant="danger"
                size="sm"
                onClick={handleDiscard}
              >
                تجاهل التغييرات
              </DashboardButton>
            </div>
          </div>
        </div>
      )}

      {/* Spacer to prevent content from being hidden behind the bar */}
      {hasUnsavedChanges && <div className="h-[72px]" />}
    </>
  );
}
