"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
  badge?: { text: string; color: string };
}

interface SidebarSection {
  label: string;
  items: SidebarItem[];
}

const sidebarSections: SidebarSection[] = [
  {
    label: "الرئيسية",
    items: [
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] shrink-0"><rect x="3" y="3" width="7" height="7" rx="1" /><rect x="14" y="3" width="7" height="7" rx="1" /><rect x="3" y="14" width="7" height="7" rx="1" /><rect x="14" y="14" width="7" height="7" rx="1" /></svg>
        ),
        label: "نظرة عامة",
        active: true,
      },
    ],
  },
  {
    label: "التشغيل",
    items: [
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] shrink-0"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /></svg>
        ),
        label: "عقاراتي",
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] shrink-0"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
        ),
        label: "ملاك العقار",
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] shrink-0"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
        ),
        label: "المستثمرين",
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] shrink-0"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z" /></svg>
        ),
        label: "طلبات الصيانة",
        badge: { text: "7", color: "bg-red-500" },
      },
    ],
  },
  {
    label: "التسويق",
    items: [
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] shrink-0"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" /></svg>
        ),
        label: "الاهتمام",
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] shrink-0"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
        ),
        label: "الحجوزات",
        badge: { text: "14", color: "bg-green" },
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] shrink-0"><rect x="2" y="3" width="20" height="14" rx="2" /><line x1="8" y1="21" x2="16" y2="21" /><line x1="12" y1="17" x2="12" y2="21" /></svg>
        ),
        label: "صفحات الهبوط",
      },
    ],
  },
  {
    label: "الإعدادات",
    items: [
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] shrink-0"><circle cx="12" cy="12" r="3" /><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" /></svg>
        ),
        label: "الإعدادات",
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] shrink-0"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" /></svg>
        ),
        label: "الموظفين والصلاحيات",
      },
      {
        icon: (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[15px] h-[15px] shrink-0"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" /></svg>
        ),
        label: "الباقات والاشتراكات",
      },
    ],
  },
];

const kpiCards = [
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#08335D" strokeWidth="2" className="w-[18px] h-[18px]"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
    ),
    iconBg: "rgba(8,51,93,.08)",
    value: 8,
    label: "العقارات",
    badge: "↑ 8 هذا الشهر",
    badgeBg: "rgba(40,201,40,.1)",
    badgeColor: "#28C928",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#28C928" strokeWidth="2" className="w-[18px] h-[18px]"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
    ),
    iconBg: "rgba(40,201,40,.1)",
    value: 220,
    label: "الملاك",
    badge: "↑ 2 هذا الشهر",
    badgeBg: "rgba(40,201,40,.1)",
    badgeColor: "#28C928",
  },
  {
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="#8b5cf6" strokeWidth="2" className="w-[18px] h-[18px]"><line x1="12" y1="1" x2="12" y2="23" /><path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" /></svg>
    ),
    iconBg: "rgba(139,92,246,.1)",
    value: 5,
    label: "المستثمرين",
    badge: "↑ 1 هذا الشهر",
    badgeBg: "rgba(139,92,246,.1)",
    badgeColor: "#8b5cf6",
  },
];

const bookings = [
  { initial: "م", avatarBg: "#08335D", name: "محمد الأحمدي", phone: "0501234567", property: "شقة A-14 · برج الخزامى", status: "مؤكد", statusBg: "rgba(40,201,40,.1)", statusColor: "#28C928" },
  { initial: "س", avatarBg: "#28C928", name: "سارة العمري", phone: "0556789012", property: "فيلا B-07 · نخيل الشرق", status: "انتظار", statusBg: "rgba(245,158,11,.12)", statusColor: "#d97706" },
  { initial: "ف", avatarBg: "#8b5cf6", name: "فهد القحطاني", phone: "0543210987", property: "فيلا C-03 · واحة الأمير", status: "مراجعة", statusBg: "rgba(59,130,246,.1)", statusColor: "#2563eb" },
  { initial: "ن", avatarBg: "#ef4444", name: "نورة الشمري", phone: "0512345678", property: "شقة D-22 · برج الخزامى", status: "ملغي", statusBg: "rgba(239,68,68,.1)", statusColor: "#dc2626" },
];

const activities = [
  { dotColor: "#28C928", text: <>حجز جديد: <b>محمد الأحمدي</b> — شقة A-14</>, time: "منذ 20 دقيقة" },
  { dotColor: "#28C928", text: <>عقار جديد: <b>أبراج الفيصلية</b></>, time: "منذ ساعة" },
  { dotColor: "#ef4444", text: <>طلب صيانة عاجل: <b>شقة C-11</b> — تسرب مياه</>, time: "منذ 3 ساعات" },
  { dotColor: "#8b5cf6", text: <>مستثمر جديد: <b>نوف السعيد</b> — 2.1M ر.س</>, time: "منذ 5 ساعات" },
  { dotColor: "#f59e0b", text: <>مرحلة مكتملة: <b>برج المروج</b> — التشطيبات الداخلية</>, time: "اليوم، 8:30 ص" },
];

