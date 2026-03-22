# Dortmund – Turkish / Turkish-speaking doctors (Batch 8)

Bu paket Dortmund için yeni kayıtlar içerir (v1–v7 üzerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL → her satırda status='active'
- Bilinmeyen alanlar NULL bırakılır.

Odak
- Klinik + özel muayenehane karışık
- Nadir branşlar
- Çok dilli merkezler
- Türkçe/Türkisch bilgisi profilde açıkça yer alan kayıtlar

---

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor',
   'Dr. med. Zübeyde Karaca - Plastische und Ästhetische Chirurgie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/plastischer-chirurg/dortmund/zuebeyde-karaca',
   'de,tr,en',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Volkan Arslan - Gefäßchirurgie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/gefaesschirurg/dortmund/volkan-arslan',
   'de,tr,en',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Esra Koc - Reproduktionsmedizin / Kinderwunschzentrum',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/reproduktionsmediziner/dortmund/esra-koc',
   'de,tr,en',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Tuncay Yalcin - Schmerzmedizin / Palliativmedizin',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/palliativmediziner/dortmund/tuncay-yalcin',
   'de,tr,en',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Elif Arikan - Arbeitsmedizin',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/arbeitsmediziner/dortmund/elif-arikan',
   'de,tr',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  )
;
