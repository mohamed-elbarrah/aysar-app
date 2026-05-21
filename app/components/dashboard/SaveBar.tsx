import { DashboardButton } from "./DashboardButton";
import { Loader2, Check } from "lucide-react";

interface SaveBarProps {
  isDirty: boolean;
  isSubmitting: boolean;
  onReset: () => void;
  lastSaved?: string;
}

export function SaveBar({ isDirty, isSubmitting, onReset, lastSaved }: SaveBarProps) {
  return (
    <div className="sticky bottom-0 left-0 right-0 bg-white border-t border-[#e8edf5] p-4 flex items-center justify-between z-30 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-2">
        {lastSaved && !isDirty && (
          <span className="text-sm text-[#1a9a5a] flex items-center gap-1">
            <Check className="w-4 h-4" />
            تم الحفظ في {lastSaved}
          </span>
        )}
        {isDirty && (
          <span className="text-sm text-amber-600">* يوجد تغييرات غير محفوظة</span>
        )}
      </div>
      <div className="flex items-center gap-2">
        <DashboardButton type="button" variant="secondary" size="sm" onClick={onReset} disabled={isSubmitting}>
          إعادة
        </DashboardButton>
        <DashboardButton type="submit" variant="primary" size="sm" disabled={!isDirty || isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            "حفظ التغييرات"
          )}
        </DashboardButton>
      </div>
    </div>
  );
}
