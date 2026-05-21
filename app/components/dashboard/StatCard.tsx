import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string | number;
  icon: LucideIcon;
  color: string;
  className?: string;
}

export function StatCard({ label, value, icon: Icon, color, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "bg-white rounded-xl border border-[#e8edf5] p-5 flex items-center justify-between",
        className
      )}
      style={{ borderTop: `3px solid ${color}` }}
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        <span className="text-sm text-[#6b7a94]">{label}</span>
      </div>
      <span className="text-3xl font-bold text-[#0c2954]">{value}</span>
    </div>
  );
}
