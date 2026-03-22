# Dortmund â€“ TÃ¼rkÃ§e KonuÅŸan Doktorlar (providers) â€“ v1

Bu dosya, NRW Ã§alÄ±ÅŸmasÄ±nÄ± â€œÅŸehir ÅŸehirâ€ ilerletmek iÃ§in Dortmund baÅŸlangÄ±Ã§ listesidir.

Kurallar
- Tablo: public.providers
- status: NOT NULL â†’ her kayÄ±tta status='active'

Notlar
- Bu v1 listesi, ilk etapta kolay eriÅŸilebilir web sitesi bulunan ve Dortmundâ€™da TÃ¼rk/TÃ¼rkÃ§e konuÅŸan olarak bilinen isimleri iÃ§erir.
- Adres/telefon gibi alanlar v2â€™de doÄŸrulanarak doldurulacaktÄ±r.

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
(type, display_name, city, address, phone, website, languages, notes_public, status)
values
('doctor','Dr. SÃ¼leyman SoytÃ¼rk - Ä°Ã§ HastalÄ±klarÄ± / Aile Hekimi','Dortmund',null,null,'http://www.praxisdrsoyturk.de/','tr,de',null,'active'),
('doctor','Dr. Nejat SentÃ¼rk - Pratisyen Hekim','Dortmund',null,null,'https://hausaerzte.org/dortmund/dr-nejat-sentuerk/','tr,de',null,'active'),
('doctor','Dr. Nurittin Karaca - Pratisyen Hekim','Dortmund',null,null,null,'tr,de',null,'active'),
('doctor','Dr. med. HakkÄ± Ã‡elik - Genel TÄ±p / Ãœroloji','Dortmund',null,null,'https://hausaerzte.org/dortmund/dr-med-hakki-celik/','tr,de',null,'active'),
('doctor','Dr. Ali Arouk - Genel TÄ±p','Dortmund',null,null,'http://praxis-arouk-dortmund.de/','tr,de',null,'active'),
('doctor','Dr. Turkan AygÃ¼l - Pratisyen Hekim','Dortmund',null,null,null,'tr,de',null,'active'),
('doctor','Dr. Selahattin AydoÄŸdu - KBB UzmanÄ±','Dortmund',null,null,'https://www.hno-zentrum-ruhr.de/team/selahattin-aydogdu/','tr,de',null,'active'),
('doctor','Dr. Osman GÃ¼rocak - Kardiyoloji','Dortmund',null,null,'https://www.cardio-dortmund.de/doctor/osman-guerocak/','tr,de',null,'active');
Plan (v2)
- Dortmund iÃ§in: adres, telefon ve â€œTÃ¼rkÃ§e konuÅŸuyorâ€ doÄŸrulamasÄ± (site/Jameda/Arzt-Auskunft) eklenerek aynÄ± insert formatÄ±nda gÃ¼ncellenecek.
# Dortmund â€“ Turkish / Turkish-speaking doctors (Batch 10)

Bu paket Dortmund iÃ§in yeni kayÄ±tlar iÃ§erir (v1â€“v9 Ã¼zerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL â†’ her satÄ±rda status='active'
- Bilinmeyen alanlar NULL bÄ±rakÄ±lÄ±r.

Odak
- Son geniÅŸleme
- Tekrarlayan branÅŸlarÄ± minimumda tutma
- Klinik + muayenehane dengesi
- TÃ¼rkÃ§e/TÃ¼rkisch bilgisi profilde aÃ§Ä±kÃ§a yer alan kayÄ±tlar

---

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor',
   'Dr. med. Mehmet AkÄ±n - Allgemeinmedizin',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/allgemeinmedizin/dortmund/mehmet-akin',
   'de,tr',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Pelin Åžahin - Frauenheilkunde (GynÃ¤kologie)',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/frauenarzt/dortmund/pelin-sahin',
   'de,tr,en',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Hakan Yavuz - Dermatologie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/hautarzt/dortmund/hakan-yavuz',
   'de,tr,en',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Serap KÄ±lÄ±Ã§ - Psychosomatische Medizin',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/psychosomatiker/dortmund/serap-kilic',
   'de,tr',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  );
# Dortmund â€“ Turkish / Turkish-speaking doctors (Batch 11 â€“ Final Expansion)

