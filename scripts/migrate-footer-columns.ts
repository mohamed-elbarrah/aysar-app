import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
);

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

  const { data: existing } = await supabase
    .from("site_settings")
    .select("*")
    .eq("id", "SETTINGS")
    .single();

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
    const { error } = await supabase
      .from("site_settings")
      .insert({
        id: "SETTINGS",
        footer_columns: defaultColumns,
      });
    if (error) console.error("Error creating settings:", error);
    else console.log("Done! Created settings with footer_columns.");
    return;
  }

  const row = existing as Record<string, unknown>;
  const quickLinks = Array.isArray(row.footer_quick_links) ? row.footer_quick_links : FOOTER_QUICK;
  const helpLinks = Array.isArray(row.footer_help_links) ? row.footer_help_links : FOOTER_HELP;
  const tagline = (row.footer_tagline as string) || DEFAULT_TAGLINE;
  const copyright = (row.footer_copyright as string) || DEFAULT_COPYRIGHT;

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

  const { error } = await supabase
    .from("site_settings")
    .upsert({
      id: "SETTINGS",
      footer_columns: migratedColumns,
    }, { onConflict: "id" });

  if (error) console.error("Error upserting settings:", error);
  else console.log("Migration complete! footer_columns populated from old data.");
}

main().catch(console.error);