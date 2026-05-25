import HeroSection from "../sections/HeroSection";
import CTASection from "../sections/CTASection";
import { FeatureSection } from "../components/FeatureSection";
import { DashboardMockup } from "../components/DashboardMockup";
import { StagesMockup } from "../components/StagesMockup";
import { MaintenanceMockup } from "../components/MaintenanceMockup";
import { BookingsMockup } from "../components/BookingsMockup";
import { TemplatesMockup } from "../components/TemplatesMockup";
import { FeaturesGrid } from "../sections/FeaturesGrid";
import { ProjectOverview } from "../sections/ProjectOverview";
import { AppSection } from "../sections/AppSection";
import { getHomePageData } from "../lib/home-page-data";

export const dynamic = "force-dynamic";

const MOCKUPS = [
  <StagesMockup key="stages" />,
  <MaintenanceMockup key="maintenance" />,
  <BookingsMockup key="bookings" />,
  <TemplatesMockup key="templates" />,
];

const FEATURE_BG_COLORS = ["bg-white", "bg-[#f7f8fa]", "bg-white", "bg-[#f7f8fa]"];
const FEATURE_BADGE_BG_COLORS = ["#f0f4ff", "#feeeee", "#fff7ed", "#fff7ed"];

export default async function Home() {
  const data = await getHomePageData();
  const { hero, featureSections, bentoFeatures, projectOverview, appSection, ctaSection } = data;

  return (
    <>
      <HeroSection
        badge={hero.badge ?? undefined}
        title={hero.title}
        titleAccent={hero.titleAccent ?? undefined}
        accentColor={hero.accentColor ?? undefined}
        accentOpacity={hero.accentOpacity ?? undefined}
        subtitle={hero.subtitle}
        primaryCta={
          hero.primaryCtaLabel
            ? { label: hero.primaryCtaLabel, href: hero.primaryCtaHref || "#" }
            : undefined
        }
        secondaryCta={
          hero.secondaryCtaLabel
            ? { label: hero.secondaryCtaLabel, href: hero.secondaryCtaHref || "#" }
            : undefined
        }
      >
        <DashboardMockup />
      </HeroSection>

      <div id="features">
        {featureSections.map((section, idx) => (
          <FeatureSection
            key={idx}
            eyebrow={section.eyebrow}
            title={section.title}
            titleAccent={section.titleAccent ?? ""}
            description={section.description}
            features={section.features.map((text: string) => ({
              iconColor: section.accentColor,
              text,
            }))}
            mockup={MOCKUPS[idx]}
            layout={section.layout as "text-left" | "text-right"}
            bgColor={FEATURE_BG_COLORS[idx]}
            accentColor={section.accentColor}
            badgeBgColor={FEATURE_BADGE_BG_COLORS[idx]}
          />
        ))}
      </div>

      <FeaturesGrid features={bentoFeatures} />

      <ProjectOverview
        eyebrow={projectOverview.eyebrow}
        title={projectOverview.title}
        titleAccent={projectOverview.titleAccent}
        description={projectOverview.description}
        checkItems={projectOverview.checkItems}
        linkLabel={projectOverview.linkLabel}
        linkHref={projectOverview.linkHref}
      />

      <AppSection
        eyebrow={appSection.eyebrow}
        title={appSection.title}
        titleAccent={appSection.titleAccent}
        description={appSection.description}
        appStoreUrl={appSection.appStoreUrl}
        googlePlayUrl={appSection.googlePlayUrl}
        app_images={appSection.app_images}
      />

      <CTASection
        variant={(ctaSection.variant as "dark" | "light") || "dark"}
        title={ctaSection.title}
        subtitle={ctaSection.subtitle}
        primaryCta={
          ctaSection.primaryCtaLabel
            ? { label: ctaSection.primaryCtaLabel, href: ctaSection.primaryCtaHref || "#" }
            : undefined
        }
        secondaryCta={
          ctaSection.secondaryCtaLabel
            ? { label: ctaSection.secondaryCtaLabel, href: ctaSection.secondaryCtaHref || "#" }
            : undefined
        }
        note={ctaSection.note ?? undefined}
      />
    </>
  );
}
