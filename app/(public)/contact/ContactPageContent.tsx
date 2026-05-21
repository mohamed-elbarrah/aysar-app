"use client";

import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { Badge } from "@/app/components/ui/Badge";
import { ContactInfoCard } from "@/app/components/ContactInfoCard";
import { ContactForm } from "@/app/components/ContactForm";
import { ChannelsGrid } from "@/app/components/ChannelsGrid";
import { CHANNELS } from "@/lib/contact-data";
import CTASection from "@/app/sections/CTASection";

function ContactHero() {
  return (
    <section className="relative gradient-hero pt-[130px] pb-20 px-6 lg:px-10 text-center overflow-hidden noise-overlay">
      <div className="glow-orb glow-orb-indigo w-[600px] h-[400px] -top-[80px] left-1/2 -translate-x-1/2" />
      <Container className="relative z-[1] max-w-[640px] mx-auto">
        <div className="anim-fade-in-up">
          <Badge>اتصل بنا</Badge>
        </div>
        <h1 className="text-[clamp(32px,5vw,52px)] font-bold text-white leading-[1.15] tracking-tight mb-4 anim-fade-in-up anim-delay-1">
          تواصل معنا<br />
          <span className="text-white/50">بكل سهولة</span>
        </h1>
        <p className="text-base text-white/50 leading-[1.78] anim-fade-in-up anim-delay-2">
          سواء كنت مطوراً عقارياً أو عميلاً يبحث عن دعم، نحن هنا لخدمتك والإجابة عن جميع استفساراتك.
        </p>
      </Container>
    </section>
  );
}

function ContactMain() {
  return (
    <Section className="bg-[#f7f8fa]">
      <div className="contact-inner max-w-[1100px] mx-auto">
        <ContactInfoCard />
        <ContactForm />
      </div>
    </Section>
  );
}

export default function ContactPageContent() {
  return (
    <>
      <ContactHero />
      <ContactMain />
      <ChannelsGrid
        title="قنوات التواصل المباشر"
        subtitle="تواصل معنا عبر قناتك المفضلة — نحن دائماً هنا"
        channels={CHANNELS}
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
