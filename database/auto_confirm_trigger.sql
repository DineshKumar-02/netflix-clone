-- ============================================================
-- SQL Trigger: Auto-Confirm Users in Supabase
-- ============================================================
-- This script automatically marks all new sign-ups as confirmed 
-- in the database. It bypasses the need to click verification 
-- links in emails, even if "Confirm email" is turned on in the 
-- Supabase Dashboard.

-- 1. Create the trigger function
CREATE OR REPLACE FUNCTION auth.auto_confirm_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Set email confirmation timestamps to the current time automatically
  NEW.email_confirmed_at = now();
  NEW.confirmed_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the trigger if it already exists (prevents duplicate errors)
DROP TRIGGER IF EXISTS tr_auto_confirm_user ON auth.users;

-- 3. Bind the trigger to run BEFORE any new user is inserted
CREATE TRIGGER tr_auto_confirm_user
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION auth.auto_confirm_user();
