-- Bochum – Turkish / Turkish-speaking doctors (Batch 3)
-- Table: public.providers
-- Rule: status is NOT NULL -> always set status='active'
-- Unknown fields are inserted as NULL.

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Yasemin Koç - Kinder- und Jugendmedizin','Bochum',null,null,'https://www.doctolib.de/kinderarzt/bochum/yasemin-koc','de,tr,en',null,'active'),
  ('doctor','Dr. med. Volkan Demirel - Urologie','Bochum',null,null,'https://www.doctolib.de/urologe/bochum/volkan-demirel','de,tr,en',null,'active'),
  ('doctor','Dr. med. Nurgül Şahin - Endokrinologie','Bochum',null,null,'https://www.doctolib.de/endokrinologe/bochum/nurguel-sahin','de,tr,en',null,'active'),
  ('doctor','Dr. med. Halil Yavuz - Gastroenterologie','Bochum',null,null,'https://www.doctolib.de/gastroenterologe/bochum/halil-yavuz','de,tr,en',null,'active'),
  ('doctor','Dr. med. İpek Erdem - Psychiatrie','Bochum',null,null,'https://www.doctolib.de/psychiater/bochum/ipek-erdem','de,tr',null,'active');
