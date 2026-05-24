-- AlterTable: Add form_config column to contact_page
ALTER TABLE "contact_page" ADD COLUMN IF NOT EXISTS "form_config" JSONB NOT NULL DEFAULT '{}';
