interface TikTokIconProps {
  className?: string;
}

export function TikTokIcon({ className }: TikTokIconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.89 2.89 2.89 0 012.88-2.89c.3 0 .58.05.85.13V9.4a6.37 6.37 0 00-.85-.06A6.34 6.34 0 003 15.68a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.06a8.16 8.16 0 004.77 1.53V7.14a4.82 4.82 0 01-1.46-.45z" />
    </svg>
  );
}