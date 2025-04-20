
-- Add industry column to the profiles table if it doesn't exist
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS industry text;
