"use client";

import { useState } from "react";
import { DashboardSidebar } from "@/app/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/app/components/dashboard/DashboardTopbar";
import { DashboardProvider } from "@/app/components/dashboard/DashboardContext";
import { GlobalSaveBar } from "@/app/components/dashboard/GlobalSaveBar";
import { AuthGuard } from "./components/AuthGuard";

function DashboardChrome({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#f5f6f9]">
      <DashboardSidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />
      <div className="flex-1 flex flex-col min-w-0 lg:mr-[260px]">
        <DashboardTopbar setMobileOpen={setMobileOpen} />
        <main className="flex-1 p-6 pb-24">{children}</main>
        <GlobalSaveBar />
      </div>
    </div>
  );
}

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <AuthGuard>
      <DashboardProvider>
        <DashboardChrome>{children}</DashboardChrome>
      </DashboardProvider>
    </AuthGuard>
  );
}
