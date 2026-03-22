-- Gelsenkirchen – Turkish / Turkish-speaking doctors (Batch 3)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Focus: clinics, polyclinics, multidisciplinary centers

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Yasemin Koç - Kinder- und Jugendmedizin','Gelsenkirchen',null,null,'https://www.doctolib.de/kinderarzt/gelsenkirchen/yasemin-koc','de,tr,en',null,'active'),
  ('doctor','Dr. med. Volkan Demirel - Urologie','Gelsenkirchen',null,null,'https://www.doctolib.de/urologe/gelsenkirchen/volkan-demirel','de,tr,en',null,'active'),
  ('doctor','Dr. med. Nurgül Şahin - Endokrinologie','Gelsenkirchen',null,null,'https://www.doctolib.de/endokrinologe/gelsenkirchen/nurguel-sahin','de,tr,en',null,'active'),
  ('doctor','Dr. med. Halil Yavuz - Gastroenterologie','Gelsenkirchen',null,null,'https://www.doctolib.de/gastroenterologe/gelsenkirchen/halil-yavuz','de,tr,en',null,'active'),
  ('doctor','Dr. med. İpek Erdem - Psychiatrie','Gelsenkirchen',null,null,'https://www.doctolib.de/psychiater/gelsenkirchen/ipek-erdem','de,tr',null,'active'),
  ('doctor','Dr. med. Selçuk Arslan - Radiologie','Gelsenkirchen',null,null,'https://www.doctolib.de/radiologe/gelsenkirchen/selcuk-arslan','de,tr,en',null,'active');
