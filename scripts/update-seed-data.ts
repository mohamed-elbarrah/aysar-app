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

async function main() {
  console.log("Fetching all data from database...");

  const [usersRes, homePagesRes, plansPagesRes, contactPagesRes, policiesRes, settingsRes, messagesRes] = await Promise.all([
    supabase.from("users").select("*"),
    supabase.from("home_page").select("*"),
    supabase.from("plans_page").select("*"),
    supabase.from("contact_page").select("*"),
    supabase.from("policies").select("*"),
    supabase.from("site_settings").select("*"),
    supabase.from("contact_messages").select("*"),
  ]);

  const dump = {
    users: usersRes.data || [],
    homePages: homePagesRes.data || [],
    plansPages: plansPagesRes.data || [],
    contactPages: contactPagesRes.data || [],
    policies: policiesRes.data || [],
    settings: settingsRes.data || [],
    messages: messagesRes.data || [],
  };

  const outPath = path.resolve(__dirname, "../prisma/seed-data.json");
  fs.writeFileSync(outPath, JSON.stringify(dump, null, 2), "utf-8");

  const counts = {
    users: dump.users.length,
    homePages: dump.homePages.length,
    plansPages: dump.plansPages.length,
    contactPages: dump.contactPages.length,
    policies: dump.policies.length,
    settings: dump.settings.length,
    messages: dump.messages.length,
  };

  console.log("Seed data refreshed successfully!");
  console.table(counts);
  console.log(`Output: ${outPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); });