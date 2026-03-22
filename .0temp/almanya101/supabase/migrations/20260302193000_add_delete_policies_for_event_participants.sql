-- Enable delete from admin panel for participant tables.
-- Existing RLS policies allow SELECT/INSERT and UPDATE, but not DELETE.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'tavla_participants' AND policyname = 'Tavla: Admin silebilir'
  ) THEN
    CREATE POLICY "Tavla: Admin silebilir" ON public.tavla_participants
      FOR DELETE USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'vct_participants' AND policyname = 'VCT: Admin silebilir'
  ) THEN
    CREATE POLICY "VCT: Admin silebilir" ON public.vct_participants
      FOR DELETE USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'typing_participants' AND policyname = 'Typing: Admin silebilir'
  ) THEN
    CREATE POLICY "Typing: Admin silebilir" ON public.typing_participants
      FOR DELETE USING (auth.role() = 'authenticated');
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'promote_participants' AND policyname = 'Promote: Admin silebilir'
  ) THEN
    CREATE POLICY "Promote: Admin silebilir" ON public.promote_participants
      FOR DELETE USING (auth.role() = 'authenticated');
  END IF;
END $$;
