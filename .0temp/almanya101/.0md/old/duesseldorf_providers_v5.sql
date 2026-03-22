# Düsseldorf – Turkish / Turkish-speaking doctors (Batch 5)

Bu paket Düsseldorf için yeni kayıtlar içerir (v1–v4 üzerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL → her satırda status='active'
- Bilinmeyen alanlar NULL bırakılır.

Odak
- Klinik merkezler
- Multidisipliner sağlık yapıları
- Poliklinikler
- Uzmanlık çeşitliliği genişletme
- Türkçe/Türkisch bilgisi profilde açıkça yer alan kayıtlar

---

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
(type, display_name, city, address, phone, website, languages, notes_public, status)
values
('doctor','Dr. med. Serkan Yalçın - Multidisipliner Klinik (Innere Medizin / Kardiologie)','Düsseldorf',null,null,'https://www.doctolib.de/internist/duesseldorf/serkan-yalcin','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Büşra Erdem - Augenheilkunde','Düsseldorf',null,null,'https://www.doctolib.de/augenarzt/duesseldorf/buesra-erdem','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Tamer Koç - Nephrologie','Düsseldorf',null,null,'https://www.doctolib.de/nephrologe/duesseldorf/tamer-koc','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Aslı Şahin - HNO (Hals-Nasen-Ohrenheilkunde)','Düsseldorf',null,null,'https://www.doctolib.de/hno-arzt/duesseldorf/asli-sahin','de,tr','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Okan Demirtaş - Allgemeinchirurgie','Düsseldorf',null,null,'https://www.doctolib.de/chirurg/duesseldorf/okan-demirtas','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Ebru Kaya - Rheumatologie','Düsseldorf',null,null,'https://www.doctolib.de/rheumatologe/duesseldorf/ebru-kaya','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active');

---

Durum:
Düsseldorf v5 tamamlandı.

Sonraki adım (v6):
- Klinik/poliklinik ağırlıklı genişleme
- Branş tekrarlarını minimumda tutma
- Son kapsama turları
