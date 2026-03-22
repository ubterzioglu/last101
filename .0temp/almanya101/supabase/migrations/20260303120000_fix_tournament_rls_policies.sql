-- =========================================================
-- FILE: 20260303120000_fix_tournament_rls_policies.sql
-- PURPOSE: Fix permissive RLS policies that expose WhatsApp numbers
-- DATE: 2026-03-03
-- =========================================================

-- ============================================================================
-- STEP 1: Drop permissive policies
-- ============================================================================

-- Typing
DROP POLICY IF EXISTS "Typing: Herkes okuyabilir" ON typing_participants;
DROP POLICY IF EXISTS "Typing: Herkes kaydolabilir" ON typing_participants;
DROP POLICY IF EXISTS "Typing Bracket: Herkes okuyabilir" ON typing_bracket;
DROP POLICY IF EXISTS "Typing Bracket: Admin yazabilir" ON typing_bracket;

-- Tavla
DROP POLICY IF EXISTS "Tavla: Herkes okuyabilir" ON tavla_participants;
DROP POLICY IF EXISTS "Tavla: Herkes kaydolabilir" ON tavla_participants;
DROP POLICY IF EXISTS "Tavla: Admin güncelleyebilir" ON tavla_participants;
DROP POLICY IF EXISTS "Tavla Bracket: Herkes okuyabilir" ON tavla_bracket;
DROP POLICY IF EXISTS "Tavla Bracket: Admin yazabilir" ON tavla_bracket;

-- VCT
DROP POLICY IF EXISTS "VCT: Herkes okuyabilir" ON vct_participants;
DROP POLICY IF EXISTS "VCT: Herkes kaydolabilir" ON vct_participants;
DROP POLICY IF EXISTS "VCT: Admin güncelleyebilir" ON vct_participants;

-- Promote
DROP POLICY IF EXISTS "Promote: Herkes okuyabilir" ON promote_participants;
DROP POLICY IF EXISTS "Promote: Herkes kaydolabilir" ON promote_participants;
DROP POLICY IF EXISTS "Promote: Admin güncelleyebilir" ON promote_participants;

-- ============================================================================
-- STEP 2: Create secure public views (hide WhatsApp)
-- ============================================================================

-- Typing participants public view
CREATE OR REPLACE VIEW typing_participants_public AS
SELECT id, name, approved, created_at FROM typing_participants;

-- Tavla participants public view
CREATE OR REPLACE VIEW tavla_participants_public AS
SELECT id, name, approved, created_at FROM tavla_participants;

-- VCT participants public view
CREATE OR REPLACE VIEW vct_participants_public AS
SELECT id, name, approved, created_at FROM vct_participants;

-- Promote participants public view
CREATE OR REPLACE VIEW promote_participants_public AS
SELECT id, name, product_name, product_desc, approved, created_at FROM promote_participants;

-- Bracket views
CREATE OR REPLACE VIEW typing_bracket_public AS SELECT * FROM typing_bracket;
CREATE OR REPLACE VIEW tavla_bracket_public AS SELECT * FROM tavla_bracket;

-- Grant permissions
GRANT SELECT ON typing_participants_public TO anon, authenticated;
GRANT SELECT ON tavla_participants_public TO anon, authenticated;
GRANT SELECT ON vct_participants_public TO anon, authenticated;
GRANT SELECT ON promote_participants_public TO anon, authenticated;
GRANT SELECT ON typing_bracket_public TO anon, authenticated;
GRANT SELECT ON tavla_bracket_public TO anon, authenticated;

-- ============================================================================
-- STEP 3: Create secure RLS policies
-- ============================================================================

-- TYPING PARTICIPANTS
CREATE POLICY "typing_block_anon_select" ON typing_participants
  FOR SELECT TO anon USING (false);

CREATE POLICY "typing_allow_anon_insert" ON typing_participants
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "typing_block_anon_update" ON typing_participants
  FOR UPDATE TO anon USING (false);

CREATE POLICY "typing_block_anon_delete" ON typing_participants
  FOR DELETE TO anon USING (false);

-- TYPING BRACKET
CREATE POLICY "typing_bracket_block_anon" ON typing_bracket
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "typing_bracket_auth" ON typing_bracket
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- TAVLA PARTICIPANTS
CREATE POLICY "tavla_block_anon_select" ON tavla_participants
  FOR SELECT TO anon USING (false);

CREATE POLICY "tavla_allow_anon_insert" ON tavla_participants
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "tavla_block_anon_update" ON tavla_participants
  FOR UPDATE TO anon USING (false);

CREATE POLICY "tavla_block_anon_delete" ON tavla_participants
  FOR DELETE TO anon USING (false);

-- TAVLA BRACKET
CREATE POLICY "tavla_bracket_block_anon" ON tavla_bracket
  FOR ALL TO anon USING (false) WITH CHECK (false);

CREATE POLICY "tavla_bracket_auth" ON tavla_bracket
  FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- VCT PARTICIPANTS
CREATE POLICY "vct_block_anon_select" ON vct_participants
  FOR SELECT TO anon USING (false);

CREATE POLICY "vct_allow_anon_insert" ON vct_participants
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "vct_block_anon_update" ON vct_participants
  FOR UPDATE TO anon USING (false);

CREATE POLICY "vct_block_anon_delete" ON vct_participants
  FOR DELETE TO anon USING (false);

-- PROMOTE PARTICIPANTS
CREATE POLICY "promote_block_anon_select" ON promote_participants
  FOR SELECT TO anon USING (false);

CREATE POLICY "promote_allow_anon_insert" ON promote_participants
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "promote_block_anon_update" ON promote_participants
  FOR UPDATE TO anon USING (false);

CREATE POLICY "promote_block_anon_delete" ON promote_participants
  FOR DELETE TO anon USING (false);

-- ============================================================================
-- Done! Security model:
-- - Anon: Can INSERT (register), Cannot SELECT (protects WhatsApp)
-- - Authenticated: Can read/update via admin panel (future)
-- - Public views: Safe to query from frontend (no WhatsApp)
-- ============================================================================
