-- Fix invalid regex in devuser login email format constraint.
-- PostgreSQL regex engine does not support \s; use POSIX character classes.

ALTER TABLE public.devuser
  DROP CONSTRAINT IF EXISTS check_devuser_login_email_format;

ALTER TABLE public.devuser
  ADD CONSTRAINT check_devuser_login_email_format
  CHECK (
    login_email IS NULL
    OR login_email ~* '^[^[:space:]@]+@[^[:space:]@]+\.[^[:space:]@]+$'
  );
