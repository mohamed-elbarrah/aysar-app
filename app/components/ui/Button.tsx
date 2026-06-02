import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, AnchorHTMLAttributes } from "react";

type ButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "solid"
  | "cta"
  | "whatsapp";
type ButtonSize = "sm" | "md" | "lg";

interface ButtonBaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}

interface ButtonAsButtonProps
  extends
    ButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children"> {
  href?: undefined;
  children: ReactNode;
}

interface ButtonAsAnchorProps
  extends
    ButtonBaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "children"> {
  href: string;
  children: ReactNode;
}

type ButtonProps = ButtonAsButtonProps | ButtonAsAnchorProps;

export function Button({
  variant = "primary",
  size = "md",
  children,
  className,
  href,
  ...rest
}: ButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 font-semibold transition-all duration-150 cursor-pointer border-none font-[inherit]";

  const variantStyles: Record<ButtonVariant, string> = {
    primary:
      "bg-white text-navy hover:opacity-[0.92] hover:-translate-y-px active:translate-y-0",
    secondary:
      "bg-white/[0.07] text-white/[0.85] border border-white/[0.14] hover:bg-white/[0.12] hover:-translate-y-px active:translate-y-0",
    ghost:
      "bg-transparent text-white/70 hover:text-white hover:bg-white/[0.08] border border-white/[0.18]",
    solid: "bg-[#28C928] text-white font-bold hover:opacity-[0.92]",
    cta: "bg-navy text-white hover:bg-[#28C928] hover:-translate-y-px active:translate-y-0",
    whatsapp:
      "bg-[rgba(37,211,102,0.08)] text-[#1a7a3a] border border-[rgba(37,211,102,0.2)] hover:bg-[rgba(37,211,102,0.14)]",
  };

  const sizeStyles: Record<ButtonSize, string> = {
    sm: "text-[13px] px-5 py-2 rounded-2xl",
    md: "text-[15px] px-8 py-3.5 rounded-2xl",
    lg: "text-base px-10 py-4 rounded-2xl",
  };

  const combinedClassName = cn(
    baseStyles,
    variantStyles[variant],
    sizeStyles[size],
    className,
  );

  if (href) {
    return (
      <a
        href={href}
        className={combinedClassName}
        {...(rest as AnchorHTMLAttributes<HTMLAnchorElement>)}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      className={combinedClassName}
      {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
    >
      {children}
    </button>
  );
}
