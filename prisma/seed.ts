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
import { APP_LINKS_DEFAULTS, DEFAULT_FOOTER_COLUMNS } from "../app/lib/dashboard/placeholders";

const PLANS_HERO = { badge: "الأسعار والباقات", title: "اختر الباقة", titleAccent: "المناسبة لك", subtitle: "باقات مرنة تساعدك على إدارة مشاريعك العقارية بكفاءة عالية — ابدأ مجاناً وطوّر متى تريد." };
const FORM_FIELDS_DEFAULTS = { name: true, phone: true, email: true, type: true, message: true };
const SUCCESS_MESSAGE_DEFAULT = "تم إرسال رسالتك بنجاح! سنتواصل معك خلال 24 ساعة.";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const passwordHash = await bcrypt.hash("admin123", 12);
  await prisma.user.upsert({ where: { email: "admin@aysar.sa" }, update: {}, create: { email: "admin@aysar.sa", passwordHash, name: "مدير النظام", role: "ADMIN" } });

  await prisma.homePage.deleteMany();
  await prisma.homePage.create({ data: { id: "HOME", hero: HOME_HERO as any, featureSections: FEATURE_SECTIONS as any, bentoFeatures: BENTO_FEATURES as any, projectOverview: PROJECT_OVERVIEW as any, appSection: APP_SECTION as any, ctaSection: CTA_SECTION as any } });

  await prisma.plansPage.deleteMany();
  await prisma.plansPage.create({ data: { id: "PLANS", hero: PLANS_HERO as any, plans: PLANS as any, compareRows: COMPARE_ROWS as any, faqItems: FAQ_ITEMS as any } });

  await prisma.contactPage.deleteMany();
  await prisma.contactPage.create({ data: { id: "CONTACT", hero: CONTACT_HERO as any, contactInfo: CONTACT_INFO as any, channels: CHANNELS as any, inquiryOptions: INQUIRY_OPTIONS as any, successMessage: SUCCESS_MESSAGE_DEFAULT, formFields: FORM_FIELDS_DEFAULTS as any } });

  await prisma.policies.deleteMany();
  await prisma.policies.create({ data: { id: "POLICIES", privacy: PRIVACY_POLICY as any, terms: TERMS_OF_USE as any, returns: RETURN_POLICY as any } });

  await prisma.siteSettings.deleteMany();
  await prisma.siteSettings.create({ data: { id: "SETTINGS", siteTitle: SITE_SETTINGS.siteTitle, siteDescription: SITE_SETTINGS.siteDescription, faviconUrl: SITE_SETTINGS.faviconUrl, seoKeywords: SITE_SETTINGS.seoKeywords, navLinks: NAV_LINKS as any, socialLinks: SOCIAL_LINKS as any, appLinks: APP_LINKS_DEFAULTS as any, footerColumns: DEFAULT_FOOTER_COLUMNS as any } });

  console.log("Seed complete: all tables populated");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });