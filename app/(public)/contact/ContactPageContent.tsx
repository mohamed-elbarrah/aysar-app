"use client";

import { Container } from "@/app/components/Container";
import { Section } from "@/app/components/Section";
import { Badge } from "@/app/components/ui/Badge";
import { ContactInfoCard } from "@/app/components/ContactInfoCard";
import { ContactForm } from "@/app/components/ContactForm";
import { ChannelsGrid } from "@/app/components/ChannelsGrid";
import CTASection from "@/app/sections/CTASection";
import type { ContactPageResponse } from "@/app/lib/contact-page-data";
import type { ContactInfo as SettingsContactInfo, SocialLink, WorkHours, PlatformLinks } from "@/app/lib/settings-data";

interface Props {
  data: ContactPageResponse;
  contactInfo: SettingsContactInfo;
  socialLinks: SocialLink[];
  workHours?: WorkHours;
  platformLinks: PlatformLinks;
}

function ContactHero({ data }: { data: ContactPageResponse }) {
  const { hero } = data;
  return (
    <section className="relative gradient-hero pt-[130px] pb-20 px-6 lg:px-10 text-center overflow-hidden noise-overlay">
      <div className="glow-orb glow-orb-indigo w-[600px] h-[400px] -top-[80px] left-1/2 -translate-x-1/2" />
      <Container className="relative z-[1] max-w-[640px] mx-auto">
        <div className="anim-fade-in-up">
          <Badge>{hero.badge}</Badge>
        </div>
        <h1 className="text-[clamp(32px,5vw,52px)] font-bold text-white leading-[1.15] tracking-tight mb-4 anim-fade-in-up anim-delay-1">
          {hero.titleLine1}<br />
          <span className="text-white/50">{hero.titleLine2}</span>
        </h1>
        <p className="text-base text-white/50 leading-[1.78] anim-fade-in-up anim-delay-2">
          {hero.subtitle}
        </p>
      </Container>
    </section>
  );
}

function ContactMain({ data, contactInfo, socialLinks, workHours }: { data: ContactPageResponse; contactInfo: SettingsContactInfo; socialLinks: SocialLink[]; workHours?: WorkHours }) {
  return (
    <Section className="bg-[#f7f8fa]">
      <div className="contact-inner max-w-[1100px] mx-auto">
        <ContactInfoCard contactInfo={contactInfo} socialLinks={socialLinks} workHours={workHours} />
        <ContactForm inquiryOptions={data.inquiryOptions} successMessage={data.successMessage} formFields={data.formFields} thirdPartyFormScript={data.thirdPartyFormScript} formReplaced={data.formReplaced} />
      </div>
    </Section>
  );
}

export default function ContactPageContent({ data, contactInfo, socialLinks, workHours, platformLinks }: Props) {
  return (
    <>
      <ContactHero data={data} />
      <ContactMain data={data} contactInfo={contactInfo} socialLinks={socialLinks} workHours={workHours} />
      <ChannelsGrid
        title="قنوات التواصل المباشر"
        subtitle="تواصل معنا عبر قناتك المفضلة — نحن دائماً هنا"
        channels={data.channels}
        siteContactInfo={contactInfo}
        sitePlatformLinks={platformLinks}
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
