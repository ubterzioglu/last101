alter table public.vatandaslik_sorulari enable row level security;
create policy "Allow public read on vatandaslik_sorulari"
  on public.vatandaslik_sorulari
  for select
  using (true);
