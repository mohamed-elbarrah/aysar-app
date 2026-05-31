"use client";

import { useState } from "react";
import { BillingPeriod } from "@/lib/plans-data";
import { PlansHeroSection } from "@/app/components/PlansHeroSection";
import { PricingToggle } from "@/app/components/PricingToggle";
import { PricingCard } from "@/app/components/PricingCard";
import { CompareTable } from "@/app/components/CompareTable";
import { Accordion } from "@/app/components/ui/Accordion";
import { Section } from "@/app/components/Section";
import CTASection from "@/app/sections/CTASection";
import type { PlansPageResponse } from "@/app/lib/plans-page-data";
import type { PlatformLinks, ContactInfo as SiteContactInfo } from "@/app/lib/settings-data";

interface Props {
  data: PlansPageResponse;
  platformLinks: PlatformLinks;
  contactInfo: SiteContactInfo;
}

export default function PlansPageContent({ data, platformLinks, contactInfo }: Props) {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");
  const { hero, plans, compareRows, faqItems } = data;

  return (
    <>
      <PlansHeroSection
        badge={hero.badge}
        title={hero.title}
        titleAccent={hero.titleAccent}
        accentColor={hero.accentColor}
        accentOpacity={hero.accentOpacity}
        subtitle={hero.subtitle}
        toggle={<PricingToggle billing={billing} onChange={setBilling} yearlyDiscountPercent={data.yearlyDiscountPercent ?? 15} />}
      />

      <Section className="bg-[#f7f8fa] !pt-16 !pb-24">
        <div className="plans-grid max-w-[1140px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {plans.map((plan) => (
            <PricingCard key={plan.id} plan={plan} billing={billing} />
          ))}
        </div>
      </Section>

      <CompareTable
        title="قارن بين الباقات"
        subtitle="تفاصيل دقيقة لكل ما ستحصل عليه"
        data={compareRows}
      />

      <Accordion
        title="أسئلة شائعة"
        subtitle="كل ما تريد معرفته عن باقات أيسَر"
        items={faqItems}
      />

      <CTASection
        variant="dark"
        title="جاهز تبدأ مع أيسَر؟"
        subtitle="انضم لمطورين عقاريين يستخدمون أيسَر لتوفير الوقت ورفع مستوى تجربة عملائهم."
        primaryCta={{
          label: "ابدأ مجاناً الآن",
          href: platformLinks.registerUrl,
        }}
        secondaryCta={{
          label: "تواصل على واتساب",
          href: `https://wa.me/${contactInfo.whatsappNumber}`,
        }}
        note="لا بطاقة ائتمان · فريقنا يتواصل معك خلال 24 ساعة"
      />
    </>
  );
}