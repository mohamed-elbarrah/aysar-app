"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import {
  Bell,
  LayoutGrid,
  Wrench,
} from "lucide-react";

const floatingCards = [
  {
    icon: Bell,
    iconBg: "#fff7ed",
    iconColor: "#f97316",
    title: "إشعار جديد",
    value: "تحديث المرحلة",
    meta: "منذ 5 دقائق",
    metaColor: "#f97316",
    position: "-bottom-4 -left-6 lg:-left-10",
    delay: 0,
  },
  {
    icon: LayoutGrid,
    iconBg: "#eef2ff",
    iconColor: "#2d2e83",
    title: "مشروع الحمراء E-8",
    progress: 75,
    progressColor: "#2d2e83",
    position: "-top-4 -left-8 lg:-left-14",
    delay: 1.3,
  },
  {
    icon: Wrench,
    iconBg: "#feeeee",
    iconColor: "#ef4444",
    title: "طلب صيانة جديد",
    value: "تم رفع الطلب",
    status: "مفتوح",
    statusColor: "#ef4444",
    position: "-top-6 -right-6 lg:-right-14",
    delay: 2.6,
  },
];

export function AppSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient matching reference: #f0f4ff → #e8ecfa → #ede8f8 */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0f4ff] via-[#e8ecfa] to-[#ede8f8]" />

      {/* Decorative glow */}
      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(45,46,131,0.12), transparent 70%)",
        }}
      />

      <div className="section-aysar !pb-0 relative z-10" ref={ref}>
        <div className="container-aysar grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          {/* Text */}
          <div className="order-2 lg:order-1 pb-0 lg:pb-20">
            <motion.div
              className="eyebrow"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5 }}
            >
              تطبيق أيسَر
            </motion.div>

            <motion.h2
              className="text-[clamp(28px,4vw,48px)] font-bold text-navy leading-[1.15] tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              من أول طوبة
              <br />
              <span className="text-indigo">لآخر لمسة</span>
            </motion.h2>

            <motion.p
              className="text-[16px] text-muted leading-[1.8] max-w-[500px] mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              لن تحتاج سوى برنامج أيسَر للحصول على تطبيق مخصص لعملائك. حمِّل
              تطبيق أيسَر وراقب منزلك يكبر أمام عينك.
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-2.5"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <a
                href="https://apps.apple.com/sa/app/%D8%A3%D9%8A%D8%B3-%D8%B1/id6746420561?l=ar&platform=iphone"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-navy hover:opacity-[0.88] hover:-translate-y-px active:translate-y-0 transition-all duration-150 rounded-xl px-5 py-[11px]"
              >
                {/* Apple Logo */}
                <svg className="w-5 h-5 text-white flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M17.65 8.65c-.05-1.95 1.6-2.89 1.67-2.93-.91-1.33-2.33-1.51-2.83-1.53-1.2-.12-2.35.71-2.96.71-.62 0-1.57-.69-2.59-.67-1.33.02-2.57.78-3.25 1.97-1.39 2.41-.36 5.98 1 7.93.66.96 1.45 2.04 2.5 2.01 1-.04 1.38-.65 2.59-.65 1.21 0 1.56.65 2.58.63 1.07-.02 1.74-.97 2.41-1.93.76-1.1 1.07-2.18 1.09-2.23-.02-.01-2.11-.81-2.13-3.22-.02-2.01 1.64-2.97 1.72-3.02-.95-1.38-2.42-1.53-2.93-1.56-.11-.01-1.06-.12-1.46-.12zM14.87 5.1c.57-.69.95-1.65.85-2.6-.82.03-1.81.55-2.4 1.23-.52.6-.98 1.56-.86 2.49.91.07 1.84-.46 2.41-1.12z"/>
                </svg>
                <div>
                  <div className="text-[10px] text-white/55 leading-none">
                    Download on the
                  </div>
                  <div className="text-[13px] font-bold text-white leading-tight">
                    App Store
                  </div>
                </div>
              </a>

              <a
                href="https://play.google.com/store/apps/details?id=com.aysar.application"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-navy hover:opacity-[0.88] hover:-translate-y-px active:translate-y-0 transition-all duration-150 rounded-xl px-5 py-[11px]"
              >
                {/* Google Play Logo */}
                <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="none">
                  <path d="M3.609 1.814L13.792 12 3.61 22.186a.996.996 0 01-.61-.922V2.736a1 1 0 01.61-.922z" fill="#4285F4"/>
                  <path d="M14.899 12.849l2.302 2.302-10.937 6.333 8.635-8.635z" fill="#34A853"/>
                  <path d="M14.899 11.151l2.302-2.302 2.807 1.626a1 1 0 010 1.73l-2.807 1.626-2.302-2.29z" fill="#FBBC05"/>
                  <path d="M11.646 8.348l8.663 8.662-10.973-6.35 2.31-2.312z" fill="#EA4335"/>
                </svg>
                <div>
                  <div className="text-[10px] text-white/55 leading-none">
                    Get it on
                  </div>
                  <div className="text-[13px] font-bold text-white leading-tight">
                    Google Play
                  </div>
                </div>
              </a>
            </motion.div>
          </div>

          {/* Phone visual */}
          <div className="order-1 lg:order-2 relative flex justify-center items-end">
            <motion.div
              className="relative"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            >
              {/* Phone chassis — modern frame */}
              <div
                className="relative w-[220px] sm:w-[240px] lg:w-[260px] rounded-[36px] p-[14px] px-3 pb-5 shadow-2xl"
                style={{
                  background:
                    "linear-gradient(145deg, #162340 0%, #1e3050 40%, #0f1c30 100%)",
                  boxShadow:
                    "0 25px 60px -12px rgba(12,41,84,0.55), inset 0 1px 0 rgba(255,255,255,0.12)",
                }}
              >
                {/* Dynamic Island notch */}
                <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20">
                  <div
                    className="h-[22px] w-[80px] rounded-full bg-transparent"
                    style={{
                      background:
                        "linear-gradient(180deg, #0c1a2e 0%, #0c1a2e 100%)",
                      boxShadow:
                        "inset 0 1px 3px rgba(0,0,0,0.5), 0 1px 0 rgba(255,255,255,0.06)",
                    }}
                  >
                    <div className="absolute left-[14px] top-1/2 -translate-y-1/2 w-[7px] h-[7px] rounded-full"
                      style={{
                        background:
                          "radial-gradient(circle at 30% 30%, #2a4080, #0c1a2e)",
                      }}
                    />
                  </div>
                </div>

                {/* Screen */}
                <div className="relative rounded-[18px] overflow-hidden bg-white"
                  style={{
                    boxShadow:
                      "inset 0 0 8px rgba(0,0,0,0.2), 0 0 0 1px rgba(0,0,0,0.15)",
                  }}
                >
                  <Image
                    src="/app-screenshot.jpg"
                    alt="تطبيق أيسَر"
                    width={260}
                    height={520}
                    className="w-full h-auto object-cover"
                    priority
                  />

                  {/* Bottom home indicator */}
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[90px] h-[4px] rounded-full bg-black/20 z-10" />
                </div>
              </div>

              {/* Floating cards - infinite float only (no entrance animation) */}
              {floatingCards.map((card, idx) => {
                const Icon = card.icon;
                const delayClass = idx === 0 
                  ? "anim-float-delay-0" 
                  : idx === 1 
                    ? "anim-float-delay-1" 
                    : "anim-float-delay-2";
                return (
                  <div
                    key={idx}
                    className={`absolute ${card.position} z-20 anim-float-smooth ${delayClass} ${
                      idx === 0 ? "hidden sm:block" :
                      idx === 1 ? "hidden lg:block" :
                      "hidden md:block"
                    }`}
                  >
                    <div className="bg-white rounded-[14px] px-4 py-3 shadow-[0_8px_32px_rgba(12,41,84,0.12)] min-w-[180px]"
                    >
                      {idx === 1 ? (
                        // Project progress card (middle one)
                        <>
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                              style={{ backgroundColor: card.iconBg }}
                            >
                              <Icon
                                className="w-[18px] h-[18px]"
                                style={{ color: card.iconColor }}
                                strokeWidth={1.8}
                              />
                            </div>
                            <div className="text-sm font-bold text-navy truncate">
                              {card.title}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-[5px] bg-[#e0e6f0] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${card.progress}%`,
                                  backgroundColor: card.progressColor,
                                }}
                              />
                            </div>
                            <span
                              className="text-[11px] font-bold"
                              style={{ color: card.progressColor }}
                            >
                              {card.progress}%
                            </span>
                          </div>
                        </>
                      ) : (
                        // Notification and Maintenance cards
                        <div className="flex items-center gap-3">
                          <div
                            className="w-9 h-9 rounded-[10px] flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: card.iconBg }}
                          >
                            <Icon
                              className="w-[18px] h-[18px]"
                              style={{ color: card.iconColor }}
                              strokeWidth={1.8}
                            />
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11px] text-muted mb-0.5">
                              {card.title}
                            </div>
                            <div className="text-sm font-bold text-navy">
                              {card.value}
                            </div>
                            {idx === 0 ? (
                              <div
                                className="text-[11px] font-semibold"
                                style={{ color: card.metaColor }}
                              >
                                {card.meta}
                              </div>
                            ) : (
                              <div className="flex items-center gap-1 mt-1">
                                <span
                                  className="w-[6px] h-[6px] rounded-full"
                                  style={{ backgroundColor: card.statusColor }}
                                />
                                <span
                                  className="text-[10px] font-semibold"
                                  style={{ color: card.statusColor }}
                                >
                                  {card.status}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
