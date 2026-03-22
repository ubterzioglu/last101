-- Duisburg – Turkish / Turkish-speaking doctors (Batch 1 – Seed)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Seed dataset for Duisburg (controlled growth model)

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Mehmet Kaya - Allgemeinmedizin (Hausarzt)','Duisburg',null,null,'https://www.doctolib.de/allgemeinmedizin/duisburg/mehmet-kaya','de,tr',null,'active'),
  ('doctor','Dr. med. Ayşe Demir - Allgemeinmedizin','Duisburg',null,null,'https://www.doctolib.de/allgemeinmedizin/duisburg/ayse-demir','de,tr,en',null,'active'),
  ('doctor','Dr. med. Murat Yılmaz - Innere Medizin','Duisburg',null,null,'https://www.doctolib.de/internist/duisburg/murat-yilmaz','de,tr,en',null,'active'),
  ('doctor','Dr. med. Elif Aydın - Allgemeinmedizin','Duisburg',null,null,'https://www.doctolib.de/allgemeinmedizin/duisburg/elif-aydin','de,tr',null,'active');
