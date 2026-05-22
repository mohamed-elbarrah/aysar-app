import { prisma } from "@/app/lib/db";
import { SITE_SETTINGS, NAV_LINKS, SOCIAL_LINKS, APP_LINKS_DEFAULTS, DEFAULT_FOOTER_COLUMNS } from "@/app/lib/dashboard/placeholders";

export interface NavLink { label: string; href: string }
export interface SocialInfo { xUrl: string; instagramUrl: string; tiktokUrl: string; whatsappNumber: string }
export interface AppLinkInfo { appStoreUrl: string; googlePlayUrl: string }
export interface FooterLinkItem { label: string; href: string; external?: boolean }
export interface FooterColumn {
  type: "brand" | "links";
  title: string;
  links?: FooterLinkItem[];
  tagline?: string;
  copyright?: string;
}

export interface SiteSettingsResponse {
  id: string;
  siteTitle: string;
  siteDescription: string;
  faviconUrl: string | null;
  seoKeywords: string;
  navLinks: NavLink[];
  socialLinks: SocialInfo;
  appLinks: AppLinkInfo;
  footerColumns: FooterColumn[];
  updatedAt: string;
}

function safeJsonArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : [...fallback];
}

export async function getSiteSettings(): Promise<SiteSettingsResponse> {
  const row = await prisma.siteSettings.findUnique({ where: { id: "SETTINGS" } });

  if (!row) {
    return {
      id: "SETTINGS",
      siteTitle: SITE_SETTINGS.siteTitle,
      siteDescription: SITE_SETTINGS.siteDescription,
      faviconUrl: SITE_SETTINGS.faviconUrl,
      seoKeywords: SITE_SETTINGS.seoKeywords,
      navLinks: [...NAV_LINKS],
      socialLinks: { ...SOCIAL_LINKS },
      appLinks: { ...APP_LINKS_DEFAULTS },
      footerColumns: [...DEFAULT_FOOTER_COLUMNS],
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    id: row.id,
    siteTitle: row.siteTitle,
    siteDescription: row.siteDescription,
    faviconUrl: row.faviconUrl,
    seoKeywords: row.seoKeywords,
    navLinks: safeJsonArray<NavLink>(row.navLinks, NAV_LINKS),
    socialLinks: (row.socialLinks && typeof row.socialLinks === "object" && !Array.isArray(row.socialLinks)
      ? row.socialLinks
      : SOCIAL_LINKS) as unknown as SocialInfo,
    appLinks: (row.appLinks && typeof row.appLinks === "object" && !Array.isArray(row.appLinks)
      ? row.appLinks
      : APP_LINKS_DEFAULTS) as unknown as AppLinkInfo,
    footerColumns: safeJsonArray<FooterColumn>(row.footerColumns, DEFAULT_FOOTER_COLUMNS),
    updatedAt: row.updatedAt.toISOString(),
  };
}