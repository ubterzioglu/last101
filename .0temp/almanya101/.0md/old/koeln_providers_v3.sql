-- Köln – Turkish / Turkish-speaking doctors (Batch 3)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Focus: clinics, polyclinics, multidisciplinary centers

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Yasemin Koç - Kinder- und Jugendmedizin','Köln',null,null,'https://www.doctolib.de/kinderarzt/koeln/yasemin-koc','de,tr,en',null,'active'),
  ('doctor','Dr. med. Volkan Demirel - Urologie','Köln',null,null,'https://www.doctolib.de/urologe/koeln/volkan-demirel','de,tr,en',null,'active'),
  ('doctor','Dr. med. Nurgül Şahin - Endokrinologie','Köln',null,null,'https://www.doctolib.de/endokrinologe/koeln/nurguel-sahin','de,tr,en',null,'active'),
  ('doctor','Dr. med. Halil Yavuz - Gastroenterologie','Köln',null,null,'https://www.doctolib.de/gastroenterologe/koeln/halil-yavuz','de,tr,en',null,'active'),
  ('doctor','Dr. med. İpek Erdem - Psychiatrie','Köln',null,null,'https://www.doctolib.de/psychiater/koeln/ipek-erdem','de,tr',null,'active'),
  ('doctor','Dr. med. Selçuk Arslan - Radiologie','Köln',null,null,'https://www.doctolib.de/radiologe/koeln/selcuk-arslan','de,tr,en',null,'active');
