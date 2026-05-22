-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Admin',
    "role" TEXT NOT NULL DEFAULT 'ADMIN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "home_page" (
    "id" TEXT NOT NULL DEFAULT 'HOME',
    "hero" JSONB NOT NULL DEFAULT '{}',
    "feature_sections" JSONB NOT NULL DEFAULT '[]',
    "bento_features" JSONB NOT NULL DEFAULT '[]',
    "project_overview" JSONB NOT NULL DEFAULT '{}',
    "app_section" JSONB NOT NULL DEFAULT '{}',
    "cta_section" JSONB NOT NULL DEFAULT '{}',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "home_page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plans_page" (
    "id" TEXT NOT NULL DEFAULT 'PLANS',
    "plans" JSONB NOT NULL DEFAULT '[]',
    "compare_rows" JSONB NOT NULL DEFAULT '[]',
    "faq_items" JSONB NOT NULL DEFAULT '[]',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plans_page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_page" (
    "id" TEXT NOT NULL DEFAULT 'CONTACT',
    "hero" JSONB NOT NULL DEFAULT '{}',
    "channels" JSONB NOT NULL DEFAULT '[]',
    "inquiry_options" JSONB NOT NULL DEFAULT '[]',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "policies" (
    "id" TEXT NOT NULL DEFAULT 'POLICIES',
    "privacy" JSONB NOT NULL DEFAULT '{}',
    "terms" JSONB NOT NULL DEFAULT '{}',
    "returns" JSONB NOT NULL DEFAULT '{}',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_settings" (
    "id" TEXT NOT NULL DEFAULT 'SETTINGS',
    "site_title" TEXT NOT NULL DEFAULT '',
    "site_description" TEXT NOT NULL DEFAULT '',
    "favicon_url" TEXT,
    "seo_keywords" TEXT NOT NULL DEFAULT '',
    "nav_links" JSONB NOT NULL DEFAULT '[]',
    "social_links" JSONB NOT NULL DEFAULT '{}',
    "app_links" JSONB NOT NULL DEFAULT '{}',
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "site_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_messages" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "inquiry" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contact_messages_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
