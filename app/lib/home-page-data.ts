import { prisma } from "@/app/lib/db";
import {
  HOME_HERO,
  FEATURE_SECTIONS,
  BENTO_FEATURES,
  PROJECT_OVERVIEW,
  APP_SECTION,
  CTA_SECTION,
} from "@/app/lib/dashboard/placeholders";

export interface HomePageResponse {
  id: string;
  hero: {
    badge?: string | null;
    title: string;
    titleAccent?: string | null;
    subtitle: string;
    primaryCtaLabel?: string | null;
    primaryCtaHref?: string | null;
    secondaryCtaLabel?: string | null;
    secondaryCtaHref?: string | null;
  };
  featureSections: Array<{
    eyebrow: string;
    title: string;
    titleAccent?: string | null;
    description: string;
    features: string[];
    layout: string;
    accentColor: string;
  }>;
  bentoFeatures: Array<{
    iconName: string;
    title: string;
    description: string;
    iconBg: string;
    iconColor: string;
  }>;
  projectOverview: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    checkItems: Array<{ bold: string; detail: string }>;
    linkLabel: string;
    linkHref: string;
  };
  appSection: {
    eyebrow: string;
    title: string;
    titleAccent: string;
    description: string;
    appStoreUrl: string;
    googlePlayUrl: string;
  };
  ctaSection: {
    title: string;
    subtitle: string;
    primaryCtaLabel?: string | null;
    primaryCtaHref?: string | null;
    secondaryCtaLabel?: string | null;
    secondaryCtaHref?: string | null;
    note?: string | null;
    variant: string;
  };
  updatedAt: string;
}

export async function getHomePageData(): Promise<HomePageResponse> {
  let page = await prisma.homePage.findUnique({ where: { id: "HOME" } });

  if (!page) {
    return {
      id: "HOME",
      hero: { ...HOME_HERO },
      featureSections: [...FEATURE_SECTIONS],
      bentoFeatures: [...BENTO_FEATURES],
      projectOverview: { ...PROJECT_OVERVIEW },
      appSection: { ...APP_SECTION },
      ctaSection: { ...CTA_SECTION },
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    id: page.id,
    hero: page.hero as HomePageResponse["hero"],
    featureSections: page.featureSections as HomePageResponse["featureSections"],
    bentoFeatures: page.bentoFeatures as HomePageResponse["bentoFeatures"],
    projectOverview: page.projectOverview as HomePageResponse["projectOverview"],
    appSection: page.appSection as HomePageResponse["appSection"],
    ctaSection: page.ctaSection as HomePageResponse["ctaSection"],
    updatedAt: page.updatedAt.toISOString(),
  };
}
