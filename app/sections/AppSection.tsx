"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";
import { Bell, LayoutGrid, Wrench } from "lucide-react";

interface AppSectionProps {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  description?: string;
  appStoreUrl?: string;
  googlePlayUrl?: string;
  app_images?: {
    left_phone?: string | null;
    right_phone?: string | null;
  };
}

const floatingCards = [
  {
    icon: Bell,
    iconBg: "#fff7ed",
    iconColor: "#f97316",
    title: "إشعار جديد",
    value: "تحديث المرحلة",
    meta: "منذ 5 دقائق",
    metaColor: "#f97316",
    position: "-top-6 -left-6 lg:-left-12",
    delay: 0,
  },
  {
    icon: LayoutGrid,
    iconBg: "#eef2ff",
    iconColor: "#2d2e83",
    title: "مشروع الحمراء E-8",
    progress: 75,
    progressColor: "#2d2e83",
    position: "top-14 left-1/2 -translate-x-1/2",
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
    position: "-top-6 -right-6 lg:-right-12",
    delay: 2.6,
  },
];

function PhoneFrame({ className, customImage }: { className?: string; customImage?: string | null }) {
  const imageSrc = customImage || "/app-screenshot.jpg";
  return (
    <div
      className={`relative w-[240px] sm:w-[280px] lg:w-[300px] rounded-[44px] p-[10px] pb-4 shadow-2xl flex-shrink-0 ${className}`}
      style={{
        background:
          "linear-gradient(145deg, #050505 0%, #141414 50%, #050505 100%)",
        boxShadow:
          "0 30px 70px -12px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.06)",
      }}
    >
      {/* Dynamic Island */}
      <div className="absolute top-[18px] left-1/2 -translate-x-1/2 z-20">
        <div
          className="w-[80px] sm:w-[80px] lg:w-[100px] h-[20px] sm:h-[20px] lg:h-[24px] rounded-full"
          style={{
            background: "#000000",
            boxShadow: "inset 0 1px 2px rgba(255,255,255,0.08)",
          }}
        />
      </div>

      {/* Side buttons (controlled by className - hidden by default) */}
      <div className="side-buttons hidden">
        <div className="power-btn absolute right-[-2px] top-[80px] w-[2px] h-[28px] bg-[#1a1a1a] rounded-l-sm" />
        <div className="vol-up absolute right-[-2px] top-[120px] w-[2px] h-[50px] bg-[#1a1a1a] rounded-l-sm" />
        <div className="vol-down absolute left-[-2px] top-[100px] w-[2px] h-[40px] bg-[#1a1a1a] rounded-r-sm" />
      </div>

      {/* Screen */}
      <div className="relative rounded-[32px] overflow-hidden bg-white h-[480px] sm:h-[560px] lg:h-[650px]">
        <Image
          src={imageSrc}
          alt="تطبيق أيسَر"
          width={300}
          height={600}
          className="w-full h-full object-cover"
          priority
        />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[110px] h-[5px] rounded-full bg-black/30 z-10" />
      </div>
    </div>
  );
}

