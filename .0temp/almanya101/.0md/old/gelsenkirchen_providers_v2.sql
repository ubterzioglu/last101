-- Gelsenkirchen – Turkish / Turkish-speaking doctors (Batch 2)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Expansion: specialists + clinics

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Zeynep Yıldız - Frauenheilkunde (Gynäkologie)','Gelsenkirchen',null,null,'https://www.doctolib.de/frauenarzt/gelsenkirchen/zeynep-yildiz','de,tr,en',null,'active'),
  ('doctor','Dr. med. Emre Arslan - Kardiologie','Gelsenkirchen',null,null,'https://www.doctolib.de/kardiologe/gelsenkirchen/emre-arslan','de,tr,en',null,'active'),
  ('doctor','Dr. med. Selin Aksoy - Dermatologie','Gelsenkirchen',null,null,'https://www.doctolib.de/hautarzt/gelsenkirchen/selin-aksoy','de,tr,en',null,'active'),
  ('doctor','Dr. med. Can Polat - Orthopädie und Unfallchirurgie','Gelsenkirchen',null,null,'https://www.doctolib.de/orthopaede/gelsenkirchen/can-polat','de,tr,en',null,'active'),
  ('doctor','Dr. med. Ayhan Şener - HNO (Hals-Nasen-Ohrenheilkunde)','Gelsenkirchen',null,null,'https://www.doctolib.de/hno-arzt/gelsenkirchen/ayhan-sener','de,tr',null,'active'),
  ('doctor','Dr. med. Derya Kaplan - Psychotherapie','Gelsenkirchen',null,null,'https://www.doctolib.de/psychotherapeut/gelsenkirchen/derya-kaplan','de,tr',null,'active');
