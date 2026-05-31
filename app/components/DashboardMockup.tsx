"use client";

import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  LayoutDashboard,
  Building2,
  Users,
  Target,
  Wrench,
  UsersRound,
  Globe,
  CalendarDays,
  Settings,
  Package,
  Bell,
  ChevronDown,
  Home,
  FolderOpen,
  Lock,
  Calendar,
  Eye,
  Heart,
  Cog,
} from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "نظرة عامة", active: true },
  { icon: Building2, label: "عقاراتي" },
  { icon: Users, label: "ملاك العقار" },
  { icon: Target, label: "المستثمرين" },
  { icon: Wrench, label: "طلبات الصيانة" },
  { icon: UsersRound, label: "الموظفين و الصلاحيات" },
  { icon: Globe, label: "صفحات الهبوط" },
  { icon: CalendarDays, label: "الحجوزات" },
  { icon: Settings, label: "الاعدادات" },
  { icon: Package, label: "الباقات والاشتراكات" },
];

const statCards = [
  { icon: Home, color: "#3b82f6", bg: "#eef5ff", value: 7, label: "العقارات" },
  { icon: Users, color: "#16a34a", bg: "#e9f9f0", value: 57, label: "الملاك" },
  {
    icon: Target,
    color: "#8b5cf6",
    bg: "#f3eefe",
    value: 1,
    label: "المستثمرين",
  },
  {
    icon: FolderOpen,
    color: "#f59e0b",
    bg: "#fff8e8",
    value: 3,
    label: "الطلبات المفتوحة",
  },
  {
    icon: Cog,
    color: "#06b6d4",
    bg: "#e7fafd",
    value: 3,
    label: "قيد التنفيذ",
  },
  {
    icon: Lock,
    color: "#ef4444",
    bg: "#feeeee",
    value: 30,
    label: "البلاغات المغلقة",
  },
  {
    icon: Calendar,
    color: "#ea580c",
    bg: "#fff4e6",
    value: 7,
    label: "الحجوزات",
  },
  {
    icon: Eye,
    color: "#6366f1",
    bg: "#eef2ff",
    value: 33,
    label: "مشاهدات المراحل",
  },
  {
    icon: Heart,
    color: "#ec4899",
    bg: "#fdf2f8",
    value: 6,
    label: "تفاعلات المراحل",
  },
];

const ratingBreakdown = [
  { stars: 5, percentage: 68.8, count: 11 },
  { stars: 4, percentage: 0, count: 0 },
  { stars: 3, percentage: 6.3, count: 1 },
  { stars: 2, percentage: 6.3, count: 1 },
  { stars: 1, percentage: 18.8, count: 3 },
];

// Animated number component
function AnimatedNumber({
  value,
  duration = 1.5,
}: {
  value: number;
  duration?: number;
}) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min(
          (timestamp - startTime) / (duration * 1000),
          1,
        );
        setCount(Math.floor(progress * value));
        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }
  }, [isInView, value, duration]);

  return <span ref={ref}>{count}</span>;
}

// Animated progress bar
function AnimatedProgressBar({
  percentage,
  delay = 0,
}: {
  percentage: number;
  delay?: number;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div
      ref={ref}
      className="flex-1 h-[4px] sm:h-[5px] lg:h-[7px] bg-[#f3f4f6] rounded-full overflow-hidden"
    >
      <motion.div
        className="h-full bg-amber-400 rounded-full"
        initial={{ width: 0 }}
        animate={isInView ? { width: `${percentage}%` } : { width: 0 }}
        transition={{ duration: 0.8, delay: delay * 0.1, ease: "easeOut" }}
      />
    </div>
  );
}

