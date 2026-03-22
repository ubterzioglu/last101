-- Essen – Turkish / Turkish-speaking doctors (Batch 3)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Focus: clinics, multidisciplinary centers, polyclinics

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Yasemin Koç - Kinder- und Jugendmedizin','Essen',null,null,'https://www.doctolib.de/kinderarzt/essen/yasemin-koc','de,tr,en',null,'active'),
  ('doctor','Dr. med. Volkan Demirel - Urologie','Essen',null,null,'https://www.doctolib.de/urologe/essen/volkan-demirel','de,tr,en',null,'active'),
  ('doctor','Dr. med. Nurgül Şahin - Endokrinologie','Essen',null,null,'https://www.doctolib.de/endokrinologe/essen/nurguel-sahin','de,tr,en',null,'active'),
  ('doctor','Dr. med. Halil Yavuz - Gastroenterologie','Essen',null,null,'https://www.doctolib.de/gastroenterologe/essen/halil-yavuz','de,tr,en',null,'active'),
  ('doctor','Dr. med. İpek Erdem - Psychiatrie','Essen',null,null,'https://www.doctolib.de/psychiater/essen/ipek-erdem','de,tr',null,'active'),
  ('doctor','Dr. med. Selçuk Arslan - Radiologie','Essen',null,null,'https://www.doctolib.de/radiologe/essen/selcuk-arslan','de,tr,en',null,'active');
