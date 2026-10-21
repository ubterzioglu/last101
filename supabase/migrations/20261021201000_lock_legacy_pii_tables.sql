-- Eski statik uygulamadan kalan, mevcut kodun hiç kullanmadığı tablolar (erişim haritası + doğrulama).
-- Ad, telefon (whatsapp), LinkedIn gibi kişisel veriler içerebilirler ve anon/authenticated'a tam yetkiyle
-- açıklardı (ör. meeting_surveys_public_read: SELECT TO anon, authenticated USING (true);
-- sprachcafe_submissions "Allow users to view their own submissions": SELECT TO authenticated USING (true)).
-- Veri korunur; yalnızca service role erişebilir. Bunlara bağlı *_stats view'ları postgres'e ait olduğu
-- için çalışmaya devam eder.
revoke all on
  public.meeting_surveys, public.supporteachother, public.sprachcafe_submissions,
  public.cvopt_satisfaction_surveys, public.question_submissions,
  public.zgen_compat, public.zgen_generations, public.zgen_profiles
from anon, authenticated;
