-- DropTable: Remove old footer columns from site_settings
ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "footer_copyright";
ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "footer_tagline";
ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "footer_quick_links";
ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "footer_help_links";