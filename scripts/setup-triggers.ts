import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

const TRIGGER_SQL = `
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DO $$
DECLARE
  tbl text;
BEGIN
  FOREACH tbl IN ARRAY ARRAY['users', 'home_page', 'plans_page', 'contact_page', 'policies', 'site_settings']
  LOOP
    EXECUTE format(
      'DROP TRIGGER IF EXISTS set_updated_at ON %I;
       CREATE TRIGGER set_updated_at
         BEFORE UPDATE ON %I
         FOR EACH ROW
         EXECUTE FUNCTION update_updated_at_column();',
      tbl, tbl
    );
  END LOOP;
END;
$$;
`;

async function main() {
  console.log("Creating updated_at triggers...");

  const { error } = await supabase.rpc('exec_sql', { sql: TRIGGER_SQL });

  if (error) {
    console.log("RPC approach failed (expected if no exec_sql function exists).");
    console.log("Using direct PostgreSQL connection instead...");
    console.log("");
    console.log("Please run the following SQL in the Supabase SQL Editor:");
    console.log("============================================================");
    console.log(TRIGGER_SQL);
    console.log("============================================================");
    console.log("");
    console.log("Or use: psql '<DIRECT_URL>' -f scripts/updated-at-triggers.sql");
  } else {
    console.log("Triggers created successfully!");
  }
}

main().catch(console.error);