import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

function escape(val: unknown): string {
  if (val === null || val === undefined) return "NULL";
  if (typeof val === "boolean") return val ? "TRUE" : "FALSE";
  if (typeof val === "number") return String(val);
  const s = String(val).replace(/'/g, "''");
  return `'${s}'`;
}

function jsonb(val: unknown): string {
  if (val === null || val === undefined) return "'{}'::jsonb";
  return `'${JSON.stringify(val).replace(/'/g, "''")}'::jsonb`;
}

async function main() {
  const [users, homePages, plansPages, contactPages, policies, settings, messages] = await Promise.all([
    prisma.user.findMany(),
    prisma.homePage.findMany(),
    prisma.plansPage.findMany(),
    prisma.contactPage.findMany(),
    prisma.policies.findMany(),
    prisma.siteSettings.findMany(),
    prisma.contactMessage.findMany(),
  ]);

  const lines: string[] = [
    "-- ============================================================",
    "-- Aysar App — Full Database Seed Dump",
    "-- Generated: " + new Date().toISOString(),
    "-- ============================================================",
    "",
    "TRUNCATE TABLE contact_messages, site_settings, policies, contact_page, plans_page, home_page, users RESTART IDENTITY CASCADE;",
    "",
  ];

  // Users
  for (const u of users) {
    lines.push(`INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at)
  VALUES (${escape(u.id)}, ${escape(u.email)}, ${escape(u.passwordHash)}, ${escape(u.name)}, ${escape(u.role)}, ${escape(u.createdAt.toISOString?.() ?? u.createdAt)}, ${escape(u.updatedAt.toISOString?.() ?? u.updatedAt)});`);
  }

  lines.push("");

  // HomePage
  for (const h of homePages) {
    lines.push(`INSERT INTO home_page (id, hero, feature_sections, bento_features, project_overview, app_section, cta_section, updated_at)
  VALUES (${escape(h.id)}, ${jsonb(h.hero)}, ${jsonb(h.featureSections)}, ${jsonb(h.bentoFeatures)}, ${jsonb(h.projectOverview)}, ${jsonb(h.appSection)}, ${jsonb(h.ctaSection)}, ${escape(h.updatedAt.toISOString?.() ?? h.updatedAt)});`);
  }

  lines.push("");

  // PlansPage
  for (const p of plansPages) {
    lines.push(`INSERT INTO plans_page (id, hero, plans, compare_rows, faq_items, updated_at)
  VALUES (${escape(p.id)}, ${jsonb(p.hero)}, ${jsonb(p.plans)}, ${jsonb(p.compareRows)}, ${jsonb(p.faqItems)}, ${escape(p.updatedAt.toISOString?.() ?? p.updatedAt)});`);
  }

  lines.push("");

  // ContactPage
  for (const c of contactPages) {
    lines.push(`INSERT INTO contact_page (id, hero, contact_info, channels, inquiry_options, success_message, form_fields, form_config, updated_at)
  VALUES (${escape(c.id)}, ${jsonb(c.hero)}, ${jsonb(c.contactInfo)}, ${jsonb(c.channels)}, ${jsonb(c.inquiryOptions)}, ${escape(c.successMessage)}, ${jsonb(c.formFields)}, ${jsonb(c.formConfig)}, ${escape(c.updatedAt.toISOString?.() ?? c.updatedAt)});`);
  }

  lines.push("");

  // Policies
  for (const p of policies) {
    lines.push(`INSERT INTO policies (id, privacy, terms, returns, updated_at)
  VALUES (${escape(p.id)}, ${jsonb(p.privacy)}, ${jsonb(p.terms)}, ${jsonb(p.returns)}, ${escape(p.updatedAt.toISOString?.() ?? p.updatedAt)});`);
  }

  lines.push("");

  // SiteSettings
  for (const s of settings) {
    lines.push(`INSERT INTO site_settings (id, site_title, site_description, favicon_url, seo_keywords, nav_links, social_links, app_links, footer_columns, contact_info, platform_links, work_hours, updated_at)
  VALUES (${escape(s.id)}, ${escape(s.siteTitle)}, ${escape(s.siteDescription)}, ${escape(s.faviconUrl)}, ${escape(s.seoKeywords)}, ${jsonb(s.navLinks)}, ${jsonb(s.socialLinks)}, ${jsonb(s.appLinks)}, ${jsonb(s.footerColumns)}, ${jsonb(s.contactInfo)}, ${jsonb(s.platformLinks)}, ${jsonb(s.workHours)}, ${escape(s.updatedAt.toISOString?.() ?? s.updatedAt)});`);
  }

  lines.push("");

  // ContactMessages
  for (const m of messages) {
    lines.push(`INSERT INTO contact_messages (id, full_name, email, phone, inquiry, subject, message, is_read, created_at)
  VALUES (${escape(m.id)}, ${escape(m.fullName)}, ${escape(m.email)}, ${escape(m.phone)}, ${escape(m.inquiry)}, ${escape(m.subject)}, ${escape(m.message)}, ${m.isRead ? "TRUE" : "FALSE"}, ${escape(m.createdAt.toISOString?.() ?? m.createdAt)});`);
  }

  lines.push("");

  const outPath = path.resolve(__dirname, "../scripts/seed-data.sql");
  fs.writeFileSync(outPath, lines.join("\n"), "utf-8");
  console.log(`SQL dump written to ${outPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
