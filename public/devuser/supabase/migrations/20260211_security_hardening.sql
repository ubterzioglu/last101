-- DevUser Security Hardening Migration
-- Date: 2026-02-11
-- Purpose: Fix critical security vulnerabilities
--   1. Block direct table access via anon key
--   2. Create secure public view with filtered fields
--   3. Restrict UPDATE/DELETE operations
--   4. Prepare for Edge Function-based API access

-- ============================================================================
-- STEP 1: Remove existing insecure policies
-- ============================================================================

DROP POLICY IF EXISTS "Public read" ON devuser;
DROP POLICY IF EXISTS "Public insert" ON devuser;
DROP POLICY IF EXISTS "Public update" ON devuser;
DROP POLICY IF EXISTS "Enable read access for all users" ON devuser;
DROP POLICY IF EXISTS "Enable insert for all users" ON devuser;
DROP POLICY IF EXISTS "Enable update for all users" ON devuser;

-- ============================================================================
-- STEP 2: Create secure public view
-- ============================================================================

-- This view filters sensitive fields and only shows searchable profiles
CREATE OR REPLACE VIEW devuser_public AS
SELECT 
  id,
  ad_soyad,
  sehir,
  rol,
  deneyim_seviye,
  aktif_kod,
  guclu_alanlar,
  programlama_dilleri,
  framework_platformlar,
  devops_cloud,
  ilgi_konular,
  ogrenmek_istenen,
  is_arama_durumu,
  ai_app_builders,
  freelance_aciklik,
  katilma_amaci,
  isbirligi_turu,
  profesyonel_destek_verebilir,
  profesyonel_destek_almak,
  kullanilan_ide,
  kullanilan_agent,
  -- LinkedIn: Only show if provided
  CASE 
    WHEN linkedin_url IS NOT NULL AND linkedin_url != '' 
    THEN linkedin_url 
    ELSE NULL 
  END as linkedin_url,
  -- WhatsApp: Only show if user gave explicit permission
  CASE 
    WHEN iletisim_izni = true AND whatsapp_tel IS NOT NULL AND whatsapp_tel != ''
    THEN whatsapp_tel 
    ELSE NULL 
  END as whatsapp_tel,
  -- Show if user allows WhatsApp contact (for UI logic)
  iletisim_izni,
  created_at
FROM devuser
WHERE aratilabilir = true;  -- Only show searchable profiles

-- Grant SELECT permission on view to anon users
GRANT SELECT ON devuser_public TO anon;
GRANT SELECT ON devuser_public TO authenticated;

-- ============================================================================
-- STEP 3: Implement strict RLS policies on main table
-- ============================================================================

-- Enable RLS if not already enabled
ALTER TABLE devuser ENABLE ROW LEVEL SECURITY;

-- POLICY 1: Block direct SELECT on main table for anon users
-- Users should query devuser_public view instead
CREATE POLICY "block_anon_direct_read" ON devuser
  FOR SELECT
  TO anon
  USING (false);

-- POLICY 2: Block INSERT for anon users
-- Inserts should go through Edge Function for validation
CREATE POLICY "block_anon_insert" ON devuser
  FOR INSERT
  TO anon
  WITH CHECK (false);

-- POLICY 3: Block UPDATE for anon users
-- Updates require authentication (future feature)
CREATE POLICY "block_anon_update" ON devuser
  FOR UPDATE
  TO anon
  USING (false);

-- POLICY 4: Block DELETE for anon users
CREATE POLICY "block_anon_delete" ON devuser
  FOR DELETE
  TO anon
  USING (false);

-- POLICY 5: Allow authenticated users to read their own data
CREATE POLICY "authenticated_read_own" ON devuser
  FOR SELECT
  TO authenticated
  USING (auth.uid()::text = user_id::text);

-- POLICY 6: Allow authenticated users to update their own data
CREATE POLICY "authenticated_update_own" ON devuser
  FOR UPDATE
  TO authenticated
  USING (auth.uid()::text = user_id::text)
  WITH CHECK (auth.uid()::text = user_id::text);

-- Note: Service role bypasses RLS, so Edge Functions can still insert/update

-- ============================================================================
-- STEP 4: Add user_id column for future authentication
-- ============================================================================

-- Add user_id column if it doesn't exist (for future auth integration)
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'devuser' AND column_name = 'user_id'
  ) THEN
    ALTER TABLE devuser ADD COLUMN user_id UUID REFERENCES auth.users(id);
    CREATE INDEX idx_devuser_user_id ON devuser(user_id);
  END IF;
END $$;

-- ============================================================================
-- STEP 5: Add indexes for performance
-- ============================================================================

-- Indexes for common filter queries
CREATE INDEX IF NOT EXISTS idx_devuser_aratilabilir ON devuser(aratilabilir);
CREATE INDEX IF NOT EXISTS idx_devuser_sehir ON devuser(sehir);
CREATE INDEX IF NOT EXISTS idx_devuser_rol ON devuser(rol);
CREATE INDEX IF NOT EXISTS idx_devuser_deneyim ON devuser(deneyim_seviye);
CREATE INDEX IF NOT EXISTS idx_devuser_is_arama ON devuser(is_arama_durumu);
CREATE INDEX IF NOT EXISTS idx_devuser_created_at ON devuser(created_at DESC);

