import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { Input } from "@/app/components/ui/Input";
import { Plus, Trash2 } from "lucide-react";

interface LinkItem { label: string; href: string; external?: boolean }

interface LinkListEditorProps {
  items: LinkItem[];
  onChange: (items: LinkItem[]) => void;
  showExternalToggle?: boolean;
  addLabel?: string;
}

export function LinkListEditor({ items, onChange, showExternalToggle = false, addLabel = "إضافة رابط" }: LinkListEditorProps) {
  const add = () => onChange([...items, { label: "", href: "" }]);
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const update = (idx: number, field: keyof LinkItem, value: string | boolean) => {
    const next = [...items];
    next[idx] = { ...next[idx], [field]: value };
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {items.map((item, idx) => (
        <div key={idx} className="flex items-start gap-2">
          <div className="flex-1">
            <Input
              value={item.label}
              onChange={(e) => update(idx, "label", e.target.value)}
              placeholder="اسم الرابط"
            />
          </div>
          <div className="flex-1">
            <Input
              value={item.href}
              onChange={(e) => update(idx, "href", e.target.value)}
              placeholder="الرابط"
            />
          </div>
          {showExternalToggle && (
            <label className="flex items-center gap-1.5 pt-2 whitespace-nowrap cursor-pointer">
              <input
                type="checkbox"
                checked={!!item.external}
                onChange={(e) => update(idx, "external", e.target.checked)}
                className="w-3.5 h-3.5 rounded border-[#d1d5db] text-[#0c2954] focus:ring-[#0c2954]"
              />
              <span className="text-xs text-[#6b7a94]">خارجي</span>
            </label>
          )}
          <DashboardButton
            type="button"
            variant="danger"
            size="icon-sm"
            onClick={() => remove(idx)}
          >
            <Trash2 className="w-4 h-4" />
          </DashboardButton>
        </div>
      ))}
      <DashboardButton type="button" variant="outline" size="sm" onClick={add} className="mt-1">
        <Plus className="w-4 h-4" />
        {addLabel}
      </DashboardButton>
    </div>
  );
}