"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const headerButtons = [
  { label: "استيراد الحجوزات", outline: true },
  { label: "تحميل القالب", outline: true },
  { label: "+ إضافة", primary: true },
];

const tableHeaders = ["#", "اسم العميل", "المشروع", "الوحدة", "المصدر", "حالة العميل", "الإجراءات"];

const tableRows = [
  { id: "7", name: "فيصل العتيبي", project: "مشروع الربوة", unit: "B5", source: "صفحة الهبوط", status: "مهتم", statusColor: "#b45309", statusBg: "#fef3c7" },
  { id: "6", name: "تركي القحطاني", project: "مشروع الربوة", unit: "B1", source: "Excel", status: "عميل جديد", statusColor: "#1d4ed8", statusBg: "#dbeafe", altBg: true },
  { id: "5", name: "بندر الزهراني", project: "مشروع الربوة", unit: "—", source: "Excel", status: "عميل جديد", statusColor: "#1d4ed8", statusBg: "#dbeafe" },
  { id: "4", name: "ريم السبيعي", project: "مشروع الورود", unit: "A2", source: "يدوي", status: "عميل جديد", statusColor: "#1d4ed8", statusBg: "#dbeafe", altBg: true },
];

export function BookingsMockup() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div
      ref={ref}
      className="bg-gradient-to-br from-[#fff7ed] to-[#ffedd5] rounded-2xl p-3 sm:p-5 lg:p-6 xl:p-8 pb-0 overflow-hidden"
      style={{ boxShadow: "0 4px 24px rgba(249,115,22,0.07)" }}
    >
      <div
        className="bg-white rounded-t-xl border border-b-0 border-[#e0e6ef] overflow-hidden"
        style={{ boxShadow: "0 -6px 24px rgba(249,115,22,0.08)" }}
      >
        {/* Header */}
        <div className="bg-navy px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 flex items-center justify-between gap-1">
          <span className="text-[9px] sm:text-[10px] lg:text-xs text-white/70 font-semibold whitespace-nowrap">إدارة الحجوزات</span>
          <div className="flex gap-1 flex-shrink-0">
            {headerButtons.map((btn, idx) => (
              <motion.span
                key={idx}
                className={`text-[7px] sm:text-[8px] lg:text-xs px-1.5 sm:px-2 py-0.5 rounded whitespace-nowrap ${
                  btn.primary
                    ? "bg-green text-white font-bold"
                    : "bg-white/10 text-white/50"
                }`}
                initial={{ opacity: 0, x: 10 }}
                animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
                transition={{ delay: 0.1 + idx * 0.05 }}
              >
                {btn.label}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Table - Compact for mobile */}
        <div style={{ direction: "rtl" }}>
          {/* Table header */}
          <motion.div
            className="grid grid-cols-[20px_70px_55px_30px_35px_45px_40px] sm:grid-cols-[25px_1fr_70px_50px_50px_60px_50px] lg:grid-cols-[30px_1fr_90px_70px_70px_80px_60px] gap-1 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-[#f9fafb] border-b border-[#f0f0f0]"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : { opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            {tableHeaders.map((header, idx) => (
              <span key={idx} className="text-[6px] sm:text-[8px] lg:text-xs font-bold text-[#718096]">
                {header}
              </span>
            ))}
          </motion.div>

          {/* Table rows */}
          {tableRows.map((row, idx) => (
            <motion.div
              key={idx}
              className={`grid grid-cols-[20px_70px_55px_30px_35px_45px_40px] sm:grid-cols-[25px_1fr_70px_50px_50px_60px_50px] lg:grid-cols-[30px_1fr_90px_70px_70px_80px_60px] gap-1 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 items-center border-b border-[#f8f8f8] ${
                row.altBg ? "bg-[#fafafa]" : ""
              }`}
              initial={{ opacity: 0, x: -16 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -16 }}
              transition={{ delay: 0.3 + idx * 0.12, duration: 0.45 }}
            >
              <span className="text-[7px] sm:text-[9px] lg:text-xs text-[#718096]">{row.id}</span>
              <span className="text-[7px] sm:text-[9px] lg:text-sm font-semibold text-navy truncate">{row.name}</span>
              <span className="text-[6px] sm:text-[8px] lg:text-xs text-[#718096] truncate">{row.project}</span>
              <span className="text-[6px] sm:text-[8px] lg:text-xs text-[#718096]">{row.unit}</span>
              <span className="text-[6px] sm:text-[8px] lg:text-xs text-[#718096]">{row.source}</span>
              <span
                className="rounded px-1 sm:px-1.5 py-0.5 text-[6px] sm:text-[8px] lg:text-xs font-bold text-center"
                style={{ backgroundColor: row.statusBg, color: row.statusColor }}
              >
                {row.status}
              </span>
              <span className="bg-[#f0f4ff] text-[#28C928] rounded px-1 py-0.5 text-[6px] sm:text-[8px] lg:text-xs font-semibold text-center">
                إجراءات ▾
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