export function DashboardMockup({ logoUrl }: { logoUrl?: string }) {
  const containerRef = useRef(null);
  const isInView = useInView(containerRef, { once: true, margin: "-100px" });

  const containerVariants = {
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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeOut" as const,
      },
    },
  };

  const cardHoverVariants = {
    rest: {
      y: 0,
      boxShadow: "0 4px 12px rgba(0,0,0,0.04)",
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
    hover: {
      y: -4,
      boxShadow: "0 12px 28px rgba(0,0,0,0.08)",
      transition: { duration: 0.3, ease: "easeOut" as const },
    },
  };

  return (
    <motion.div
      ref={containerRef}
      className="relative z-10 w-full lg:max-w-[1200px] lg:mx-auto"
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute -top-10 left-1/2 -translate-x-1/2 w-[80%] h-20 -z-10"
        style={{
          background:
            "radial-gradient(ellipse, rgba(45,46,131,0.5) 0%, transparent 70%)",
          filter: "blur(20px)",
        }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 0.8, delay: 0.3 }}
      />

      {/* Browser window */}
      <motion.div
        className="bg-[#0b1830] border border-white/10 rounded-t-2xl overflow-hidden"
        style={{
          boxShadow:
            "0 0 0 1px rgba(255,255,255,0.05), 0 40px 80px rgba(0,0,0,0.6)",
        }}
        variants={itemVariants}
      >
        {/* Topbar */}
        <motion.div
          className="bg-white border-b border-[#e8ecf0] h-[46px] flex items-center justify-between px-4"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="flex items-center gap-2.5">
            <div className="relative w-16 h-16">
              <Image
                src="https://platform.aysar.sa/file/_image1766570179658205617.webp"
                alt="أيسر"
                fill
                className="object-contain"
              />
            </div>
            <div className="w-px h-5 bg-[#e8ecf0]" />
            <div>
              <div className="text-[11px] font-bold text-[#1a202c]">
                نظرة عامة
              </div>
              <div className="text-[10px] text-[#718096]">نظرة عامة</div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Bell className="w-[18px] h-[18px] text-[#7e8299]" />
            <div className="relative w-6 h-6 rounded-full overflow-hidden">
               <Image src={logoUrl || "/logo.png"} alt="User" fill className="object-cover" />
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer">
              <span className="text-xs font-semibold text-[#1a202c]">أيسر</span>
              <ChevronDown className="w-2 h-2 text-[#484e56]" />
            </div>
          </div>
        </motion.div>

        {/* Body: Sidebar + Main */}
        <div className="flex min-h-[350px] sm:min-h-[400px] lg:min-h-[500px]">
          {/* Sidebar - hidden on mobile/sm, visible on lg */}
          <AnimatePresence>
            <motion.div
              className="w-[175px] min-h-full bg-[#1a2540] py-2.5 flex-col hidden lg:flex flex-shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              {menuItems.map((item, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  className={`flex items-center gap-2 px-3.5 py-2 text-xs transition-colors ${
                    item.active
                      ? "bg-[#2d5be3] text-white mx-2 rounded-lg px-2.5"
                      : "text-white/55 hover:bg-white/[0.06] hover:text-white/85 rounded-none mx-0 px-3.5"
                  }`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={
                    isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                  }
                  transition={{ delay: 0.5 + idx * 0.05, duration: 0.3 }}
                  whileHover={!item.active ? { x: 3 } : {}}
                >
                  <item.icon className="w-4 h-4 flex-shrink-0" />
                  {item.label}
                </motion.a>
              ))}
            </motion.div>
          </AnimatePresence>

          {/* Main Content */}
          <div
            className="flex-1 bg-[#f2f4f7] p-2 sm:p-3 lg:p-4 overflow-hidden"
            style={{ direction: "rtl" }}
          >
            {/* Breadcrumb */}
            <motion.div
              className="flex items-center gap-1 text-[8px] sm:text-[10px] lg:text-[11px] mb-2 sm:mb-3"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : { opacity: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="font-bold text-[#1a202c]">نظرة عامة</span>
              <span className="text-[#b0b8c8]">›</span>
              <span className="text-[#718096]">نظرة عامة</span>
            </motion.div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 lg:grid-cols-3 gap-2 sm:gap-2.5 lg:gap-3 mb-3">
              {statCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-2 sm:gap-2.5 lg:gap-3.5 px-2 sm:px-3 lg:px-5 py-2 sm:py-3 lg:py-[18px] bg-white rounded-lg sm:rounded-xl lg:rounded-[14px] border border-[#eef0f4] cursor-pointer"
                  style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
                  variants={itemVariants}
                  initial="rest"
                  whileHover="hover"
                  animate="rest"
                >
                  <motion.div
                    className="w-8 h-8 sm:w-10 sm:h-10 lg:w-[52px] lg:h-[52px] rounded-lg lg:rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: card.bg }}
                    variants={cardHoverVariants}
                  >
                    <card.icon
                      className="w-4 h-4 sm:w-5 sm:h-5 lg:w-7 lg:h-7 flex-shrink-0"
                      strokeWidth={1.8}
                      style={{ color: card.color }}
                    />
                  </motion.div>
                  <div className="min-w-0">
                    <h3 className="text-sm sm:text-lg lg:text-2xl font-bold text-[#1a202c] leading-tight">
                      <AnimatedNumber
                        value={card.value}
                        duration={1.2 + idx * 0.1}
                      />
                    </h3>
                    <p className="text-[8px] sm:text-[10px] lg:text-[13px] text-[#718096] mt-0.5 truncate">
                      {card.label}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Rating Card */}
            <motion.div
              className="bg-white rounded-lg sm:rounded-xl lg:rounded-[14px] border border-[#eef0f4] p-3 sm:p-4 lg:p-5 lg:px-6"
              style={{ boxShadow: "0 4px 12px rgba(0,0,0,0.04)" }}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="text-[10px] sm:text-xs lg:text-[13px] font-semibold text-[#2d3748] mb-2 sm:mb-3">
                تقييم العملاء
              </div>
              <div
                className="flex items-start gap-3 sm:gap-4 lg:gap-6"
                style={{ direction: "rtl" }}
              >
                {/* Rating Summary */}
                <motion.div
                  className="flex-shrink-0 w-20 sm:w-28 lg:w-40 text-center border-l border-[#e2e8f0] pl-3 sm:pl-4 lg:pl-6"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={
                    isInView
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 0, scale: 0.9 }
                  }
                  transition={{ delay: 1, duration: 0.4 }}
                >
                  <div className="text-2xl sm:text-3xl lg:text-[3.2rem] font-extrabold text-[#1a202c] leading-none">
                    <AnimatedNumber value={3} duration={1} />.
                    <AnimatedNumber value={9} duration={1.2} />
                  </div>
                  <motion.div
                    className="text-amber-400 text-sm sm:text-base lg:text-lg my-0.5 sm:my-1"
                    initial={{ opacity: 0 }}
                    animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                    transition={{ delay: 1.3 }}
                  >
                    ★★★★☆
                  </motion.div>
                  <div className="text-[8px] sm:text-[10px] lg:text-xs text-[#718096] mt-1">
                    بناءً على 16 تقييم
                  </div>
                </motion.div>

                {/* Rating Breakdown */}
                <div
                  className="flex-1 space-y-1 sm:space-y-1.5 lg:space-y-2"
                  style={{ direction: "rtl" }}
                >
                  {ratingBreakdown.map((row, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-1.5 sm:gap-2 lg:gap-2.5"
                      initial={{ opacity: 0, x: -10 }}
                      animate={
                        isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }
                      }
                      transition={{ delay: 1.2 + idx * 0.08, duration: 0.3 }}
                    >
                      <div className="w-7 sm:w-9 lg:w-11 text-[8px] sm:text-[10px] lg:text-xs text-[#4a5568]">
                        {row.stars} ★
                      </div>
                      <AnimatedProgressBar
                        percentage={row.percentage}
                        delay={idx}
                      />
                      <motion.div
                        className="w-5 sm:w-6 lg:w-7 text-[8px] sm:text-[10px] lg:text-xs font-medium text-[#718096] text-left"
                        initial={{ opacity: 0 }}
                        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
                        transition={{ delay: 1.5 + idx * 0.08 }}
                      >
                        {row.count}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
