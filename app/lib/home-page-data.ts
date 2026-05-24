import { supabase } from "@/app/lib/db";
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
  const { data: page } = await supabase
    .from("home_page")
    .select("*")
    .eq("id", "HOME")
    .single();

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
    featureSections: page.feature_sections as HomePageResponse["featureSections"],
    bentoFeatures: page.bento_features as HomePageResponse["bentoFeatures"],
    projectOverview: page.project_overview as HomePageResponse["projectOverview"],
    appSection: page.app_section as HomePageResponse["appSection"],
    ctaSection: page.cta_section as HomePageResponse["ctaSection"],
    updatedAt: page.updated_at,
  };
}