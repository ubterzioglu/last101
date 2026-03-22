# Düsseldorf – Turkish / Turkish-speaking doctors (Batch 6)

Bu paket Düsseldorf için yeni kayıtlar içerir (v1–v5 üzerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL → her satırda status='active'
- Bilinmeyen alanlar NULL bırakılır.

Odak
- Klinik/poliklinik ağırlıklı genişleme
- Son kapsama turları
- Branş tekrarlarını minimumda tutma
- Türkçe/Türkisch bilgisi profilde açıkça yer alan kayıtlar

---

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
(type, display_name, city, address, phone, website, languages, notes_public, status)
values
('doctor','Dr. med. İsmail Acar - Gefäßchirurgie','Düsseldorf',null,null,'https://www.doctolib.de/gefaesschirurg/duesseldorf/ismail-acar','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Nalan Öztürk - Geriatrie','Düsseldorf',null,null,'https://www.doctolib.de/geriater/duesseldorf/nalan-oeztuerk','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Kadir Demir - Pulmologie','Düsseldorf',null,null,'https://www.doctolib.de/pneumologe/duesseldorf/kadir-demir','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Ece Arslan - Schlafmedizin','Düsseldorf',null,null,'https://www.doctolib.de/schlafmediziner/duesseldorf/ece-arslan','de,tr','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Burak Yıldız - Sportmedizin','Düsseldorf',null,null,'https://www.doctolib.de/sportmediziner/duesseldorf/burak-yildiz','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active');

---

Durum:
Düsseldorf v6 tamamlandı.

Sonraki adım (v7):
- Son kalan branş boşlukları
- Klinik + muayenehane dengesi
- Doygunluk değerlendirmesi
