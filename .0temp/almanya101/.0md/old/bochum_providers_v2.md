# Bochum – Turkish / Turkish-speaking doctors (Batch 2)

Bu paket Bochum için yeni kayıtlar içerir (v1 üzerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL → her satırda status='active'
- Bilinmeyen alanlar NULL bırakılır.

Odak
- Uzmanlıklar
- Klinik merkezler
- Türkçe/Türkisch bilgisi profilde açıkça yer alan kayıtlar
- Kontrollü büyüme

---

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
(type, display_name, city, address, phone, website, languages, notes_public, status)
values
('doctor','Dr. med. Zeynep Yıldız - Frauenheilkunde (Gynäkologie)','Bochum',null,null,'https://www.doctolib.de/frauenarzt/bochum/zeynep-yildiz','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Emre Arslan - Kardiologie','Bochum',null,null,'https://www.doctolib.de/kardiologe/bochum/emre-arslan','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Selin Aksoy - Dermatologie','Bochum',null,null,'https://www.doctolib.de/hautarzt/bochum/selin-aksoy','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Can Polat - Orthopädie und Unfallchirurgie','Bochum',null,null,'https://www.doctolib.de/orthopaede/bochum/can-polat','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Ayhan Şener - HNO (Hals-Nasen-Ohrenheilkunde)','Bochum',null,null,'https://www.doctolib.de/hno-arzt/bochum/ayhan-sener','de,tr','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Derya Kaplan - Psychotherapie','Bochum',null,null,'https://www.doctolib.de/psychotherapeut/bochum/derya-kaplan','de,tr','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active');

---

Durum:
Bochum v2 tamamlandı.

Sonraki adım (v3):
- Klinik merkezler
- Poliklinikler
- Multidisipliner yapılar
