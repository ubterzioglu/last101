# Dortmund – Turkish / Turkish-speaking providers (Batch 2)

Notes:
- This file contains **ONLY new Dortmund entries** (append to your existing data).
- Uses explicit column list and sets `status='active'` to satisfy the NOT NULL constraint.
- Fields left unknown are set to `NULL`.

## SQL (Supabase) – INSERT

```sql
insert into public.providers
  (type, display_name, city, address, phone, website, languages, notes_public, status)
values
  -- Hausarzt Dortmund Schüren (site mentions Turkish; contact/address on the Praxis page)
  ('doctor', 'Christina Çiçek - Allgemeinmedizin (Hausarzt)', 'Dortmund', 'Gevelsbergstraße 30, 44269 Dortmund-Schüren', '0231 2929 2777', 'https://www.hausarzt-dortmund-schueren.de/', 'Deutsch, Türkisch, Englisch', null, 'active'),

  -- Jameda: Turkish (Türkçe) listed as spoken language
  ('doctor', 'Dr. Özge Demircan - Allgemeinmedizin', 'Dortmund', null, null, 'https://www.jameda.de/oezge-demircan/allgemeinmediziner-suchterkrankungen/dortmund', 'Deutsch, Türkisch', null, 'active'),

  -- Arzt-Auskunft: languages include Turkish (practice website is praxis-kara.com)
  ('doctor', 'Dr. Akin Kara - Allgemeinmedizin', 'Dortmund', 'Leopoldstraße 10, 44147 Dortmund', '0231 818012', 'https://www.praxis-kara.com', 'Türkisch, Arabisch', null, 'active'),

  -- Arzt-Auskunft: address + phone; (listed languages are Arabisch, Russisch)
  ('doctor', 'Dr. med. Yahya Al-Atrash - Innere Medizin / Allgemeinmedizin', 'Dortmund', 'Leopoldstraße 10, 44147 Dortmund', '0231 818012', 'https://www.praxis-kara.com', 'Arabisch, Russisch', 'Türkçe desteği pratikte mevcut olabilir; doğrulanmış dil listesi yoksa bu satırı değiştir.', 'active'),

  -- Doctolib profile (same practice website)
  ('doctor', 'Dr. Ghaith Abu Al-Kishik - Allgemeinmedizin', 'Dortmund', 'Leopoldstraße 10, 44147 Dortmund', null, 'https://www.praxis-kara.com', null, null, 'active'),

  -- Arkin Kara practice website explicitly mentions Turkish
  ('doctor', 'Dr. Arkin Kara - Allgemeinmedizin', 'Dortmund', 'Oesterholzstraße 34, 44145 Dortmund', '0231 818687', 'https://hausarztpraxis-arkinkara.de/', 'Deutsch, Türkisch, Arabisch', null, 'active'),

  -- Jameda: Turkish (Türkçe) listed among languages
  ('doctor', 'Priv.-Doz. Dr. med. Ziad Hilal - Frauenheilkunde (Gynäkologie)', 'Dortmund', 'Kaiserstraße 41, 44135 Dortmund', '0231 527970', 'https://www.gyndomed.de/', 'Deutsch, Türkisch, Englisch, Arabisch', null, 'active'),

  -- Arzt-Auskunft: languages include Turkish
  ('doctor', 'Dr. med. Fedai Özcan - Innere Medizin / Nephrologie', 'Dortmund', 'Beurhausstraße 40, 44137 Dortmund', null, 'https://www.klinikumdo.de/person/fedai-oezcan/', 'Englisch, Türkisch', null, 'active'),

  -- Arzt-Auskunft: languages include Turkish
  ('doctor', 'Dr. med. Eren Demirel - Radiologie', 'Dortmund', 'Brüderweg 13, 44135 Dortmund', null, null, 'Englisch, Türkisch', null, 'active'),

  -- Arzt-Auskunft: languages include Turkish
  ('doctor', 'Dr. med. Falk Jahnke - HNO (Hals-Nasen-Ohrenheilkunde)', 'Dortmund', 'Strünkedestraße 9, 44359 Dortmund', null, null, 'Englisch, Türkisch', null, 'active'),

  -- Arzt-Auskunft: languages include Turkish
  ('doctor', 'Erkan Erarslan - Allgemeinchirurgie / Orthopädie & Unfallchirurgie', 'Dortmund', 'Bergstraße 92, 44339 Dortmund', null, null, 'Englisch, Spanisch, Türkisch', null, 'active'),

  -- Arzt-Auskunft: languages include Turkish
  ('doctor', 'Dr. med. Blerina Jorgaqi-Miftari - Augenheilkunde', 'Dortmund', 'Kampstraße 45, 44137 Dortmund', null, null, 'Türkisch', null, 'active')
;
```
