alter table public.vatandaslik_sorulari enable row level security;

drop policy if exists "Allow public read on vatandaslik_sorulari" on public.vatandaslik_sorulari;

create policy "Allow public read on vatandaslik_sorulari"
  on public.vatandaslik_sorulari
  for select
  to anon, authenticated
  using (true);

grant select on public.vatandaslik_sorulari to anon, authenticated;
