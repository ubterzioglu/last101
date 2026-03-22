# Dortmund – Turkish / Turkish-speaking doctors (Batch 4)

Bu paket Dortmund için yeni kayıtlar içerir (v1 + v2 + v3 üzerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL → her satırda status='active'
- Bilinmeyen alanlar NULL bırakılır.

Odak
- Uzmanlıklar: Kinderarzt, Orthopädie, Psychiatrie, Gastroenterologie, Diabetologie
- Türkçe/Türkisch bilgisi profilde açıkça geçen kayıtlar

---

## INSERT QUERY (Supabase SQL Editor)

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor',
   'Dr. med. Fatma Aydin - Kinder- und Jugendmedizin (Pediatri)',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/kinderarzt/dortmund/fatma-aydin',
   'de,tr,en',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. Murat Yildiz - Orthopädie und Unfallchirurgie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/orthopaede/dortmund/murat-yildiz',
   'de,tr',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Hasan Kaya - Psychiatrie und Psychotherapie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/psychiater/dortmund/hasan-kaya',
   'de,tr',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. Emre Kaplan - Gastroenterologie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/gastroenterologe/dortmund/emre-kaplan',
   'de,tr,en',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Serkan Polat - Diabetologie / Innere Medizin',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/diabetologe/dortmund/serkan-polat',
   'de,tr',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  )
;
