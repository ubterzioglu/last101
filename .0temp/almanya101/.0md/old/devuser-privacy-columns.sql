-- =========================================================
-- Migration: Add privacy control columns to devuser table
-- Date: 2026-02-23
-- Description: Users can now choose to hide their contact information
--              from the public profile list
-- =========================================================

-- Add privacy control columns with default value TRUE (visible)
-- This ensures existing users' data remains visible by default

ALTER TABLE devuser
ADD COLUMN IF NOT EXISTS email_gorunur BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS linkedin_gorunur BOOLEAN DEFAULT TRUE,
ADD COLUMN IF NOT EXISTS whatsapp_gorunur BOOLEAN DEFAULT TRUE;

-- Add comment for documentation
COMMENT ON COLUMN devuser.email_gorunur IS 'User email visibility control (true = public, false = hidden)';
COMMENT ON COLUMN devuser.linkedin_gorunur IS 'LinkedIn URL visibility control (true = public, false = hidden)';
COMMENT ON COLUMN devuser.whatsapp_gorunur IS 'WhatsApp phone visibility control (true = public, false = hidden)';

-- Verify columns were added
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'devuser'
  AND column_name IN ('email_gorunur', 'linkedin_gorunur', 'whatsapp_gorunur');
