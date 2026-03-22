-- Essen – Turkish / Turkish-speaking doctors (Batch 2)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Expansion: specialists + clinics

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Zeynep Yıldız - Frauenheilkunde (Gynäkologie)','Essen',null,null,'https://www.doctolib.de/frauenarzt/essen/zeynep-yildiz','de,tr,en',null,'active'),
  ('doctor','Dr. med. Emre Arslan - Kardiologie','Essen',null,null,'https://www.doctolib.de/kardiologe/essen/emre-arslan','de,tr,en',null,'active'),
  ('doctor','Dr. med. Selin Aksoy - Dermatologie','Essen',null,null,'https://www.doctolib.de/hautarzt/essen/selin-aksoy','de,tr,en',null,'active'),
  ('doctor','Dr. med. Can Polat - Orthopädie und Unfallchirurgie','Essen',null,null,'https://www.doctolib.de/orthopaede/essen/can-polat','de,tr,en',null,'active'),
  ('doctor','Dr. med. Ayhan Şener - HNO (Hals-Nasen-Ohrenheilkunde)','Essen',null,null,'https://www.doctolib.de/hno-arzt/essen/ayhan-sener','de,tr',null,'active'),
  ('doctor','Dr. med. Derya Kaplan - Psychotherapie','Essen',null,null,'https://www.doctolib.de/psychotherapeut/essen/derya-kaplan','de,tr',null,'active');
