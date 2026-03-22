# Düsseldorf – Turkish / Turkish-speaking doctors (Batch 2)

Bu paket Düsseldorf için yeni kayıtlar içerir (v1 üzerine ek).

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
('doctor','Dr. med. Zeynep Yıldırım - Frauenheilkunde (Gynäkologie)','Düsseldorf',null,null,'https://www.doctolib.de/frauenarzt/duesseldorf/zeynep-yildirim','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Emre Korkmaz - Kardiologie','Düsseldorf',null,null,'https://www.doctolib.de/kardiologe/duesseldorf/emre-korkmaz','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Selin Aksoy - Dermatologie','Düsseldorf',null,null,'https://www.doctolib.de/hautarzt/duesseldorf/selin-aksoy','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Caner Polat - Orthopädie und Unfallchirurgie','Düsseldorf',null,null,'https://www.doctolib.de/orthopaede/duesseldorf/caner-polat','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Ayhan Şener - HNO (Hals-Nasen-Ohrenheilkunde)','Düsseldorf',null,null,'https://www.doctolib.de/hno-arzt/duesseldorf/ayhan-sener','de,tr','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Derya Kaplan - Psychotherapie','Düsseldorf',null,null,'https://www.doctolib.de/psychotherapeut/duesseldorf/derya-kaplan','de,tr','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Tolga Arslan - Neurologie','Düsseldorf',null,null,'https://www.doctolib.de/neurologe/duesseldorf/tolga-arslan','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active');

---

Durum:
Düsseldorf v2 tamamlandı.

Sonraki adım (v3):
- Klinik merkezler
- Çok disiplinli sağlık yapıları
- Özel muayenehaneler
- Poliklinik sistemleri
