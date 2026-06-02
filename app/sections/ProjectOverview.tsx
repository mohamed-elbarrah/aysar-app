"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface ProjectCardData {
  name: string;
  units: string;
  location: string;
  delivery: string;
  progress: number;
  progressColor: string;
  imageUrl: string;
  clients: string;
  remaining: string;
  currentPhase: string;
  nextPhase: string;
  phaseColor: string;
  progressGradient: string;
}

interface ProjectOverviewProps {
  eyebrow?: string;
  title?: string;
  titleAccent?: string;
  description?: string;
  checkItems?: Array<{ bold: string; detail: string }>;
  linkLabel?: string;
  linkHref?: string;
}

const projects: ProjectCardData[] = [
  {
    name: "واحة الأمير",
    units: "88 وحدة",
    location: "الدمام",
    delivery: "تسليم مايو 2025",
    progress: 92,
    progressColor: "#28C928",
    imageUrl: "/projects/project1.jpg",
    clients: "14 عميل نشط",
    remaining: "6 وحدات متبقية",
    currentPhase: "التشطيبات الداخلية",
    nextPhase: "التسليم النهائي",
    phaseColor: "#28C928",
    progressGradient: "linear-gradient(90deg, #28C928, #28C928)",
  },
  {
    name: "نخيل الشرق",
    units: "56 وحدة",
    location: "جدة",
    delivery: "تسليم يونيو 2026",
    progress: 45,
    progressColor: "#f59e0b",
    imageUrl: "/projects/project2.jpg",
    clients: "18 عميل نشط",
    remaining: "24 وحدة متبقية",
    currentPhase: "الهيكل الخرساني",
    nextPhase: "التشطيبات الخارجية",
    phaseColor: "#b45309",
    progressGradient: "linear-gradient(90deg, #f59e0b, #e08900)",
  },
  {
    name: "برج الخزامى",
    units: "124 وحدة",
    location: "الرياض",
    delivery: "تسليم مارس 2026",
    progress: 78,
    progressColor: "#28C928",
    imageUrl: "/projects/project3.jpg",
    clients: "31 عميل نشط",
    remaining: "12 وحدة متبقية",
    currentPhase: "تركيب الواجهات",
    nextPhase: "التشطيبات الداخلية",
    phaseColor: "#28C928",
    progressGradient: "linear-gradient(90deg, #28C928, #28C928)",
  },
];

