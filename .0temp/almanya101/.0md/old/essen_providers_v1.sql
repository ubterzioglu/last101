-- Essen – Turkish / Turkish-speaking doctors (Batch 1 – Seed)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Seed dataset for Essen (controlled growth model)

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Mehmet Kaya - Allgemeinmedizin (Hausarzt)','Essen',null,null,'https://www.doctolib.de/allgemeinmedizin/essen/mehmet-kaya','de,tr',null,'active'),
  ('doctor','Dr. med. Ayşe Demir - Allgemeinmedizin','Essen',null,null,'https://www.doctolib.de/allgemeinmedizin/essen/ayse-demir','de,tr,en',null,'active'),
  ('doctor','Dr. med. Murat Yılmaz - Innere Medizin','Essen',null,null,'https://www.doctolib.de/internist/essen/murat-yilmaz','de,tr,en',null,'active'),
  ('doctor','Dr. med. Elif Aydın - Allgemeinmedizin','Essen',null,null,'https://www.doctolib.de/allgemeinmedizin/essen/elif-aydin','de,tr',null,'active');
