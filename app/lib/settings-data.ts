import { prisma } from "@/app/lib/db";
import { SITE_SETTINGS, NAV_LINKS, SOCIAL_LINKS, APP_LINKS_DEFAULTS, DEFAULT_FOOTER_COLUMNS, SITE_CONTACT_INFO, PLATFORM_LINKS, WORK_HOURS } from "@/app/lib/dashboard/placeholders";

export interface NavLink { label: string; href: string }
export interface SocialLink { key: string; label: string; url: string; iconUrl?: string }
export interface AppLinkInfo { appStoreUrl: string; googlePlayUrl: string }
export interface FooterLinkItem { label: string; href: string; external?: boolean }
export interface FooterColumn {
  type: "brand" | "links";
  title: string;
  links?: FooterLinkItem[];
  tagline?: string;
  copyright?: string;
}

export interface ContactInfo {
  phone: string;
  email: string;
  legalEmail: string;
  whatsappNumber: string;
  location: string;
}

export interface PlatformLinks {
  loginUrl: string;
  registerUrl: string;
  supportCenterUrl: string;
}

export interface WorkHours {
  days: string;
  time: string;
}

export interface SiteSettingsResponse {
  id: string;
  siteTitle: string;
  siteDescription: string;
  faviconUrl: string | null;
  seoKeywords: string;
  navLinks: NavLink[];
  socialLinks: SocialLink[];
  appLinks: AppLinkInfo;
  footerColumns: FooterColumn[];
  contactInfo: ContactInfo;
  platformLinks: PlatformLinks;
  workHours: WorkHours;
  updatedAt: string;
}

function safeJsonArray<T>(value: unknown, fallback: T[]): T[] {
  return Array.isArray(value) ? (value as T[]) : [...fallback];
}

function safeJsonField<T>(value: unknown, fallback: T): T {
  if (value && typeof value === "object" && !Array.isArray(value)) return value as T;
  return { ...fallback };
}

function normalizeSocialLinks(raw: unknown): SocialLink[] {
  if (Array.isArray(raw)) return raw as SocialLink[];
  if (raw && typeof raw === "object") {
    const old = raw as Record<string, string>;
    const links: SocialLink[] = [];
    if (old.xUrl) links.push({ key: "x", label: "X (Twitter)", url: old.xUrl });
    if (old.instagramUrl) links.push({ key: "instagram", label: "Instagram", url: old.instagramUrl });
    if (old.tiktokUrl) links.push({ key: "tiktok", label: "TikTok", url: old.tiktokUrl });
    if (links.length > 0) return links;
  }
  return [...SOCIAL_LINKS];
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
      socialLinks: [...SOCIAL_LINKS],
      appLinks: { ...APP_LINKS_DEFAULTS },
      footerColumns: [...DEFAULT_FOOTER_COLUMNS],
      contactInfo: { ...SITE_CONTACT_INFO },
      platformLinks: { ...PLATFORM_LINKS },
      workHours: { ...WORK_HOURS },
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
    socialLinks: normalizeSocialLinks(row.socialLinks),
    appLinks: (row.appLinks && typeof row.appLinks === "object" && !Array.isArray(row.appLinks)
      ? row.appLinks
      : APP_LINKS_DEFAULTS) as unknown as AppLinkInfo,
    footerColumns: safeJsonArray<FooterColumn>(row.footerColumns, DEFAULT_FOOTER_COLUMNS),
    contactInfo: safeJsonField<ContactInfo>(row.contactInfo, SITE_CONTACT_INFO),
    platformLinks: safeJsonField<PlatformLinks>(row.platformLinks, PLATFORM_LINKS),
    workHours: safeJsonField<WorkHours>(row.workHours, WORK_HOURS),
    updatedAt: row.updatedAt.toISOString(),
  };
}