-- Supabase Auth migration for DevUser
-- Allow login_email without legacy 6-digit PIN hash/salt
-- Enforce one profile per authenticated user_id

ALTER TABLE public.devuser
  DROP CONSTRAINT IF EXISTS check_devuser_login_hash_presence;

ALTER TABLE public.devuser
  DROP CONSTRAINT IF EXISTS check_devuser_login_hash_pair;

ALTER TABLE public.devuser
  ADD CONSTRAINT check_devuser_login_hash_pair
  CHECK (
    (login_pin_hash IS NULL AND login_pin_salt IS NULL)
    OR (login_pin_hash IS NOT NULL AND login_pin_salt IS NOT NULL)
  );

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM information_schema.columns
    WHERE table_schema = 'public'
      AND table_name = 'devuser'
      AND column_name = 'user_id'
  ) THEN
    ALTER TABLE public.devuser
      ADD COLUMN user_id UUID REFERENCES auth.users(id);
  END IF;
END $$;

CREATE UNIQUE INDEX IF NOT EXISTS idx_devuser_user_id_unique
  ON public.devuser (user_id)
  WHERE user_id IS NOT NULL;

