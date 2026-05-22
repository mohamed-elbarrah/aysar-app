import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import {
  HOME_HERO, FEATURE_SECTIONS, BENTO_FEATURES, PROJECT_OVERVIEW,
  APP_SECTION, CTA_SECTION, CONTACT_HERO, CONTACT_INFO, CHANNELS,
  SITE_SETTINGS, NAV_LINKS, SOCIAL_LINKS,
} from "../app/lib/dashboard/placeholders";
import { PLANS, COMPARE_ROWS, FAQ_ITEMS } from "../app/lib/dashboard/placeholders";
import { INQUIRY_OPTIONS } from "../app/lib/dashboard/placeholders";
import { PRIVACY_POLICY, TERMS_OF_USE, RETURN_POLICY } from "../app/lib/dashboard/placeholders";

const PLANS_HERO = { badge: "الأسعار والباقات", title: "اختر الباقة", titleAccent: "المناسبة لك", subtitle: "باقات مرنة تساعدك على إدارة مشاريعك العقارية بكفاءة عالية — ابدأ مجاناً وطوّر متى تريد." };
const FORM_FIELDS_DEFAULTS = { name: true, phone: true, email: true, type: true, message: true };
const SUCCESS_MESSAGE_DEFAULT = "تم إرسال رسالتك بنجاح! سنتواصل معك خلال 24 ساعة.";

const APP_LINKS_DEFAULTS = {
  appStoreUrl: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone",
  googlePlayUrl: "https://play.google.com/store/apps/details?id=com.aysar.application",
};
const FOOTER_DEFAULTS = {
  footerCopyright: "© 2026 مؤسسة أيسر المتطورة لتقنية المعلومات · رقم السجل التجاري: 4030620045",
  footerTagline: "أيسَر برنامج لإدارة العقارات وتتبع مراحل الإنشاء من أول طوبة لآخر لمسة.",
  footerQuickLinks: [
    { label: "الرئيسية", href: "/" }, { label: "الأسعار", href: "/plans" }, { label: "اتصل بنا", href: "/contact" },
  ],
  footerHelpLinks: [
    { label: "تسجيل دخول", href: "https://platform.aysar.sa/ar/company/dashboard/login" },
    { label: "مركز المساعدة", href: "https://support.aysar.sa/" },
    { label: "التحديثات", href: "https://support.aysar.sa/page/update" },
    { label: "سياسة الخصوصية", href: "/privacy-policy" },
    { label: "شروط الاستخدام", href: "/terms-of-use" },
    { label: "سياسة الاسترجاع", href: "/return-policy" },
  ],
};

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({ where: { email: "admin@aysar.sa" }, update: {}, create: { email: "admin@aysar.sa", passwordHash, name: "مدير النظام", role: "ADMIN" } });

  await prisma.homePage.deleteMany();
  await prisma.homePage.create({ data: { id: "HOME", hero: HOME_HERO, featureSections: FEATURE_SECTIONS, bentoFeatures: BENTO_FEATURES, projectOverview: PROJECT_OVERVIEW, appSection: APP_SECTION, ctaSection: CTA_SECTION } });

  await prisma.plansPage.deleteMany();
  await prisma.plansPage.create({ data: { id: "PLANS", hero: PLANS_HERO, plans: PLANS, compareRows: COMPARE_ROWS, faqItems: FAQ_ITEMS } });

  await prisma.contactPage.deleteMany();
  await prisma.contactPage.create({ data: { id: "CONTACT", hero: CONTACT_HERO, contactInfo: CONTACT_INFO, channels: CHANNELS, inquiryOptions: INQUIRY_OPTIONS, successMessage: SUCCESS_MESSAGE_DEFAULT, formFields: FORM_FIELDS_DEFAULTS } });

  await prisma.policies.deleteMany();
  await prisma.policies.create({ data: { id: "POLICIES", privacy: PRIVACY_POLICY, terms: TERMS_OF_USE, returns: RETURN_POLICY } });

  await prisma.siteSettings.deleteMany();
  await prisma.siteSettings.create({ data: { id: "SETTINGS", siteTitle: SITE_SETTINGS.siteTitle, siteDescription: SITE_SETTINGS.siteDescription, faviconUrl: SITE_SETTINGS.faviconUrl, seoKeywords: SITE_SETTINGS.seoKeywords, navLinks: NAV_LINKS, socialLinks: SOCIAL_LINKS, appLinks: APP_LINKS_DEFAULTS, ...FOOTER_DEFAULTS } });

  console.log("Seed complete: all tables populated");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
