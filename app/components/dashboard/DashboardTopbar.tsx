"use client";

import { usePathname } from "next/navigation";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import { Menu } from "lucide-react";
import { DashboardButton } from "./DashboardButton";

const pageTitles: Record<string, string> = {
  "/dashboard": "لوحة التحكم",
  "/dashboard/home-page": "الصفحة الرئيسية",
  "/dashboard/plans-page": "صفحة الخطط والأسعار",
  "/dashboard/contact-page": "صفحة التواصل",
  "/dashboard/policies": "الصفحات القانونية",
  "/dashboard/messages": "رسائل التواصل",
  "/dashboard/settings": "الإعدادات العامة",
  "/dashboard/profile": "الملف الشخصي",
};

export function DashboardTopbar({
  setMobileOpen,
}: {
  setMobileOpen: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const title = pageTitles[pathname] || "لوحة التحكم";
  const today = format(new Date(), "dd/MM/yyyy", { locale: ar });

  return (
    <header className="bg-white border-b border-[#e8edf5] px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <DashboardButton
          variant="ghost"
          size="icon-sm"
          className="lg:hidden"
          onClick={() => setMobileOpen(true)}
        >
          <Menu className="w-5 h-5" />
        </DashboardButton>
        <h1 className="text-2xl font-bold text-[#0c2954]">{title}</h1>
      </div>
      <div className="text-[#6b7a94] text-sm bg-[#f5f6f9] px-3 py-1.5 rounded-lg">
        {today}
      </div>
    </header>
  );
}
