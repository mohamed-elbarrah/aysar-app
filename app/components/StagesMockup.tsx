"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const kpiCards = [
  { value: "7", label: "العقارات", bg: "#eef5ff" },
  { value: "57", label: "الملاك", bg: "#e9f9f0" },
  { value: "30", label: "البلاغات", bg: "#feeeee" },
];

const progressRows = [
  { label: "الحفر والأساسات", progress: 100, color: "#28C928" },
  { label: "الهيكل الخرساني", progress: 100, color: "#28C928" },
  { label: "التشطيبات الخارجية", progress: 80, color: "#28C928" },
  { label: "التشطيبات الداخلية", progress: 35, color: "#f59e0b" },
  { label: "+ مراحل مخصصة", progress: 0, color: "#e8ebf3", muted: true },
];

export function StagesMockup() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div
      ref={ref}
      className="bg-gradient-to-br from-[#f0f4ff] to-[#e8edf8] rounded-2xl p-3 sm:p-5 lg:p-6 xl:p-8 pb-0 overflow-hidden"
      style={{ boxShadow: "0 4px 24px rgba(12,41,84,0.08)" }}
    >
      <div
        className="bg-white rounded-t-xl border border-b-0 border-[#e0e6ef] overflow-hidden"
        style={{ boxShadow: "0 -6px 24px rgba(12,41,84,0.08)" }}
      >
        {/* Browser bar */}
        <div className="bg-navy px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 flex items-center justify-between">
          <div className="flex gap-1 sm:gap-1.5">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#ff5f57] opacity-80" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#febc2e] opacity-80" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#28c840] opacity-80" />
          </div>
          <span className="text-[8px] sm:text-[10px] lg:text-xs text-white/40 hidden sm:block">platform.aysar.sa</span>
          <div className="w-6 sm:w-8 lg:w-12" />
        </div>

        {/* Content */}
        <div className="p-2 sm:p-3 lg:p-5" style={{ direction: "rtl" }}>
          {/* KPI cards */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 lg:gap-3 mb-3 lg:mb-4">
            {kpiCards.map((card, idx) => (
              <motion.div
                key={idx}
                className="rounded-lg p-2 sm:p-2.5 lg:p-4 text-center"
                style={{ backgroundColor: card.bg }}
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
              >
                <div className="text-base sm:text-lg lg:text-2xl xl:text-3xl font-bold text-navy">{card.value}</div>
                <div className="text-[8px] sm:text-[9px] lg:text-xs text-[#718096] mt-0.5 sm:mt-1">{card.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Progress section */}
          <motion.div
            className="bg-[#f5f7ff] border border-[#e0e6ef] rounded-xl p-2.5 sm:p-3 lg:p-4 mb-2 sm:mb-3"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            <div className="flex items-center justify-between mb-2 sm:mb-3">
              <span className="text-[10px] sm:text-xs lg:text-sm font-bold text-navy">مشروع الياسمين</span>
              <span className="bg-navy text-white rounded-full px-2 sm:px-2.5 lg:px-3 py-0.5 text-[9px] sm:text-[10px] lg:text-xs font-bold">78%</span>
            </div>

            <div className="flex flex-col gap-1.5 sm:gap-2 lg:gap-2.5">
              {progressRows.map((row, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-center gap-2"
                  initial={{ opacity: 0, x: -10 }}
                  animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
                  transition={{ delay: 0.4 + idx * 0.08, duration: 0.3 }}
                >
                  <span className={`text-[8px] sm:text-[9px] lg:text-xs min-w-[70px] sm:min-w-[90px] lg:min-w-[110px] ${row.muted ? "text-[#b0b8c8]" : "text-[#718096]"}`}>
                    {row.label}
                  </span>
                  <div className="flex-1 h-1 sm:h-1.5 lg:h-2 bg-[#e8ebf3] rounded-full overflow-hidden">
                    {row.progress > 0 ? (
                      <motion.div
                        className="h-full rounded-full"
                        style={{ backgroundColor: row.color }}
                        initial={{ width: 0 }}
                        animate={isInView ? { width: `${row.progress}%` } : { width: 0 }}
                        transition={{ delay: 0.5 + idx * 0.1, duration: 0.8, ease: "easeOut" }}
                      />
                    ) : (
                      <div className="h-full bg-[#e8ebf3] rounded-full" />
                    )}
                  </div>
                  <span
                    className="text-[8px] sm:text-[9px] lg:text-xs font-bold min-w-[24px] sm:min-w-[30px]"
                    style={{ color: row.muted ? "#b0b8c8" : row.color }}
                  >
                    {row.progress > 0 ? `${row.progress}%` : "—"}
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Notification */}
          <motion.div
            className="bg-[#fff8e8] border border-[#fde68a] rounded-lg px-2 sm:px-2.5 lg:px-3 py-1.5 sm:py-2 flex items-center gap-1.5 sm:gap-2"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <span className="text-sm sm:text-base lg:text-lg">🔔</span>
            <span className="text-[9px] sm:text-[11px] lg:text-xs text-navy truncate">
              آخر تحديث: <strong>تم رفع 8 صور</strong> من موقع برج الخزامى
            </span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
