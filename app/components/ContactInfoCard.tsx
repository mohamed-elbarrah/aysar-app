"use client";

import { CONTACT_INFO } from "@/lib/contact-data";

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.63A2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="#4f46e5" strokeWidth="2" strokeLinejoin="round" />
      <path d="M22 6l-10 7L2 6" stroke="#4f46e5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0118 0z" stroke="#ef4444" strokeWidth="2" strokeLinejoin="round" />
      <circle cx="12" cy="10" r="3" stroke="#ef4444" strokeWidth="2" />
    </svg>
  );
}

function HoursIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#f97316" strokeWidth="2" />
      <path d="M12 6v6l4 2" stroke="#f97316" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const infoItems = [
  {
    icon: <PhoneIcon />,
    iconBg: "#eef5ff",
    label: "الهاتف",
    value: CONTACT_INFO.phone,
    href: `tel:${CONTACT_INFO.phone}`,
  },
  {
    icon: <EmailIcon />,
    iconBg: "#f0f4ff",
    label: "البريد الإلكتروني",
    value: CONTACT_INFO.email,
    href: `mailto:${CONTACT_INFO.email}`,
  },
  {
    icon: <LocationIcon />,
    iconBg: "#feeeee",
    label: "الموقع",
    value: CONTACT_INFO.location,
  },
  {
    icon: <HoursIcon />,
    iconBg: "#fff7ed",
    label: "ساعات العمل",
    value: CONTACT_INFO.hoursDays,
    sub: CONTACT_INFO.hoursTime,
  },
];

export function ContactInfoCard() {
  return (
    <div className="contact-info-card anim-fade-in-up">
      <div className="text-[20px] font-bold text-navy mb-2">معلومات التواصل</div>
      <div className="text-[14px] text-muted leading-[1.75] mb-8">
        يمكنك التواصل معنا عبر أي من القنوات التالية وسيتم الرد عليك خلال 24 ساعة.
      </div>

      <div className="info-items">
        {infoItems.map((item, i) => (
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
              {item.sub && <div className="info-value-sub">{item.sub}</div>}
            </div>
          </div>
        ))}
      </div>

      <div className="text-[12px] font-bold text-muted tracking-wide uppercase mb-3">تابعنا على</div>
      <div className="social-row">
        <a href="http://wa.me/966125101107" className="soc-btn-contact whatsapp" target="_blank" rel="noopener noreferrer">
          <img src="https://cdn.prod.website-files.com/686ecfb1fbbb502328ba5eed/6909ff4f4cfaf893fa5531ba_whatsapp-white-icon.png" alt="واتساب" className="!filter-none" />
        </a>
        <a href="https://x.com/aysar_ksa" className="soc-btn-contact" target="_blank" rel="noopener noreferrer">
          <img src="https://cdn.prod.website-files.com/686ecfb1fbbb502328ba5eed/686f58163d6350e998381015_X.svg" alt="X" />
        </a>
        <a href="https://www.instagram.com/aysar_ksa/" className="soc-btn-contact" target="_blank" rel="noopener noreferrer">
          <img src="https://cdn.prod.website-files.com/686ecfb1fbbb502328ba5eed/686f581646ec4c97bf1eecb4_Insta.svg" alt="Instagram" />
        </a>
        <a href="https://www.tiktok.com/@aysar_sa" className="soc-btn-contact tiktok" target="_blank" rel="noopener noreferrer">
          <img src="https://cdn.prod.website-files.com/686ecfb1fbbb502328ba5eed/68e0d5460bf150d8b7f651f6_tiktok-white-icon.webp" alt="TikTok" className="!filter-none" />
        </a>
      </div>
    </div>
  );
}
