-- Seed sample questions and answers (50-60)

insert into cs_questions (question, status, answer_count)
values
('Almanya''da ilk Anmeldung nasil yapilir?', 'approved', 1),
('Banka hesabi acmak icin hangi evraklar gerekir?', 'approved', 1),
('En uygun saglik sigortasi nasil secilir?', 'approved', 1),
('Almanya''da is ararken nelere dikkat etmeli?', 'approved', 1),
('Cocuk icin okul kaydi nasil yapilir?', 'approved', 1),
('Almanya''da kira sozlesmesinde en kritik maddeler neler?', 'approved', 1),
('Internet ve telefon aboneligi icin tavsiyeniz?', 'approved', 1),
('Vize uzatma randevusu nasil alinir?', 'approved', 1),
('Almanya''da acil saglik hizmetine nasil basvurulur?', 'approved', 1),
('Jobcenter ile nasil iletisim kurulur?', 'approved', 1),
('Brut maastan nete hesaplama icin guvenilir yontem?', 'approved', 1),
('Almanya''da arac almak mi kiralamak mi mantikli?', 'approved', 1),
('Ehliyet cevirme sureci nasil ilerliyor?', 'approved', 1),
('Schufa puani neden onemli ve nasil iyilestirilir?', 'approved', 1),
('Kira yardimi (Wohngeld) kimler alabilir?', 'approved', 1),
('Vergi sinifi degistirmek avantajli mi?', 'approved', 1),
('Almanya''da ev ararken en iyi siteler hangileri?', 'approved', 1),
('Aile birlesimi icin temel sartlar neler?', 'approved', 1),
('Almanya''da calisma izni nasil alinir?', 'approved', 1),
('Dortmund''da Turk market tavsiyesi var mi?', 'approved', 1),
('Kita (kres) basvurusu icin en erken ne zaman?', 'approved', 1),
('Almanya''da kartla mi nakit mi tercih edilmeli?', 'approved', 1),
('AOK ve TK arasinda temel farklar neler?', 'approved', 1),
('Almanya''da ev sigortasi gerekli mi?', 'approved', 1),
('Ausbildung icin yas siniri var mi?', 'approved', 1),
('Universite denkligi nasil yapilir?', 'approved', 1),
('Almanya''da vergi iadesi nasil alinir?', 'approved', 1),
('Otobus ve tren aboneliklerinde en uygunu hangisi?', 'approved', 1),
('Almanya''da internet baglanti kurulumu kac gun surer?', 'approved', 1),
('Kira depozitosu iadesi ne kadar surer?', 'approved', 1),
('Almanya''da calisirken ikinci is yapilabilir mi?', 'approved', 1),
('Bildirim yukumlulukleri (adres degisikligi vb.) neler?', 'approved', 1),
('Almanya''da Turkce doktor nasil bulunur?', 'approved', 1),
('Mavi kart icin sartlar neler?', 'approved', 1),
('Almanya''da aile hekimi degistirmek zor mu?', 'approved', 1),
('Cocuk parasi (Kindergeld) nasil basvurulur?', 'approved', 1),
('Almanya''da isten cikinca haklar neler?', 'approved', 1),
('Arac sigortasi turleri arasinda farklar neler?', 'approved', 1),
('Acilde bekleme sureleri nasil azaltirilir?', 'approved', 1),
('Almanya''da kira artisi yasal siniri nedir?', 'approved', 1),
('WBS belgesi nedir ve nasil alinir?', 'approved', 1),
('Almanya''da ev satin alma sureci nasil?', 'approved', 1),
('Turk bankalarinin Almanya subeleri var mi?', 'approved', 1),
('Mobility ticket vs Deutschlandticket farki?', 'approved', 1),
('Almanya''da noter islemleri pahali mi?', 'approved', 1),
('Almanya''da evlilik icin gerekli belgeler neler?', 'approved', 1),
('Almanya''da askerlik durumu nasil bildirilir?', 'approved', 1),
('Almanya''da spor salonu ucretleri nasil?', 'approved', 1),
('Kisa sureli ev kiralamak yasal mi?', 'approved', 1),
('Almanya''da cep telefonu numarasi tasinabilir mi?', 'approved', 1),
('Calisma saatleri ve fazla mesai kurallari neler?', 'approved', 1),
('Almanya''da gastronomi isine girmek zor mu?', 'approved', 1),
('Freelance calismak icin hangi adimlar gerekli?', 'approved', 1),
('Doviz transferi icin en uygun yontem hangisi?', 'approved', 1),
('Almanya''da tatil gunleri nasil hesaplanir?', 'approved', 1),
('Evsizlik riski varsa hangi kurumlara basvurulur?', 'approved', 1),
('Almanya''da yasam maliyeti hangi sehirde daha dusuk?', 'approved', 1),
('Sosyal yardimlarin calisma iznine etkisi var mi?', 'approved', 1);

insert into cs_answers (question_id, message, status)
select id, 'Kisa cevap: Belediye (Bürgeramt) randevusu alin, kira sozlesmesi ve pasaportla gidin.', 'approved'
from cs_questions where question ilike 'Almanya''da ilk Anmeldung%';

insert into cs_answers (question_id, message, status)
select id, 'Genelde pasaport, adres kaydi ve gelir belgesi yeterli olur. Bankaya gore degisir.', 'approved'
from cs_questions where question ilike 'Banka hesabi acmak%';

insert into cs_answers (question_id, message, status)
select id, 'Ihtiyac ve butcene gore karsilastirma yap. Aile hekimi dahil mi bak.', 'approved'
from cs_questions where question ilike 'En uygun saglik sigortasi%';

insert into cs_answers (question_id, message, status)
select id, 'CV ve motivasyon mektubunu Almanca hazirla, LinkedIn ve Indeed aktif kullan.', 'approved'
from cs_questions where question ilike 'Almanya''da is ararken%';

insert into cs_answers (question_id, message, status)
select id, 'Belediye web sitesinden okul bolgesi ve gerekli evraklari kontrol et.', 'approved'
from cs_questions where question ilike 'Cocuk icin okul kaydi%';

-- Default short answers for remaining questions
insert into cs_answers (question_id, message, status)
select id, 'Deneyime gore degisir ama once resmi sitelerden bilgi alin.', 'approved'
from cs_questions
where id not in (select question_id from cs_answers);

