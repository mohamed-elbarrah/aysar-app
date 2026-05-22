-- AlterTable
ALTER TABLE "site_settings" ADD COLUMN     "footer_copyright" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "footer_help_links" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "footer_quick_links" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN     "footer_tagline" TEXT NOT NULL DEFAULT '';
