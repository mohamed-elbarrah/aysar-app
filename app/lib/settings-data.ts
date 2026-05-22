import { prisma } from "@/app/lib/db";
import { SITE_SETTINGS, NAV_LINKS, SOCIAL_LINKS } from "@/app/lib/dashboard/placeholders";

const APP_LINKS_DEFAULTS = {
  appStoreUrl: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone",
  googlePlayUrl: "https://play.google.com/store/apps/details?id=com.aysar.application",
};

export interface NavLink { label: string; href: string }
export interface SocialInfo { xUrl: string; instagramUrl: string; tiktokUrl: string; whatsappNumber: string }
export interface AppLinkInfo { appStoreUrl: string; googlePlayUrl: string }
export interface FooterLinkItem { label: string; href: string; external?: boolean }

export interface SiteSettingsResponse {
  id: string;
  siteTitle: string;
  siteDescription: string;
  faviconUrl: string | null;
  seoKeywords: string;
  navLinks: NavLink[];
  socialLinks: SocialInfo;
  appLinks: AppLinkInfo;
  footerCopyright: string;
  footerTagline: string;
  footerQuickLinks: FooterLinkItem[];
  footerHelpLinks: FooterLinkItem[];
  updatedAt: string;
}

const FOOTER_COPYRIGHT = "© 2026 مؤسسة أيسر المتطورة لتقنية المعلومات · رقم السجل التجاري: 4030620045";
const FOOTER_TAGLINE = "أيسَر برنامج لإدارة العقارات وتتبع مراحل الإنشاء من أول طوبة لآخر لمسة.";
const FOOTER_QUICK: FooterLinkItem[] = [
  { label: "الرئيسية", href: "/" }, { label: "الأسعار", href: "/plans" }, { label: "اتصل بنا", href: "/contact" },
];
const FOOTER_HELP: FooterLinkItem[] = [
  { label: "تسجيل دخول", href: "https://platform.aysar.sa/ar/company/dashboard/login", external: true },
  { label: "مركز المساعدة", href: "https://support.aysar.sa/", external: true },
  { label: "التحديثات", href: "https://support.aysar.sa/page/update", external: true },
  { label: "سياسة الخصوصية", href: "/privacy-policy" },
  { label: "شروط الاستخدام", href: "/terms-of-use" },
  { label: "سياسة الاسترجاع", href: "/return-policy" },
];

export async function getSiteSettings(): Promise<SiteSettingsResponse> {
  let row = await prisma.siteSettings.findUnique({ where: { id: "SETTINGS" } });

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
      footerCopyright: FOOTER_COPYRIGHT,
      footerTagline: FOOTER_TAGLINE,
      footerQuickLinks: FOOTER_QUICK,
      footerHelpLinks: FOOTER_HELP,
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    id: row.id,
    siteTitle: row.siteTitle,
    siteDescription: row.siteDescription,
    faviconUrl: row.faviconUrl,
    seoKeywords: row.seoKeywords,
    navLinks: row.navLinks as NavLink[],
    socialLinks: row.socialLinks as SocialInfo,
    appLinks: row.appLinks as AppLinkInfo,
    footerCopyright: row.footerCopyright,
    footerTagline: row.footerTagline,
    footerQuickLinks: row.footerQuickLinks as FooterLinkItem[],
    footerHelpLinks: row.footerHelpLinks as FooterLinkItem[],
    updatedAt: row.updatedAt.toISOString(),
  };
}
