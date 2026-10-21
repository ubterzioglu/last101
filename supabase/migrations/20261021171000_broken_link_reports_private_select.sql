-- "Admin can read all broken link reports" policy'si rol belirtmeden `using (true)` ile tanımlıydı;
-- bu, anon anahtarı olan herkesin tüm raporları okuyabilmesi demekti. Admin listesi service role ile
-- okur (RLS'i atlar), herkese açık form yalnızca insert yapar; bu yüzden SELECT policy'si kaldırılır.

drop policy if exists "Admin can read all broken link reports" on public.broken_link_reports;
