-- Central admin authentication store.
-- Admin API keys are stored as PBKDF2 hashes and verified server-side.

CREATE TABLE IF NOT EXISTS public.admin_api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_label TEXT NOT NULL,
  key_salt TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  hash_iterations INTEGER NOT NULL DEFAULT 210000,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  expires_at TIMESTAMPTZ NULL,
  last_used_at TIMESTAMPTZ NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT admin_api_keys_hash_iterations_check CHECK (hash_iterations >= 1000),
  CONSTRAINT admin_api_keys_unique_label UNIQUE (key_label)
);

ALTER TABLE public.admin_api_keys ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'admin_api_keys' AND policyname = 'admin_api_keys_no_anon_select'
  ) THEN
    CREATE POLICY "admin_api_keys_no_anon_select"
      ON public.admin_api_keys
      FOR SELECT
      TO anon
      USING (false);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'admin_api_keys' AND policyname = 'admin_api_keys_no_authenticated_select'
  ) THEN
    CREATE POLICY "admin_api_keys_no_authenticated_select"
      ON public.admin_api_keys
      FOR SELECT
      TO authenticated
      USING (false);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_admin_api_keys_active ON public.admin_api_keys (is_active, expires_at);
CREATE INDEX IF NOT EXISTS idx_admin_api_keys_last_used ON public.admin_api_keys (last_used_at DESC);
