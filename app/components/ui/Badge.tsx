import { cn } from "@/lib/utils";

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "light";
  dot?: boolean;
  className?: string;
}

export function Badge({ children, variant = "default", dot, className }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-[30px] pl-[12px] pr-[16px] py-[5px] text-[12px] font-medium",
        variant === "default" &&
          "bg-white/[0.06] border border-white/[0.12] text-white/70",
        variant === "light" &&
          "bg-indigo/5 border border-indigo/10 text-indigo",
        className
      )}
    >
      {dot && <span className="w-[6px] h-[6px] rounded-full bg-mint flex-shrink-0" />}
      {children}
    </div>
  );
}
