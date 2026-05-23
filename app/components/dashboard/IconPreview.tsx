"use client";

import { icons } from "lucide-react";

interface IconPreviewProps {
  iconName: string;
  iconUrl?: string | null;
  iconColor: string;
  size?: number;
  className?: string;
}

export function IconPreview({
  iconName,
  iconUrl,
  iconColor,
  size = 20,
  className = "",
}: IconPreviewProps) {
  if (iconUrl) {
    return (
      <div
        className={`flex items-center justify-center ${className}`}
        style={{ width: size, height: size }}
      >
        <img
          src={iconUrl}
          alt=""
          className="max-w-full max-h-full object-contain"
        />
      </div>
    );
  }

  const LucideIcon = icons[iconName as keyof typeof icons] as
    | React.ComponentType<{
        className?: string;
        style?: React.CSSProperties;
        strokeWidth?: number;
      }>
    | undefined;

  if (LucideIcon) {
    return (
      <LucideIcon
        className={className}
        style={{ color: iconColor, width: size, height: size }}
        strokeWidth={1.8}
      />
    );
  }

  return (
    <span
      className={`flex items-center justify-center text-xs font-bold ${className}`}
      style={{ color: iconColor, width: size, height: size }}
    >
      ?
    </span>
  );
}
