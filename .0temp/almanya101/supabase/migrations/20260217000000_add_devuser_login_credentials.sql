-- Add login credentials for devuserlist authentication
-- Date: 2026-02-17

ALTER TABLE public.devuser
  ADD COLUMN IF NOT EXISTS login_email TEXT,
  ADD COLUMN IF NOT EXISTS login_pin_hash TEXT,
  ADD COLUMN IF NOT EXISTS login_pin_salt TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS idx_devuser_login_email_unique
  ON public.devuser (lower(login_email))
  WHERE login_email IS NOT NULL;

ALTER TABLE public.devuser
  DROP CONSTRAINT IF EXISTS check_devuser_login_email_format;

ALTER TABLE public.devuser
  ADD CONSTRAINT check_devuser_login_email_format
  CHECK (
    login_email IS NULL
    OR login_email ~* '^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$'
  );

ALTER TABLE public.devuser
  DROP CONSTRAINT IF EXISTS check_devuser_login_hash_presence;

ALTER TABLE public.devuser
  ADD CONSTRAINT check_devuser_login_hash_presence
  CHECK (
    (login_email IS NULL AND login_pin_hash IS NULL AND login_pin_salt IS NULL)
    OR (login_email IS NOT NULL AND login_pin_hash IS NOT NULL AND login_pin_salt IS NOT NULL)
  );
