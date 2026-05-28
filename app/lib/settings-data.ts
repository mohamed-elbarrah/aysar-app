import { supabase } from "@/app/lib/db";
import { SITE_SETTINGS, NAV_LINKS, SOCIAL_LINKS, APP_LINKS_DEFAULTS, DEFAULT_FOOTER_COLUMNS, SITE_CONTACT_INFO, PLATFORM_LINKS, WORK_HOURS } from "@/app/lib/dashboard/placeholders";
import { type ScriptRecord, type ExtractedMeta, parseJsonScripts, extractMetaFromScripts } from "@/app/lib/scripts";

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
  scripts: ScriptRecord[];
  extractedMeta: ExtractedMeta;
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
  const { data: row } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "SETTINGS")
    .single();

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
      scripts: [],
      extractedMeta: {},
      updatedAt: new Date().toISOString(),
    };
  }

    const scripts = parseJsonScripts(row.scripts);
    const extractedMeta = extractMetaFromScripts(scripts);

    return {
      id: row.id,
      siteTitle: row.site_title,
      siteDescription: row.site_description,
      faviconUrl: row.favicon_url,
      seoKeywords: row.seo_keywords,
      navLinks: safeJsonArray<NavLink>(row.nav_links, NAV_LINKS),
      socialLinks: normalizeSocialLinks(row.social_links),
      appLinks: (row.app_links && typeof row.app_links === "object" && !Array.isArray(row.app_links)
        ? row.app_links
        : APP_LINKS_DEFAULTS) as unknown as AppLinkInfo,
      footerColumns: safeJsonArray<FooterColumn>(row.footer_columns, DEFAULT_FOOTER_COLUMNS),
      contactInfo: safeJsonField<ContactInfo>(row.contact_info, SITE_CONTACT_INFO),
      platformLinks: safeJsonField<PlatformLinks>(row.platform_links, PLATFORM_LINKS),
      workHours: safeJsonField<WorkHours>(row.work_hours, WORK_HOURS),
      scripts,
      extractedMeta,
      updatedAt: row.updated_at,
    };
}