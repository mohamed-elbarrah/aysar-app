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

/**
 * Run this script to refresh prisma/seed-data.json with the current database state.
 * Usage: npx tsx scripts/update-seed-data.ts
 */
async function main() {
  console.log("Fetching all data from database...");

  const [users, homePages, plansPages, contactPages, policies, settings, messages] = await Promise.all([
    prisma.user.findMany(),
    prisma.homePage.findMany(),
    prisma.plansPage.findMany(),
    prisma.contactPage.findMany(),
    prisma.policies.findMany(),
    prisma.siteSettings.findMany(),
    prisma.contactMessage.findMany(),
  ]);

  const dump = {
    users,
    homePages,
    plansPages,
    contactPages,
    policies,
    settings,
    messages,
  };

  const outPath = path.resolve(__dirname, "../prisma/seed-data.json");
  fs.writeFileSync(outPath, JSON.stringify(dump, null, 2), "utf-8");

  const counts = {
    users: users.length,
    homePages: homePages.length,
    plansPages: plansPages.length,
    contactPages: contactPages.length,
    policies: policies.length,
    settings: settings.length,
    messages: messages.length,
  };

  console.log("Seed data refreshed successfully!");
  console.table(counts);
  console.log(`Output: ${outPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
