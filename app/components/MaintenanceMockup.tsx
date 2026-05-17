"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Eye } from "lucide-react";

const filterButtons = [
  { label: "كل الحالات ▾", active: true },
  { label: "جميع المشاريع ▾", active: false },
  { label: "الأحدث ▾", active: false },
];

const tableHeaders = ["#", "الاسم", "المشروع", "نوع المشكلة", "الحالة", "العملية"];

const tableRows = [
  { id: "33", name: "خالد المطيري", project: "مشروع الياسمين", issue: "السباكة", status: "مفتوح", statusColor: "#16a34a", bgColor: "#dcfce7" },
  { id: "32", name: "أحمد الشهري", project: "مشروع الياسمين", issue: "السباكة", status: "مفتوح", statusColor: "#16a34a", bgColor: "#dcfce7", altBg: true },
  { id: "31", name: "محمد الحربي", project: "مشروع الياسمين", issue: "الكهرباء", status: "مفتوح", statusColor: "#16a34a", bgColor: "#dcfce7" },
  { id: "30", name: "سلطان الغامدي", project: "مشروع الربوة", issue: "السباكة", status: "مغلق", statusColor: "#ef4444", bgColor: "#fee2e2", altBg: true },
];

export function MaintenanceMockup() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <div
      ref={ref}
      className="bg-gradient-to-br from-[#fff5f5] to-[#fee8e8] rounded-2xl p-3 sm:p-5 lg:p-6 xl:p-8 pb-0 overflow-hidden"
      style={{ boxShadow: "0 4px 24px rgba(192,57,43,0.06)" }}
    >
      <div
        className="bg-white rounded-t-xl border border-b-0 border-[#e0e6ef] overflow-hidden"
        style={{ boxShadow: "0 -6px 24px rgba(192,57,43,0.06)" }}
      >
        {/* Header */}
        <div className="bg-navy px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 flex items-center justify-between">
          <span className="text-[9px] sm:text-[10px] lg:text-xs text-white/70 font-semibold">طلبات الصيانة</span>
          <div className="flex gap-1 sm:gap-1.5">
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#ff5f57] opacity-80" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#febc2e] opacity-80" />
            <div className="w-2 h-2 sm:w-2.5 sm:h-2.5 lg:w-3 lg:h-3 rounded-full bg-[#28c840] opacity-80" />
          </div>
        </div>

        {/* Filter bar */}
        <motion.div
          className="px-2 sm:px-3 lg:px-4 py-2 sm:py-2.5 border-b border-[#f0f0f0] flex gap-1.5 sm:gap-2"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: 0.2 }}
        >
          {filterButtons.map((btn, idx) => (
            <div
              key={idx}
              className={`bg-[#f5f7ff] border border-[#e0e6ef] rounded-md px-2 sm:px-2.5 lg:px-3 py-1 text-[8px] sm:text-[9px] lg:text-xs whitespace-nowrap ${
                btn.active ? "text-navy font-semibold" : "text-[#718096]"
              }`}
            >
              {btn.label}
            </div>
          ))}
        </motion.div>

        {/* Table - Scale down on mobile */}
        <div style={{ direction: "rtl" }}>
          {/* Table header */}
          <div className="grid grid-cols-[25px_1fr_60px_50px_45px_35px] sm:grid-cols-[30px_1fr_80px_60px_70px_45px] lg:grid-cols-[35px_1fr_100px_80px_90px_50px] gap-1 sm:gap-1.5 lg:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 bg-[#f9fafb] border-b border-[#f0f0f0]">
            {tableHeaders.map((header, idx) => (
              <span key={idx} className="text-[7px] sm:text-[8px] lg:text-xs font-bold text-[#718096]">
                {header}
              </span>
            ))}
          </div>

          {/* Table rows */}
          {tableRows.map((row, idx) => (
            <motion.div
              key={idx}
              className={`grid grid-cols-[25px_1fr_60px_50px_45px_35px] sm:grid-cols-[30px_1fr_80px_60px_70px_45px] lg:grid-cols-[35px_1fr_100px_80px_90px_50px] gap-1 sm:gap-1.5 lg:gap-2 px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 items-center border-b border-[#f8f8f8] ${
                row.altBg ? "bg-[#fafafa]" : ""
              }`}
              initial={{ opacity: 0, y: 12 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
              transition={{ delay: 0.3 + idx * 0.1, duration: 0.4 }}
            >
              <span className="text-[7px] sm:text-[9px] lg:text-xs text-[#718096]">{row.id}</span>
              <span className="text-[7px] sm:text-[9px] lg:text-sm font-semibold text-navy truncate">{row.name}</span>
              <span className="text-[6px] sm:text-[8px] lg:text-xs text-[#718096] truncate">{row.project}</span>
              <span className="text-[6px] sm:text-[8px] lg:text-xs text-[#718096]">{row.issue}</span>
              <span
                className="rounded px-1 sm:px-1.5 lg:px-2 py-0.5 text-[6px] sm:text-[8px] lg:text-xs font-bold text-center"
                style={{ backgroundColor: row.bgColor, color: row.statusColor }}
              >
                {row.status}
              </span>
              <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 lg:w-4 lg:h-4 text-[#718096] mx-auto" />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