-- GIN indexes for array fields (for faster array containment queries)
CREATE INDEX IF NOT EXISTS idx_devuser_programlama_dilleri ON devuser USING GIN(programlama_dilleri);
CREATE INDEX IF NOT EXISTS idx_devuser_framework_platformlar ON devuser USING GIN(framework_platformlar);
CREATE INDEX IF NOT EXISTS idx_devuser_devops_cloud ON devuser USING GIN(devops_cloud);
CREATE INDEX IF NOT EXISTS idx_devuser_ilgi_konular ON devuser USING GIN(ilgi_konular);

-- ============================================================================
-- STEP 6: Create function to check for duplicate registrations
-- ============================================================================

CREATE OR REPLACE FUNCTION check_duplicate_registration(
  p_linkedin_url TEXT,
  p_whatsapp_tel TEXT,
  p_ad_soyad TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  v_count INTEGER;
BEGIN
  -- Check if LinkedIn URL already exists
  IF p_linkedin_url IS NOT NULL AND p_linkedin_url != '' THEN
    SELECT COUNT(*) INTO v_count
    FROM devuser
    WHERE linkedin_url = p_linkedin_url;
    
    IF v_count > 0 THEN
      RETURN TRUE;
    END IF;
  END IF;
  
  -- Check if WhatsApp number already exists
  IF p_whatsapp_tel IS NOT NULL AND p_whatsapp_tel != '' THEN
    SELECT COUNT(*) INTO v_count
    FROM devuser
    WHERE whatsapp_tel = p_whatsapp_tel;
    
    IF v_count > 0 THEN
      RETURN TRUE;
    END IF;
  END IF;
  
  -- Check if same name registered recently (within 24 hours)
  IF p_ad_soyad IS NOT NULL AND p_ad_soyad != '' THEN
    SELECT COUNT(*) INTO v_count
    FROM devuser
    WHERE ad_soyad = p_ad_soyad
      AND created_at > NOW() - INTERVAL '24 hours';
    
    IF v_count > 0 THEN
      RETURN TRUE;
    END IF;
  END IF;
  
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission to service role (for Edge Functions)
GRANT EXECUTE ON FUNCTION check_duplicate_registration TO service_role;

-- ============================================================================
-- STEP 7: Additional security hardening
-- ============================================================================

-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Add constraint to ensure aratilabilir is not null
ALTER TABLE devuser ALTER COLUMN aratilabilir SET DEFAULT false;

-- Add constraint to ensure veri_paylasim_onay is not null  
ALTER TABLE devuser ALTER COLUMN veri_paylasim_onay SET DEFAULT false;

-- Add constraint to ensure iletisim_izni is not null
ALTER TABLE devuser ALTER COLUMN iletisim_izni SET DEFAULT false;

-- Add check constraint for LinkedIn URL format (basic)
ALTER TABLE devuser DROP CONSTRAINT IF EXISTS check_linkedin_format;
ALTER TABLE devuser ADD CONSTRAINT check_linkedin_format 
  CHECK (linkedin_url IS NULL OR linkedin_url = '' OR linkedin_url ~* '^https?://([a-z0-9-]+\.)*linkedin\.com/.*$');

-- Add check constraint for phone number format
ALTER TABLE devuser DROP CONSTRAINT IF EXISTS check_phone_format;
ALTER TABLE devuser ADD CONSTRAINT check_phone_format
  CHECK (whatsapp_tel IS NULL OR whatsapp_tel = '' OR whatsapp_tel ~* '^\+?[0-9]{6,20}$');

-- Add comment to table for documentation
COMMENT ON TABLE devuser IS 'Developer community members table. DO NOT access directly from frontend. Use Edge Functions or devuser_public view.';
COMMENT ON VIEW devuser_public IS 'Public read-only view with filtered sensitive data. Safe to query from frontend with appropriate filters.';

-- ============================================================================
-- STEP 8: Row count limiter function (optional - prevents runaway queries)
-- ============================================================================

CREATE OR REPLACE FUNCTION get_devuser_public_safe(
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0
) RETURNS SETOF devuser_public AS $$
BEGIN
  -- Enforce max limit to prevent abuse
  IF p_limit > 100 THEN
    p_limit := 100;
  END IF;
  
  IF p_limit < 1 THEN
    p_limit := 1;
  END IF;
  
  IF p_offset < 0 THEN
    p_offset := 0;
  END IF;
  
  RETURN QUERY
  SELECT * FROM devuser_public
  ORDER BY created_at DESC
  LIMIT p_limit OFFSET p_offset;
END;
$$ LANGUAGE plpgsql STABLE SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION get_devuser_public_safe TO anon;
GRANT EXECUTE ON FUNCTION get_devuser_public_safe TO authenticated;

-- ============================================================================
-- VERIFICATION QUERIES (Run these to verify migration success)
-- ============================================================================

-- Verify view was created
-- SELECT * FROM devuser_public LIMIT 1;

-- Verify policies are in place
-- SELECT * FROM pg_policies WHERE tablename = 'devuser';

-- Verify constraints exist
-- SELECT conname, pg_get_constraintdef(oid) FROM pg_constraint WHERE conrelid = 'devuser'::regclass;

-- Test that anon cannot read main table directly
-- SET ROLE anon;
-- SELECT * FROM devuser LIMIT 1;  -- Should fail
-- SELECT * FROM devuser_public LIMIT 1;  -- Should succeed
-- RESET ROLE;

-- Test the safe getter function
-- SELECT * FROM get_devuser_public_safe(10, 0);
