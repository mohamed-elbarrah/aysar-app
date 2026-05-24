import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;

console.log("");
console.log("═══════════════════════════════════════════");
console.log("  [SUPABASE] Connection Check");
console.log("═══════════════════════════════════════════");
console.log("");

if (!SUPABASE_URL) {
  console.error("  [SUPABASE] FAIL  — SUPABASE_URL is not set");
  console.error("  [SUPABASE]       Set SUPABASE_URL environment variable");
  process.exit(1);
}

console.log(`  [SUPABASE] URL   — ${SUPABASE_URL}`);

if (!SUPABASE_ANON_KEY) {
  console.error("  [SUPABASE] WARN  — SUPABASE_ANON_KEY is not set (db.js test will fail on Hostinger)");
} else {
  console.log(`  [SUPABASE] ANON  — ${SUPABASE_ANON_KEY.slice(0, 20)}...`);
}

if (!SUPABASE_SERVICE_KEY) {
  console.error("  [SUPABASE] WARN  — SUPABASE_SERVICE_KEY is not set (server-side DB access will fail)");
} else {
  console.log(`  [SUPABASE] SVC   — ${SUPABASE_SERVICE_KEY.slice(0, 20)}...`);
}

console.log("");

async function testConnection(key: string, label: string): Promise<boolean> {
  const client = createClient(SUPABASE_URL!, key);

  const { data, error, status } = await client
    .from("site_settings")
    .select("id, site_title")
    .limit(1);

  if (error) {
    console.error(`  [SUPABASE] FAIL  — ${label} connection failed`);
    console.error(`  [SUPABASE]        Status: ${status}`);
    console.error(`  [SUPABASE]        Error:  ${error.message}`);
    return false;
  }

  console.log(`  [SUPABASE] OK    — ${label} connection successful (status: ${status})`);
  if (data && data.length > 0) {
    console.log(`  [SUPABASE]        Table: site_settings — id: "${data[0].id}", title: "${data[0].site_title}"`);
  }
  return true;
}

async function main() {
  let allPassed = true;

  if (SUPABASE_ANON_KEY) {
    const anonOk = await testConnection(SUPABASE_ANON_KEY, "ANON_KEY");
    if (!anonOk) allPassed = false;
  }

  if (SUPABASE_SERVICE_KEY) {
    const svcOk = await testConnection(SUPABASE_SERVICE_KEY, "SERVICE_KEY");
    if (!svcOk) allPassed = false;
  }

  console.log("");
  if (allPassed) {
    console.log("  [SUPABASE] DONE  — All connections verified successfully");
  } else {
    console.error("  [SUPABASE] DONE  — Some connections FAILED — check errors above");
  }
  console.log("═══════════════════════════════════════════");
  console.log("");

  if (!allPassed) process.exit(1);
}

main();