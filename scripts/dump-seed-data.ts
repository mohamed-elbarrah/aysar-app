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
  console.log(`Seed data written to ${outPath}`);
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
