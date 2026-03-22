CREATE TABLE IF NOT EXISTS cvopt_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    linkedin TEXT NOT NULL,
    whatsapp TEXT NOT NULL,
    approved BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE cvopt_participants ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "cvopt_block_anon_select" ON cvopt_participants;
DROP POLICY IF EXISTS "cvopt_allow_anon_insert" ON cvopt_participants;
DROP POLICY IF EXISTS "cvopt_block_anon_update" ON cvopt_participants;
DROP POLICY IF EXISTS "cvopt_block_anon_delete" ON cvopt_participants;

CREATE POLICY "cvopt_block_anon_select" ON cvopt_participants
  FOR SELECT TO anon USING (false);

CREATE POLICY "cvopt_allow_anon_insert" ON cvopt_participants
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "cvopt_block_anon_update" ON cvopt_participants
  FOR UPDATE TO anon USING (false);

CREATE POLICY "cvopt_block_anon_delete" ON cvopt_participants
  FOR DELETE TO anon USING (false);

CREATE OR REPLACE VIEW cvopt_participants_public AS
SELECT id, name, approved, created_at FROM cvopt_participants;

GRANT SELECT ON cvopt_participants_public TO anon, authenticated;

CREATE INDEX IF NOT EXISTS idx_cvopt_participants_approved ON cvopt_participants(approved);
CREATE INDEX IF NOT EXISTS idx_cvopt_participants_created_at ON cvopt_participants(created_at);
