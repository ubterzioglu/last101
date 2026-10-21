-- Migration: "İş ve Kariyer Platformları" kategorisi
-- Kaynak: Almanya Kariyer, Uyum ve CV Rehberi, Bölüm 4 (100 platform)
-- Mevcut kayıtlarla ad veya alan adı çakışanlar eklenmez (idempotent).
-- Zaten tabloda olanlar: Randstad, Hays, Michael Page, Robert Half, GULP, get-in-IT

INSERT INTO recruitment_agencies (name, url, description, category, status)
SELECT v.name, v.url, v.description, 'İş ve Kariyer Platformları', 'active'
FROM (VALUES
  -- 4.1 Genel iş ilanı platformları
  ('StepStone', 'https://www.stepstone.de', 'Genel: Kurumsal işler. Maaş beklentisi filtresi ve sektör raporları için ideal'),
  ('Indeed', 'https://de.indeed.com', 'Genel: Tüm ilanları tarar. Anahtar kelime aramasıyla hızlı sonuç verir'),
  ('LinkedIn Jobs', 'https://www.linkedin.com/jobs', 'Genel: Kurumsal işler ve networking. Profilin Almanca/İngilizce optimize olmalı'),
  ('XING', 'https://www.xing.com/jobs', 'Genel: DACH bölgesi. Alman işverenler LinkedIn''den daha sık kullanır'),
  ('Glassdoor', 'https://www.glassdoor.de', 'Genel: İşveren yorumları. Başvurmadan önce şirket kültürü ve maaşları araştırın'),
  ('Monster', 'https://www.monster.de', 'Genel: Geleneksel şirketler. Özgeçmiş yükleyerek işverenlerin sizi bulmasını sağlayın'),
  ('Jobware', 'https://www.jobware.de', 'Genel: Uzman ve yönetici pozisyonları'),
  ('Kimeta', 'https://www.kimeta.de', 'Genel: Farklı kariyer sitelerindeki ilanları tek ekranda toplar'),
  ('Jooble', 'https://de.jooble.org', 'Genel: Tüm interneti tarar; yerel gazete ve küçük firma ilanlarını da bulur'),
  ('Stellenanzeigen', 'https://www.stellenanzeigen.de', 'Genel: Yerel işletmeler. Büyük şehirler dışındaki KOBİ ilanları için etkili'),
  ('MeineStadt', 'https://jobs.meinestadt.de', 'Genel: Şehir veya ilçe bazlı bölgesel iş araması'),
  ('Jobbörse.de', 'https://www.jobboerse.de', 'Genel: Çeşitli sektörler, kariyer rehberleri ve başvuru şablonları'),
  ('Yourfirm', 'https://www.yourfirm.de', 'Genel: Alman KOBİ''leri ve gizli şampiyon orta ölçekli firmalar'),
  ('Experteer', 'https://www.experteer.de', 'Genel: Kıdemli yöneticiler için 100 bin Euro üzeri pozisyonlar (freemium)'),
  ('Stellenmarkt', 'https://www.stellenmarkt.de', 'Genel: Standart ofis işleri, sade ve geleneksel ilan arama deneyimi'),
  -- 4.2 Resmî ve kamu portalları
  ('BA Jobbörse', 'https://www.arbeitsagentur.de/jobsuche/', 'Kamu: Federal İş Ajansı resmi iş bulma platformu, işverenler için en güvenilir ana portal'),
  ('Interamt', 'https://www.interamt.de', 'Kamu: Kamu sektörü ilanları; birçok federal bakanlık başvuruları bu portaldan alır'),
  ('Service.bund.de', 'https://www.service.bund.de', 'Kamu: Federal, eyalet ve belediye idarelerindeki iş ve eğitim yerleri'),
  ('Jobs beim Staat', 'https://www.jobs-beim-staat.de', 'Kamu: Belediye, eyalet ve federal kurumların güncel ilanlarını toplayan arama motoru'),
  ('ÖD-News Stellenmarkt', 'https://stellen.oeffentlicher-dienst-news.de', 'Kamu: Kamu hizmetinin tüm alanlarını kapsayan ilan tabanı'),
  ('Karriereportal Berlin', 'https://karriereportal-stellen.berlin.de', 'Kamu: Berlin eyalet idaresi memur ve sözleşmeli pozisyonları'),
  ('Karriere.NRW', 'https://karriere.nrw', 'Kamu: Kuzey Ren-Vestfalya eyaletinin kariyer portalı ve kamu ilanları'),
  ('Make it in Germany Jobbörse', 'https://www.make-it-in-germany.com/en/working-in-germany/job-listings', 'Kamu: Yurt dışındaki adaylar için Federal İş Ajansı ilanları, İngilizce arayüz'),
  ('ZAV', 'https://www.arbeitsagentur.de/vor-ort/zav/startseite', 'Kamu: Federal İş Ajansı yurt dışından nitelikli çalışan alımı ve yerleştirme birimi'),
  ('EU Careers (EPSO)', 'https://eu-careers.europa.eu', 'Kamu: AB kurum ve ajanslarındaki işler; kadrolu pozisyonlarda genelde AB vatandaşlığı aranır'),
  -- 4.3 IT, yazılım ve teknoloji
  ('GermanTechJobs', 'https://germantechjobs.de', 'IT: Yazılım ve IT ilanları, maaş aralıklarını şeffaf gösterir'),
  ('Arbeitnow', 'https://www.arbeitnow.com', 'IT: İngilizce IT ve uzaktan işler, vize sponsorluğu filtresi var'),
  ('Wellfound', 'https://wellfound.com', 'IT: Teknoloji girişimleri, hissedar olma potansiyeli olan erken aşama startuplar'),
  ('Berlin Startup Jobs', 'https://berlinstartupjobs.com', 'IT: Berlin startup ekosistemi; QA, Dev ve Product rolleri'),
  ('Honeypot', 'https://www.honeypot.io', 'IT: Tersine işe alım; profil oluşturursunuz, Alman şirketleri size teklif gönderir'),
  ('Instaffo', 'https://instaffo.com', 'IT: Becerilerinize göre uygun firmalarla otomatik eşleştirme'),
  ('Talent.io', 'https://www.talent.io/de', 'IT: Profilinize göre şirketlerin doğrudan iletişime geçtiği platform'),
  ('WeAreDevelopers', 'https://www.wearedevelopers.com', 'IT: Sadece yazılımcılar için Avrupa/Almanya ağı'),
  ('4scotty', 'https://4scotty.com', 'IT: Şirketler mülakat öncesi teklif ve maaş detaylarıyla size ulaşır'),
  ('IT-Treff', 'https://www.it-treff.de', 'IT: Sistem yönetimi ve donanım destek rolleri'),
  ('Otta', 'https://otta.com', 'IT: Hızlı büyüyen modern firmalar ve uzaktan roller'),
  ('Remote-jobs', 'https://remote-jobs.de', 'IT: Yalnızca %100 uzaktan veya hibrit çalışmaya izin veren ilanlar'),
  ('IT-Jobs.de', 'https://www.it-jobs.de', 'IT: Şirketlerin kariyer sayfalarındaki tüm yazılım ilanları'),
  -- 4.4 İngilizce ilanlar ve vize sponsorluğu / relocation
  ('EnglishJobs', 'https://englishjobs.de', 'İngilizce: Almanca bilgisi gerektirmeyen firmaların ilanları'),
  ('The Local Jobs', 'https://jobs.thelocal.de', 'İngilizce: Yabancılar için kurulan haber ağının kariyer sekmesi'),
  ('Relocate.me', 'https://relocate.me', 'Relocation: Yalnızca vize sponsorluğu ve taşınma paketi sunan işler'),
  ('Germany Startup Jobs', 'https://germanystartupjobs.com', 'İngilizce: İngilizcenin ana dil olduğu dinamik startup pozisyonları'),
  ('Landing.jobs', 'https://landing.jobs', 'Relocation: Vize ve çalışma izni filtresiyle Batı Avrupa teknoloji ilanları'),
  ('Startup.jobs', 'https://startup.jobs', 'İngilizce: "relocation" anahtar kelimesiyle taşınma destekli startup ilanları'),
  ('Europe Language Jobs', 'https://europelanguagejobs.com', 'İngilizce: Dil becerinize (örn. Türkçe) göre Avrupa''daki işler'),
  ('EuroEngineerJobs', 'https://euroengineerjobs.com', 'İngilizce: Almanya dahil Avrupa genelinde İngilizce mühendislik ilanları'),
  ('EuroPharmaJobs', 'https://europharmajobs.com', 'İngilizce: İlaç, biyoteknoloji ve üretimde Avrupa çapında ilanlar'),
  ('HN Who is Hiring', 'https://news.ycombinator.com', 'İngilizce/IT: Aylık "Who is hiring" başlığında şirketler vize sponsorluğu notuyla ilan verir'),
  -- 4.5 Mühendislik, otomotiv, üretim ve enerji
  ('Ingenieur.de', 'https://jobs.ingenieur.de', 'Mühendislik: VDI resmi ilanları, mühendisler için prestijli ilan ağı'),
  ('Jobvector', 'https://www.jobvector.de', 'MINT: Mühendis, biyolog, fizikçi ve kimyagerler için bilim ve teknoloji ilanları'),
  ('Greenjobs', 'https://www.greenjobs.de', 'Enerji/Çevre: Rüzgar, güneş enerjisi ve sürdürülebilirlik alanı ilanları'),
  ('Energiejobs', 'https://www.energiejobs.de', 'Enerji: Enerji dönüşümü kapsamındaki mühendislik projeleri'),
  ('Baujobs', 'https://www.baujobs.de', 'İnşaat: Mimarlık ve inşaat mühendisliği pozisyonları'),
  ('Auto-jobs', 'https://www.auto-jobs.de', 'Otomotiv: Yan sanayi ve OEM firmalarına doğrudan ulaşım'),
  ('Chemie.de Jobs', 'https://www.chemie.de/jobs', 'Kimya: Laboratuvar ve proses mühendisliği işleri'),
  ('MINT Solutions', 'https://www.mint-solutions.de', 'Mühendislik: Fen bilimleri ve bilişimde yüksek nitelikli headhunter ilanları'),
  -- 4.6 Sağlık ve bakım
  ('PraktischArzt', 'https://www.praktischarzt.de', 'Sağlık: Doktorlar ve asistan hekimler için en geniş ilan havuzu'),
  ('Ärzteblatt Jobs', 'https://jobs.aerzteblatt.de', 'Sağlık: Alman Tabipler Birliği dergisinin uzman ve başhekim ilan portalı'),
  ('Medi-Jobs', 'https://www.medi-jobs.de', 'Sağlık: Fizyoterapistten diyetisyene tüm sağlık kolları'),
  ('Kliniken.de', 'https://www.kliniken.de/jobs', 'Sağlık: Hastane içi roller, harita üzerinde klinik ilanı arama'),
  ('Pflegejob', 'https://www.pflegejob.de', 'Bakım: Hasta ve yaşlı bakımı, yurt dışından alım yapılan bakım personeli'),
  ('DocCheck Jobs', 'https://jobs.doccheck.com', 'Sağlık: İlaç ve medikal teknoloji sektörü kurumsal ilanları'),
  ('Thieme Stellen', 'https://stellenmarkt.thieme.de', 'Sağlık: Akademik ve pratik tıp, Thieme yayınevinin ilan tabanı'),
  ('Medizin-Job', 'https://www.medizin-job.de', 'Sağlık/Bakım: Muayenehanelerden bakım merkezlerine çeşitli medikal pozisyonlar'),
  -- 4.7 Teknik meslekler ve zanaat (Handwerk)
  ('Handwerker Jobs', 'https://www.handwerkerjobs.de', 'Zanaat: 12.000''i aşkın zanaat ilanı, kariyer rehberleri ve iş alarmı'),
  ('Handwerker Stellen', 'https://www.handwerkerstellen.de', 'Zanaat: Elektrikçi, tesisatçı ve usta ilanları'),
  ('PowerUs', 'https://www.powerus.de', 'Zanaat: Elektrik, SHK, çatı, marangozluk, metal ve oto mekatronik kalıcı pozisyonlar'),
  ('Lehrstellen-Radar', 'https://www.lehrstellen-radar.de', 'Ausbildung: 130''dan fazla zanaat dalında Ausbildung ve staj yeri arama'),
  ('Handwerk.de', 'https://www.handwerk.de', 'Zanaat: Alman Zanaat Odaları portalı; meslek testi, A-Z meslekler, Ausbildung yeri'),
  ('BQ-Portal', 'https://www.bq-portal.de', 'Zanaat/Denklik: Yabancı meslek belgelerinin Almanya''daki karşılığı; HWK denkliği öncesi bakın'),
  -- 4.8 Lojistik, perakende, otelcilik ve gastronomi
  ('Hotelcareer', 'https://www.hotelcareer.de', 'Otelcilik: Konaklama endüstrisinin bir numaralı iş arama motoru'),
  ('Gastrojobs', 'https://www.gastrojobs.de', 'Gastronomi: Aşçı ve servis, restoran ve catering şirketlerinin ilanları'),
  ('Rolling Pin', 'https://www.rollingpin.de/jobs', 'Otel/Gastro: Michelin yıldızlı restoranlar ve lüks oteller'),
  ('Logistik-Jobs', 'https://www.logistik-jobs.de', 'Lojistik: Tedarik zinciri, mühendislikten depolamaya tüm kademeler'),
  ('Speditions-Jobs', 'https://www.speditions-jobs.de', 'Lojistik: Tır şoförlüğünden uluslararası taşımacılık planlamasına nakliye ve gümrükleme'),
  ('Karriere Handel', 'https://www.karriere-im-handel.de', 'Perakende: Satış danışmanlığı, şube müdürlüğü ve zincir market pozisyonları'),
  -- 4.9 Öğrenci, staj, Werkstudent, Ausbildung ve yeni mezun
  ('Absolventa', 'https://www.absolventa.de', 'Yeni mezun: Trainee ve Junior roller, 0-2 yıl deneyimliler için ideal'),
  ('Workwise', 'https://workwise.io', 'Öğrenci/Mezun: Ön yazı gerektirmeden tek tıkla başvuru'),
  ('MeinPraktikum', 'https://www.meinpraktikum.de', 'Staj: Staj programları ve şirketlerin stajyerlerden aldığı puanlar'),
  ('Zenjob', 'https://www.zenjob.com/de/jobs', 'Öğrenci: Uygulama üzerinden günlük yevmiyeli part-time işler'),
  ('Jobmensa', 'https://www.jobmensa.de', 'Öğrenci: Almanya''nın en büyük üniversite öğrencisi iş havuzu (Werkstudent)'),
  ('Azubiyo', 'https://www.azubiyo.de', 'Ausbildung: Hem okuyup hem maaş almak isteyenler için mesleki eğitim ve test'),
  ('AUBI-plus', 'https://www.aubi-plus.de', 'Ausbildung: Şirketlerin eğitim olanakları, kalite sertifikalarıyla listelenir'),
  ('e-fellows', 'https://www.e-fellows.net/jobs', 'Öğrenci/Mezun: Burs programları ve prestijli danışmanlık/finans stajları'),
  ('Unicum', 'https://karriere.unicum.de', 'Öğrenci/Mezun: Kampüs işleri ve başlangıç seviyesi ilanlar'),
  ('Connecticum', 'https://www.connecticum.de', 'Öğrenci/Mezun: IT ve mühendislik stajı, kariyer fuarlarının dijital uzantısı'),
  -- 4.10 Akademi ve araştırma
  ('Academics', 'https://www.academics.de', 'Akademi: Almanya, Avusturya ve İsviçre üniversite ve araştırma kurumları ilanları (DIE ZEIT)'),
  ('EURAXESS', 'https://euraxess.ec.europa.eu/jobs', 'Akademi: AB araştırmacı iş ve hareketlilik portalı, Almanya ilanlarını da kapsar'),
  ('jobs.myScience', 'https://www.myscience.de/jobs', 'Akademi: Almanya ve komşu ülkelerdeki araştırma merkezleri ve yüksek teknoloji firmaları'),
  ('Academic Positions', 'https://academicpositions.com', 'Akademi: Doktora, post-doc ve profesörlük ilanları, ülke filtresiyle'),
  ('Max Planck Stellenbörse', 'https://www.mpg.de/stellenboerse', 'Akademi: Max Planck Enstitülerindeki post-doc, bilimsel ve teknik pozisyonlar'),
  -- 4.11 İşe alım ajansları ve büyük işveren kariyer sayfaları
  ('Deutsche Bahn Karriere', 'https://db.jobs/de-de', 'İşveren: Demiryolu ve IT; en çok personel alan, relocation konusunda güçlü şirketlerden'),
  ('Bosch Karriere', 'https://www.bosch.de/karriere', 'İşveren: Otomotiv ve yazılım; Türkiye''den transfer için popüler adres'),
  ('Siemens Karriere', 'https://jobs.siemens.com', 'İşveren: Otomasyon ve enerji; çok sayıda İngilizce departman')
) AS v(name, url, description)
WHERE NOT EXISTS (
  SELECT 1 FROM recruitment_agencies r
  WHERE lower(r.name) = lower(v.name)
     OR regexp_replace(lower(r.url), '^https?://(www\.)?([^/]+).*$', '\2')
      = regexp_replace(lower(v.url), '^https?://(www\.)?([^/]+).*$', '\2')
);
