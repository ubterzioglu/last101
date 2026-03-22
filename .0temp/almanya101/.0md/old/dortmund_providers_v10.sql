# Dortmund – Turkish / Turkish-speaking doctors (Batch 10)

Bu paket Dortmund için yeni kayıtlar içerir (v1–v9 üzerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL → her satırda status='active'
- Bilinmeyen alanlar NULL bırakılır.

Odak
- Son genişleme
- Tekrarlayan branşları minimumda tutma
- Klinik + muayenehane dengesi
- Türkçe/Türkisch bilgisi profilde açıkça yer alan kayıtlar

---

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor',
   'Dr. med. Mehmet Akın - Allgemeinmedizin',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/allgemeinmedizin/dortmund/mehmet-akin',
   'de,tr',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Pelin Şahin - Frauenheilkunde (Gynäkologie)',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/frauenarzt/dortmund/pelin-sahin',
   'de,tr,en',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Hakan Yavuz - Dermatologie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/hautarzt/dortmund/hakan-yavuz',
   'de,tr,en',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Serap Kılıç - Psychosomatische Medizin',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/psychosomatiker/dortmund/serap-kilic',
   'de,tr',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  )
;
