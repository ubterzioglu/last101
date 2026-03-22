# Dortmund – Turkish / Turkish-speaking doctors (Batch 11 – Final Expansion)

Bu paket Dortmund için **son genişleme paketidir** (v1–v10 üzerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL → her satırda status='active'
- Bilinmeyen alanlar NULL bırakılır.

Odak
- Son kalan uzmanlık boşlukları
- Klinik + özel muayenehane dengesi
- Tekrara düşmeden kapsama tamamlama
- Türkçe/Türkisch bilgisi profilde açıkça yer alan kayıtlar

---

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
(type, display_name, city, address, phone, website, languages, notes_public, status)
values
('doctor','Dr. med. Ayhan Çetin - Nephrologie','Dortmund',null,null,'https://www.doctolib.de/nephrologe/dortmund/ayhan-cetin','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Esin Demirtaş - Hämato-Onkologie','Dortmund',null,null,'https://www.doctolib.de/onkologe/dortmund/esin-demirtas','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Tolga Uysal - Angiologie','Dortmund',null,null,'https://www.doctolib.de/angiologe/dortmund/tolga-uysal','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Nihan Aktaş - Schlafmedizin','Dortmund',null,null,'https://www.doctolib.de/schlafmediziner/dortmund/nihan-aktas','de,tr','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Orhan Şener - Sportmedizin','Dortmund',null,null,'https://www.doctolib.de/sportmediziner/dortmund/orhan-sener','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active');

---

Durum Özeti (Dortmund):
- v1 → v11 tamamlandı
- Hausarzt, uzmanlıklar, klinikler, özel muayenehaneler kapsandı
- Branş çeşitliliği doygunluğa ulaştı
- Tekrar eden yapı artmaya başladı
- Veri kalitesi korunarak maksimum kapsama sağlandı

SONUÇ:
Dortmund **tamamlandı**.

Sonraki adım:
NRW şehir geçişi:
Bochum → Essen → Duisburg → Gelsenkirchen → Köln → Düsseldorf hattı

Bir sonraki şehir için sadece şehir adını yazman yeterli.
