-- Tanisma kaynasma toplantisi survey tablosu
CREATE TABLE IF NOT EXISTS meeting_surveys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  devuser_id UUID REFERENCES devuser(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  wants_meeting BOOLEAN NOT NULL,
  available_dates TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS aktif et
ALTER TABLE meeting_surveys ENABLE ROW LEVEL SECURITY;

-- Public insert policy (kayit gerektirmeden katilim)
CREATE POLICY meeting_surveys_public_insert
  ON meeting_surveys
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Public read policy (istatistikler icin)
CREATE POLICY meeting_surveys_public_read
  ON meeting_surveys
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Kullanici kendi kaydini guncelleyebilir
CREATE POLICY meeting_surveys_user_update
  ON meeting_surveys
  FOR UPDATE
  TO authenticated
  USING (devuser_id = auth.uid())
  WITH CHECK (devuser_id = auth.uid());

-- Istatistikler view'i
CREATE OR REPLACE VIEW meeting_survey_stats AS
SELECT
  COUNT(*) AS total_responses,
  COUNT(*) FILTER (WHERE wants_meeting = true) AS wants_meeting_count,
  COUNT(*) FILTER (WHERE wants_meeting = false) AS doesnt_want_meeting_count,
  ROUND(COUNT(*) FILTER (WHERE wants_meeting = true) * 100.0 / NULLIF(COUNT(*), 0)) AS wants_meeting_percentage
FROM meeting_surveys;

-- Tarih dagilimi view'i
CREATE OR REPLACE VIEW meeting_survey_date_stats AS
SELECT
  UNNEST(available_dates) AS date_option,
  COUNT(*) AS vote_count
FROM meeting_surveys
WHERE wants_meeting = true
GROUP BY UNNEST(available_dates)
ORDER BY vote_count DESC;

-- Updated at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_meeting_surveys_updated_at
  BEFORE UPDATE ON meeting_surveys
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
