-- docs/security/db-audit-2026-10-21.md bulgu 1–5'in kapatılması + hazırlık sırasında bulunan view yazma yolu.
-- Erişim eşlemesi (21 Ekim 2026): aşağıdaki tablolara yazma yapan canlı kodun tamamı service role ile çalışır
-- (lib/supabase/admin.ts); service role RLS ve tablo yetkilerinden etkilenmez.

-- 1) trigger_news_ingest: yalnızca pg_cron (postgres) çağırır; anonim tetikleme maliyet üretiyordu.
revoke execute on function public.trigger_news_ingest() from public, anon, authenticated;

-- 2) feedback_submissions / bookmark_submissions: "Service role ..." adlı ama rolü `public` olan ALL/true
--    policy'leri herkese okuma+silme veriyordu. Erişim yalnızca service role'lü API route'larından yapılır
--    (devuser-dis-submit, devuser-dis-list, devuser-dis-admin-*); bookmark_submissions kullanılmıyor.
drop policy if exists "Service role can do everything on feedback" on public.feedback_submissions;
drop policy if exists "Allow anonymous feedback submission" on public.feedback_submissions;
drop policy if exists "Only authenticated can read feedback" on public.feedback_submissions;
revoke all on public.feedback_submissions from anon, authenticated;

drop policy if exists "Service role can do everything on bookmarks" on public.bookmark_submissions;
revoke all on public.bookmark_submissions from anon, authenticated;

-- 3) devuser: koşulsuz UPDATE/INSERT policy'leri herkesin her profili değiştirmesine izin veriyordu.
--    Yazmalar /api/devuser-{register,update,me} ve admin route'larında service role ile yapılır.
--    SELECT policy'si ("Public read access for searchable profiles") korunur: /api/devuser/list ve
--    /api/devuser-count anon/cookie client ile okur.
drop policy if exists "Users can update own profile" on public.devuser;
drop policy if exists "Public insert access" on public.devuser;
revoke insert, update, delete, truncate, references, trigger on public.devuser from anon, authenticated;

-- 4) RLS'i kapalı eski etkinlik/vize tabloları: canlı kodda kullanılmıyor (endpoint'leri 404, son yazma
--    Şubat 2026). RLS açılır, policy yok, anon/authenticated yetkisi yok; veri service role ile erişilebilir.
alter table public.event_e1_date_votes enable row level security;
alter table public.event_e1_questions enable row level security;
alter table public.event_e2_questions enable row level security;
alter table public.event_e2_topic_votes enable row level security;
alter table public.vizeqa_questions enable row level security;
revoke all on public.event_e1_date_votes, public.event_e1_questions, public.event_e2_questions,
  public.event_e2_topic_votes, public.vizeqa_questions from anon, authenticated;

-- 5) View'lar postgres'e ait ve security_invoker değil: otomatik güncellenebilir bir view üzerinden yazma,
--    view sahibinin yetkisiyle çalışıp alttaki tablonun RLS'ini atlar (ör. PATCH /rest/v1/devuser_public).
--    View'larda anon/authenticated için yalnızca SELECT kalır.
revoke insert, update, delete, truncate, references, trigger on
  public.cvopt_participants_public, public.cvopt_satisfaction_stats, public.devuser_public,
  public.meeting_attendance_date_stats, public.meeting_attendance_stats, public.meeting_survey_date_stats,
  public.meeting_survey_stats, public.promote_participants_public, public.tavla_bracket_public,
  public.tavla_participants_public, public.typing_bracket_public, public.typing_participants_public,
  public.vct_participants_public
from anon, authenticated;
