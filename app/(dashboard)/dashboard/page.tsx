"use client";

import { useState, useEffect } from "react";
import { StatCard } from "@/app/components/dashboard/StatCard";
import { LayoutGrid, MessageCircle, Layers, CreditCard } from "lucide-react";

export default function DashboardPage() {
  const [unreadCount, setUnreadCount] = useState<number | null>(null);

  useEffect(() => {
    async function loadCount() {
      try {
        const res = await fetch("/api/contact-messages", { credentials: "include" });
        const json = await res.json();
        if (json.success && typeof json.unreadCount === "number") {
          setUnreadCount(json.unreadCount);
        }
      } catch {
        /* ignore */
      }
    }
    loadCount();
  }, []);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="إجمالي الصفحات" value={6} icon={LayoutGrid} color="#0c2954" />
        <StatCard label="رسائل جديدة" value={unreadCount ?? "..."} icon={MessageCircle} color="#1a9a5a" />
        <StatCard label="أقسام المحتوى" value={24} icon={Layers} color="#f97316" />
        <StatCard label="الباقات النشطة" value={3} icon={CreditCard} color="#5ddfb8" />
      </div>

      <h2 className="text-lg font-bold text-[#0c2954] mb-4">وصول سريع</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <QuickAccessCard title="الصفحة الرئيسية" href="/dashboard/home-page" description="تعديل البانر والمميزات" />
        <QuickAccessCard title="الخطط والأسعار" href="/dashboard/plans-page" description="تعديل الباقات والأسئلة" />
        <QuickAccessCard title="رسائل التواصل" href="/dashboard/messages" description={unreadCount !== null ? `${unreadCount} رسالة جديدة` : "لا توجد رسائل جديدة"} />
        <QuickAccessCard title="الإعدادات العامة" href="/dashboard/settings" description="تعديل الموقع والروابط" />
      </div>

      <div className="bg-[#f8f9fc] rounded-xl border border-[#e8edf5] p-6">
        <h2 className="text-lg font-bold text-[#0c2954] mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#1a9a5a]"></span>
          إرشادات إدارة المحتوى
        </h2>
        <ul className="space-y-3 text-sm text-[#6b7a94]">
          <li className="flex items-start gap-2">
            <span className="text-[#1a9a5a] font-bold mt-0.5">1.</span>
            <span>أضغط على زر &ldquo;حفظ التغييرات&rdquo; الموجود في الزاوية السفلية بعد إتمام أي تعديل</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#1a9a5a] font-bold mt-0.5">2.</span>
            <span>الصفحة الرئيسية تحتوي على: البانر، المميزات، شبكة Bento، نظرة على المشروع، قسم التطبيق، ودعوة العمل</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#1a9a5a] font-bold mt-0.5">3.</span>
            <span>الخطط والأسعار: تعديل الباقات، جدول المقارنة، والأسئلة الشائعة</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#1a9a5a] font-bold mt-0.5">4.</span>
            <span>صفحة التواصل: تعديل معلومات التواصل، القنوات، ونموذج الاتصال</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#1a9a5a] font-bold mt-0.5">5.</span>
            <span>الصفحات القانونية: تعديل سياسة الخصوصية، شروط الاستخدام، وسياسة الإرجاع</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#1a9a5a] font-bold mt-0.5">6.</span>
            <span>الإعدادات العامة: تعديل معلومات الموقع، شريط التنقل، التذييل، وروابط التواصل الاجتماعي</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-[#1a9a5a] font-bold mt-0.5">7.</span>
            <span>جميع التغييرات تظهر فوراً على الموقع بعد الحفظ</span>
          </li>
        </ul>
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
