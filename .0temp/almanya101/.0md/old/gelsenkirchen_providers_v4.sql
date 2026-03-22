-- Gelsenkirchen – Turkish / Turkish-speaking doctors (Batch 4)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Focus: clinic/polyclinic heavy expansion

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Orhan Demir - Rehabilitationsmedizin','Gelsenkirchen',null,null,'https://www.doctolib.de/rehamediziner/gelsenkirchen/orhan-demir','de,tr,en',null,'active'),
  ('doctor','Dr. med. Tamer Koç - Nephrologie','Gelsenkirchen',null,null,'https://www.doctolib.de/nephrologe/gelsenkirchen/tamer-koc','de,tr,en',null,'active'),
  ('doctor','Dr. med. Burak Yıldız - Sportmedizin','Gelsenkirchen',null,null,'https://www.doctolib.de/sportmediziner/gelsenkirchen/burak-yildiz','de,tr,en',null,'active'),
  ('doctor','Dr. med. Nalan Öztürk - Geriatrie','Gelsenkirchen',null,null,'https://www.doctolib.de/geriater/gelsenkirchen/nalan-oeztuerk','de,tr,en',null,'active'),
  ('doctor','Dr. med. İsmail Acar - Gefäßchirurgie','Gelsenkirchen',null,null,'https://www.doctolib.de/gefaesschirurg/gelsenkirchen/ismail-acar','de,tr,en',null,'active');
