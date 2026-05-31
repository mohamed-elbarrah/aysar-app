"use client";

import Link from "next/link";
import Image from "next/image";

import type { SocialLink, FooterColumn, ContactInfo, AppLinkInfo } from "@/app/lib/settings-data";
import { resolveSocialIcon } from "@/app/components/ui/SocialIconRegistry";
import { WhatsAppIcon } from "@/app/components/icons/WhatsAppIcon";

interface FooterProps {
  columns: FooterColumn[];
  socialLinks: SocialLink[];
  contactInfo: ContactInfo;
  appLinks: AppLinkInfo;
}

export default function Footer({ columns, socialLinks, contactInfo, appLinks, logoUrl }: FooterProps & { logoUrl?: string }) {
  return (
    <footer className="bg-[#08335D] pt-14 pb-0">
      <div className="container-aysar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-10 border-b border-white/[0.08]">
          {columns.map((col, idx) => {
            if (col.type === "brand") {
              return (
                <div key={idx}>
                  <Link href="/" className="inline-block mb-4">
                    <Image
                      src={logoUrl || "/logo.png"}
                      alt="أيسَر"
                      width={110}
                      height={44}
                      className="h-12 w-auto object-contain"
                      style={{ width: 'auto' }}
                      priority
                    />
                  </Link>
                  {col.tagline && (
                    <p className="text-[14px] text-white/45 leading-relaxed max-w-[260px] mb-5">
                      {col.tagline}
                    </p>
                  )}
                  <div className="flex items-center gap-2">
                    {socialLinks.map((social) => {
                      const IconComp = resolveSocialIcon(social.key, social.iconUrl);
                      return (
                        <a
                          key={social.key}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={social.label}
                          className="w-[34px] h-[34px] rounded-lg bg-white/[0.07] border border-white/[0.1] flex items-center justify-center transition-colors hover:bg-white/[0.14]"
                        >
                          <IconComp className="w-4 h-4 text-white" />
                        </a>
                      );
                    })}
                    <a
                      href={`https://wa.me/${contactInfo.whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label="واتساب"
                      className="w-[34px] h-[34px] rounded-lg bg-white/[0.07] border border-white/[0.1] flex items-center justify-center transition-colors hover:bg-white/[0.14]"
                    >
                      <WhatsAppIcon className="w-4 h-4 text-white" />
                    </a>
                  </div>
                </div>
              );
            }

            const isAppColumn = col.title === "التطبيق";

            return (
              <div key={idx}>
                <h4 className="text-[16px] font-bold text-white/50 tracking-wide uppercase mb-4">{col.title}</h4>
                {isAppColumn ? (
                  <div className="flex flex-col gap-3 w-fit">
                    <a
                      href={appLinks.appStoreUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 bg-white hover:bg-[#F4F7FA] transition-colors duration-150 rounded-xl px-4 py-2.5 border border-[#e8ebf3] shadow-sm"
                    >
                      <Image
                        src="/apple-logo-svgrepo.svg"
                        alt="App Store"
                        width={20}
                        height={20}
                        className="w-5 h-5 flex-shrink-0"
                        unoptimized
                      />
                      <div>
                        <div className="text-[10px] text-navy leading-none">
                          Download on the
                        </div>
                        <div className="text-[13px] font-bold text-navy leading-tight">
                          App Store
                        </div>
                      </div>
                    </a>

                    <a
                      href={appLinks.googlePlayUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2.5 bg-white hover:bg-[#F4F7FA] transition-colors duration-150 rounded-xl px-4 py-2.5 border border-[#e8ebf3] shadow-sm"
                    >
                      <Image
                        src="/google-play.svg"
                        alt="Google Play"
                        width={20}
                        height={20}
                        className="w-5 h-5 flex-shrink-0"
                        unoptimized
                      />
                      <div>
                        <div className="text-[10px] text-navy leading-none">
                          GET IT ON
                        </div>
                        <div className="text-[13px] font-bold text-navy leading-tight">
                          Google Play
                        </div>
                      </div>
                    </a>
                  </div>
                ) : (
                  col.links && col.links.length > 0 && (
                    <ul className="flex flex-col gap-2.5">
                      {col.links.map((link, linkIdx) => (
                        <li key={linkIdx}>
                          {link.external ? (
                            <a href={link.href} target="_blank" rel="noopener noreferrer" className="text-[14px] text-white/55 hover:text-white transition-colors">
                              {link.label}
                            </a>
                          ) : (
                            <Link href={link.href} className="text-[14px] text-white/55 hover:text-white transition-colors">
                              {link.label}
                            </Link>
                          )}
                        </li>
                      ))}
                    </ul>
                  )
                )}
              </div>
            );
          })}
        </div>

        <div className="py-5 flex items-center justify-center">
          <span className="text-[12px] text-white/28">
            {columns.find((c) => c.type === "brand")?.copyright || ""}
          </span>
        </div>
      </div>
    </footer>
  );
}