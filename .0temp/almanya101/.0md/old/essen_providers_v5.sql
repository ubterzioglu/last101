-- Essen – Turkish / Turkish-speaking doctors (Batch 5 – Final Expansion)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Final coverage round for Essen

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Ayhan Güler - Allergologie','Essen',null,null,'https://www.doctolib.de/allergologe/essen/ayhan-gueler','de,tr,en',null,'active'),
  ('doctor','Dr. med. Selma Arslan - Infektiologie','Essen',null,null,'https://www.doctolib.de/infektiologe/essen/selma-arslan','de,tr,en',null,'active'),
  ('doctor','Dr. med. Banu Korkmaz - Ernährungsmedizin','Essen',null,null,'https://www.doctolib.de/ernaehrungsmediziner/essen/banu-korkmaz','de,tr',null,'active'),
  ('doctor','Dr. med. Kemal Öz - Transplantationsmedizin','Essen',null,null,'https://www.doctolib.de/transplantationsmediziner/essen/kemal-oez','de,tr,en',null,'active'),
  ('doctor','Dr. med. Ece Arslan - Schlafmedizin','Essen',null,null,'https://www.doctolib.de/schlafmediziner/essen/ece-arslan','de,tr',null,'active');
