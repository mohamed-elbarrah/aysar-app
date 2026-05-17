"use client";

import { ReactNode } from "react";
import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

interface FeatureSectionProps {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  features: { iconColor: string; text: string }[];
  mockup: ReactNode;
  layout: "text-left" | "text-right";
  bgColor?: string;
  accentColor: string;
  badgeBgColor: string;
}

export function FeatureSection({
  eyebrow,
  title,
  titleAccent,
  description,
  features,
  mockup,
  layout,
  bgColor = "bg-white",
  accentColor,
  badgeBgColor,
}: FeatureSectionProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <motion.div
      ref={ref}
      className={`section-aysar ${bgColor}`}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={containerVariants}
    >
      <div
        className={`container-aysar sec-inner grid gap-8 lg:gap-16 items-center ${
          layout === "text-right"
            ? "lg:grid-cols-[1fr_1.5fr]"
            : "lg:grid-cols-[1.5fr_1fr]"
        }`}
      >
        {/* Mobile/Tablet: Always text first, mockup second */}
        {/* LG: Respect layout prop */}
        <div className="order-1 lg:hidden">
          <FeatureContent
            eyebrow={eyebrow}
            title={title}
            titleAccent={titleAccent}
            description={description}
            features={features}
            accentColor={accentColor}
            badgeBgColor={badgeBgColor}
          />
        </div>
        <motion.div className="order-2 lg:hidden" variants={itemVariants}>
          {mockup}
        </motion.div>

        {/* LG screens: Respect layout prop */}
        {layout === "text-right" ? (
          <>
            <div className="hidden lg:block">
              <FeatureContent
                eyebrow={eyebrow}
                title={title}
                titleAccent={titleAccent}
                description={description}
                features={features}
                accentColor={accentColor}
                badgeBgColor={badgeBgColor}
              />
            </div>
            <motion.div className="hidden lg:block" variants={itemVariants}>
              {mockup}
            </motion.div>
          </>
        ) : (
          <>
            <motion.div className="hidden lg:block" variants={itemVariants}>
              {mockup}
            </motion.div>
            <div className="hidden lg:block">
              <FeatureContent
                eyebrow={eyebrow}
                title={title}
                titleAccent={titleAccent}
                description={description}
                features={features}
                accentColor={accentColor}
                badgeBgColor={badgeBgColor}
              />
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
}

function FeatureContent({
  eyebrow,
  title,
  titleAccent,
  description,
  features,
  accentColor,
  badgeBgColor,
}: {
  eyebrow: string;
  title: string;
  titleAccent: string;
  description: string;
  features: { iconColor: string; text: string }[];
  accentColor: string;
  badgeBgColor: string;
}) {
  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div>
      <motion.div
        variants={itemVariants}
        className="inline-flex items-center gap-1.5 rounded-full px-3.5 py-1 text-xs font-semibold mb-5"
        style={{ backgroundColor: badgeBgColor, color: accentColor }}
      >
        {eyebrow}
      </motion.div>

      <motion.h2
        variants={itemVariants}
        className="text-[clamp(26px,3.5vw,44px)] font-bold text-navy leading-[1.18] tracking-tight mb-4"
      >
        {title}
        <br />
        <span style={{ color: accentColor }}>{titleAccent}</span>
      </motion.h2>

      <motion.p
        variants={itemVariants}
        className="text-base text-muted leading-[1.85] mb-8 max-w-[560px]"
      >
        {description}
      </motion.p>

      <div className="flex flex-col gap-3">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            variants={itemVariants}
            className="flex items-center gap-2.5"
          >
            <div
              className="w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: feature.iconColor + "20" }}
            >
              <svg
                width="11"
                height="11"
                viewBox="0 0 24 24"
                fill="none"
                stroke={feature.iconColor}
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-[15px] text-[#3a4a60]">
              <strong className="text-navy">
                {feature.text.split(" — ")[0]}
              </strong>
              {feature.text.includes(" — ")
                ? ` — ${feature.text.split(" — ")[1]}`
                : ""}
            </span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
