import cron from "node-cron";
import { createClient } from "@supabase/supabase-js";

let registered = false;

function registerKeepAlive() {
  if (registered) return;
  registered = true;

  const url =
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_KEY;

  if (!url || !key) {
    console.warn("[keep-alive] Skipped: missing Supabase credentials");
    return;
  }

  const supabase = createClient(url, key);

  cron.schedule("0 8 */3 * *", async () => {
    const { error } = await supabase.from("users").select("id").limit(1);
    if (error) {
      console.error("[keep-alive] Ping failed:", error.message);
      return;
    }
  });

  console.log("[keep-alive] Scheduled every 3 days at 08:00 UTC");
}

registerKeepAlive();
