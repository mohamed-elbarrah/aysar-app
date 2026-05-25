-- Add custom scripts columns to site_settings table
-- Run this in Supabase SQL Editor

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS head_scripts TEXT DEFAULT '';

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS body_scripts TEXT DEFAULT '';

-- Verify columns were added
SELECT column_name, data_type, column_default 
FROM information_schema.columns 
WHERE table_name = 'site_settings' 
AND column_name IN ('head_scripts', 'body_scripts');
