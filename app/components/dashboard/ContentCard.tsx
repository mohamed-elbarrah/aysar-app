import { cn } from "@/lib/utils";

interface ContentCardProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export function ContentCard({ title, subtitle, children, className }: ContentCardProps) {
  return (
    <div className={cn("bg-white rounded-xl border border-[#e8edf5] shadow-sm hover:shadow-md transition-shadow duration-200", className)}>
      <div className="px-5 py-4 border-b border-[#e8edf5]">
        <h3 className="font-bold text-[#0c2954] text-sm">{title}</h3>
        {subtitle && <p className="text-xs text-[#6b7a94] mt-0.5">{subtitle}</p>}
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}
