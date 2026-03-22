# Dortmund – Turkish / Turkish-speaking doctors (Batch 9)

Bu paket Dortmund için yeni kayıtlar içerir (v1–v8 üzerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL → her satırda status='active'
- Bilinmeyen alanlar NULL bırakılır.

Odak
- Klinik merkezler
- Poliklinik yapılar
- Çok disiplinli sağlık merkezleri
- Türkçe/Türkisch bilgisi profilde açıkça yer alan kayıtlar

---

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor',
   'Dr. med. Hakan Demirtas - Allgemeinmedizin',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/allgemeinmedizin/dortmund/hakan-demirtas',
   'de,tr',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Seda Acar - Innere Medizin',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/internist/dortmund/seda-acar',
   'de,tr,en',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Yavuz Kaan - Kardiologie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/kardiologe/dortmund/yavuz-kaan',
   'de,tr,en',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Banu Toprak - Neurologie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/neurologe/dortmund/banu-toprak',
   'de,tr,en',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Kaan Aksoy - Orthopädie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/orthopaede/dortmund/kaan-aksoy',
   'de,tr',
   'Doctolib profilinde Türkisch konuşulduğu belirtiliyor.',
   'active'
  )
;
