"use client";

import { BillingPeriod } from "@/lib/plans-data";

interface PricingToggleProps {
  billing: BillingPeriod;
  onChange: (period: BillingPeriod) => void;
}

export function PricingToggle({ billing, onChange }: PricingToggleProps) {
  return (
    <div className="billing-toggle fade-up anim-delay-3">
      <button
        className={`billing-btn ${billing === "monthly" ? "active" : ""}`}
        onClick={() => onChange("monthly")}
      >
        شهري
      </button>
      <button
        className={`billing-btn ${billing === "yearly" ? "active" : ""}`}
        onClick={() => onChange("yearly")}
      >
        سنوي
        <span className="save-badge mr-[6px]">وفّر 15%</span>
      </button>
    </div>
  );
}