export function AppSection({
  eyebrow = "تطبيق أيسَر",
  title = "من أول طوبة",
  titleAccent = "لآخر لمسة",
  description = "لن تحتاج سوى برنامج أيسَر للحصول على تطبيق مخصص لعملائك. حمِّل تطبيق أيسَر وراقب منزلك يكبر أمام عينك.",
  appStoreUrl = "https://apps.apple.com/sa/app/%D8%A3%D9%8A%D8%B3-%D8%B1/id6746420561?l=ar&platform=iphone",
  googlePlayUrl = "https://play.google.com/store/apps/details?id=com.aysar.application",
  app_images,
}: AppSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#f0f4ff] via-[#e8ecfa] to-[#ede8f8]" />

      <div
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[700px] h-[500px] rounded-full pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse, rgba(45,46,131,0.12), transparent 70%)",
        }}
      />

      <div className="section-aysar !pb-0 relative z-10" ref={ref}>
        <div className="container-aysar grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-20 items-center">
          <div className="order-1 lg:order-1 pb-0 lg:pb-20">
            <motion.div
              className="eyebrow"
              initial={{ opacity: 0, y: 16 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
              transition={{ duration: 0.5 }}
            >
              {eyebrow}
            </motion.div>

            <motion.h2
              className="text-[clamp(28px,4vw,48px)] font-bold text-navy leading-[1.15] tracking-tight mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {title}
              <br />
              <span className="text-indigo">{titleAccent}</span>
            </motion.h2>

            <motion.p
              className="text-[16px] text-muted leading-[1.8] max-w-[500px] mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {description}
            </motion.p>

            <motion.div
              className="flex flex-wrap gap-2.5"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
              transition={{ duration: 0.5, delay: 0.35 }}
            >
              <a
                href={appStoreUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-white hover:bg-[#f5f6f9] transition-colors duration-150 rounded-xl px-4 py-2.5 border border-[#e8edf5] shadow-sm"
              >
                <Image
                  src="/apple-logo-svgrepo.svg"
                  alt="App Store"
                  width={20}
                  height={20}
                  className="w-5 h-5 flex-shrink-0"
                  unoptimized
                />
                <div>
                  <div className="text-[10px] text-navy leading-none">
                    Download on the
                  </div>
                  <div className="text-[13px] font-bold text-navy leading-tight">
                    App Store
                  </div>
                </div>
              </a>

              <a
                href={googlePlayUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2.5 bg-white hover:bg-[#f5f6f9] transition-colors duration-150 rounded-xl px-4 py-2.5 border border-[#e8edf5] shadow-sm"
              >
                <Image
                  src="/google-play.svg"
                  alt="Google Play"
                  width={20}
                  height={20}
                  className="w-5 h-5 flex-shrink-0"
                  unoptimized
                />
                <div>
                  <div className="text-[10px] text-navy leading-none">
                    GET IT ON
                  </div>
                  <div className="text-[13px] font-bold text-navy leading-tight">
                    Google Play
                  </div>
                </div>
              </a>
            </motion.div>
          </div>

          <div className="order-2 lg:order-2 relative flex justify-center  min-h-[420px] sm:min-h-[500px] lg:min-h-[580px]">
            <motion.div
              className="relative flex items-end justify-center"
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
              transition={{ duration: 0.7, ease: "easeOut", delay: 0.3 }}
            >
              {/* Both phones in a V shape — bottoms together, tops spread apart */}
              <div className="relative w-[400px] sm:w-[500px] lg:w-[600px] h-[420px] sm:h-[500px] lg:h-[540px] flex items-end justify-center translate-y-[45%]">
                {/* Left phone — rotates from bottom-right corner so bottom stays right */}
                <div
                  className="relative z-10 -ml-80 sm:-ml-100"
                  style={{
                    transform: "rotate(-16deg)",
                    transformOrigin: "bottom left",
                  }}
                >
                  <PhoneFrame 
                    className="w-[100px] sm:w-[120px] lg:w-[140px]" 
                    customImage={app_images?.left_phone}
                  />
                </div>

                {/* Right phone — rotates from bottom-left corner so bottom stays left, in front */}
                <div
                  className="relative z-0"
                  style={{
                    transform: "rotate(16deg)",
                    transformOrigin: "bottom right",
                  }}
                >
                  <PhoneFrame 
                    className="w-[100px] sm:w-[120px] lg:w-[140px]" 
                    customImage={app_images?.right_phone}
                  />
                </div>
              </div>

              {floatingCards.map((card, idx) => {
                const Icon = card.icon;
                const delayClass =
                  idx === 0
                    ? "anim-float-delay-0"
                    : idx === 1
                      ? "anim-float-delay-1"
                      : "anim-float-delay-2";
                return (
                  <div
                    key={idx}
                    className={`absolute ${card.position} z-30 anim-float-smooth ${delayClass} ${
                      idx === 0
                        ? "hidden sm:block"
                        : idx === 1
                          ? "hidden lg:block"
                          : "hidden md:block"
                    }`}
                  >
                    <div className="bg-white rounded-[14px] px-4 py-3 shadow-[0_8px_32px_rgba(12,41,84,0.12)] min-w-[180px]">
                      {idx === 1 ? (
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
