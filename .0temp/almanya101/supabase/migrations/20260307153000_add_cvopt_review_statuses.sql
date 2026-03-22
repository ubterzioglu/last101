ALTER TABLE cvopt_participants
  ADD COLUMN IF NOT EXISTS linkedin_ok BOOLEAN NOT NULL DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS cv_ok BOOLEAN NOT NULL DEFAULT FALSE;

CREATE OR REPLACE VIEW cvopt_participants_public AS
SELECT
  id,
  name,
  approved,
  created_at,
  linkedin_ok,
  cv_ok
FROM cvopt_participants;
