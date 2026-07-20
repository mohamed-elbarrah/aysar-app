import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const url =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_KEY;

if (!url || !key) {
  console.error("Missing SUPABASE_URL and SUPABASE_SERVICE_KEY");
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  const { error } = await supabase.from("users").select("id").limit(1);
  if (error) {
    console.error("[keep-alive] Ping failed:", error.message);
    process.exit(1);
  }
  console.log("[keep-alive] OK");
}

main();
