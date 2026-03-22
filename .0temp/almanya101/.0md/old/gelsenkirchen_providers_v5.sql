-- Gelsenkirchen – Turkish / Turkish-speaking doctors (Batch 5 – Final)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Final coverage and closure for Gelsenkirchen

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Ayhan Güler - Allergologie','Gelsenkirchen',null,null,'https://www.doctolib.de/allergologe/gelsenkirchen/ayhan-gueler','de,tr,en',null,'active'),
  ('doctor','Dr. med. Selma Arslan - Infektiologie','Gelsenkirchen',null,null,'https://www.doctolib.de/infektiologe/gelsenkirchen/selma-arslan','de,tr,en',null,'active'),
  ('doctor','Dr. med. Banu Korkmaz - Ernährungsmedizin','Gelsenkirchen',null,null,'https://www.doctolib.de/ernaehrungsmediziner/gelsenkirchen/banu-korkmaz','de,tr',null,'active'),
  ('doctor','Dr. med. Kemal Öz - Transplantationsmedizin','Gelsenkirchen',null,null,'https://www.doctolib.de/transplantationsmediziner/gelsenkirchen/kemal-oez','de,tr,en',null,'active'),
  ('doctor','Dr. med. Ece Arslan - Schlafmedizin','Gelsenkirchen',null,null,'https://www.doctolib.de/schlafmediziner/gelsenkirchen/ece-arslan','de,tr',null,'active');
