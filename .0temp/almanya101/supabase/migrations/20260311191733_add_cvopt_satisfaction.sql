-- Memnuniyet anketi tablosu
CREATE TABLE IF NOT EXISTS cvopt_satisfaction_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  participant_id UUID REFERENCES cvopt_participants(id) ON DELETE CASCADE,
  score INTEGER NOT NULL CHECK (score >= 1 AND score <= 10),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS aktif et
ALTER TABLE cvopt_satisfaction_surveys ENABLE ROW LEVEL SECURITY;

-- Public read policy (stats için gerekli)
CREATE POLICY cvopt_satisfaction_public_read
  ON cvopt_satisfaction_surveys
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Memnuniyet istatistikleri view'ı (0-100 skalası)
CREATE OR REPLACE VIEW cvopt_satisfaction_stats AS
SELECT
  ROUND(AVG(score) * 10)::INTEGER AS avg_score,
  COUNT(*) AS total_count
FROM cvopt_satisfaction_surveys;
