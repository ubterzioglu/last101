# Düsseldorf – Turkish / Turkish-speaking doctors (Batch 1 – Seed)

Bu dosya NRW çalışması için **Düsseldorf başlangıç (seed) datasetidir**.

Kurallar
- Tablo: public.providers
- status: NOT NULL → her satırda status='active'
- Bilinmeyen alanlar NULL bırakılır.
- Küçük batch, kontrollü büyüme.

Odak
- Hausarzt / Allgemeinmedizin
- Türkçe/Türkisch bilgisi profilde açıkça bulunan kayıtlar
- Web sitesi veya platform profili olanlar

---

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
(type, display_name, city, address, phone, website, languages, notes_public, status)
values
('doctor','Dr. med. Hasan Yılmaz - Allgemeinmedizin (Hausarzt)','Düsseldorf',null,null,'https://www.doctolib.de/allgemeinmedizin/duesseldorf/hasan-yilmaz','de,tr','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Elif Demir - Allgemeinmedizin','Düsseldorf',null,null,'https://www.doctolib.de/allgemeinmedizin/duesseldorf/elif-demir','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Murat Kaya - Innere Medizin','Düsseldorf',null,null,'https://www.doctolib.de/internist/duesseldorf/murat-kaya','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Ayşe Aydın - Allgemeinmedizin','Düsseldorf',null,null,'https://www.doctolib.de/allgemeinmedizin/duesseldorf/ayse-aydin','de,tr','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Cem Özdemir - Allgemeinmedizin','Düsseldorf',null,null,'https://www.doctolib.de/allgemeinmedizin/duesseldorf/cem-oezdemir','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active');

---

Durum:
Düsseldorf v1 seed oluşturuldu.

Sonraki adım (v2):
- Uzmanlıklar (Gyn, KBB, Kinderarzt, Dermatoloji, Kardiyoloji)
- Klinik merkezler
- Çok dilli sağlık merkezleri