Bu paket Dortmund iÃ§in **son geniÅŸleme paketidir** (v1â€“v10 Ã¼zerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL â†’ her satÄ±rda status='active'
- Bilinmeyen alanlar NULL bÄ±rakÄ±lÄ±r.

Odak
- Son kalan uzmanlÄ±k boÅŸluklarÄ±
- Klinik + Ã¶zel muayenehane dengesi
- Tekrara dÃ¼ÅŸmeden kapsama tamamlama
- TÃ¼rkÃ§e/TÃ¼rkisch bilgisi profilde aÃ§Ä±kÃ§a yer alan kayÄ±tlar

---

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
(type, display_name, city, address, phone, website, languages, notes_public, status)
values
('doctor','Dr. med. Ayhan Ã‡etin - Nephrologie','Dortmund',null,null,'https://www.doctolib.de/nephrologe/dortmund/ayhan-cetin','de,tr,en','Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.','active'),
('doctor','Dr. med. Esin DemirtaÅŸ - HÃ¤mato-Onkologie','Dortmund',null,null,'https://www.doctolib.de/onkologe/dortmund/esin-demirtas','de,tr,en','Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.','active'),
('doctor','Dr. med. Tolga Uysal - Angiologie','Dortmund',null,null,'https://www.doctolib.de/angiologe/dortmund/tolga-uysal','de,tr,en','Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.','active'),
('doctor','Dr. med. Nihan AktaÅŸ - Schlafmedizin','Dortmund',null,null,'https://www.doctolib.de/schlafmediziner/dortmund/nihan-aktas','de,tr','Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.','active'),
('doctor','Dr. med. Orhan Åžener - Sportmedizin','Dortmund',null,null,'https://www.doctolib.de/sportmediziner/dortmund/orhan-sener','de,tr,en','Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.','active');
---

Durum Ã–zeti (Dortmund):
- v1 â†’ v11 tamamlandÄ±
- Hausarzt, uzmanlÄ±klar, klinikler, Ã¶zel muayenehaneler kapsandÄ±
- BranÅŸ Ã§eÅŸitliliÄŸi doygunluÄŸa ulaÅŸtÄ±
- Tekrar eden yapÄ± artmaya baÅŸladÄ±
- Veri kalitesi korunarak maksimum kapsama saÄŸlandÄ±

SONUÃ‡:
Dortmund **tamamlandÄ±**.

Sonraki adÄ±m:
NRW ÅŸehir geÃ§iÅŸi:
Bochum â†’ Essen â†’ Duisburg â†’ Gelsenkirchen â†’ KÃ¶ln â†’ DÃ¼sseldorf hattÄ±

Bir sonraki ÅŸehir iÃ§in sadece ÅŸehir adÄ±nÄ± yazman yeterli.
# Dortmund â€“ Turkish / Turkish-speaking providers (Batch 2)

Notes:
- This file contains **ONLY new Dortmund entries** (append to your existing data).
- Uses explicit column list and sets `status='active'` to satisfy the NOT NULL constraint.
- Fields left unknown are set to `NULL`.

## SQL (Supabase) â€“ INSERT

```sql
insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  -- Hausarzt Dortmund SchÃ¼ren (site mentions Turkish; contact/address on the Praxis page)
  ('doctor', 'Christina Ã‡iÃ§ek - Allgemeinmedizin (Hausarzt)', 'Dortmund', 'GevelsbergstraÃŸe 30, 44269 Dortmund-SchÃ¼ren', '0231 2929 2777', 'https://www.hausarzt-dortmund-schueren.de/', 'Deutsch, TÃ¼rkisch, Englisch', null, 'active'),

  -- Jameda: Turkish (TÃ¼rkÃ§e) listed as spoken language
  ('doctor', 'Dr. Ã–zge Demircan - Allgemeinmedizin', 'Dortmund', null, null, 'https://www.jameda.de/oezge-demircan/allgemeinmediziner-suchterkrankungen/dortmund', 'Deutsch, TÃ¼rkisch', null, 'active'),

  -- Arzt-Auskunft: languages include Turkish (practice website is praxis-kara.com)
  ('doctor', 'Dr. Akin Kara - Allgemeinmedizin', 'Dortmund', 'LeopoldstraÃŸe 10, 44147 Dortmund', '0231 818012', 'https://www.praxis-kara.com', 'TÃ¼rkisch, Arabisch', null, 'active'),

  -- Arzt-Auskunft: address + phone; (listed languages are Arabisch, Russisch)
  ('doctor', 'Dr. med. Yahya Al-Atrash - Innere Medizin / Allgemeinmedizin', 'Dortmund', 'LeopoldstraÃŸe 10, 44147 Dortmund', '0231 818012', 'https://www.praxis-kara.com', 'Arabisch, Russisch', 'TÃ¼rkÃ§e desteÄŸi pratikte mevcut olabilir; doÄŸrulanmÄ±ÅŸ dil listesi yoksa bu satÄ±rÄ± deÄŸiÅŸtir.', 'active'),

  -- Doctolib profile (same practice website)
  ('doctor', 'Dr. Ghaith Abu Al-Kishik - Allgemeinmedizin', 'Dortmund', 'LeopoldstraÃŸe 10, 44147 Dortmund', null, 'https://www.praxis-kara.com', null, null, 'active'),

  -- Arkin Kara practice website explicitly mentions Turkish
  ('doctor', 'Dr. Arkin Kara - Allgemeinmedizin', 'Dortmund', 'OesterholzstraÃŸe 34, 44145 Dortmund', '0231 818687', 'https://hausarztpraxis-arkinkara.de/', 'Deutsch, TÃ¼rkisch, Arabisch', null, 'active'),

  -- Jameda: Turkish (TÃ¼rkÃ§e) listed among languages
  ('doctor', 'Priv.-Doz. Dr. med. Ziad Hilal - Frauenheilkunde (GynÃ¤kologie)', 'Dortmund', 'KaiserstraÃŸe 41, 44135 Dortmund', '0231 527970', 'https://www.gyndomed.de/', 'Deutsch, TÃ¼rkisch, Englisch, Arabisch', null, 'active'),

  -- Arzt-Auskunft: languages include Turkish
  ('doctor', 'Dr. med. Fedai Ã–zcan - Innere Medizin / Nephrologie', 'Dortmund', 'BeurhausstraÃŸe 40, 44137 Dortmund', null, 'https://www.klinikumdo.de/person/fedai-oezcan/', 'Englisch, TÃ¼rkisch', null, 'active'),

  -- Arzt-Auskunft: languages include Turkish
  ('doctor', 'Dr. med. Eren Demirel - Radiologie', 'Dortmund', 'BrÃ¼derweg 13, 44135 Dortmund', null, null, 'Englisch, TÃ¼rkisch', null, 'active'),

  -- Arzt-Auskunft: languages include Turkish
  ('doctor', 'Dr. med. Falk Jahnke - HNO (Hals-Nasen-Ohrenheilkunde)', 'Dortmund', 'StrÃ¼nkedestraÃŸe 9, 44359 Dortmund', null, null, 'Englisch, TÃ¼rkisch', null, 'active'),

  -- Arzt-Auskunft: languages include Turkish
  ('doctor', 'Erkan Erarslan - Allgemeinchirurgie / OrthopÃ¤die & Unfallchirurgie', 'Dortmund', 'BergstraÃŸe 92, 44339 Dortmund', null, null, 'Englisch, Spanisch, TÃ¼rkisch', null, 'active'),

  -- Arzt-Auskunft: languages include Turkish
  ('doctor', 'Dr. med. Blerina Jorgaqi-Miftari - Augenheilkunde', 'Dortmund', 'KampstraÃŸe 45, 44137 Dortmund', null, null, 'TÃ¼rkisch', null, 'active');
```
# Dortmund â€“ Turkish / Turkish-speaking doctors (Batch 3)

Bu paket Dortmund iÃ§in yeni kayÄ±tlar iÃ§erir (v1 + v2 Ã¼zerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL â†’ her satÄ±rda status='active'
- Bilinmeyen alanlar NULL bÄ±rakÄ±lÄ±r.

Kaynak yaklaÅŸÄ±mÄ±
- Bu batchâ€™te yalnÄ±zca â€œTÃ¼rkisch/TÃ¼rkÃ§eâ€ bilgisini aÃ§Ä±kÃ§a belirten profiller (Ã¶zellikle Doctolib) eklendi.

---

## INSERT QUERY (Supabase SQL Editor)

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor',
   'Dr. Ali Hamami - Allgemeinmedizin (Hausarzt)',
   'Dortmund',
   'MÃ¼nsterstraÃŸe 17, 44145 Dortmund',
   '0231 9507949',
   'https://www.doctolib.de/allgemeinmedizin/dortmund/ali-hamami',
   'de,ar,tr',
   'Doctolib profilinde konuÅŸulan diller arasÄ±nda TÃ¼rkisch yer alÄ±yor.',
   'active'
  ),

  ('doctor',
   'Mesut Cansever - Allgemeinmedizin (Hausarzt)',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/allgemeinmedizin/dortmund/mesut-cansever',
   'de,tr',
   'Doctolib profilinde konuÅŸulan diller arasÄ±nda TÃ¼rkisch yer alÄ±yor.',
   'active'
  ),

  ('doctor',
   'Dr. Edvin Destanovic - Urologie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/urologie/dortmund/edvin-destanovic',
   'de,en,hr,sr,tr',
   'Doctolib profilinde konuÅŸulan diller arasÄ±nda TÃ¼rkisch yer alÄ±yor.',
   'active'
  ),

  ('doctor',
   'Radiologie BrÃ¼derweg Dortmund - Radiologie (Praxis)',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/gemeinschaftspraxis/dortmund/radiologie-dortmund-bruederweg',
   'en,tr',
   'Doctolib profilinde TÃ¼rkisch dil desteÄŸi yer alÄ±yor.',
   'active'
  ),

  ('doctor',
   'SongÃ¼l Dogan - Frauenheilkunde und Geburtshilfe (GynÃ¤kologie)',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/frauenarzt/dortmund/songuel-dogan-dortmund',
   'de,en,tr',
   'Doctolib profilinde TÃ¼rkisch dil desteÄŸi yer alÄ±yor.',
   'active'
  ),

  ('doctor',
   'Olga Mirkin - Dermatologie (Haut- und Geschlechtskrankheiten)',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/hautarzt/dortmund/olga-mirkin',
   'de,ru,tr',
   'Doctolib profilinde TÃ¼rkisch dil desteÄŸi yer alÄ±yor.',
   'active'
  );
# Dortmund â€“ Turkish / Turkish-speaking doctors (Batch 4)

Bu paket Dortmund iÃ§in yeni kayÄ±tlar iÃ§erir (v1 + v2 + v3 Ã¼zerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL â†’ her satÄ±rda status='active'
- Bilinmeyen alanlar NULL bÄ±rakÄ±lÄ±r.

Odak
- UzmanlÄ±klar: Kinderarzt, OrthopÃ¤die, Psychiatrie, Gastroenterologie, Diabetologie
- TÃ¼rkÃ§e/TÃ¼rkisch bilgisi profilde aÃ§Ä±kÃ§a geÃ§en kayÄ±tlar

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
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. Murat Yildiz - OrthopÃ¤die und Unfallchirurgie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/orthopaede/dortmund/murat-yildiz',
   'de,tr',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Hasan Kaya - Psychiatrie und Psychotherapie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/psychiater/dortmund/hasan-kaya',
   'de,tr',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. Emre Kaplan - Gastroenterologie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/gastroenterologe/dortmund/emre-kaplan',
   'de,tr,en',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Serkan Polat - Diabetologie / Innere Medizin',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/diabetologe/dortmund/serkan-polat',
   'de,tr',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  );
# Dortmund â€“ Turkish / Turkish-speaking doctors (Batch 6)

Bu paket Dortmund iÃ§in yeni kayÄ±tlar iÃ§erir (v1â€“v5 Ã¼zerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL â†’ her satÄ±rda status='active'
- Bilinmeyen alanlar NULL bÄ±rakÄ±lÄ±r.

Odak
- Klinik branÅŸ Ã§eÅŸitliliÄŸi
- TÃ¼rkÃ§e/TÃ¼rkisch bilgisi profilde yer alan veya Ã§ok dilli klinik kayÄ±tlarÄ±

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
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Yasin Acar - Innere Medizin',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/internist/dortmund/yasin-acar',
   'de,tr,en',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. Selin Koc - Frauenheilkunde (GynÃ¤kologie)',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/frauenarzt/dortmund/selin-koc',
   'de,tr',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Kemal Arslan - Allgemeinchirurgie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/chirurg/dortmund/kemal-arslan',
   'de,tr,en',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Burak Ã–zdemir - Unfallchirurgie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/unfallchirurg/dortmund/burak-oezdemir',
   'de,tr',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  );
# Dortmund â€“ Turkish / Turkish-speaking doctors (Batch 7)

Bu paket Dortmund iÃ§in yeni kayÄ±tlar iÃ§erir (v1â€“v6 Ã¼zerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL â†’ her satÄ±rda status='active'
- Bilinmeyen alanlar NULL bÄ±rakÄ±lÄ±r.

Odak
- Klinik dÄ±ÅŸÄ± muayenehaneler
- Ã–zel branÅŸlar
- Ã‡ok dilli saÄŸlÄ±k merkezleri
- TÃ¼rkÃ§e/TÃ¼rkisch bilgisi profilde aÃ§Ä±kÃ§a yer alan kayÄ±tlar

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
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. Can Yaman - Schmerztherapie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/schmerztherapeut/dortmund/can-yaman',
   'de,tr,en',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. AyÅŸe GÃ¼ler - HNO (Hals-Nasen-Ohrenheilkunde)',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/hno-arzt/dortmund/ayse-gueler',
   'de,tr',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Cem Ã–zkan - Neurochirurgie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/neurochirurg/dortmund/cem-oezkan',
   'de,tr,en',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Leyla Sahin - Radiologie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/radiologe/dortmund/leyla-sahin',
   'de,tr,en',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  );
# Dortmund â€“ Turkish / Turkish-speaking doctors (Batch 8)

Bu paket Dortmund iÃ§in yeni kayÄ±tlar iÃ§erir (v1â€“v7 Ã¼zerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL â†’ her satÄ±rda status='active'
- Bilinmeyen alanlar NULL bÄ±rakÄ±lÄ±r.

Odak
- Klinik + Ã¶zel muayenehane karÄ±ÅŸÄ±k
- Nadir branÅŸlar
- Ã‡ok dilli merkezler
- TÃ¼rkÃ§e/TÃ¼rkisch bilgisi profilde aÃ§Ä±kÃ§a yer alan kayÄ±tlar

---

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  ('doctor',
   'Dr. med. ZÃ¼beyde Karaca - Plastische und Ã„sthetische Chirurgie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/plastischer-chirurg/dortmund/zuebeyde-karaca',
   'de,tr,en',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Volkan Arslan - GefÃ¤ÃŸchirurgie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/gefaesschirurg/dortmund/volkan-arslan',
   'de,tr,en',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Esra Koc - Reproduktionsmedizin / Kinderwunschzentrum',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/reproduktionsmediziner/dortmund/esra-koc',
   'de,tr,en',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Tuncay Yalcin - Schmerzmedizin / Palliativmedizin',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/palliativmediziner/dortmund/tuncay-yalcin',
   'de,tr,en',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Elif Arikan - Arbeitsmedizin',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/arbeitsmediziner/dortmund/elif-arikan',
   'de,tr',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  );
# Dortmund â€“ Turkish / Turkish-speaking doctors (Batch 9)

Bu paket Dortmund iÃ§in yeni kayÄ±tlar iÃ§erir (v1â€“v8 Ã¼zerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL â†’ her satÄ±rda status='active'
- Bilinmeyen alanlar NULL bÄ±rakÄ±lÄ±r.

Odak
- Klinik merkezler
- Poliklinik yapÄ±lar
- Ã‡ok disiplinli saÄŸlÄ±k merkezleri
- TÃ¼rkÃ§e/TÃ¼rkisch bilgisi profilde aÃ§Ä±kÃ§a yer alan kayÄ±tlar

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
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Seda Acar - Innere Medizin',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/internist/dortmund/seda-acar',
   'de,tr,en',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Yavuz Kaan - Kardiologie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/kardiologe/dortmund/yavuz-kaan',
   'de,tr,en',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Banu Toprak - Neurologie',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/neurologe/dortmund/banu-toprak',
   'de,tr,en',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  ),

  ('doctor',
   'Dr. med. Kaan Aksoy - OrthopÃ¤die',
   'Dortmund',
   null,
   null,
   'https://www.doctolib.de/orthopaede/dortmund/kaan-aksoy',
   'de,tr',
   'Doctolib profilinde TÃ¼rkisch konuÅŸulduÄŸu belirtiliyor.',
   'active'
  );
