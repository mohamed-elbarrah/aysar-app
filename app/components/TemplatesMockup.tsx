"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const headerButtons = [
  { label: "استيراد قالب", outline: true },
  { label: "+ إنشاء مرحلة", primary: true },
];

const tableHeaders = [
  "#",
  "اسم المرحلة",
  "الحالة",
  "نسبة المرحلة",
  "المشاهدات",
  "التفاعلات",
];

const tableRows = [
  {
    id: "1",
    name: "الحفر والتأسيس",
    status: "مكتمل",
    statusColor: "#16a34a",
    statusBg: "#dcfce7",
    progress: 100,
    progressColor: "#28C928",
    views: "247",
    interactions: "32",
  },
  {
    id: "2",
    name: "الهيكل الخرساني",
    status: "مكتمل",
    statusColor: "#16a34a",
    statusBg: "#dcfce7",
    progress: 100,
    progressColor: "#28C928",
    views: "198",
    interactions: "28",
    altBg: true,
  },
  {
    id: "3",
    name: "التشطيبات الخارجية",
    status: "جارٍ",
    statusColor: "#b45309",
    statusBg: "#fef3c7",
    progress: 80,
    progressColor: "#f59e0b",
    views: "156",
    interactions: "41",
  },
  {
    id: "4",
    name: "التشطيبات الداخلية",
    status: "قادم",
    statusColor: "#28C928",
    statusBg: "#f0f4ff",
    progress: 0,
    progressColor: "#b0b8c8",
    views: "—",
    interactions: "—",
    altBg: true,
  },
  { id: "5", name: "+ يمكنك إضافة حتى 50 مرحلة", muted: true },
];

export function TemplatesMockup() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div
      ref={ref}
      className="bg-gradient-to-br  from-[#fff5e6] to-[#fff0d4] rounded-2xl p-3 sm:p-5 lg:p-6 xl:p-8 pb-0 overflow-hidden"
      style={{ boxShadow: "0 4px 24px rgba(249,115,22,0.07)" }}
    >
      <div
        className="bg-white rounded-t-xl border border-b-0 border-[#e0e6ef] overflow-hidden"
        style={{ boxShadow: "0 -6px 24px rgba(249,115,22,0.08)" }}
      >
        {/* Header */}
        <div className="bg-navy px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-1">
          <span className="text-[8px] sm:text-[10px] lg:text-xs text-white/70 font-semibold truncate">
            مراحل العقار — مشروع الياسمين
          </span>
          <div className="flex gap-1 flex-shrink-0">
            {headerButtons.map((btn, idx) => (
              <motion.span
                key={idx}
                className={`text-[7px] sm:text-[8px] lg:text-xs px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap ${
                  btn.primary
                    ? "bg-green text-white font-bold"
                    : "bg-white/10 text-white/60"
                }`}
                initial={{ opacity: 0, x: 10 }}
                animate={
                  isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }
                }
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                {btn.label}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Table */}
        <div style={{ direction: "rtl" }}>
          {/* Table header */}
          <motion.div
            className="grid grid-cols-[18px_1fr_40px_50px_35px_35px] sm:grid-cols-[22px_1fr_50px_60px_45px_45px] lg:grid-cols-[28px_1fr_80px_70px_50px_50px] gap-1 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-[#f9fafb] border-b border-[#f0f0f0]"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            {tableHeaders.map((header, idx) => (
              <span
                key={idx}
                className="text-[6px] sm:text-[7px] lg:text-xs font-bold text-[#718096]"
              >
                {header}
              </span>
            ))}
          </motion.div>

          {/* Table rows */}
          {tableRows.map((row, idx) => (
            <motion.div
              key={idx}
              className={`grid grid-cols-[18px_1fr_40px_50px_35px_35px] sm:grid-cols-[22px_1fr_50px_60px_45px_45px] lg:grid-cols-[28px_1fr_80px_70px_50px_50px] gap-1 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 items-center border-b border-[#f8f8f8] ${
                row.altBg ? "bg-[#fafafa]" : ""
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
            >
              <span
                className={`text-[7px] sm:text-[9px] lg:text-xs ${row.muted ? "text-[#718096] font-semibold" : "text-[#718096] font-semibold"}`}
              >
                {row.id}
              </span>
              <span
                className={`text-[8px] sm:text-[10px] lg:text-sm font-bold truncate ${row.muted ? "text-[#b0b8c8]" : "text-navy"}`}
              >
                {row.name}
              </span>
              {!row.muted ? (
                <>
                  <span
                    className="rounded px-1 sm:px-1.5 lg:px-2 py-0.5 text-[6px] sm:text-[8px] lg:text-xs font-bold text-center"
                    style={{
                      backgroundColor: row.statusBg,
                      color: row.statusColor,
                    }}
                  >
                    {row.status}
                  </span>
                  <div className="flex items-center gap-1">
                    <div className="flex-1 h-0.5 sm:h-1 lg:h-1.5 bg-[#e0e6f0] rounded-full overflow-hidden">
                      {row.progress && row.progress > 0 && (
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: row.progressColor }}
                          initial={{ width: 0 }}
                          animate={
                            isInView
                              ? { width: `${row.progress}%` }
                              : { width: 0 }
                          }
                          transition={{
                            delay: 0.5 + idx * 0.15,
                            duration: 1.2,
                            ease: "easeOut",
                          }}
                        />
                      )}
                    </div>
                    <span
                      className="text-[6px] sm:text-[8px] lg:text-xs font-bold"
                      style={{ color: row.progressColor }}
                    >
                      {row.progress && row.progress > 0
                        ? `${row.progress}%`
                        : "0%"}
                    </span>
                  </div>
                  <span className="text-[7px] sm:text-[9px] lg:text-xs text-[#718096] text-center">
                    {row.views}
                  </span>
                  <span className="text-[7px] sm:text-[9px] lg:text-xs text-[#718096] text-center">
                    {row.interactions}
                  </span>
                </>
              ) : (
                <>
                  <span className="bg-[#f5f5f5] text-[#b0b8c8] rounded px-1 sm:px-1.5 py-0.5 text-[6px] sm:text-[8px] lg:text-xs font-semibold text-center">
                    —
                  </span>
                  <div className="flex-1 h-0.5 sm:h-1 lg:h-1.5 bg-[#f0f0f0] rounded-full" />
                  <span></span>
                  <span></span>
                </>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
