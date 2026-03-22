-- Migration: Create vizeqa_questions table
-- Purpose: Store anonymous questions submitted via vizeqa form

CREATE TABLE IF NOT EXISTS vizeqa_questions (
  id BIGSERIAL PRIMARY KEY,
  question TEXT NOT NULL CHECK (LENGTH(TRIM(question)) >= 3),
  ip_hash TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries sorted by created_at
CREATE INDEX IF NOT EXISTS idx_vizeqa_questions_created_at ON vizeqa_questions(created_at DESC);
