# Dortmund – Turkish / Turkish-speaking doctors (Batch 3)

Bu paket Dortmund için yeni kayıtlar içerir (v1 + v2 üzerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL → her satırda status='active'
- Bilinmeyen alanlar NULL bırakılır.

Kaynak yaklaşımı
- Bu batch’te yalnızca “Türkisch/Türkçe” bilgisini açıkça belirten profiller (özellikle Doctolib) eklendi.

---

## INSERT QUERY (Supabase SQL Editor)

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor',
   'Dr. Ali Hamami - Allgemeinmedizin (Hausarzt)',
   'Dortmund',
   'Münsterstraße 17, 44145 Dortmund',
   '0231 9507949',
   'https://www.doctolib.de/allgemeinmedizin/dortmund/ali-hamami',
   'de,ar,tr',
   'Doctolib profilinde konuşulan diller arasında Türkisch yer alıyor.',
   'active'
  ),

  ('doctor',
   'Mesut Cansever - Allgemeinmedizin (Hausarzt)',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/allgemeinmedizin/dortmund/mesut-cansever',
   'de,tr',
   'Doctolib profilinde konuşulan diller arasında Türkisch yer alıyor.',
   'active'
  ),

  ('doctor',
   'Dr. Edvin Destanovic - Urologie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/urologie/dortmund/edvin-destanovic',
   'de,en,hr,sr,tr',
   'Doctolib profilinde konuşulan diller arasında Türkisch yer alıyor.',
   'active'
  ),

  ('doctor',
   'Radiologie Brüderweg Dortmund - Radiologie (Praxis)',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/gemeinschaftspraxis/dortmund/radiologie-dortmund-bruederweg',
   'en,tr',
   'Doctolib profilinde Türkisch dil desteği yer alıyor.',
   'active'
  ),

  ('doctor',
   'Songül Dogan - Frauenheilkunde und Geburtshilfe (Gynäkologie)',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/frauenarzt/dortmund/songuel-dogan-dortmund',
   'de,en,tr',
   'Doctolib profilinde Türkisch dil desteği yer alıyor.',
   'active'
  ),

  ('doctor',
   'Olga Mirkin - Dermatologie (Haut- und Geschlechtskrankheiten)',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/hautarzt/dortmund/olga-mirkin',
   'de,ru,tr',
   'Doctolib profilinde Türkisch dil desteği yer alıyor.',
   'active'
  )
;
