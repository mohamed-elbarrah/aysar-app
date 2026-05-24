"use client";

import { DashboardButton } from "./DashboardButton";
import { Loader2, Check, Pencil } from "lucide-react";

interface SaveBarProps {
  isDirty: boolean;
  isSubmitting: boolean;
  onSave: () => void;
  onReset?: () => void;
  lastSaved?: string | null;
  noChangesText?: string;
  unsavedText?: string;
  savedText?: string;
  savingText?: string;
  saveButtonText?: string;
  resetButtonText?: string;
}

export function SaveBar({
  isDirty,
  isSubmitting,
  onSave,
  onReset,
  lastSaved,
  noChangesText = "لا توجد تغييرات",
  unsavedText = "توجد تغييرات غير محفوظة",
  savedText = "تم الحفظ",
  savingText = "جاري الحفظ...",
  saveButtonText = "حفظ التغييرات",
  resetButtonText = "إعادة",
}: SaveBarProps) {
  return (
    <div
      className="sticky bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm border-t border-[#e8edf5] px-6 py-4 flex items-center justify-between shadow-[0_-4px_20px_rgba(0,0,0,0.04)] transition-all duration-300"
    >
      <div className="flex items-center gap-2 min-w-0">
        {isSubmitting ? (
          <span className="text-sm text-[#6b7a94] flex items-center gap-1.5">
            <Loader2 className="w-4 h-4 animate-spin shrink-0" />
            {savingText}
          </span>
        ) : isDirty ? (
          <span className="text-sm text-amber-600 flex items-center gap-1.5 font-medium">
            <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0 animate-pulse" />
            {unsavedText}
          </span>
        ) : lastSaved ? (
          <span className="text-sm text-[#1a9a5a] flex items-center gap-1.5">
            <Check className="w-4 h-4 shrink-0" />
            {savedText} {lastSaved}
          </span>
        ) : (
          <span className="text-sm text-[#6b7a94] flex items-center gap-1.5">
            <Pencil className="w-4 h-4 shrink-0" />
            {noChangesText}
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {onReset && (
          <DashboardButton
            type="button"
            variant="secondary"
            size="sm"
            onClick={onReset}
            disabled={isSubmitting || !isDirty}
          >
            {resetButtonText}
          </DashboardButton>
        )}
        <DashboardButton
          type="button"
          variant="primary"
          size="sm"
          onClick={onSave}
          disabled={!isDirty || isSubmitting}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              {savingText}
            </>
          ) : (
            saveButtonText
          )}
        </DashboardButton>
      </div>
    </div>
  );
}