/* ───── small SVG icons ───── */
function CheckCircleIcon({ fill }: { fill: string }) {
  return (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" fill={fill} />
      <path
        d="M8 12l3 3 5-5"
        stroke="#fff"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ClockCircleIcon({ stroke }: { stroke: string }) {
  return (
    <svg width="8" height="8" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke={stroke} strokeWidth="2" />
      <path
        d="M12 8v4l3 3"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/* ───── animated progress ───── */
function AnimatedProgress({
  targetPercentage,
  gradient,
  color,
  delay = 0,
}: {
  targetPercentage: number;
  gradient?: string;
  color?: string;
  delay?: number;
}) {
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

  const bgStyle = gradient
    ? { background: gradient }
    : { backgroundColor: color };

  return (
    <div
      ref={ref}
      className="h-[5px] bg-[#e8edf5] rounded-full overflow-hidden"
    >
      <div
        className="h-full rounded-full transition-none"
        style={{ width: `${width}%`, ...bgStyle }}
      />
    </div>
  );
}

/* ───── main component ───── */
export function ProjectOverview({
  eyebrow = "لوحة التحكم",
  title = "كل مشاريعك",
  titleAccent = "في نظرة واحدة",
  description = "لوحة تحكم احترافية تعطيك صورة كاملة عن جميع مشاريعك، وحداتك، وعملاءك — محدّثة لحظياً.",
  checkItems = [
    {
      bold: "إدارة مشاريع متعددة",
      detail: " — فيلات، شقق، تجاري من لوحة واحدة",
    },
    { bold: "تتبع نسبة الإنجاز", detail: " لكل مشروع ولكل مرحلة بدقة" },
    { bold: "توثيق بالصور والفيديو", detail: " — يراها العميل فور رفعها" },
    { bold: "سحابي 100%", detail: " — من أي جهاز وأي مكان بدون تثبيت" },
  ],
  linkLabel = "ادخل لوحة التحكم",
  linkHref = "https://platform.aysar.sa/",
}: ProjectOverviewProps) {
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
          {/* ---------- left text ---------- */}
          <div className="order-1">
            <motion.div
              className="eyebrow"
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
            >
              {eyebrow}
            </motion.div>

            <motion.h2
              className="text-[clamp(28px,4vw,48px)] font-bold text-text leading-[1.15] tracking-tight mb-4"
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.1 }}
            >
              {title}
              <br />
              <span className="text-indigo">{titleAccent}</span>
            </motion.h2>

            <motion.p
              className="text-[17px] text-muted leading-[1.75] max-w-[560px] mb-7"
              variants={textVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              transition={{ delay: 0.2 }}
            >
              {description}
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
                      stroke="#08335D"
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
                href={linkHref}
                target="_blank"
                className="inline-flex items-center gap-1.5 text-sm font-bold text-navy border-b-2 border-navy pb-1 hover:text-indigo hover:border-indigo transition-colors duration-150"
              >
                {linkLabel}
              </Link>
            </motion.div>
          </div>

          {/* ---------- right mockup ---------- */}
          <div className="order-2">
            <motion.div
              className="bg-[#f4f6fb] border border-border rounded-[20px] p-5"
              initial={{ opacity: 0, x: 30 }}
              animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 30 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
            >
              {/* top bar */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-[13px] font-bold text-[#08335D]">
                  كل المشاريع
                </span>
                <div className="flex items-center gap-1.5">
                  <span className="bg-white border border-[#e0e6ef] rounded-md px-2.5 py-1 text-[10px] text-muted">
                    ترتيب ▾
                  </span>
                  <span className="bg-[#08335D] rounded-md px-2.5 py-1 text-[10px] text-white font-semibold">
                    + مشروع جديد
                  </span>
                </div>
              </div>

              {/* cards */}
              <div className="flex flex-col gap-3">
                {projects.map((project, idx) => {
                  const phaseBgLight =
                    project.phaseColor === "#b45309"
                      ? "bg-[#fffbeb]"
                      : "bg-[#f0faf4]";
                  const phaseBorder =
                    project.phaseColor === "#b45309"
                      ? "border-[rgba(245,158,11,0.2)]"
                      : "border-[rgba(40,201,40,0.2)]";

                  return (
                    <motion.div
                      key={idx}
                      className="bg-white border border-[#e8ecf4] rounded-[16px] overflow-hidden"
                      style={{
                        boxShadow: "rgba(8, 51, 93, 0.05) 0px 2px 12px",
                      }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={
                        isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: 20 }
                      }
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
                      {/* ── image header ── */}
                      <div className="relative h-[110px] overflow-hidden">
                        <Image
                          src={project.imageUrl}
                          alt={project.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 560px"
                        />
                        <div
                          className="absolute inset-0"
                          style={{
                            background:
                              "linear-gradient(to bottom, rgba(0,0,0,0) 40%, rgba(8,51,93,0.75) 100%)",
                          }}
                        />

                        {/* circular progress badge */}
                        <div
                          className="absolute top-2.5 left-2.5 w-[46px] h-[46px] rounded-full flex flex-col items-center justify-center border-2"
                          style={{
                            background: "rgba(0,0,0,0.45)",
                            backdropFilter: "blur(6px)",
                            borderColor: project.progressColor,
                          }}
                        >
                          <span
                            className="text-[11px] font-extrabold leading-[1]"
                            style={{ color: project.progressColor }}
                          >
                            {project.progress}%
                          </span>
                          <span className="text-[7px] text-white/65">
                            إنجاز
                          </span>
                        </div>

                        {/* title overlay */}
                        <div className="absolute bottom-2 right-2.5 left-[60px]">
                          <div className="text-[13px] font-bold text-white">
                            {project.name}
                          </div>
                          <div className="text-[10px] text-white/70">
                            {project.location} · {project.units}
                          </div>
                        </div>
                      </div>

                      {/* ── bottom details ── */}
                      <div className="px-3.5 py-3">
                        {/* progress bar */}
                        <div className="mb-2.5">
                          <AnimatedProgress
                            targetPercentage={project.progress}
                            gradient={project.progressGradient}
                            delay={200 + idx * 150}
                          />
                        </div>

                        {/* phase cards grid */}
                        <div className="grid grid-cols-2 gap-2">
                          {/* current phase */}
                          <div
                            className={`${phaseBgLight} border ${phaseBorder} rounded-lg px-2.5 py-1.5`}
                          >
                            <div
                              className="text-[9px] font-bold tracking-[0.4px] mb-0.5 flex items-center gap-1"
                              style={{ color: project.phaseColor }}
                            >
                              <CheckCircleIcon fill={project.progressColor} />
                              المرحلة الحالية
                            </div>
                            <div className="text-[11px] font-semibold text-[#08335D]">
                              {project.currentPhase}
                            </div>
                          </div>

                          {/* next phase */}
                          <div className="bg-[#f0f4ff] border border-[rgba(8,51,93,0.12)] rounded-lg px-2.5 py-1.5">
                            <div className="text-[9px] font-bold text-[#08335D] tracking-[0.4px] mb-0.5 flex items-center gap-1">
                              <ClockCircleIcon stroke="#08335D" />
                              المرحلة القادمة
                            </div>
                            <div className="text-[11px] font-semibold text-[#08335D]">
                              {project.nextPhase}
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
