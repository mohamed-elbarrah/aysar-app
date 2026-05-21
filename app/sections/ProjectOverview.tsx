"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";

interface ProjectCardData {
  initial: string;
  name: string;
  units: string;
  location: string;
  delivery: string;
  progress: number;
  progressColor: string;
  initialBg: string;
  clients: string;
  remaining: string;
}

const projects: ProjectCardData[] = [
  {
    initial: "و",
    name: "واحة الأمير",
    units: "88 وحدة",
    location: "الدمام",
    delivery: "تسليم مايو 2025",
    progress: 92,
    progressColor: "#1a9a5a",
    initialBg: "#1a9a5a",
    clients: "14 عميل نشط",
    remaining: "6 وحدات متبقية",
  },
  {
    initial: "ن",
    name: "نخيل الشرق",
    units: "56 وحدة",
    location: "جدة",
    delivery: "تسليم يونيو 2026",
    progress: 45,
    progressColor: "#f59e0b",
    initialBg: "#2d2e83",
    clients: "18 عميل نشط",
    remaining: "24 وحدة متبقية",
  },
  {
    initial: "ب",
    name: "برج الخزامى",
    units: "124 وحدة",
    location: "الرياض",
    delivery: "تسليم مارس 2026",
    progress: 78,
    progressColor: "#2d2e83",
    initialBg: "#0c2954",
    clients: "31 عميل نشط",
    remaining: "12 وحدة متبقية",
  },
];

const checkItems = [
  { bold: "إدارة مشاريع متعددة", detail: " — فيلات، شقق، تجاري من لوحة واحدة" },
  { bold: "تتبع نسبة الإنجاز", detail: " لكل مشروع ولكل مرحلة بدقة" },
  { bold: "توثيق بالصور والفيديو", detail: " — يراها العميل فور رفعها" },
  { bold: "سحابي 100%", detail: " — من أي جهاز وأي مكان بدون تثبيت" },
];

function AnimatedProgress({ targetPercentage, color, delay = 0 }: { targetPercentage: number; color: string; delay?: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const [width, setWidth] = useState(0);

  useEffect(() => {
    if (!isInView) return;
    const timer = setTimeout(() => {
      const start = performance.now();
      const dur = 1200;
      const step = (now: number) => {
        const p = Math.min((now - start) / dur, 1);
        setWidth(targetPercentage * p);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(timer);
  }, [isInView, targetPercentage, delay]);

  return (
    <div ref={ref} className="flex-1 h-[5px] bg-[#e8edf5] rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-none"
        style={{ width: `${width}%`, backgroundColor: color }}
      />
    </div>
  );
}

export function ProjectOverview() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <section className="bg-white">
      <div className="section-aysar" ref={ref}>
        <div className="container-aysar grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Text */}
          <div className="order-1">
            <motion.div
              className="eyebrow"
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              لوحة التحكم
            </motion.div>

            <motion.h2
              className="text-[clamp(28px,4vw,48px)] font-bold text-text leading-[1.15] tracking-tight mb-4"
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.1 }}
            >
              كل مشاريعك
              <br />
              <span className="text-indigo">في نظرة واحدة</span>
            </motion.h2>

            <motion.p
              className="text-[17px] text-muted leading-[1.75] max-w-[560px] mb-7"
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.2 }}
            >
              لوحة تحكم احترافية تعطيك صورة كاملة عن جميع مشاريعك، وحداتك،
              وعملاءك — محدّثة لحظياً.
            </motion.p>

            <motion.div
              className="flex flex-col gap-[13px] mb-8"
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.3 }}
            >
              {checkItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  className="flex items-start gap-2.5"
                  variants={textVariants}
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  transition={{ delay: 0.35 + idx * 0.08 }}
                >
                  <div className="w-5 h-5 rounded-full bg-green-light flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#0c2954"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12" />
                    </svg>
                  </div>
                  <span className="text-[15px] text-text-secondary leading-[1.6]">
                    <strong className="text-text">{item.bold}</strong>
                    {item.detail}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.7 }}
            >
              <Link
                href="https://platform.aysar.sa/"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-navy border-b-2 border-navy pb-1 hover:text-indigo hover:border-indigo transition-colors duration-150"
              >
                ادخل لوحة التحكم ←
              </Link>
            </motion.div>
          </div>

          {/* Visual — Project Cards */}
          <div className="order-2">
            <motion.div
              className="bg-[#f4f6fb] border border-border rounded-[20px] p-5"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* Mini header */}
              <div className="flex items-center justify-between mb-3.5">
                <span className="text-[13px] font-bold text-text">
                  كل المشاريع
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="bg-white border border-[#e0e6ef] rounded-md px-2.5 py-1 text-[10px] text-muted">
                    ترتيب ▾
                  </span>
                  <span className="bg-navy rounded-md px-2.5 py-1 text-[10px] text-white font-semibold">
                    + مشروع جديد
                  </span>
                </div>
              </div>

              {/* Cards */}
              <div className="flex flex-col gap-2.5">
                {projects.map((project, idx) => (
                  <motion.div
                    key={idx}
                    className="bg-white border border-[#e8ecf4] rounded-[14px] p-4 flex items-center gap-3.5"
                    initial={{ opacity: 0, x: 20 }}
                    animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }}
                    transition={{
                      delay: 0.4 + idx * 0.15,
                      duration: 0.5,
                      ease: "easeOut",
                    }}
                    whileHover={{
                      y: -2,
                      boxShadow: "0 8px 24px rgba(12,41,84,0.06)",
                      transition: { duration: 0.25 },
                    }}
                  >
                    {/* Initial circle */}
                    <div
                      className="w-[38px] h-[38px] rounded-[10px] flex-shrink-0 flex items-center justify-center text-[15px] font-bold text-white"
                      style={{ backgroundColor: project.initialBg }}
                    >
                      {project.initial}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[13px] font-bold text-text truncate">
                          {project.name}
                        </span>
                        <span
                          className="text-[13px] font-bold"
                          style={{ color: project.progressColor }}
                        >
                          {project.progress}%
                        </span>
                      </div>
                      <div className="text-[11px] text-muted mb-2">
                        {project.units} · {project.location} ·{" "}
                        {project.delivery}
                      </div>

                      <AnimatedProgress
                        targetPercentage={project.progress}
                        color={project.progressColor}
                        delay={200 + idx * 150}
                      />

                      <div className="flex items-center justify-between mt-1.5">
                        <span className="text-[10px] text-muted">
                          {project.clients}
                        </span>
                        <span className="text-[10px] text-muted">
                          {project.remaining}
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
