import { Plan, BillingPeriod } from "@/lib/plans-data";

function CheckIcon() {
  return (
    <div className="check-icon-plan">
      <svg viewBox="0 0 12 12" fill="none" className="w-[10px] h-[10px]">
        <path d="M2 6l3 3 5-5" stroke="#1a9a5a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

function CrossIcon() {
  return (
    <div className="cross-icon-plan">
      <svg viewBox="0 0 12 12" fill="none" className="w-[8px] h-[8px]">
        <path d="M3 3l6 6M9 3L3 9" stroke="#d0d5dd" strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    </div>
  );
}

interface PricingCardProps {
  plan: Plan;
  billing: BillingPeriod;
}

export function PricingCard({ plan, billing }: PricingCardProps) {
  const isYearly = billing === "yearly";
  const displayPrice = plan.isFree
    ? null
    : isYearly
      ? plan.priceYearly
      : plan.priceMonthly;
  const monthlyEquiv = plan.isFree || !isYearly
    ? null
    : Math.round((plan.priceYearly ?? 0) / 12);

  return (
    <div className={`plan-card fade-up ${plan.isFeatured ? "featured" : ""}`}>
      {plan.isFeatured && <div className="featured-badge-label">الأكثر رواجاً</div>}

      <div className="pt-7 px-7 pb-5">
        <div className="text-[22px] font-bold text-text mb-1">{plan.name}</div>
        <div className="text-[13px] text-muted mb-6">{plan.description}</div>

        {plan.isFree ? (
          <>
            <div className="plan-price-free">مجاناً</div>
            <div className="text-[12px] text-muted mt-2">بدون بطاقة ائتمان</div>
          </>
        ) : (
          <>
            <div className="plan-price">
              <span className="text-[18px] font-semibold text-muted mb-0.5">ر.س</span>
              <span className="text-[44px] font-bold text-text tracking-tight leading-none">
                {displayPrice?.toLocaleString("en-US")}
              </span>
              <span className="text-[13px] text-muted mr-1">
                {isYearly ? "/ سنوياً" : "/ شهرياً"}
              </span>
            </div>
            <div className="text-[12px] text-muted mt-1">شامل الضريبة</div>
            {isYearly && monthlyEquiv && (
              <div className="text-[12px] text-muted mt-1">
                يعادل <span className="text-green font-semibold">{monthlyEquiv.toLocaleString("en-US")}</span> ر.س شهرياً · <span className="text-green font-bold">وفّر 15%</span>
              </div>
            )}
          </>
        )}
      </div>

      <a
        href={plan.ctaHref}
        target="_blank"
        rel="noopener noreferrer"
        className={`block text-center font-bold text-[15px] py-[13px] px-7 rounded-[11px] no-underline mx-7 mb-6 transition-all duration-200 ${
          plan.isFeatured
            ? "bg-gradient-to-br from-navy to-indigo text-white shadow-[0_4px_16px_rgba(45,46,131,0.3)] hover:opacity-92 hover:-translate-y-px"
            : "bg-[#f7f8fa] text-navy border-2 border-border hover:bg-[#e8edf5]"
        }`}
      >
        {plan.ctaLabel}
      </a>

      <div className="h-px bg-border mx-7 mb-5" />

      <div className="px-7 pb-7 flex flex-col gap-[11px]">
        <div className="text-[11px] font-bold text-muted tracking-wide mb-1">
          {plan.featuresTitle}
        </div>
        {plan.features.map((feature, i) => (
          <div key={i} className={`feature-row ${!feature.enabled ? "disabled" : ""}`}>
            {feature.soon ? (
              <>
                <span className="soon-badge-plan">قريباً</span>
                {feature.text}
              </>
            ) : feature.enabled ? (
              <>
                <CheckIcon />
                {feature.text}
              </>
            ) : (
              <>
                <CrossIcon />
                {feature.text}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
