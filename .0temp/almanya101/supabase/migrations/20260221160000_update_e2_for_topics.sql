-- Event E2: Update for topic-based voting instead of dates

DROP TABLE IF EXISTS public.event_e2_date_votes CASCADE;

CREATE TABLE IF NOT EXISTS public.event_e2_topic_votes (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  full_name TEXT,
  anonymous BOOLEAN NOT NULL DEFAULT FALSE,
  selected_topics TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT event_e2_topic_votes_selected_topics_len
    CHECK (cardinality(selected_topics) >= 1 AND cardinality(selected_topics) <= 5),
  CONSTRAINT event_e2_topic_votes_selected_topics_values
    CHECK (
      selected_topics <@ ARRAY[
        'ai-tools',
        'industry-trends',
        'ai-vs-coding',
        'nonprofit',
        'ai-collaboration',
        'app-testing',
        'state-groups',
        'ai-usage',
        'working-conditions',
        'project-presentations',
        'mutual-support'
      ]::TEXT[]
    )
);

CREATE INDEX IF NOT EXISTS idx_event_e2_topic_votes_created_at
  ON public.event_e2_topic_votes (created_at DESC);
