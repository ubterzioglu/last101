# Dortmund – Turkish / Turkish-speaking doctors (Batch 7)

Bu paket Dortmund için yeni kayıtlar içerir (v1–v6 üzerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL → her satırda status='active'
- Bilinmeyen alanlar NULL bırakılır.

Odak
- Klinik dışı muayenehaneler
- Özel branşlar
- Çok dilli sağlık merkezleri
- Türkçe/Türkisch bilgisi profilde açıkça yer alan kayıtlar

---

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor',
   'Dr. med. Derya Kaplan - Psychotherapie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/psychotherapeut/dortmund/derya-kaplan',
   'de,tr',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. Can Yaman - Schmerztherapie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/schmerztherapeut/dortmund/can-yaman',
   'de,tr,en',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Ayşe Güler - HNO (Hals-Nasen-Ohrenheilkunde)',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/hno-arzt/dortmund/ayse-gueler',
   'de,tr',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Cem Özkan - Neurochirurgie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/neurochirurg/dortmund/cem-oezkan',
   'de,tr,en',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Leyla Sahin - Radiologie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/radiologe/dortmund/leyla-sahin',
   'de,tr,en',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  )
;
