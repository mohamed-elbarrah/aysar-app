import { DashboardSidebar } from "@/app/components/dashboard/DashboardSidebar";
import { DashboardTopbar } from "@/app/components/dashboard/DashboardTopbar";

export const metadata = {
  title: "لوحة التحكم — أيسَر",
  description: "إدارة محتوى موقع أيسَر",
};

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex min-h-screen bg-[#f5f6f9]">
      <DashboardSidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:mr-[260px]">
        <DashboardTopbar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
