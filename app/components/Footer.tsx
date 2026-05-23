"use client";

import Link from "next/link";
import Image from "next/image";
import type { SocialLink, FooterColumn, ContactInfo } from "@/app/lib/settings-data";
import { resolveSocialIcon } from "@/app/components/ui/SocialIconRegistry";
import { WhatsAppIcon } from "@/app/components/icons/WhatsAppIcon";

interface FooterProps {
  columns: FooterColumn[];
  socialLinks: SocialLink[];
  contactInfo: ContactInfo;
}

export default function Footer({ columns, socialLinks, contactInfo }: FooterProps) {
  return (
    <footer className="bg-[#0c2954] pt-14 pb-0">
      <div className="container-aysar">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 pb-10 border-b border-white/[0.08]">
          {columns.map((col, idx) => {
            if (col.type === "brand") {
              return (
                <div key={idx}>
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

            return (
              <div key={idx}>
                <h4 className="text-[11px] font-bold text-white/35 tracking-wide uppercase mb-4">{col.title}</h4>
                {col.links && col.links.length > 0 && (
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
                )}
              </div>
            );
          })}
        </div>

        <div className="py-5 flex items-center justify-between flex-wrap gap-4">
          <span className="text-[12px] text-white/28">
            {columns.find((c) => c.type === "brand")?.copyright || ""}
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