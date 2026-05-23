"use client";

import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { ContactInfo, SocialLink, WorkHours } from "@/app/lib/settings-data";
import { resolveSocialIcon, CONTACT_ICONS } from "@/app/components/ui/SocialIconRegistry";

export interface ContactInfoCardProps {
  contactInfo: ContactInfo;
  socialLinks: SocialLink[];
  workHours?: WorkHours;
}

const WHATSAPP_ICON = CONTACT_ICONS.whatsapp;

function InfoItems({ contactInfo, workHours }: { contactInfo: ContactInfo; workHours?: WorkHours }) {
  return [
    {
      icon: <Phone className="w-5 h-5" style={{ color: "#3b82f6" }} />,
      iconBg: "#eef5ff",
      label: "الهاتف",
      value: contactInfo.phone,
      href: `tel:${contactInfo.phone}`,
    },
    {
      icon: <Mail className="w-5 h-5" style={{ color: "#4f46e5" }} />,
      iconBg: "#f0f4ff",
      label: "البريد الإلكتروني",
      value: contactInfo.email,
      href: `mailto:${contactInfo.email}`,
    },
    {
      icon: <MapPin className="w-5 h-5" style={{ color: "#ef4444" }} />,
      iconBg: "#feeeee",
      label: "الموقع",
      value: contactInfo.location,
    },
    ...(workHours
      ? [
          {
            icon: <Clock className="w-5 h-5" style={{ color: "#f97316" }} />,
            iconBg: "#fff7ed",
            label: "ساعات العمل",
            value: workHours.days,
            sub: workHours.time,
          },
        ]
      : []),
  ];
}

export function ContactInfoCard({ contactInfo, socialLinks, workHours }: ContactInfoCardProps) {
  const items = InfoItems({ contactInfo, workHours });

  return (
    <div className="contact-info-card anim-fade-in-up">
      <div className="text-[20px] font-bold text-navy mb-2">معلومات التواصل</div>
      <div className="text-[14px] text-muted leading-[1.75] mb-8">
        يمكنك التواصل معنا عبر أي من القنوات التالية وسيتم الرد عليك خلال 24 ساعة.
      </div>

      <div className="info-items">
        {items.map((item, i) => (
          <div key={i} className="info-item">
            <div className="info-icon-box" style={{ background: item.iconBg }}>
              {item.icon}
            </div>
            <div>
              <div className="info-label">{item.label}</div>
              {item.href ? (
                <a href={item.href} className="info-value">
                  {item.value}
                </a>
              ) : (
                <div className="info-value">{item.value}</div>
              )}
              {"sub" in item && item.sub && <div className="info-value-sub">{item.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="text-[12px] font-bold text-muted tracking-wide uppercase mb-3">تابعنا على</div>
      <div className="social-row">
        <a
          href={`https://wa.me/${contactInfo.whatsappNumber}`}
          className="soc-btn-contact whatsapp"
          target="_blank"
          rel="noopener noreferrer"
        >
          <WHATSAPP_ICON className="w-5 h-5" />
        </a>
        {socialLinks.map((link) => {
          const Icon = resolveSocialIcon(link.key, link.iconUrl);
          return (
            <a
              key={link.key}
              href={link.url}
              className="soc-btn-contact"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={link.label}
            >
              <Icon className="w-5 h-5" />
            </a>
          );
        })}
      </div>
    </div>
  );
}