-- Add structured scripts JSONB column to site_settings table
-- Replaces raw head_scripts/body_scripts TEXT columns
-- Run this in Supabase SQL Editor

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS scripts JSONB DEFAULT '[]'::jsonb;

-- Verify column was added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'site_settings' 
AND column_name = 'scripts';