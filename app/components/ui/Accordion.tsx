"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { FAQItem } from "@/lib/plans-data";
import { Section } from "@/app/components/Section";

interface AccordionProps {
  title: string;
  subtitle: string;
  items: FAQItem[];
  className?: string;
}

export function Accordion({ title, subtitle, items, className }: AccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <Section className={cn("bg-[#F4F7FA]", className)}>
      <div className="max-w-[720px] mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-[clamp(24px,3.5vw,38px)] font-bold text-text leading-tight mb-3">
            {title}
          </h2>
          <p className="text-[16px] text-muted">{subtitle}</p>
        </div>

        {items.map((item, index) => {
          const isOpen = openIndex === index;
          return (
            <div key={index} className={cn("faq-item", isOpen && "open")}>
              <div
                className="faq-q"
                onClick={() => setOpenIndex(isOpen ? null : index)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setOpenIndex(isOpen ? null : index);
                  }
                }}
              >
                {item.question}
                <div className="faq-icon">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </div>
              </div>
              <div className="faq-a">{item.answer}</div>
            </div>
          );
        })}
      </div>
    </Section>
  );
}
