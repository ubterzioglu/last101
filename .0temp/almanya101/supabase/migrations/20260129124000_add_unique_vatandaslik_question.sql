alter table public.vatandaslik_sorulari
  add constraint vatandaslik_sorulari_eyalet_soru_almanca_unique
  unique (eyalet, soru_almanca);
