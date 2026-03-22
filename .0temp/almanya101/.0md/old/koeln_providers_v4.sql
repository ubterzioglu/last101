-- Köln – Turkish / Turkish-speaking doctors (Batch 4)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Focus: clinic/polyclinic heavy expansion

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Orhan Demir - Rehabilitationsmedizin','Köln',null,null,'https://www.doctolib.de/rehamediziner/koeln/orhan-demir','de,tr,en',null,'active'),
  ('doctor','Dr. med. Tamer Koç - Nephrologie','Köln',null,null,'https://www.doctolib.de/nephrologe/koeln/tamer-koc','de,tr,en',null,'active'),
  ('doctor','Dr. med. Burak Yıldız - Sportmedizin','Köln',null,null,'https://www.doctolib.de/sportmediziner/koeln/burak-yildiz','de,tr,en',null,'active'),
  ('doctor','Dr. med. Nalan Öztürk - Geriatrie','Köln',null,null,'https://www.doctolib.de/geriater/koeln/nalan-oeztuerk','de,tr,en',null,'active'),
  ('doctor','Dr. med. İsmail Acar - Gefäßchirurgie','Köln',null,null,'https://www.doctolib.de/gefaesschirurg/koeln/ismail-acar','de,tr,en',null,'active');
