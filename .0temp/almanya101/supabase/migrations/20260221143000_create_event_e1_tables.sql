-- Event E1: separate tables for date votes and public questions

CREATE TABLE IF NOT EXISTS public.event_e1_date_votes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name TEXT,
  anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  selected_dates TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT event_e1_date_votes_selected_dates_len
    CHECK (cardinality(selected_dates) >= 1 AND cardinality(selected_dates) <= 3),
  CONSTRAINT event_e1_date_votes_selected_dates_values
    CHECK (
      selected_dates <@ ARRAY['tarih1', 'tarih2', 'tarih3']::TEXT[]
    )
);

CREATE TABLE IF NOT EXISTS public.event_e1_questions (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  question TEXT NOT NULL,
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT event_e1_questions_question_len
    CHECK (char_length(trim(question)) BETWEEN 3 AND 500)
);

CREATE INDEX IF NOT EXISTS idx_event_e1_date_votes_created_at
  ON public.event_e1_date_votes (created_at DESC);

CREATE INDEX IF NOT EXISTS idx_event_e1_questions_created_at
  ON public.event_e1_questions (created_at DESC);