const maintenanceRows = [
  { property: "C-11 · برج الخزامى", issue: "تسرب مياه في السقف", priority: "طارئ", priorityBg: "rgba(239,68,68,.1)", priorityColor: "#dc2626", status: "قيد المعالجة", statusBg: "rgba(245,158,11,.12)", statusColor: "#d97706" },
  { property: "A-08 · نخيل الشرق", issue: "عطل في مكيف الهواء", priority: "طارئ", priorityBg: "rgba(239,68,68,.1)", priorityColor: "#dc2626", status: "مفتوح", statusBg: "rgba(40,201,40,.1)", statusColor: "#28C928" },
  { property: "D-15 · واحة الأمير", issue: "كسر في نافذة المطبخ", priority: "عالي", priorityBg: "rgba(245,158,11,.12)", priorityColor: "#d97706", status: "قيد المعالجة", statusBg: "rgba(245,158,11,.12)", statusColor: "#d97706" },
];

function AnimatedNumber({ value, duration = 1.5 }: { value: number; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        setCount(Math.floor(progress * value));
        if (progress < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
}

export function DashboardMockup() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const variants = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: "easeOut" as const,
        staggerChildren: 0.08,
      },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className="w-full max-w-[1200px] mx-auto"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
    >
      {/* Glow */}
      <div
        className="relative z-0 w-[80%] h-20 mx-auto -mb-10"
        style={{
          background: "radial-gradient(ellipse, rgba(45,46,131,0.5) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
      />

      {/* Browser Shell */}
      <div
        className="rounded-t-2xl overflow-hidden pointer-events-none select-none"
        style={{ boxShadow: "0 8px 40px rgba(40, 201, 40, 0.2), 0 0 80px rgba(40, 201, 40, 0.08)" }}
      >
        {/* Chrome Bar */}
        <div className="bg-navy border-b border-white/7 flex items-center gap-2.5 px-[18px] py-[11px]">
          <div className="w-[14px] h-[14px] rounded-full bg-red-500 shrink-0" />
          <div className="w-[14px] h-[14px] rounded-full bg-amber-500 shrink-0" />
          <div className="w-[14px] h-[14px] rounded-full bg-green shrink-0" />
          <div
            className="mr-auto bg-white/5 border border-white/8 rounded-md px-2.5 py-1 text-[11px] text-white/35 text-center max-w-[100px] sm:max-w-[200px] lg:max-w-[380px]"
            style={{ direction: "ltr" }}
          >
            platform.aysar.sa
          </div>
          <div className="w-[30px] h-[30px] rounded-lg bg-white/6 flex items-center justify-center">
            <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.4)" strokeWidth="2" className="w-[15px] h-[15px]"><polyline points="23 4 23 10 17 10" /><path d="M20.49 15a9 9 0 11-2.12-9.36L23 10" /></svg>
          </div>
        </div>

        {/* Dashboard Body */}
        <div className="flex bg-[#f5f6fa]" style={{ direction: "rtl" }}>

          {/* ═══ SIDEBAR ═══ */}
          <div className="w-[220px] min-w-[220px] bg-navy flex-col shrink-0 hidden lg:flex">
            <div className="h-14 flex items-center justify-center border-b border-white/7 px-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="https://i.postimg.cc/8cgyGQ5R/newaysar.png"
                alt="أيسر"
                className="h-20 w-auto max-w-[140px] object-contain -my-3.5"
              />
            </div>
            <div className="flex-1 py-2.5">
              {sidebarSections.map((section, sIdx) => (
                <div key={sIdx}>
                  <div className="text-[9px] font-bold text-white/30 uppercase tracking-wide px-[18px] py-2.5">
                    {section.label}
                  </div>
                  {section.items.map((item, iIdx) => (
                    <motion.div
                      key={iIdx}
                      className={`flex items-center gap-[9px] mx-2 px-3 py-2 rounded-lg text-[12.5px] ${
                        item.active
                          ? "bg-green/18 text-green font-semibold"
                          : "text-white/50 hover:bg-white/[0.06] hover:text-white/85"
                      }`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                      transition={{ delay: 0.4 + (sIdx * section.items.length + iIdx) * 0.04, duration: 0.3 }}
                    >
                      {item.icon}
                      {item.label}
                      {item.badge && (
                        <span className={`mr-auto ${item.badge.color} text-white text-[9px] font-bold px-[6px] py-[1px] rounded-full`}>
                          {item.badge.text}
                        </span>
                      )}
                    </motion.div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* ═══ MAIN CONTENT ═══ */}
          <div className="flex-1 min-w-0 overflow-hidden">

            {/* Topbar */}
            <motion.div
              className="h-14 bg-white border-b border-[#e8ebf3] flex items-center gap-3 px-3 sm:px-4 lg:px-5 shrink-0"
              initial={{ opacity: 0, y: -18 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: -18 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <div className="w-8 h-8 rounded-lg bg-[#f5f6fa] border border-[#e8ebf3] flex items-center justify-center shrink-0 lg:hidden">
                <svg viewBox="0 0 24 24" fill="none" stroke="#7C8794" strokeWidth="2" className="w-[15px] h-[15px]"><line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" /></svg>
              </div>
              <div className="text-sm font-bold text-navy hidden sm:block shrink-0">نظرة عامة</div>
              <div className="flex items-center gap-2 bg-[#f5f6fa] border border-[#e8ebf3] rounded-lg px-3 py-1.5 text-xs text-muted min-w-0 flex-1 sm:min-w-[200px]">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-[13px] h-[13px] opacity-50 shrink-0"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
                <span className="truncate">ابحث عن أي شيء...</span>
              </div>
              <div className="w-8 h-8 rounded-lg bg-[#f5f6fa] border border-[#e8ebf3] flex items-center justify-center shrink-0 relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="#7C8794" strokeWidth="2" className="w-[15px] h-[15px]"><path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" /><path d="M13.73 21a2 2 0 01-3.46 0" /></svg>
                <div className="absolute top-[6px] right-[6px] w-[7px] h-[7px] bg-red-500 rounded-full border-2 border-white" />
              </div>
              <div className="w-[34px] h-[34px] rounded-full bg-navy text-white text-[13px] font-bold flex items-center justify-center shrink-0">م</div>
            </motion.div>

            {/* Content */}
            <div className="p-3 sm:p-4 lg:p-5 overflow-hidden">

              {/* Page Header */}
              <motion.div
                className="flex items-center justify-between flex-wrap gap-2 mb-[18px]"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 0.35, duration: 0.5 }}
              >
                <div className="text-[17px] font-bold text-navy">نظرة عامة</div>
                <div className="text-xs text-muted">الأحد، 25 مايو 2026</div>
              </motion.div>

              {/* ═══ KPI GRID — 3 columns on ALL breakpoints ═══ */}
              <motion.div
                className="grid grid-cols-3 gap-2 sm:gap-3 mb-[18px]"
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={{
                  hidden: { opacity: 1 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.13 } },
                }}
              >
                {kpiCards.map((card, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white rounded-xl border border-[#e8ebf3] p-3 sm:p-4 lg:p-5 text-center"
                    variants={{
                      hidden: { opacity: 0, y: 24, scale: 0.97 },
                      visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.5, ease: "easeOut" } },
                    }}
                    whileHover={{ y: -3, boxShadow: "0 18px 45px rgba(0,0,0,.08)", transition: { duration: 0.28 } }}
                  >
                    <div
                      className="w-[38px] h-[38px] rounded-xl flex items-center justify-center mx-auto mb-3"
                      style={{ background: card.iconBg }}
                    >
                      {card.icon}
                    </div>
                    <div className="text-xl sm:text-2xl font-bold text-navy leading-none mb-1">
                      <AnimatedNumber value={card.value} duration={1.2 + idx * 0.1} />
                    </div>
                    <div className="text-xs text-muted mb-2">{card.label}</div>
                    <span
                      className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: card.badgeBg, color: card.badgeColor }}
                    >
                      {card.badge}
                    </span>
                  </motion.div>
                ))}
              </motion.div>

              {/* ═══ TWO COLUMNS ═══ */}
              <div className="grid grid-cols-1 lg:grid-cols-[1.55fr_1fr] gap-3 sm:gap-3.5 mb-[18px]">

                {/* Bookings */}
                <motion.div
                  className="bg-white rounded-xl border border-[#e8ebf3] overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 0.85, duration: 0.5 }}
                >
                  <div className="px-4 py-3 border-b border-[#e8ebf3] flex items-center justify-between">
                    <span className="text-[13px] font-bold text-navy">آخر الحجوزات</span>
                    <span className="text-[11px] font-semibold text-green">عرض الكل</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="bg-[#f5f6fa]">
                          <th className="text-[10px] font-bold text-muted px-3.5 py-[7px] text-right border-b border-[#e8ebf3] whitespace-nowrap">العميل</th>
                          <th className="text-[10px] font-bold text-muted px-3.5 py-[7px] text-right border-b border-[#e8ebf3] whitespace-nowrap">العقار</th>
                          <th className="text-[10px] font-bold text-muted px-3.5 py-[7px] text-right border-b border-[#e8ebf3] whitespace-nowrap">الحالة</th>
                        </tr>
                      </thead>
                      <tbody>
                        {bookings.map((row, idx) => (
                          <tr key={idx} className="transition-colors hover:bg-[#fafbfc]">
                            <td className="px-3.5 py-[9px] border-b border-[rgba(232,235,243,.6)]">
                              <div className="flex items-center gap-2">
                                <div
                                  className="w-7 h-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center shrink-0"
                                  style={{ background: row.avatarBg }}
                                >
                                  {row.initial}
                                </div>
                                <div className="min-w-0">
                                  <div className="text-xs font-semibold text-navy truncate">{row.name}</div>
                                  <div className="text-[10px] text-muted">{row.phone}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-3.5 py-[9px] text-xs text-navy border-b border-[rgba(232,235,243,.6)] whitespace-nowrap">{row.property}</td>
                            <td className="px-3.5 py-[9px] border-b border-[rgba(232,235,243,.6)]">
                              <span
                                className="text-[10px] font-bold px-2 py-[2px] rounded-full whitespace-nowrap"
                                style={{ background: row.statusBg, color: row.statusColor }}
                              >
                                {row.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>

                {/* Activities */}
                <motion.div
                  className="bg-white rounded-xl border border-[#e8ebf3] overflow-hidden"
                  initial={{ opacity: 0, y: 30 }}
                  animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <div className="px-4 py-3 border-b border-[#e8ebf3]">
                    <span className="text-[13px] font-bold text-navy">آخر الأنشطة</span>
                  </div>
                  <div className="p-4 space-y-3.5">
                    {activities.map((act, idx) => (
                      <motion.div
                        key={idx}
                        className="flex gap-2.5 items-start"
                        initial={{ opacity: 0, x: 18 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 18 }}
                        transition={{ delay: 1.15 + idx * 0.07, duration: 0.35 }}
                      >
                        <div className="w-2 h-2 rounded-full mt-1 shrink-0" style={{ background: act.dotColor }} />
                        <div className="min-w-0">
                          <div className="text-xs text-navy leading-relaxed">{act.text}</div>
                          <div className="text-[10px] text-muted mt-0.5">{act.time}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* ═══ MAINTENANCE TABLE ═══ */}
              <motion.div
                className="bg-white rounded-xl border border-[#e8ebf3] overflow-hidden"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="px-4 py-3 border-b border-[#e8ebf3] flex items-center justify-between">
                  <span className="text-[13px] font-bold text-navy">آخر طلبات الصيانة</span>
                  <span className="text-[11px] font-semibold text-green">عرض الكل</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-[#f5f6fa]">
                        <th className="text-[10px] font-bold text-muted px-3.5 py-[7px] text-right border-b border-[#e8ebf3] whitespace-nowrap">العقار</th>
                        <th className="text-[10px] font-bold text-muted px-3.5 py-[7px] text-right border-b border-[#e8ebf3] whitespace-nowrap">المشكلة</th>
                        <th className="text-[10px] font-bold text-muted px-3.5 py-[7px] text-right border-b border-[#e8ebf3] whitespace-nowrap">الأولوية</th>
                        <th className="text-[10px] font-bold text-muted px-3.5 py-[7px] text-right border-b border-[#e8ebf3] whitespace-nowrap">الحالة</th>
                      </tr>
                    </thead>
                    <tbody>
                      {maintenanceRows.map((row, idx) => (
                        <tr key={idx} className="transition-colors hover:bg-[#fafbfc]">
                          <td className="px-3.5 py-[9px] border-b border-[rgba(232,235,243,.6)] text-xs font-semibold text-navy whitespace-nowrap">{row.property}</td>
                          <td className="px-3.5 py-[9px] border-b border-[rgba(232,235,243,.6)] text-xs text-muted">{row.issue}</td>
                          <td className="px-3.5 py-[9px] border-b border-[rgba(232,235,243,.6)]">
                            <span
                              className="text-[10px] font-bold px-2 py-[2px] rounded-full whitespace-nowrap"
                              style={{ background: row.priorityBg, color: row.priorityColor }}
                            >
                              {row.priority}
                            </span>
                          </td>
                          <td className="px-3.5 py-[9px] border-b border-[rgba(232,235,243,.6)]">
                            <span
                              className="text-[10px] font-bold px-2 py-[2px] rounded-full whitespace-nowrap"
                              style={{ background: row.statusBg, color: row.statusColor }}
                            >
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </motion.div>

            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
