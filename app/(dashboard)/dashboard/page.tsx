import { StatCard } from "@/app/components/dashboard/StatCard";
import { LayoutGrid, MessageCircle, Layers, Clock, CreditCard, Home, Settings } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard label="إجمالي الصفحات" value={6} icon={LayoutGrid} color="#0c2954" />
        <StatCard label="رسائل جديدة" value={3} icon={MessageCircle} color="#1a9a5a" />
        <StatCard label="أقسام المحتوى" value={24} icon={Layers} color="#f97316" />
        <StatCard label="آخر تحديث" value="20/05/2026" icon={Clock} color="#2d2e83" />
        <StatCard label="الباقات النشطة" value={3} icon={CreditCard} color="#5ddfb8" />
      </div>

      <h2 className="text-lg font-bold text-[#0c2954] mb-4">وصول سريع</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAccessCard title="الصفحة الرئيسية" href="/dashboard/home-page" description="تعديل البانر والمميزات" />
        <QuickAccessCard title="الخطط والأسعار" href="/dashboard/plans-page" description="تعديل الباقات والأسئلة" />
        <QuickAccessCard title="رسائل التواصل" href="/dashboard/messages" description="3 رسائل جديدة" />
        <QuickAccessCard title="الإعدادات العامة" href="/dashboard/settings" description="تعديل الموقع والروابط" />
      </div>
    </div>
  );
}

function QuickAccessCard({ title, href, description }: { title: string; href: string; description: string }) {
  return (
    <a
      href={href}
      className="bg-white rounded-xl border border-[#e8edf5] p-5 hover:shadow-md transition-shadow duration-200 block"
    >
      <h3 className="font-bold text-[#0c2954] mb-1">{title}</h3>
      <p className="text-sm text-[#6b7a94]">{description}</p>
    </a>
  );
}
