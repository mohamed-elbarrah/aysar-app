"use client";

import Link from "next/link";
import Image from "next/image";
import type { SocialInfo, AppLinkInfo, FooterLinkItem } from "@/app/lib/settings-data";

interface FooterProps {
  tagline: string;
  copyright: string;
  quickLinks: FooterLinkItem[];
  helpLinks: FooterLinkItem[];
  socialLinks: SocialInfo;
  appLinks: AppLinkInfo;
}

const SOCIAL_ICONS: Record<string, { label: string; href: (s: SocialInfo) => string }> = {
  whatsapp: { label: "واتساب", href: (s) => `https://wa.me/${s.whatsappNumber}` },
  x: { label: "X", href: (s) => s.xUrl },
  instagram: { label: "إنستغرام", href: (s) => s.instagramUrl },
  tiktok: { label: "تيك توك", href: (s) => s.tiktokUrl },
};

function WhatsAppIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>;
}
function XIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>;
}
function InstagramIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>;
}
function TikTokIcon({ className }: { className?: string }) {
  return <svg className={className} viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.88-2.89 2.89 2.89 0 012.88-2.89c.3 0 .58.05.85.13V9.4a6.37 6.37 0 00-.85-.06A6.34 6.34 0 003 15.68a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.06a8.16 8.16 0 004.77 1.53V7.14a4.82 4.82 0 01-1.46-.45z" /></svg>;
}

const SOCIAL_ICON_MAP: Record<string, typeof WhatsAppIcon> = {
  whatsapp: WhatsAppIcon,
  x: XIcon,
  instagram: InstagramIcon,
  tiktok: TikTokIcon,
};

export default function Footer({ tagline, copyright, quickLinks, helpLinks, socialLinks, appLinks }: FooterProps) {
  return (
    <footer className="bg-[#0c2954] pt-14 pb-0">
      <div className="container-aysar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(3,1fr)] gap-12 pb-10 border-b border-white/[0.08]">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-block mb-4">
              <Image
                src="/logo.png"
                alt="أيسَر"
                width={100}
                height={34}
                className="h-[34px] w-auto object-contain brightness-[5]"
                priority
              />
            </Link>
            <p className="text-[14px] text-white/45 leading-relaxed max-w-[260px] mb-5">
              {tagline}
            </p>
            <div className="flex items-center gap-2">
              {Object.entries(SOCIAL_ICONS).map(([key, cfg]) => {
                const IconComp = SOCIAL_ICON_MAP[key];
                if (!IconComp) return null;
                return (
                  <a
                    key={key}
                    href={cfg.href(socialLinks)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={cfg.label}
                    className="w-[34px] h-[34px] rounded-lg bg-white/[0.07] border border-white/[0.1] flex items-center justify-center transition-colors hover:bg-white/[0.14]"
                  >
                    <IconComp className="w-4 h-4 text-white" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-[11px] font-bold text-white/35 tracking-wide uppercase mb-4">روابط سريعة</h4>
            <ul className="flex flex-col gap-2.5">
              {quickLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="text-[14px] text-white/55 hover:text-white transition-colors">
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help */}
          <div>
            <h4 className="text-[11px] font-bold text-white/35 tracking-wide uppercase mb-4">المساعدة</h4>
            <ul className="flex flex-col gap-2.5">
              {helpLinks.map((l) => (
                <li key={l.href}>
                  {l.external ? (
                    <a href={l.href} target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/55 hover:text-white transition-colors">
                      {l.label}
                    </a>
                  ) : (
                    <Link href={l.href} className="text-[14px] text-white/55 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* App */}
          <div>
            <h4 className="text-[11px] font-bold text-white/35 tracking-wide uppercase mb-4">التطبيق</h4>
            <ul className="flex flex-col gap-2.5">
              <li>
                <a href={appLinks.appStoreUrl} target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/55 hover:text-white transition-colors">
                  App Store
                </a>
              </li>
              <li>
                <a href={appLinks.googlePlayUrl} target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/55 hover:text-white transition-colors">
                  Google Play
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom line */}
        <div className="py-5 flex items-center justify-between flex-wrap gap-4">
          <span className="text-[12px] text-white/28">
            {copyright}
          </span>
          <div className="flex items-center gap-4">
            <Link href="/privacy-policy" className="text-[12px] text-white/40 hover:text-white/70 transition-colors">
              الخصوصية
            </Link>
            <Link href="/terms-of-use" className="text-[12px] text-white/40 hover:text-white/70 transition-colors">
              الشروط
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
