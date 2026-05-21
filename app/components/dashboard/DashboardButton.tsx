import { Button as ButtonPrimitive } from "@base-ui/react/button";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const dashboardButtonVariants = cva(
  "inline-flex items-center justify-center rounded-xl font-semibold whitespace-nowrap transition-all duration-200 outline-none select-none focus-visible:ring-2 focus-visible:ring-[#0c2954]/20 disabled:pointer-events-none disabled:opacity-50 active:translate-y-px",
  {
    variants: {
      variant: {
        primary:
          "bg-[#0c2954] text-white hover:bg-[#1a3a6a] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(12,41,84,0.25)] active:bg-[#0c2954] active:shadow-none",
        secondary:
          "bg-white text-[#0c2954] border border-[#e8edf5] hover:bg-[#f5f6f9] hover:border-[#d0d8e8] active:bg-[#eef0f4]",
        ghost:
          "bg-transparent text-[#6b7a94] hover:text-[#0c2954] hover:bg-[#f5f6f9] active:bg-[#eef0f4]",
        danger:
          "bg-[#fef2f2] text-[#dc2626] border border-[#fecaca] hover:bg-[#fee2e2] hover:border-[#fca5a5] active:bg-[#fecaca]",
        success:
          "bg-[#1a9a5a] text-white hover:bg-[#158a50] hover:-translate-y-0.5 hover:shadow-[0_4px_12px_rgba(26,154,90,0.25)] active:bg-[#1a9a5a] active:shadow-none",
        outline:
          "bg-transparent text-[#0c2954] border-2 border-[#0c2954] hover:bg-[#0c2954] hover:text-white active:bg-[#0c2954]",
      },
      size: {
        default: "h-10 px-5 text-sm gap-1.5",
        sm: "h-8 px-3.5 text-xs gap-1",
        lg: "h-12 px-6 text-base gap-2",
        icon: "h-10 w-10 p-0",
        "icon-sm": "h-8 w-8 p-0",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
    },
  }
);

export interface DashboardButtonProps
  extends ButtonPrimitive.Props,
    VariantProps<typeof dashboardButtonVariants> {}

export function DashboardButton({
  className,
  variant = "primary",
  size = "default",
  ...props
}: DashboardButtonProps) {
  return (
    <ButtonPrimitive
      data-slot="dashboard-button"
      className={cn(dashboardButtonVariants({ variant, size, className }))}
      {...props}
    />
  );
}
