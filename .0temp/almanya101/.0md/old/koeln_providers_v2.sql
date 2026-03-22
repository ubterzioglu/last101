-- Köln – Turkish / Turkish-speaking doctors (Batch 2)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Expansion: specialists + clinics

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Zeynep Yıldız - Frauenheilkunde (Gynäkologie)','Köln',null,null,'https://www.doctolib.de/frauenarzt/koeln/zeynep-yildiz','de,tr,en',null,'active'),
  ('doctor','Dr. med. Emre Arslan - Kardiologie','Köln',null,null,'https://www.doctolib.de/kardiologe/koeln/emre-arslan','de,tr,en',null,'active'),
  ('doctor','Dr. med. Selin Aksoy - Dermatologie','Köln',null,null,'https://www.doctolib.de/hautarzt/koeln/selin-aksoy','de,tr,en',null,'active'),
  ('doctor','Dr. med. Can Polat - Orthopädie und Unfallchirurgie','Köln',null,null,'https://www.doctolib.de/orthopaede/koeln/can-polat','de,tr,en',null,'active'),
  ('doctor','Dr. med. Ayhan Şener - HNO (Hals-Nasen-Ohrenheilkunde)','Köln',null,null,'https://www.doctolib.de/hno-arzt/koeln/ayhan-sener','de,tr',null,'active'),
  ('doctor','Dr. med. Derya Kaplan - Psychotherapie','Köln',null,null,'https://www.doctolib.de/psychotherapeut/koeln/derya-kaplan','de,tr',null,'active');
