-- Add logo_url column to site_settings table
-- Run this in Supabase SQL Editor

ALTER TABLE site_settings 
ADD COLUMN IF NOT EXISTS logo_url TEXT;

-- Verify column was added
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'site_settings' 
AND column_name = 'logo_url';