-- AlterTable
ALTER TABLE "contact_messages" ALTER COLUMN "subject" SET DEFAULT '';

-- AlterTable
ALTER TABLE "contact_page" ADD COLUMN     "contact_info" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "form_fields" JSONB NOT NULL DEFAULT '{}',
ADD COLUMN     "success_message" TEXT NOT NULL DEFAULT '';
