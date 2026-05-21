"use client";

import { useState } from "react";
import { BillingPeriod, PLANS, COMPARE_ROWS, FAQ_ITEMS } from "@/lib/plans-data";
import { PlansHeroSection } from "@/app/components/PlansHeroSection";
import { PricingToggle } from "@/app/components/PricingToggle";
import { PricingCard } from "@/app/components/PricingCard";
import { CompareTable } from "@/app/components/CompareTable";
import { Accordion } from "@/app/components/ui/Accordion";
import { Section } from "@/app/components/Section";
import CTASection from "@/app/sections/CTASection";

export default function PlansPageContent() {
  const [billing, setBilling] = useState<BillingPeriod>("monthly");

  return (
    <>
      <PlansHeroSection
        badge="الأسعار والباقات"
        title="اختر الباقة"
        titleAccent="المناسبة لك"
        subtitle="باقات مرنة تساعدك على إدارة مشاريعك العقارية بكفاءة عالية — ابدأ مجاناً وطوّر متى تريد."
        toggle={<PricingToggle billing={billing} onChange={setBilling} />}
      />

      <Section className="bg-[#f7f8fa] !pt-16 !pb-24">
        <div className="plans-grid max-w-[1140px] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
          {PLANS.map((plan, index) => (
            <PricingCard key={plan.id} plan={plan} billing={billing} />
          ))}
        </div>
      </Section>

      <CompareTable
        title="قارن بين الباقات"
        subtitle="تفاصيل دقيقة لكل ما ستحصل عليه"
        rows={COMPARE_ROWS}
      />

      <Accordion
        title="أسئلة شائعة"
        subtitle="كل ما تريد معرفته عن باقات أيسَر"
        items={FAQ_ITEMS}
      />

      <CTASection
        variant="dark"
        title="جاهز تبدأ مع أيسَر؟"
        subtitle="انضم لمطورين عقاريين يستخدمون أيسَر لتوفير الوقت ورفع مستوى تجربة عملائهم."
        primaryCta={{
          label: "ابدأ مجاناً الآن",
          href: "https://platform.aysar.sa/ar/company/dashboard/register",
        }}
        secondaryCta={{
          label: "تواصل على واتساب",
          href: "http://wa.me/966125101107",
        }}
        note="لا بطاقة ائتمان · فريقنا يتواصل معك خلال 24 ساعة"
      />
    </>
  );
}
