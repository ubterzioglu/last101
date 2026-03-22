CREATE TABLE IF NOT EXISTS public.meeting_attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  available_dates TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.meeting_attendance ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'meeting_attendance'
      AND policyname = 'meeting_attendance_public_insert'
  ) THEN
    CREATE POLICY meeting_attendance_public_insert
      ON public.meeting_attendance
      FOR INSERT
      TO anon, authenticated
      WITH CHECK (true);
  END IF;
END $$;

DROP POLICY IF EXISTS meeting_attendance_public_read ON public.meeting_attendance;

CREATE INDEX IF NOT EXISTS meeting_attendance_created_at_idx
  ON public.meeting_attendance (created_at DESC);

CREATE OR REPLACE VIEW public.meeting_attendance_stats AS
SELECT COUNT(*) AS total_responses
FROM public.meeting_attendance;

CREATE OR REPLACE VIEW public.meeting_attendance_date_stats AS
SELECT
  UNNEST(available_dates) AS date_option,
  COUNT(*) AS vote_count
FROM public.meeting_attendance
GROUP BY UNNEST(available_dates)
ORDER BY vote_count DESC;
