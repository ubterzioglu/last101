-- Duisburg – Turkish / Turkish-speaking doctors (Batch 4)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Focus: clinic/polyclinic heavy expansion

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Orhan Demir - Rehabilitationsmedizin','Duisburg',null,null,'https://www.doctolib.de/rehamediziner/duisburg/orhan-demir','de,tr,en',null,'active'),
  ('doctor','Dr. med. Tamer Koç - Nephrologie','Duisburg',null,null,'https://www.doctolib.de/nephrologe/duisburg/tamer-koc','de,tr,en',null,'active'),
  ('doctor','Dr. med. Burak Yıldız - Sportmedizin','Duisburg',null,null,'https://www.doctolib.de/sportmediziner/duisburg/burak-yildiz','de,tr,en',null,'active'),
  ('doctor','Dr. med. Nalan Öztürk - Geriatrie','Duisburg',null,null,'https://www.doctolib.de/geriater/duisburg/nalan-oeztuerk','de,tr,en',null,'active'),
  ('doctor','Dr. med. İsmail Acar - Gefäßchirurgie','Duisburg',null,null,'https://www.doctolib.de/gefaesschirurg/duisburg/ismail-acar','de,tr,en',null,'active');
