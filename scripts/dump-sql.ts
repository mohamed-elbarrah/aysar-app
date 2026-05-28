import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

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
  const [usersRes, homePagesRes, plansPagesRes, contactPagesRes, policiesRes, settingsRes, messagesRes] = await Promise.all([
    supabase.from("users").select("*"),
    supabase.from("home_page").select("*"),
    supabase.from("plans_page").select("*"),
    supabase.from("contact_page").select("*"),
    supabase.from("policies").select("*"),
    supabase.from("site_settings").select("*"),
    supabase.from("contact_messages").select("*"),
  ]);

  const users = usersRes.data || [];
  const homePages = homePagesRes.data || [];
  const plansPages = plansPagesRes.data || [];
  const contactPages = contactPagesRes.data || [];
  const policies = policiesRes.data || [];
  const settings = settingsRes.data || [];
  const messages = messagesRes.data || [];

  const lines: string[] = [
    "-- ============================================================",
    "-- Aysar App — Full Database Seed Dump",
    "-- Generated: " + new Date().toISOString(),
    "-- ============================================================",
    "",
    "TRUNCATE TABLE contact_messages, site_settings, policies, contact_page, plans_page, home_page, users RESTART IDENTITY CASCADE;",
    "",
  ];

  for (const u of users) {
    lines.push(`INSERT INTO users (id, email, password_hash, name, role, created_at, updated_at)
  VALUES (${escape(u.id)}, ${escape(u.email)}, ${escape(u.password_hash)}, ${escape(u.name)}, ${escape(u.role)}, ${escape(u.created_at)}, ${escape(u.updated_at)});`);
  }

  lines.push("");

  for (const h of homePages) {
    lines.push(`INSERT INTO home_page (id, hero, feature_sections, bento_features, project_overview, app_section, cta_section, updated_at)
  VALUES (${escape(h.id)}, ${jsonb(h.hero)}, ${jsonb(h.feature_sections)}, ${jsonb(h.bento_features)}, ${jsonb(h.project_overview)}, ${jsonb(h.app_section)}, ${jsonb(h.cta_section)}, ${escape(h.updated_at)});`);
  }

  lines.push("");

  for (const p of plansPages) {
    lines.push(`INSERT INTO plans_page (id, hero, plans, compare_rows, faq_items, updated_at)
  VALUES (${escape(p.id)}, ${jsonb(p.hero)}, ${jsonb(p.plans)}, ${jsonb(p.compare_rows)}, ${jsonb(p.faq_items)}, ${escape(p.updated_at)});`);
  }

  lines.push("");

  for (const c of contactPages) {
    lines.push(`INSERT INTO contact_page (id, hero, contact_info, channels, inquiry_options, success_message, form_fields, form_config, updated_at)
  VALUES (${escape(c.id)}, ${jsonb(c.hero)}, ${jsonb(c.contact_info)}, ${jsonb(c.channels)}, ${jsonb(c.inquiry_options)}, ${escape(c.success_message)}, ${jsonb(c.form_fields)}, ${jsonb(c.form_config)}, ${escape(c.updated_at)});`);
  }

  lines.push("");

  for (const p of policies) {
    lines.push(`INSERT INTO policies (id, privacy, terms, returns, updated_at)
  VALUES (${escape(p.id)}, ${jsonb(p.privacy)}, ${jsonb(p.terms)}, ${jsonb(p.returns)}, ${escape(p.updated_at)});`);
  }

  lines.push("");

  for (const s of settings) {
    lines.push(`INSERT INTO site_settings (id, site_title, site_description, favicon_url, seo_keywords, nav_links, social_links, app_links, footer_columns, contact_info, platform_links, work_hours, scripts, updated_at)
  VALUES (${escape(s.id)}, ${escape(s.site_title)}, ${escape(s.site_description)}, ${escape(s.favicon_url)}, ${escape(s.seo_keywords)}, ${jsonb(s.nav_links)}, ${jsonb(s.social_links)}, ${jsonb(s.app_links)}, ${jsonb(s.footer_columns)}, ${jsonb(s.contact_info)}, ${jsonb(s.platform_links)}, ${jsonb(s.work_hours)}, ${jsonb(s.scripts)}, ${escape(s.updated_at)});`);
  }

  lines.push("");

  for (const m of messages) {
    lines.push(`INSERT INTO contact_messages (id, full_name, email, phone, inquiry, subject, message, is_read, created_at)
  VALUES (${escape(m.id)}, ${escape(m.full_name)}, ${escape(m.email)}, ${escape(m.phone)}, ${escape(m.inquiry)}, ${escape(m.subject)}, ${escape(m.message)}, ${m.is_read ? "TRUE" : "FALSE"}, ${escape(m.created_at)});`);
  }

  lines.push("");

  const outPath = path.resolve(__dirname, "../scripts/seed-data.sql");
  fs.writeFileSync(outPath, lines.join("\n"), "utf-8");
  console.log(`SQL dump written to ${outPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); });