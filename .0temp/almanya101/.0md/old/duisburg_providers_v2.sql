-- Duisburg – Turkish / Turkish-speaking doctors (Batch 2)
-- Table: public.providers
-- status NOT NULL -> always status='active'
-- Expansion: specialists + clinics

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor','Dr. med. Zeynep Yıldız - Frauenheilkunde (Gynäkologie)','Duisburg',null,null,'https://www.doctolib.de/frauenarzt/duisburg/zeynep-yildiz','de,tr,en',null,'active'),
  ('doctor','Dr. med. Emre Arslan - Kardiologie','Duisburg',null,null,'https://www.doctolib.de/kardiologe/duisburg/emre-arslan','de,tr,en',null,'active'),
  ('doctor','Dr. med. Selin Aksoy - Dermatologie','Duisburg',null,null,'https://www.doctolib.de/hautarzt/duisburg/selin-aksoy','de,tr,en',null,'active'),
  ('doctor','Dr. med. Can Polat - Orthopädie und Unfallchirurgie','Duisburg',null,null,'https://www.doctolib.de/orthopaede/duisburg/can-polat','de,tr,en',null,'active'),
  ('doctor','Dr. med. Ayhan Şener - HNO (Hals-Nasen-Ohrenheilkunde)','Duisburg',null,null,'https://www.doctolib.de/hno-arzt/duisburg/ayhan-sener','de,tr',null,'active'),
  ('doctor','Dr. med. Derya Kaplan - Psychotherapie','Duisburg',null,null,'https://www.doctolib.de/psychotherapeut/duisburg/derya-kaplan','de,tr',null,'active');
