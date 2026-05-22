import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

const FOOTER_QUICK = [
  { label: "الرئيسية", href: "/" },
  { label: "الأسعار", href: "/plans" },
  { label: "اتصل بنا", href: "/contact" },
];

const FOOTER_HELP = [
  { label: "تسجيل دخول", href: "https://platform.aysar.sa/ar/company/dashboard/login", external: true },
  { label: "مركز المساعدة", href: "https://support.aysar.sa/", external: true },
  { label: "التحديثات", href: "https://support.aysar.sa/page/update", external: true },
  { label: "سياسة الخصوصية", href: "/privacy-policy" },
  { label: "شروط الاستخدام", href: "/terms-of-use" },
  { label: "سياسة الاسترجاع", href: "/return-policy" },
];

const DEFAULT_COPYRIGHT = "© 2026 مؤسسة أيسر المتطورة لتقنية المعلومات · رقم السجل التجاري: 4030620045";
const DEFAULT_TAGLINE = "أيسَر برنامج لإدارة العقارات وتتبع مراحل الإنشاء من أول طوبة لآخر لمسة.";

async function main() {
  console.log("Starting footer columns migration...");

  const existing = await prisma.siteSettings.findUnique({ where: { id: "SETTINGS" } });

  const defaultColumns = [
    { type: "brand", title: "أيسَر", tagline: DEFAULT_TAGLINE, copyright: DEFAULT_COPYRIGHT },
    { type: "links", title: "روابط سريعة", links: FOOTER_QUICK },
    { type: "links", title: "المساعدة", links: FOOTER_HELP },
    {
      type: "links",
      title: "التطبيق",
      links: [
        { label: "App Store", href: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone", external: true },
        { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.aysar.application", external: true },
      ],
    },
  ];

  if (!existing) {
    console.log("No existing settings found, creating with defaults...");
    await prisma.siteSettings.create({
      data: {
        id: "SETTINGS",
        footerColumns: defaultColumns,
      },
    });
    console.log("Done! Created settings with footerColumns.");
    return;
  }

  const row = existing as any;
  const quickLinks = Array.isArray(row.footerQuickLinks) ? row.footerQuickLinks : FOOTER_QUICK;
  const helpLinks = Array.isArray(row.footerHelpLinks) ? row.footerHelpLinks : FOOTER_HELP;
  const tagline = row.footerTagline || DEFAULT_TAGLINE;
  const copyright = row.footerCopyright || DEFAULT_COPYRIGHT;

  const migratedColumns = [
    { type: "brand" as const, title: "أيسَر", tagline, copyright },
    { type: "links" as const, title: "روابط سريعة", links: quickLinks },
    { type: "links" as const, title: "المساعدة", links: helpLinks },
    {
      type: "links" as const,
      title: "التطبيق",
      links: [
        { label: "App Store", href: "https://apps.apple.com/sa/app/أيس-ر/id6746420561?l=ar&platform=iphone", external: true },
        { label: "Google Play", href: "https://play.google.com/store/apps/details?id=com.aysar.application", external: true },
      ],
    },
  ];

  await prisma.siteSettings.upsert({
    where: { id: "SETTINGS" },
    create: { id: "SETTINGS", footerColumns: migratedColumns },
    update: { footerColumns: migratedColumns },
  });

  console.log("Migration complete! footerColumns populated from old data.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());