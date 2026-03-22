-- Bochum – Turkish / Turkish-speaking doctors (Batch 5 – Final)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Final expansion and closure for Bochum

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Ayhan Güler - Allergologie','Bochum',null,null,'https://www.doctolib.de/allergologe/bochum/ayhan-gueler','de,tr,en',null,'active'),
  ('doctor','Dr. med. Selma Arslan - Infektiologie','Bochum',null,null,'https://www.doctolib.de/infektiologe/bochum/selma-arslan','de,tr,en',null,'active'),
  ('doctor','Dr. med. Banu Korkmaz - Ernährungsmedizin','Bochum',null,null,'https://www.doctolib.de/ernaehrungsmediziner/bochum/banu-korkmaz','de,tr',null,'active'),
  ('doctor','Dr. med. Kemal Öz - Transplantationsmedizin','Bochum',null,null,'https://www.doctolib.de/transplantationsmediziner/bochum/kemal-oez','de,tr,en',null,'active');
