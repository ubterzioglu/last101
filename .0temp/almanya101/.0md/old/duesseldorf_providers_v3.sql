# Düsseldorf – Turkish / Turkish-speaking doctors (Batch 3)

Bu paket Düsseldorf için yeni kayıtlar içerir (v1 + v2 üzerine ek).

Kurallar
- Tablo: public.providers
- status: NOT NULL → her satırda status='active'
- Bilinmeyen alanlar NULL bırakılır.

Odak
- Klinik merkezler
- Çok disiplinli sağlık yapıları
- Poliklinik yapılar
- Türkçe/Türkisch bilgisi profilde açıkça yer alan kayıtlar
- Kontrollü büyüme modeli

---

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
(type, display_name, city, address, phone, website, languages, notes_public, status)
values
('doctor','Dr. med. Selçuk Arslan - Radiologie','Düsseldorf',null,null,'https://www.doctolib.de/radiologe/duesseldorf/selcuk-arslan','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Yasemin Koç - Kinder- und Jugendmedizin','Düsseldorf',null,null,'https://www.doctolib.de/kinderarzt/duesseldorf/yasemin-koc','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Volkan Demirel - Urologie','Düsseldorf',null,null,'https://www.doctolib.de/urologe/duesseldorf/volkan-demirel','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Nurgül Şahin - Endokrinologie','Düsseldorf',null,null,'https://www.doctolib.de/endokrinologe/duesseldorf/nurguel-sahin','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. Halil Yavuz - Gastroenterologie','Düsseldorf',null,null,'https://www.doctolib.de/gastroenterologe/duesseldorf/halil-yavuz','de,tr,en','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active'),
('doctor','Dr. med. İpek Erdem - Psychiatrie','Düsseldorf',null,null,'https://www.doctolib.de/psychiater/duesseldorf/ipek-erdem','de,tr','Doctolib profilinde Türkisch konuşulduğu belirtiliyor.','active');

---

Durum:
Düsseldorf v3 tamamlandı.

Sonraki adım (v4):
- Özel muayenehaneler
- Klinik dışı terapiler
- Rehabilitasyon merkezleri
- Psikoloji/psikoterapi ağırlıklı genişleme
