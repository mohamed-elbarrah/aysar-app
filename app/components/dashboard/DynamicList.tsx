import { DashboardButton } from "@/app/components/dashboard/DashboardButton";
import { Input } from "@/app/components/ui/Input";
import { Plus, Trash2 } from "lucide-react";

interface DynamicListProps {
  items: string[];
  onChange: (items: string[]) => void;
  placeholder?: string;
  label?: string;
}

export function DynamicList({ items, onChange, placeholder = "عنصر جديد", label }: DynamicListProps) {
  const add = () => onChange([...items, ""]);
  const remove = (idx: number) => onChange(items.filter((_, i) => i !== idx));
  const update = (idx: number, value: string) => {
    const next = [...items];
    next[idx] = value;
    onChange(next);
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium text-[#0c1829]">{label}</label>}
      {items.map((item, idx) => (
        <div key={idx} className="flex items-center gap-2">
          <Input
            value={item}
            onChange={(e) => update(idx, e.target.value)}
            placeholder={placeholder}
            wrapperClassName="flex-1 !mb-0"
          />
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
        إضافة
      </DashboardButton>
    </div>
  );
}
