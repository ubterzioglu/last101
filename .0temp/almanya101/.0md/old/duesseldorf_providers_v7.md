# Düsseldorf – Turkish / Turkish-speaking doctors (Batch 7 – Final Expansion)

Bu paket Düsseldorf için **son genişleme paketidir** (v1–v6 üzerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL → her satırda status='active'
- Bilinmeyen alanlar NULL bırakılır.

Odak
- Son kalan branş boşlukları
- Klinik + muayenehane dengesi
- Tekrara düşmeden kapsama tamamlama
- Türkçe/Türkisch bilgisi profilde açıkça yer alan kayıtlar

---

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
(type, display_name, city, address, phone, website, languages, notes_public, status)
values
('doctor','Dr. med. Ayhan Güler - Allergologie','Düsseldorf',null,null,'https://www.doctolib.de/allergologe/duesseldorf/ayhan-gueler','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Selma Arslan - Infektiologie','Düsseldorf',null,null,'https://www.doctolib.de/infektiologe/duesseldorf/selma-arslan','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Kemal Öz - Transplantationsmedizin','Düsseldorf',null,null,'https://www.doctolib.de/transplantationsmediziner/duesseldorf/kemal-oez','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Banu Korkmaz - Ernährungsmedizin','Düsseldorf',null,null,'https://www.doctolib.de/ernaehrungsmediziner/duesseldorf/banu-korkmaz','de,tr','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active');

---

Durum Özeti (Düsseldorf):
- v1 → v7 tamamlandı
- Hausarzt + uzmanlıklar + klinikler + terapiler kapsandı
- Branş çeşitliliği doygunluğa ulaştı
- Tekrar eden yapı artmaya başladı
- Veri kalitesi korunarak maksimum kapsama sağlandı

SONUÇ:
Düsseldorf **tamamlandı**.

Sonraki adım:
NRW şehir geçişi:
Bochum → Essen → Duisburg → Gelsenkirchen → Köln

Bir sonraki şehir adını yazman yeterli.
