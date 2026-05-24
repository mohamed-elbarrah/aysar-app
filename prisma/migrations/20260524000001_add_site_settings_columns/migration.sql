-- AlterTable: Add missing columns to site_settings
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "contact_info" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "platform_links" JSONB NOT NULL DEFAULT '{}';
ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "work_hours" JSONB NOT NULL DEFAULT '{}';
