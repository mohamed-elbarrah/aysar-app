import "dotenv/config";
import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

async function main() {
  const seedDataPath = path.resolve(__dirname, "seed-data.json");
  const raw = fs.readFileSync(seedDataPath, "utf-8");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const data: Record<string, any[]> = JSON.parse(raw);

  const adminUser = data.users[0];
  const passwordHash = await bcrypt.hash("admin123", 12);

  await supabase
    .from("users")
    .upsert({
      id: adminUser?.id,
      email: adminUser?.email ?? "admin@aysar.sa",
      password_hash: adminUser?.passwordHash ?? passwordHash,
      name: adminUser?.name ?? "مدير النظام",
      role: adminUser?.role ?? "ADMIN",
    }, { onConflict: "email" });

  const homePage = data.homePages[0];
  if (homePage) {
    await supabase.from("home_page").upsert({
      id: "HOME",
      hero: homePage.hero,
      feature_sections: homePage.featureSections,
      bento_features: homePage.bentoFeatures,
      project_overview: homePage.projectOverview,
      app_section: homePage.appSection,
      cta_section: homePage.ctaSection,
    }, { onConflict: "id" });
  }

  const plansPage = data.plansPages[0];
  if (plansPage) {
    await supabase.from("plans_page").upsert({
      id: "PLANS",
      hero: plansPage.hero,
      plans: plansPage.plans,
      compare_rows: plansPage.compareRows,
      faq_items: plansPage.faqItems,
    }, { onConflict: "id" });
  }

  const contactPage = data.contactPages[0];
  if (contactPage) {
    await supabase.from("contact_page").upsert({
      id: "CONTACT",
      hero: contactPage.hero,
      contact_info: contactPage.contactInfo,
      channels: contactPage.channels,
      inquiry_options: contactPage.inquiryOptions,
      success_message: contactPage.successMessage,
      form_fields: contactPage.formFields,
      form_config: contactPage.formConfig,
    }, { onConflict: "id" });
  }

  const policies = data.policies[0];
  if (policies) {
    await supabase.from("policies").upsert({
      id: "POLICIES",
      privacy: policies.privacy,
      terms: policies.terms,
      returns: policies.returns,
    }, { onConflict: "id" });
  }

  const settings = data.settings[0];
  if (settings) {
    await supabase.from("site_settings").upsert({
      id: "SETTINGS",
      site_title: settings.siteTitle,
      site_description: settings.siteDescription,
      favicon_url: settings.faviconUrl,
      seo_keywords: settings.seoKeywords,
      nav_links: settings.navLinks,
      social_links: settings.socialLinks,
      app_links: settings.appLinks,
      footer_columns: settings.footerColumns,
      contact_info: settings.contactInfo,
      platform_links: settings.platformLinks,
      work_hours: settings.workHours,
      scripts: [],
    }, { onConflict: "id" });
  }

  console.log("Seed complete: all tables populated from seed-data.json");
}

main().catch((e) => { console.error(e); process.exit(1); });