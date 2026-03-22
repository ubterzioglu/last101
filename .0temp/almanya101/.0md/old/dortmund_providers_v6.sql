# Dortmund – Turkish / Turkish-speaking doctors (Batch 6)

Bu paket Dortmund için yeni kayıtlar içerir (v1–v5 üzerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL → her satırda status='active'
- Bilinmeyen alanlar NULL bırakılır.

Odak
- Klinik branş çeşitliliği
- Türkçe/Türkisch bilgisi profilde yer alan veya çok dilli klinik kayıtları

---

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor',
   'Dr. med. Nermin Kaya - Allgemeinmedizin',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/allgemeinmedizin/dortmund/nermin-kaya',
   'de,tr',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Yasin Acar - Innere Medizin',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/internist/dortmund/yasin-acar',
   'de,tr,en',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. Selin Koc - Frauenheilkunde (Gynäkologie)',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/frauenarzt/dortmund/selin-koc',
   'de,tr',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Kemal Arslan - Allgemeinchirurgie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/chirurg/dortmund/kemal-arslan',
   'de,tr,en',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Burak Özdemir - Unfallchirurgie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/unfallchirurg/dortmund/burak-oezdemir',
   'de,tr',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  )
;
