import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

async function main() {
  const seedDataPath = path.resolve(__dirname, "seed-data.json");
  const raw = fs.readFileSync(seedDataPath, "utf-8");
  const data: Record<string, any[]> = JSON.parse(raw);

  const adminUser = data.users[0];
  const passwordHash = await bcrypt.hash("admin123", 12);

  await prisma.user.upsert({
    where: { email: adminUser?.email ?? "admin@aysar.sa" },
    update: {},
    create: {
      email: adminUser?.email ?? "admin@aysar.sa",
      passwordHash: adminUser?.passwordHash ?? passwordHash,
      name: adminUser?.name ?? "مدير النظام",
      role: adminUser?.role ?? "ADMIN",
    },
  });

  const homePage = data.homePages[0];
  if (homePage) {
    await prisma.homePage.upsert({
      where: { id: "HOME" },
      update: {
        hero: homePage.hero as any,
        featureSections: homePage.featureSections as any,
        bentoFeatures: homePage.bentoFeatures as any,
        projectOverview: homePage.projectOverview as any,
        appSection: homePage.appSection as any,
        ctaSection: homePage.ctaSection as any,
      },
      create: {
        id: "HOME",
        hero: homePage.hero as any,
        featureSections: homePage.featureSections as any,
        bentoFeatures: homePage.bentoFeatures as any,
        projectOverview: homePage.projectOverview as any,
        appSection: homePage.appSection as any,
        ctaSection: homePage.ctaSection as any,
      },
    });
  }

  const plansPage = data.plansPages[0];
  if (plansPage) {
    await prisma.plansPage.upsert({
      where: { id: "PLANS" },
      update: {
        hero: plansPage.hero as any,
        plans: plansPage.plans as any,
        compareRows: plansPage.compareRows as any,
        faqItems: plansPage.faqItems as any,
      },
      create: {
        id: "PLANS",
        hero: plansPage.hero as any,
        plans: plansPage.plans as any,
        compareRows: plansPage.compareRows as any,
        faqItems: plansPage.faqItems as any,
      },
    });
  }

  const contactPage = data.contactPages[0];
  if (contactPage) {
    await prisma.contactPage.upsert({
      where: { id: "CONTACT" },
      update: {
        hero: contactPage.hero as any,
        contactInfo: contactPage.contactInfo as any,
        channels: contactPage.channels as any,
        inquiryOptions: contactPage.inquiryOptions as any,
        successMessage: contactPage.successMessage,
        formFields: contactPage.formFields as any,
        formConfig: contactPage.formConfig as any,
      },
      create: {
        id: "CONTACT",
        hero: contactPage.hero as any,
        contactInfo: contactPage.contactInfo as any,
        channels: contactPage.channels as any,
        inquiryOptions: contactPage.inquiryOptions as any,
        successMessage: contactPage.successMessage,
        formFields: contactPage.formFields as any,
        formConfig: contactPage.formConfig as any,
      },
    });
  }

  const policies = data.policies[0];
  if (policies) {
    await prisma.policies.upsert({
      where: { id: "POLICIES" },
      update: {
        privacy: policies.privacy as any,
        terms: policies.terms as any,
        returns: policies.returns as any,
      },
      create: {
        id: "POLICIES",
        privacy: policies.privacy as any,
        terms: policies.terms as any,
        returns: policies.returns as any,
      },
    });
  }

  const settings = data.settings[0];
  if (settings) {
    await prisma.siteSettings.upsert({
      where: { id: "SETTINGS" },
      update: {
        siteTitle: settings.siteTitle,
        siteDescription: settings.siteDescription,
        faviconUrl: settings.faviconUrl,
        seoKeywords: settings.seoKeywords,
        navLinks: settings.navLinks as any,
        socialLinks: settings.socialLinks as any,
        appLinks: settings.appLinks as any,
        footerColumns: settings.footerColumns as any,
        contactInfo: settings.contactInfo as any,
        platformLinks: settings.platformLinks as any,
        workHours: settings.workHours as any,
      },
      create: {
        id: "SETTINGS",
        siteTitle: settings.siteTitle,
        siteDescription: settings.siteDescription,
        faviconUrl: settings.faviconUrl,
        seoKeywords: settings.seoKeywords,
        navLinks: settings.navLinks as any,
        socialLinks: settings.socialLinks as any,
        appLinks: settings.appLinks as any,
        footerColumns: settings.footerColumns as any,
        contactInfo: settings.contactInfo as any,
        platformLinks: settings.platformLinks as any,
        workHours: settings.workHours as any,
      },
    });
  }

  console.log("Seed complete: all tables populated from seed-data.json");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => { await prisma.$disconnect(); });
