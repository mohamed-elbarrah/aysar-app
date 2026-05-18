"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Bell,
  Globe,
  Users,
  Smartphone,
  ImageIcon,
  Cloud,
  LayoutGrid,
  MessageCircle,
} from "lucide-react";

interface GridFeature {
  icon: React.ElementType;
  title: string;
  description: string;
  iconBg: string;
  iconColor: string;
}

const features: GridFeature[] = [
  {
    icon: Bell,
    title: "إشعارات لحظية",
    description: "عند كل تحديث للمراحل",
    iconBg: "#e9f9f0",
    iconColor: "#1a9a5a",
  },
  {
    icon: Globe,
    title: "صفحات هبوط",
    description: "برابط خاص لكل مشروع",
    iconBg: "#eef2ff",
    iconColor: "#4f46e5",
  },
  {
    icon: Users,
    title: "نظام CRM",
    description: "إدارة العملاء والمبيعات",
    iconBg: "#f0f4ff",
    iconColor: "#2d2e83",
  },
  {
    icon: Smartphone,
    title: "تطبيق مخصص",
    description: "iOS و Android للعملاء",
    iconBg: "#fff7ed",
    iconColor: "#f97316",
  },
  {
    icon: ImageIcon,
    title: "صور وفيديو",
    description: "توثيق المراحل من الموقع",
    iconBg: "#fdf2f8",
    iconColor: "#ec4899",
  },
  {
    icon: Cloud,
    title: "سحابي 100%",
    description: "بدون تثبيت أو خوادم",
    iconBg: "#e7fafd",
    iconColor: "#06b6d4",
  },
  {
    icon: LayoutGrid,
    title: "مشاريع متعددة",
    description: "فيلات، شقق، تجاري",
    iconBg: "#f3eefe",
    iconColor: "#8b5cf6",
  },
  {
    icon: MessageCircle,
    title: "دعم فني 7/24",
    description: "واتساب أو بريد إلكتروني",
    iconBg: "#fff8e8",
    iconColor: "#f59e0b",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export function FeaturesGrid() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="bg-bg-alt">
      <div className="section-aysar" ref={ref}>
        <div className="container-aysar text-center">
          <motion.p
            className="text-sm font-semibold text-muted mb-4"
            initial={{ opacity: 0, y: 10 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
            transition={{ duration: 0.5 }}
          >
            والكثير من المميزات
          </motion.p>

          <motion.h2
            className="text-[clamp(22px,3vw,36px)] font-bold text-navy mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            كل أدوات المطور العقاري{" "}
            <span className="text-indigo">في مكان واحد</span>
          </motion.h2>

          <motion.div
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4"
            variants={containerVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
          >
            {features.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  whileHover={{
                    y: -3,
                    boxShadow: "0 12px 32px rgba(12,41,84,0.08)",
                    transition: { duration: 0.25 },
                  }}
                  className="bg-white border border-border rounded-[14px] p-5 lg:p-6 text-center flex flex-col items-center"
                >
                  <div
                    className="w-12 h-12 rounded-[13px] flex items-center justify-center mb-3.5"
                    style={{ backgroundColor: feat.iconBg }}
                  >
                    <Icon
                      className="w-5 h-5"
                      strokeWidth={1.8}
                      style={{ color: feat.iconColor }}
                    />
                  </div>
                  <h3 className="text-sm font-bold text-text mb-1.5">
                    {feat.title}
                  </h3>
                  <p className="text-xs text-muted leading-relaxed">
                    {feat.description}
                  </p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
