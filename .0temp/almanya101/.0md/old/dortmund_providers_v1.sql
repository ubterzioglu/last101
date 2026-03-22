# Dortmund – Türkçe Konuşan Doktorlar (providers) – v1

Bu dosya, NRW çalışmasını “şehir şehir” ilerletmek için Dortmund başlangıç listesidir.

Kurallar
- Tablo: public.providers
- status: NOT NULL → her kayıtta status='active'

Notlar
- Bu v1 listesi, ilk etapta kolay erişilebilir web sitesi bulunan ve Dortmund’da Türk/Türkçe konuşan olarak bilinen isimleri içerir.
- Adres/telefon gibi alanlar v2’de doğrulanarak doldurulacaktır.

INSERT QUERY (Supabase SQL Editor)

insert into public.providers
(type, display_name, city, address, phone, website, languages, notes_public, status)
values
('doctor','Dr. Süleyman Soytürk - İç Hastalıkları / Aile Hekimi','Dortmund',null,null,'http://www.praxisdrsoyturk.de/','tr,de',null,'active'),
('doctor','Dr. Nejat Sentürk - Pratisyen Hekim','Dortmund',null,null,'https://hausaerzte.org/dortmund/dr-nejat-sentuerk/','tr,de',null,'active'),
('doctor','Dr. Nurittin Karaca - Pratisyen Hekim','Dortmund',null,null,null,'tr,de',null,'active'),
('doctor','Dr. med. Hakkı Çelik - Genel Tıp / Üroloji','Dortmund',null,null,'https://hausaerzte.org/dortmund/dr-med-hakki-celik/','tr,de',null,'active'),
('doctor','Dr. Ali Arouk - Genel Tıp','Dortmund',null,null,'http://praxis-arouk-dortmund.de/','tr,de',null,'active'),
('doctor','Dr. Turkan Aygül - Pratisyen Hekim','Dortmund',null,null,null,'tr,de',null,'active'),
('doctor','Dr. Selahattin Aydoğdu - KBB Uzmanı','Dortmund',null,null,'https://www.hno-zentrum-ruhr.de/team/selahattin-aydogdu/','tr,de',null,'active'),
('doctor','Dr. Osman Gürocak - Kardiyoloji','Dortmund',null,null,'https://www.cardio-dortmund.de/doctor/osman-guerocak/','tr,de',null,'active');

Plan (v2)
- Dortmund için: adres, telefon ve “Türkçe konuşuyor” doğrulaması (site/Jameda/Arzt-Auskunft) eklenerek aynı insert formatında güncellenecek.
