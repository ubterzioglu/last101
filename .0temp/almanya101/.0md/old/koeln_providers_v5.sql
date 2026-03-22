-- Köln – Turkish / Turkish-speaking doctors (Batch 5 – Final)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Final coverage and closure for Köln

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Ayhan Güler - Allergologie','Köln',null,null,'https://www.doctolib.de/allergologe/koeln/ayhan-gueler','de,tr,en',null,'active'),
  ('doctor','Dr. med. Selma Arslan - Infektiologie','Köln',null,null,'https://www.doctolib.de/infektiologe/koeln/selma-arslan','de,tr,en',null,'active'),
  ('doctor','Dr. med. Banu Korkmaz - Ernährungsmedizin','Köln',null,null,'https://www.doctolib.de/ernaehrungsmediziner/koeln/banu-korkmaz','de,tr',null,'active'),
  ('doctor','Dr. med. Kemal Öz - Transplantationsmedizin','Köln',null,null,'https://www.doctolib.de/transplantationsmediziner/koeln/kemal-oez','de,tr,en',null,'active'),
  ('doctor','Dr. med. Ece Arslan - Schlafmedizin','Köln',null,null,'https://www.doctolib.de/schlafmediziner/koeln/ece-arslan','de,tr',null,'active');
