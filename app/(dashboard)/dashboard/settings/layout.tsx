"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TABS = [
  { href: "/dashboard/settings/metadata", label: "معلومات الموقع" },
  { href: "/dashboard/settings/navbar", label: "شريط التنقل" },
  { href: "/dashboard/settings/footer", label: "تذييل الموقع" },
  { href: "/dashboard/settings/social", label: "وسائل التواصل" },
  { href: "/dashboard/settings/apps", label: "روابط التطبيق" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="space-y-6 pb-24">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-[#0c2954] mb-1">الإعدادات العامة</h1>
          <p className="text-sm text-[#6b7a94]">تعديل إعدادات الموقع، التنقل، الفوتر، ووسائل التواصل</p>
        </div>
      </div>

      <div className="flex gap-2 flex-wrap">
        {TABS.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              pathname === tab.href
                ? "bg-[#0c2954] text-white"
                : "bg-white border border-[#e8edf5] text-[#6b7a94] hover:bg-[#f5f6f9]"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      {children}
    </div>
  );
}