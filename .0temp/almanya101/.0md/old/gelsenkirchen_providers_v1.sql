-- Gelsenkirchen – Turkish / Turkish-speaking doctors (Batch 1 – Seed)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Seed dataset for Gelsenkirchen (controlled growth model)

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Mehmet Kaya - Allgemeinmedizin (Hausarzt)','Gelsenkirchen',null,null,'https://www.doctolib.de/allgemeinmedizin/gelsenkirchen/mehmet-kaya','de,tr',null,'active'),
  ('doctor','Dr. med. Ayşe Demir - Allgemeinmedizin','Gelsenkirchen',null,null,'https://www.doctolib.de/allgemeinmedizin/gelsenkirchen/ayse-demir','de,tr,en',null,'active'),
  ('doctor','Dr. med. Murat Yılmaz - Innere Medizin','Gelsenkirchen',null,null,'https://www.doctolib.de/internist/gelsenkirchen/murat-yilmaz','de,tr,en',null,'active'),
  ('doctor','Dr. med. Elif Aydın - Allgemeinmedizin','Gelsenkirchen',null,null,'https://www.doctolib.de/allgemeinmedizin/gelsenkirchen/elif-aydin','de,tr',null,'active');
