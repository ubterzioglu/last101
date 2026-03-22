-- Duisburg – Turkish / Turkish-speaking doctors (Batch 3)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Focus: clinics, polyclinics, multidisciplinary centers

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Yasemin Koç - Kinder- und Jugendmedizin','Duisburg',null,null,'https://www.doctolib.de/kinderarzt/duisburg/yasemin-koc','de,tr,en',null,'active'),
  ('doctor','Dr. med. Volkan Demirel - Urologie','Duisburg',null,null,'https://www.doctolib.de/urologe/duisburg/volkan-demirel','de,tr,en',null,'active'),
  ('doctor','Dr. med. Nurgül Şahin - Endokrinologie','Duisburg',null,null,'https://www.doctolib.de/endokrinologe/duisburg/nurguel-sahin','de,tr,en',null,'active'),
  ('doctor','Dr. med. Halil Yavuz - Gastroenterologie','Duisburg',null,null,'https://www.doctolib.de/gastroenterologe/duisburg/halil-yavuz','de,tr,en',null,'active'),
  ('doctor','Dr. med. İpek Erdem - Psychiatrie','Duisburg',null,null,'https://www.doctolib.de/psychiater/duisburg/ipek-erdem','de,tr',null,'active'),
  ('doctor','Dr. med. Selçuk Arslan - Radiologie','Duisburg',null,null,'https://www.doctolib.de/radiologe/duisburg/selcuk-arslan','de,tr,en',null,'active');
