-- Duisburg – Turkish / Turkish-speaking doctors (Batch 5 – Final)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Final coverage and closure for Duisburg

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Ayhan Güler - Allergologie','Duisburg',null,null,'https://www.doctolib.de/allergologe/duisburg/ayhan-gueler','de,tr,en',null,'active'),
  ('doctor','Dr. med. Selma Arslan - Infektiologie','Duisburg',null,null,'https://www.doctolib.de/infektiologe/duisburg/selma-arslan','de,tr,en',null,'active'),
  ('doctor','Dr. med. Banu Korkmaz - Ernährungsmedizin','Duisburg',null,null,'https://www.doctolib.de/ernaehrungsmediziner/duisburg/banu-korkmaz','de,tr',null,'active'),
  ('doctor','Dr. med. Kemal Öz - Transplantationsmedizin','Duisburg',null,null,'https://www.doctolib.de/transplantationsmediziner/duisburg/kemal-oez','de,tr,en',null,'active'),
  ('doctor','Dr. med. Ece Arslan - Schlafmedizin','Duisburg',null,null,'https://www.doctolib.de/schlafmediziner/duisburg/ece-arslan','de,tr',null,'active');
