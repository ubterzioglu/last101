-- Bochum – Turkish / Turkish-speaking doctors (Batch 4)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Final coverage round for Bochum

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Selçuk Arslan - Radiologie','Bochum',null,null,'https://www.doctolib.de/radiologe/bochum/selcuk-arslan','de,tr,en',null,'active'),
  ('doctor','Dr. med. Orhan Demir - Rehabilitationsmedizin','Bochum',null,null,'https://www.doctolib.de/rehamediziner/bochum/orhan-demir','de,tr,en',null,'active'),
  ('doctor','Dr. med. Tamer Koç - Nephrologie','Bochum',null,null,'https://www.doctolib.de/nephrologe/bochum/tamer-koc','de,tr,en',null,'active'),
  ('doctor','Dr. med. Burak Yıldız - Sportmedizin','Bochum',null,null,'https://www.doctolib.de/sportmediziner/bochum/burak-yildiz','de,tr,en',null,'active'),
  ('doctor','Dr. med. Nalan Öztürk - Geriatrie','Bochum',null,null,'https://www.doctolib.de/geriater/bochum/nalan-oeztuerk','de,tr,en',null,'active');
