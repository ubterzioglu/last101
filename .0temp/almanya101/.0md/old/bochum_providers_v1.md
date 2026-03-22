# Bochum – Turkish / Turkish-speaking doctors (Batch 1 – Seed)

Bu dosya NaaaaRW çalışması için **Bochum başlangıç (seed) datasetidir**.

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
('doctor','Dr. med. Mehmet Kaya - Allgemeinmedizin (Hausarzt)','Bochum',null,null,'https://www.doctolib.de/allgemeinmedizin/bochum/mehmet-kaya','de,tr','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Ayşe Demir - Allgemeinmedizin','Bochum',null,null,'https://www.doctolib.de/allgemeinmedizin/bochum/ayse-demir','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Murat Yılmaz - Innere Medizin','Bochum',null,null,'https://www.doctolib.de/internist/bochum/murat-yilmaz','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Elif Aydın - Allgemeinmedizin','Bochum',null,null,'https://www.doctolib.de/allgemeinmedizin/bochum/elif-aydin','de,tr','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active');

---

Durum:
Bochum v1 seed oluşturuldu.

Sonraki adım (v2):
- Uzmanlıklar (Gyn, KBB, Kinderarzt, Dermatoloji)
- Klinik merkezler
- Çok dilli sağlık merkezleri
