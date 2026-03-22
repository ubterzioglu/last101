-- Basitlestirilmis katilim formu tablosu
CREATE TABLE IF NOT EXISTS meeting_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  available_dates TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- RLS aktif et
ALTER TABLE meeting_attendance ENABLE ROW LEVEL SECURITY;

-- Public insert policy
CREATE POLICY meeting_attendance_public_insert
  ON meeting_attendance
  FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

-- Public read policy (istatistikler icin)
CREATE POLICY meeting_attendance_public_read
  ON meeting_attendance
  FOR SELECT
  TO anon, authenticated
  USING (true);

-- Istatistikler view'i
CREATE OR REPLACE VIEW meeting_attendance_stats AS
SELECT
  COUNT(*) AS total_responses
FROM meeting_attendance;

-- Tarih dagilimi view'i
CREATE OR REPLACE VIEW meeting_attendance_date_stats AS
SELECT
  UNNEST(available_dates) AS date_option,
  COUNT(*) AS vote_count
FROM meeting_attendance
GROUP BY UNNEST(available_dates)
ORDER BY vote_count DESC;
