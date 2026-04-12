export interface DocumentData {
  name: string;
  officialName?: string;
  purpose?: string;
  who?: string;
  supportingDocs?: string;
  authority?: string;
  duration?: string;
  cost?: string;
  note?: string;
  source?: string;
}

export interface CategoryData {
  category: string;
  documents: DocumentData[];
}

export const belgelerData: CategoryData[] = [
  {
    "category": "Adres ve kayıt belgeleri",
    "documents": [
      {
        "name": "Anmeldung / İkamet kaydı",
        "officialName": "İkamet adres kaydı / *Anmeldung der Wohnung*",
        "purpose": "Almanya’da bir adrese resmen kayıt olmak; vergi kimliği (Steuer-ID) ve birçok işlem için başlangıç noktasıdır. ",
        "who": "A+B (hemen herkes).",
        "supportingDocs": "Kimlik/pasaport; kira sözleşmesi; **Wohnungsgeberbestätigung** (ev sahibi formu). ",
        "authority": "Bürgeramt / Einwohnermeldeamt (belediyeye bağlı). ",
        "duration": "Randevuya bağlı; işlem genellikle aynı gün sonuçlanır (yerel uygulama).",
        "cost": "Eyalete göre değişir (bazı yerlerde ücretsiz/ düşük ücret).",
        "source": ""
      },
      {
        "name": "Meldebescheinigung / İkamet belgesi",
        "officialName": "İkamet belgesi / *Meldebescheinigung*",
        "purpose": "Adres kaydınızın (Anmeldung) resmî kanıtı; banka, işveren, bazı oturum/vatandaşlık süreçlerinde istenir. ",
        "who": "A+B.",
        "supportingDocs": "Kimlik belgesi; bazen kayıtlı adresin doğrulanması.",
        "authority": "Meldebehörde/Bürgeramt. ",
        "duration": "Sıklıkla “anında” veya kısa süre (online/gişe). ",
        "cost": "Eyalete göre değişir; online başvuruda bazı yerlerde ücret alınmayabilir. ",
        "source": ""
      },
      {
        "name": "Wohnungsgeberbestätigung / Ev sahibi teyit belgesi",
        "officialName": "Ev sahibi teyidi / *Wohnungsgeberbestätigung*",
        "purpose": "Anmeldung için yasal zorunlu kanıt türlerinden biridir; ev sahibi taşınmayı yazılı teyit eder. ",
        "who": "A+B (Anmeldung yapan herkes).",
        "supportingDocs": "Ev sahibinin doldurduğu form; taşınma tarihi/adres bilgisi.",
        "authority": "Belgeyi “Wohnungsgeber” düzenler; Meldebehörde’ye sunulur. ",
        "duration": "Ev sahibinin düzenleme hızına bağlı.",
        "cost": "Yok (genellikle).",
        "source": ""
      }
    ]
  },
  {
    "category": "Vergi ve sosyal güvenlik",
    "documents": [
      {
        "name": "Steuerliche Identifikationsnummer (IdNr) / Steuer-ID",
        "officialName": "Vergi kimlik numarası / *Steuerliche Identifikationsnummer*",
        "purpose": "Almanya’da vergi ve birçok sosyal işlemde (özellikle çocuk yardımları başvurularında) kimlikleyici numaradır. ",
        "who": "A+B.",
        "supportingDocs": "Genellikle otomatik atanır; kayıp/yeniden bildirim için kimlik ve kayıt bilgileri gerekir. ",
        "authority": "Sistematik atama Meldebehörde kaydı sonrası yapılır; bilgilendirme vergi idaresi üzerinden gelir. ",
        "duration": "İlk atama/tebliğ süresi yerel süreç ve posta akışına bağlı (Eyalete göre değişir).",
        "cost": "Yok.",
        "source": ""
      },
      {
        "name": "Versicherungsnummernachweis (Sozialversicherung) / Sosyal sigorta numarası belgesi",
        "officialName": "Sosyal güvenlik numarası belgesi / *Versicherungsnummernachweis (Sozialversicherungsausweis)*",
        "purpose": "Çalışma ve sigorta kayıtlarında “SV numarası” kanıtı; işverenler sıklıkla ister. ",
        "who": "A+B (özellikle çalışmaya başlayanlar).",
        "supportingDocs": "Kişisel kimlik bilgileri; bazı durumlarda sigorta geçmişi.",
        "authority": "Rentenversicherung sistemi (çoğu zaman işveren kaydıyla tetiklenir). ",
        "duration": "İlk istihdam/ kayıt akışına bağlı (Eyalete göre değişir).",
        "cost": "Yok.",
        "source": ""
      }
    ]
  },
  {
    "category": "Sağlık",
    "documents": [
      {
        "name": "Elektronische Gesundheitskarte (eGK) / Sağlık sigortası kartı",
        "officialName": "Elektronik sağlık kartı / *Elektronische Gesundheitskarte (eGK)*",
        "purpose": "Doktorda/eczanelerde sigorta kanıtı; sağlık hizmetine erişim. ",
        "who": "A+B (Almanya’da sigortalı olan herkes).",
        "supportingDocs": "Krankenkasse üyeliği; kimlik; fotoğraf (kural/istisna sigortaya göre). ",
        "authority": "Krankenkasse (GKV/özel). ",
        "duration": "Üyelik tamamlanınca kartın basım/posta sürecine bağlı (Eyalete göre değişir).",
        "cost": "Kart için ayrı ücret genellikle yok; sigorta primleri ayrı konudur. ",
        "source": ""
      }
    ]
  },
  {
    "category": "Kimlik ve seyahat (Almanya)",
    "documents": [
      {
        "name": "Personalausweis / Alman kimlik kartı",
        "officialName": "Alman kimlik kartı / *Personalausweis*",
        "purpose": "Almanya içinde temel kimlik; eID ile birçok online işlem; AB içinde kimlikle seyahat (uygun ülkelerde). ",
        "who": "B (Alman vatandaşıysa) + A (Alman vatandaşlığına geçtiyse).",
        "supportingDocs": "Biyometrik foto; kimlik doğrulama; önceki kimlik/pasaport (duruma göre). ",
        "authority": "Bürgeramt/Personalausweisbehörde. ",
        "duration": "Üretim genellikle **en az 2 hafta** (yoğunlukta uzayabilir). ",
        "cost": "**24+ yaş 46 €**, **24 yaş altı 27,60 €** (07.02.2026 itibarıyla). ",
        "source": ""
      },
      {
        "name": "Reisepass / Alman pasaportu",
        "officialName": "Alman pasaportu / *Reisepass*",
        "purpose": "AB dışı seyahatlerde temel belge; bazı ülkeler kimlikle kabul etmez. ",
        "who": "B (Alman vatandaşıysa) + A (Alman vatandaşlığına geçtiyse).",
        "supportingDocs": "Biyometrik foto; kimlik; önceki pasaport (varsa).",
        "authority": "Passbehörde/Bürgeramt. ",
        "duration": "Başvurudan sonra **genellikle en az 2 hafta** (yerel yoğunlukta daha uzun olabilir). ",
        "cost": "**24+ yaş 70 €**, **24 yaş altı 37,50 €**; Express için **32 €** ek ücret olabilir. ",
        "source": ""
      },
      {
        "name": "Vorläufiger Reisepass / Geçici Alman pasaportu",
        "officialName": "Geçici pasaport / *Vorläufiger Reisepass*",
        "purpose": "Acil durumlarda kısa süreli seyahat belgesi (genelde 1 yıl geçerli). ",
        "who": "B (Alman vatandaşıysa) + A (Alman vatandaşlığına geçtiyse) – acil ihtiyaca göre.",
        "supportingDocs": "Kimlik; fotoğraf; aciliyet gerekçesi (uygulama yerel).",
        "authority": "Bürgeramt/Passbehörde.",
        "duration": "Çoğu yerde aynı gün düzenlenebilir (Eyalete göre değişir).",
        "cost": "**26 €**. ",
        "source": ""
      }
    ]
  },
  {
    "category": "Vize (Almanya’ya giriş için) – A grubu için tipik “ön belge”",
    "documents": [
      {
        "name": "Nationales Visum (D-Visum) / Uzun dönem ulusal vize",
        "officialName": "Ulusal vize / *Nationales Visum (D-Visum)*",
        "purpose": "90 günden uzun kalış için Almanya’ya giriş; Almanya içinde sonrasında oturum kartına (eAT) bağlanır. ",
        "who": "A (sonradan gelenlerin çok büyük kısmı).",
        "supportingDocs": "Vize türüne göre değişir (ör. aile birleşimi, çalışma, eğitim); başvuruda form ve pasaport temel unsurlardır. ",
        "authority": "Başvuru ülkesindeki Alman dış temsilciliği; çoğu durumda Almanya’daki Ausländerbehörde ve bazen diğer kurumların onayı gerekir. ",
        "duration": "Vize türüne göre **birkaç hafta**, onay gerektiren dosyalarda **3 aya kadar, bazen daha uzun** sürebilir. ",
        "cost": "Ulusal vize için genel ücret **75 €**; bazı çocuk başvurularında **37,50 €** (istisna/ muafiyetler olabilir). ",
        "source": ""
      }
    ]
  },
  {
    "category": "Göç ve oturum (Almanya içinde) – A ve Alman vatandaşı olmayan B grubu için çekirdek set",
    "documents": [
      {
        "name": "Elektronischer Aufenthaltstitel (eAT) / Oturum kartı",
        "officialName": "Elektronik oturum izni kartı / *Elektronischer Aufenthaltstitel (eAT)*",
        "purpose": "Oturum hakkının kart üzerinde verilmesi; çalışma hakkı/yan koşullar çoğu zaman eAT ve “Zusatzblatt” ile görünür hale gelir. ",
        "who": "A + B (Alman vatandaşı değilse).",
        "supportingDocs": "Pasaport; biyometrik foto; adres kaydı; oturum gerekçesine göre (iş sözleşmesi, aile bağları, eğitim vb.) ek set.",
        "authority": "Ausländerbehörde.",
        "duration": "Kart üretimi çoğu şehirde **4–6 hafta** olarak ifade edilir (Eyalete göre değişir). ",
        "cost": "Oturum türüne göre farklıdır (aşağıda ayrı fişler).",
        "source": ""
      },
      {
        "name": "Aufenthaltserlaubnis / Süreli oturum izni",
        "officialName": "Süreli oturum izni / *Aufenthaltserlaubnis*",
        "purpose": "Belirli amaçla (aile, iş, eğitim vb.) süreli ikamet.",
        "who": "A + B (Alman vatandaşı değilse).",
        "supportingDocs": "Amaç bazlı dosya; pasaport; foto; adres.",
        "authority": "Ausländerbehörde.",
        "duration": "Eyalete göre değişir; kart basımı eAT sürelerinden etkilenir. ",
        "cost": "Tipik idari ücret **100 €**. ",
        "source": ""
      },
      {
        "name": "Blaue Karte EU / AB Mavi Kart",
        "officialName": "AB Mavi Kart / *Blaue Karte EU*",
        "purpose": "Nitelikli istihdam için özel oturum statüsü.",
        "who": "A (nitelikli çalışma ile gelenler) + B (Alman vatandaşı değilse ve koşulları sağlıyorsa).",
        "supportingDocs": "İş sözleşmesi/teklif; diploma ve/veya denklik; pasaport; foto; (gerekirse) diğer kurum onayları.",
        "authority": "Ausländerbehörde.",
        "duration": "Eyalete göre değişir; eAT üretim süreci etkiler. ",
        "cost": "Tipik idari ücret **100 €**; bazı özel durumlarda azaltılmış ücret uygulamaları olabilir. ",
        "source": ""
      },
      {
        "name": "Niederlassungserlaubnis / Süresiz oturum izni",
        "officialName": "Süresiz oturum izni / *Niederlassungserlaubnis*",
        "purpose": "Süre sınırı olmadan ikamet; iş piyasasına erişimde daha istikrarlı statü.",
        "who": "A + B (Alman vatandaşı değilse, şartları sağlarsa).",
        "supportingDocs": "Uzun süreli ikamet/gelir/entegrasyon kanıtları (dosya türü: Eyalete göre değişir).",
        "authority": "Ausländerbehörde.",
        "duration": "Eyalete göre değişir.",
        "cost": "Tipik idari ücret **113 €**. ",
        "source": ""
      },
      {
        "name": "Erlaubnis zum Daueraufenthalt-EU / AB uzun dönem ikamet izni",
        "officialName": "AB uzun dönem ikamet izni / *Erlaubnis zum Daueraufenthalt-EU*",
        "purpose": "AB içinde uzun dönem ikamet statüsü (ülkeler arası kurallar ayrıca geçerlidir).",
        "who": "A + B (Alman vatandaşı değilse, şartları sağlarsa).",
        "supportingDocs": "İkamet süresi, geçim güvencesi vb. kanıtlar (Eyalete göre değişir).",
        "authority": "Ausländerbehörde.",
        "duration": "Eyalete göre değişir.",
        "cost": "Tipik idari ücret **109 €**. ",
        "source": ""
      },
      {
        "name": "Fiktionsbescheinigung / Geçici “statü devam ediyor” belgesi",
        "officialName": "Geçici oturum belgesi / *Fiktionsbescheinigung*",
        "purpose": "Oturum uzatma/başvuru işlemi sürerken mevcut statünün (hukuki olarak) devam ettiğini belgelemek. ",
        "who": "A + B (Alman vatandaşı değilse; uzatma/yenileme sürecinde).",
        "supportingDocs": "Başvuru kanıtı; pasaport; mevcut oturum kartı (varsa).",
        "authority": "Ausländerbehörde. ",
        "duration": "Örnek federal hizmet tanımında “yaklaşık 5 hafta” verilmiştir (Eyalete göre değişir). ",
        "cost": "Örnek federal hizmet tanımında **13 €** verilmiştir (uygulama Eyalete göre değişir). ",
        "source": ""
      },
      {
        "name": "Zusatzblatt zum Aufenthaltstitel / Oturum kartı ek sayfası",
        "officialName": "Oturum koşulları ek sayfası / *Zusatzblatt (Nebenbestimmungen)*",
        "purpose": "Çalışma izni, yerleşim kısıtı vb. “yan koşulları” göstermek; kart üzerinde “siehe Zusatzblatt” bulunabilir. ",
        "who": "A + B (Alman vatandaşı değilse; koşul varsa).",
        "supportingDocs": "Genelde eAT ile birlikte verilir; değişiklik talebinde gelir/iş/yaşam durumu kanıtları istenir. ",
        "authority": "Ausländerbehörde.",
        "duration": "eAT üretim süreciyle eş zamanlı; değişikliklerde Eyalete göre değişir. ",
        "cost": "Değişiklik başvurularında yerel ücret olabilir (Eyalete göre değişir).",
        "source": ""
      }
    ]
  },
  {
    "category": "Aile, doğum, evlilik, velayet (Almanya)",
    "documents": [
      {
        "name": "Geburtsurkunde / Doğum belgesi",
        "officialName": "Doğum belgesi / *Geburtsurkunde*",
        "purpose": "Kimlik ve aile işlemlerinin temel kanıtı; Elterngeld/Kindergeld, sağlık sigortası kaydı gibi işlemlerde kullanılır. ",
        "who": "A+B (kendi doğum belgesi veya Almanya’da doğan çocuk için).",
        "supportingDocs": "Başvuruya göre; ebeveyn kimlikleri; evlilik kaydı veya annenin doğum belgesi gibi evraklar (duruma göre). ",
        "authority": "Standesamt (doğum yerindeki). ",
        "duration": "Yeni doğum kaydı sonrası Standesamt akışına bağlı; sonradan “Urkunde” talebi posta/online sürecine bağlı (Eyalete göre değişir).",
        "cost": "Eyalete göre değişir; örnek portallarda 15–20 € bantları görülür, sosyal amaçlı bazı nüshalar ücretsiz olabilir. ",
        "source": ""
      },
      {
        "name": "Eheurkunde / Evlilik belgesi",
        "officialName": "Evlilik belgesi / *Eheurkunde*",
        "purpose": "Evliliğin resmî kanıtı; soyadı, çocuk, oturum/vatandaşlık dosyalarında sık kullanılır.",
        "who": "A+B (evli olanlar).",
        "supportingDocs": "Kayıtlı olduğu Standesamt bilgisi; kimlik; yetkilendirme/vekâlet (başkasının alması halinde). ",
        "authority": "Standesamt (evliliğin tescil edildiği yer). ",
        "duration": "Kayıt yeri belliyse genelde kısa; kayıt yeri bilinmiyorsa arama süreci aylar sürebilir (örnek: 8 aya kadar). ",
        "cost": "Eyalete göre değişir; sık görülen örnek ücret 10 € (ek nüsha 5 €) olsa da belediyeye göre farklı tarife olabilir. ",
        "source": ""
      },
      {
        "name": "Anerkennung ausländischer Ehescheidung / Yabancı boşanma kararının tanınması",
        "officialName": "Yabancı boşanma kararının tanınması / *Anerkennung ausländischer Ehescheidungen (Bescheid)*",
        "purpose": "Boşanmanın Alman hukuk düzeninde geçerli sayılması; yeni evlilik ve nüfus/statü işlemleri için kritik olabilir. ",
        "who": "A+B (boşanma kararı Almanya dışında verildiyse ve tanıma gerekiyorsa).",
        "supportingDocs": "Yabancı mahkeme kararı, kesinleşme şerhi, tercüme/apostil/diğer kanıtlar (dosya ülkeye göre değişir).",
        "authority": "Eyalet adlî idaresi / pratikte çoğu yerde Oberlandesgericht üzerinden yürür (Eyalete göre değişir). ",
        "duration": "Yaklaşık 3–4 ay örneklenir; dosya karmaşıklığına göre değişebilir (Eyalete göre değişir). ",
        "cost": "Gelire bağlı çerçeve ücret örnekleri **15–305 €** bandı; başvuru kanalı (Standesamt üzerinden) ek ücrete yol açabilir. ",
        "source": ""
      },
      {
        "name": "Vaterschaftsanerkennung / Babalık tanıma belgesi",
        "officialName": "Babalık tanıma / *Vaterschaftsanerkennung*",
        "purpose": "Evlilik dışı doğumlarda babalık bağını resmen kurmak; soyadı, nafaka, vatandaşlık/soy bağı dosyalarında etkili olabilir. ",
        "who": "A+B (ihtiyaca göre; özellikle evlilik dışı çocuklarda).",
        "supportingDocs": "Kimlik belgeleri ve kişisel durum evrakları (yerel).",
        "authority": "Jugendamt/Standesamt/Noter/Amtsgericht gibi yerler. ",
        "duration": "Randevu/başvuruya bağlı; çoğu yerde aynı gün beyan alınabilir (Eyalete göre değişir).",
        "cost": "Jugendamt/Standesamt üzerinden genellikle ücretsiz; noter/mahkeme masraf doğurabilir. ",
        "source": ""
      },
      {
        "name": "Sorgeerklärung / Ortak velayet beyanı",
        "officialName": "Ortak velayet beyanı / *Sorgeerklärung*",
        "purpose": "Evlilik dışı ebeveynlerde ortak velayet tesis etmek; çocuğun resmî işlemlerinde imza/karar yetkisi. ",
        "who": "A+B (özellikle evlilik dışı ebeveynler).",
        "supportingDocs": "Ebeveyn kimlik belgeleri; (sonradan yapılırsa) çocuğun doğum belgesi gibi evraklar. ",
        "authority": "Jugendamt veya noter (kamusal beyan şartı). ",
        "duration": "Randevuya bağlı (Eyalete göre değişir).",
        "cost": "Jugendamt üzerinden genellikle ücretsiz; noter ücretli olabilir (Eyalete göre değişir). ",
        "source": ""
      }
    ]
  },
  {
    "category": "Sosyal yardımlar (çocuk/aile)",
    "documents": [
      {
        "name": "Kindergeld-Antrag / Çocuk parası başvurusu",
        "officialName": "Çocuk parası başvurusu / *Kindergeld (Antrag bei der Familienkasse)*",
        "purpose": "Çocuk için düzenli maddî destek; başvuru için vergi kimlik numaraları kritik veri alanıdır. ",
        "who": "A+B (uygun hak sahipleri; ikamet ve statü kriterleri ayrıca değerlendirilir).",
        "supportingDocs": "Başvuruda ebeveyn ve çocukların Steuer-ID’leri; çocukla ilişki ve ikamet kanıtları (dosya türü değişebilir). ",
        "authority": "Familienkasse. ",
        "duration": "Bölgesel farklı; örnek resmi bilgi “genelde 4–6 hafta” olarak verilir (Eyalete göre değişir). ",
        "cost": "Başvuru için ücret yok.",
        "source": ""
      },
      {
        "name": "Elterngeld-Antrag / Ebeveyn parası başvurusu",
        "officialName": "Ebeveyn parası / *Elterngeld (Antrag)*",
        "purpose": "Doğum sonrası gelir telafisi; ebeveynin çocuğa bakım için çalışmayı azaltması/ara vermesi halinde destek.",
        "who": "A+B (uygun hak sahipleri).",
        "supportingDocs": "Geburtsurkunde + gelir kanıtları (maaş bordroları, vergi kararı vb.). ",
        "authority": "Elterngeldstelle (Eyalete göre değişir; bazen Jugendamt bağlantılı). ",
        "duration": "Şehre göre değişir; örnek belediye bilgisinde **6–8 hafta** verilmiştir (Eyalete göre değişir). ",
        "cost": "Örnek belediye hizmet tanımlarında “ücret yok” denir. ",
        "source": ""
      },
      {
        "name": "Unterhaltsvorschuss / Nafaka avansı (tek ebeveyn için)",
        "officialName": "Nafaka avansı / *Unterhaltsvorschuss (Antrag)*",
        "purpose": "Diğer ebeveyn nafaka ödemiyorsa/eksikse, çocuğa devlet tarafından geçici destek. ",
        "who": "A+B (tek ebeveynli hanelerde şartlara bağlı).",
        "supportingDocs": "Geburtsurkunde; varsa Vaterschaftsanerkennung ve Unterhaltstitel; kimlik/oturum kartı (özellikle yabancılar için) gibi evraklar. ",
        "authority": "Genellikle Jugendamt/Unterhaltsvorschussstelle. ",
        "duration": "Yerel iş yüküne bağlı (Eyalete göre değişir).",
        "cost": "Örnek belediye hizmetlerinde “**ücret yok**” açıkça belirtilir. ",
        "source": ""
      }
    ]
  },
  {
    "category": "Adli/uygunluk belgeleri",
    "documents": [
      {
        "name": "Führungszeugnis / Adli sicil (Almanya – “iyi hâl belgesi”)",
        "officialName": "Adli sicil kaydı belgesi / *Führungszeugnis*",
        "purpose": "İşe giriş, gönüllülük, çocuklarla çalışma gibi alanlarda güvenlik kontrolü. ",
        "who": "A+B (ihtiyaca göre).",
        "supportingDocs": "Kimlik doğrulama; online başvuruda eID/BundID ile doğrulama seçenekleri (yönteme göre). ",
        "authority": "Federal sistem üzerinden; başvuru online veya belediye üzerinden yapılabilir. ",
        "duration": "Posta ve işlem akışına bağlı (Eyalete göre değişir); pratikte birkaç iş günü–hafta ölçeğinde planlanır.",
        "cost": "**13 €**. ",
        "source": ""
      }
    ]
  },
  {
    "category": "Ehliyet ve ulaşım – Türkiye’den gelenler için kritik",
    "documents": [
      {
        "name": "Umschreibung ausländischer Fahrerlaubnis / Türk ehliyetinin Alman ehliyetine çevrilmesi",
        "officialName": "Yabancı ehliyet dönüşümü / *Umschreibung einer ausländischen Fahrerlaubnis*",
        "purpose": "Almanya’da yerleşik ikamet başladıktan sonra Türkiye ehliyetinin sınırlı süre geçerli olması nedeniyle Alman ehliyete geçiş.",
        "who": "A (Türkiye’den ehliyetle gelenler) + B (ehliyeti Türkiye’den aldıysa).",
        "supportingDocs": "Kimlik/pasaport; Meldebestätigung; yabancı ehliyet aslı + tercüme; biyometrik foto; gerekirse ilk yardım ve diğer yerel kanıtlar. ",
        "authority": "Fahrerlaubnisbehörde (şehir/kaymakamlık düzeyi). ",
        "duration": "Başvuru ve sınav planlamasına bağlı (Eyalete göre değişir).",
        "cost": "İdari ücretler belediyeye göre değişir (örnek tarifelerde ~55–58 € bandı görülür; sınav ücretleri ayrıca). ",
        "note": "(Türkiye “Anlage 11” listesinde yok):** Federal bakanlık merkblatt’ında “Anlage 11” ülkeleri listelenir; listede Türkiye bulunmadığı için genel kural olarak teorik + pratik sınav gerekliliğiyle karşılaşılır (tam şartlar yerel makamca teyit edilir). ",
        "source": ""
      }
    ]
  },
  {
    "category": "Vatandaşlık ve statü belgeleri (özellikle uzun vadeli entegrasyon)",
    "documents": [
      {
        "name": "Einbürgerungsurkunde / Alman vatandaşlığına kabul belgesi",
        "officialName": "Vatandaşlığa kabul belgesi / *Einbürgerungsurkunde*",
        "purpose": "Alman vatandaşlığının kazanımını ispat; bu belgeyle Alman kimliği/pasaportu için başvuru yapılır; kaybında yeniden düzenlenmez, güvenle saklanmalıdır. ",
        "who": "A (vatandaşlığa geçmek isteyenler) + B (Alman vatandaşı değilse ve sonradan geçecekse).",
        "supportingDocs": "Başvuru dosyası; entegrasyon/gelir/kimlik vb. (Eyalete göre değişir).",
        "authority": "Einbürgerungsbehörde (belediye/ilçe).",
        "duration": "Yerel iş yükü çok değişken; örnek bir belediyede randevu bekleme 12 ay ve başvuru sonrası işleme 16 aya kadar uzayabilir şeklinde ilan edilmiştir (Eyalete göre değişir). ",
        "cost": "Genel çerçevede yetişkin için **255 €**, birlikte vatandaş olan reşit olmayan çocuk için **51 €** düzeyi resmî ücret tablolarında geçer. ",
        "source": ""
      },
      {
        "name": "Staatsangehörigkeitsausweis / Alman vatandaşlığının tespiti belgesi",
        "officialName": "Vatandaşlık tespit belgesi / *Staatsangehörigkeitsausweis*",
        "purpose": "Alman vatandaşlığının resmen tespiti/kanıtı gereken karmaşık dosyalarda kullanılır. ",
        "who": "A+B (nadiren; ancak bazı pasaport/vatandaşlık ihtilaflarında kritik).",
        "supportingDocs": "Soy bağı/kimlik/önceki statü belgeleri (dosya çok değişken).",
        "authority": "Başvuru kanalı yerel olabilir; karar ve ücret yapısı federal düzeyde tariflenir. ",
        "duration": "Dosyaya göre çok değişken; resmî bilgi “çok farklı, sıklıkla ek araştırma gerekir” şeklindedir. ",
        "cost": "**51 €**. ",
        "source": ""
      }
    ]
  },
  {
    "category": "Entegrasyon ve dil belgeleri (A’da daha yaygın; vatandaşlıkta da sık “kanıt seti”)",
    "documents": [
      {
        "name": "Zertifikat Integrationskurs / Entegrasyon kursu sertifikası",
        "officialName": "Entegrasyon kursu sertifikası / *Zertifikat Integrationskurs*",
        "purpose": "Kursun başarıyla tamamlandığını göstermek; bazı oturum ve vatandaşlık süreçlerinde kanıt olarak kullanılır. ",
        "who": "A (sık) + B (Alman vatandaşı değilse veya entegrasyon kanıtı gerekiyorsa).",
        "supportingDocs": "Kurs katılımı; DTZ (A2/B1) ve “Leben in Deutschland” testinin başarıyla geçilmesi. ",
        "authority": "Kurs/sınav altyapısı BAMF sistemiyle yürür; sertifika test başarısı sonrası oluşur. ",
        "duration": "Sınav sonucu/sertifika akışı; örnek rehberde sonuçların ~8 haftada geldiği belirtilir (Eyalete göre değişir). ",
        "cost": "Kurs ücretleri statüye göre değişebilir; mesleki dil kurslarında gelir eşiğine göre katkı payı olabilir. ",
        "source": ""
      },
      {
        "name": "B1 dil belgesi (BAMF tanınan) / B1 Sprachnachweis",
        "officialName": "B1 dil kanıtı / *B1-Sprachnachweis*",
        "purpose": "Oturum/vatandaşlık süreçlerinde dil seviyesini kanıtlamak; BAMF tanıdığı sınav türleri listelenmiştir. ",
        "who": "A+B (ihtiyaca göre).",
        "supportingDocs": "Sınav/sertifika.",
        "authority": "Sınav kurumları; BAMF tanıma listesi. ",
        "duration": "Sınav kurumuna göre (Eyalete göre değişir).",
        "cost": "Sınav kurumuna göre (Eyalete göre değişir).",
        "source": ""
      }
    ]
  },
  {
    "category": "Yabancı diploma değerlendirmesi (özellikle A’da çalışma/oturum için “kanıt belgesi”)",
    "documents": [
      {
        "name": "Zeugnisbewertung / Yabancı yükseköğrenim diploması değerlendirme belgesi",
        "officialName": "Diploma değerlendirmesi / *Zeugnisbewertung*",
        "purpose": "Yabancı üniversite diplomasının Almanya sisteminde sınıflandırılması (işveren/oturum süreçlerine yardımcı). ",
        "who": "A (sık) + B (eğitimini Türkiye’de tamamladıysa).",
        "supportingDocs": "Diploma/ transkript ve istenen doğrulama biçimleri (tercüme/beglaubigte Kopie). ",
        "authority": "ZAB. ",
        "duration": "Belgeler tam ise **en fazla 3 ay** olarak belirtilir. ",
        "cost": "**208 €**. ",
        "source": ""
      }
    ]
  },
  {
    "category": "Türkiye kaynaklı belgeler (Almanya’da yaşayanlar için sık gereksinim)",
    "documents": [
      {
        "name": "T.C. Umuma Mahsus Pasaport / Türk pasaportu",
        "officialName": "Türk pasaportu / *Türkischer Reisepass (türk. Pasaport)*",
        "purpose": "Türkiye vatandaşları için seyahat/kimlik; Almanya’daki oturum işlemlerinde pasaport temel belgedir.",
        "who": "A+B (Türkiye vatandaşı olanlar).",
        "supportingDocs": "T.C. Kimlik Kartı; biyometrik foto; eski pasaport; reşit olmayanlarda ebeveyn hazır bulunması veya muvafakatname gibi ek set. ",
        "authority": "T.C. Başkonsolosluğu (konsolosluk randevu sistemi).",
        "duration": "Örnek resmî duyuruda e-pasaportların Türkiye’de tanzim edilip konsolosluğa **yaklaşık 3 hafta** içinde gönderildiği belirtilir; başka temsilcilikte “yaklaşık 1 ay” ifadesi de vardır (yoğunluğa göre değişebilir). ",
        "cost": "Konsolosluk bilgi notlarında yıl bazında güncellenen harç + defter + posta bedelleri verilir (örnek 2026 tarifesi). ",
        "source": ""
      },
      {
        "name": "T.C. Kimlik Kartı / Türk kimlik kartı",
        "officialName": "T.C. kimlik kartı / *Türkische ID-Karte (T.C. Kimlik Kartı)*",
        "purpose": "Türkiye vatandaşlığı kimliği; konsolosluk ve Türkiye işlemlerinde ana kimlik belgesi; dış temsilciliklerden verilebilir. ",
        "who": "A+B (Türkiye vatandaşı olanlar).",
        "supportingDocs": "Biyometrik foto; eski nüfus cüzdanı/kimlik; pasaport/diğer fotoğraflı Türk belgeleri; doğum başvurularında önce doğum kaydı şartı vurgulanır. ",
        "authority": "T.C. Başkonsolosluğu (konsolosluk randevu sistemi). ",
        "duration": "Kimlik kartı Türkiye’de basılıp temsilciliğe gönderilir; örnek uygulamada bildirim gelmezse **45 gün sonra** durum sorulabileceği, bildirimden sonra kartın **en geç 3 ay içinde** teslim alınması gerektiği belirtilir (temsilciliğe göre değişebilir). ",
        "cost": "Temsilcilik ve işlem türüne göre değişebilir (kurumlar ücret tabloları yayınlar); bu raporda tek tip tutar verilmemiştir.",
        "source": ""
      },
      {
        "name": "Yurt dışı doğum tescili / Türkiye’de nüfusa doğum kaydı",
        "officialName": "Yurt dışı doğum tescili / *(TR işlemi) Doğum tescili*",
        "purpose": "Almanya’da doğan çocuğun Türkiye nüfus sistemine kaydı; sonrasında kimlik/pasaport gibi işlemlerin ön şartıdır. ",
        "who": "A+B (Türkiye vatandaşı çocuk/ebeveyn dosyalarında).",
        "supportingDocs": "Doğum belgesi ve ebeveyn kimliği gibi evrak seti (temsilciliğe göre değişir). ",
        "authority": "T.C. Başkonsolosluğu / Nüfus birimi.",
        "duration": "Dosya ve yazışmaya göre değişir.",
        "cost": "İşleme göre değişir.",
        "source": ""
      },
      {
        "name": "Uluslararası Doğum Kayıt Örneği (Formül A)",
        "officialName": "Formül A / *Internationale Geburtsurkunde (Auszug)* (kullanım bağlamına göre adlandırılır)",
        "purpose": "Türkiye’deki doğum kayıt bilgisini çok dilli formatta almak; Almanya’daki bazı medeni hâl işlemlerinde veya Türkiye işlemlerinde kullanılır. ",
        "who": "A+B (ihtiyaca göre).",
        "supportingDocs": "e-Devlet erişimi/kimlik doğrulama. ",
        "authority": "e-Devlet üzerinden ilgili nüfus hizmeti. ",
        "duration": "Online alım anlık.",
        "cost": "Genellikle yok.",
        "source": ""
      },
      {
        "name": "Uluslararası Evlenme Kayıt Örneği (Formül B)",
        "officialName": "Formül B / *Internationale Eheurkunde (Auszug)* (kullanım bağlamına göre)",
        "purpose": "Türkiye’deki evlilik kayıtlarının çok dilli belgesi; uluslararası işlem ve tescillerde kullanılır. ",
        "who": "A+B (ihtiyaca göre).",
        "supportingDocs": "Başvuru kanalına göre değişir.",
        "authority": "Konsolosluk/nüfus hattı. ",
        "duration": "Başvuru kanalına göre değişir.",
        "cost": "İşleme göre değişir.",
        "source": ""
      },
      {
        "name": "Nüfus kayıt örneği (vukuatlı) / Aile kayıt belgesi",
        "officialName": "Nüfus kayıt örneği / *(DE bağlamında) Personenstands-/Registerauszug* (kullanım amacına göre)",
        "purpose": "Aile ve medeni hâl bilgisini (evlilik, çocuklar vb.) resmî biçimde göstermek; özellikle Türkiye işlemleri ve bazı Almanya dosyalarında (apostil+tercüme ile) kullanılır. ",
        "who": "A+B (ihtiyaca göre).",
        "supportingDocs": "e-Devlet kimlik doğrulama. ",
        "authority": "e-Devlet/Nüfus hizmeti. ",
        "duration": "Online alım anlık.",
        "cost": "Yok.",
        "source": ""
      },
      {
        "name": "Adli Sicil Kaydı / Türkiye sabıka kaydı",
        "officialName": "Adli sicil kaydı / *Strafregisterauszug (TR)* (kullanım bağlamına göre)",
        "purpose": "Türkiye sabıka kaydını belgelemek; vize/iş süreçlerinde talep edilebilir.",
        "who": "A+B (ihtiyaca göre).",
        "supportingDocs": "e-Devlet kimlik doğrulama.",
        "authority": "e-Devlet adli sicil hizmeti. ",
        "duration": "Online alım anlık.",
        "cost": "Yok.",
        "source": ""
      },
      {
        "name": "Muvafakatname / Reşit olmayan çocuk için ebeveyn rızası belgesi (TR konsolosluk noteri)",
        "officialName": "Muvafakatname / *Einverständniserklärung der Eltern (konsularisch beurkundet)*",
        "purpose": "Çocuk pasaportu/seyahati ve bazı işlemlerde ebeveyn rızasını belgelemek.",
        "who": "A+B (reşit olmayan çocuk başvurularında).",
        "supportingDocs": "Ebeveyn kimlikleri; velayet durumunu gösteren kararlar; konsolosluk uygulamasına göre ek evrak. ",
        "authority": "T.C. Başkonsolosluğu noterlik işlemleri; ayrıca Türkiye’de noter.",
        "duration": "Randevu ve işlem gününe bağlı.",
        "cost": "Konsolosluk noter harçlarına göre (temsilciliğe göre değişir).",
        "source": ""
      }
    ]
  },
  {
    "category": "Belge geçerliliği ve çeviri – TR↔DE belge trafiğinde “olmazsa olmaz”",
    "documents": [
      {
        "name": "Haager Apostille / Apostil şerhi",
        "officialName": "Apostil şerhi / *Haager Apostille*",
        "purpose": "Bir ülkede düzenlenen resmî belgenin diğer ülkede kullanılabilmesi için imza/kurum doğrulaması; Almanya ile Türkiye de dahil birçok ülke arasında apostil mekanizması geçerlidir. ",
        "who": "A+B (özellikle Türkiye belgesi Almanya’da veya Almanya belgesi Türkiye’de kullanılacaksa).",
        "supportingDocs": "Apostil, belgenin **orijinali** üzerinden verilir; hangi ülkede kullanılacağına göre “apostil mi legalizasyon mu” kararı verilir. ",
        "authority": "Belgeyi düzenleyen ülkenin yetkili apostil makamı; Almanya’da hangi makamların apostil verdiği eyalete göre değişir. ",
        "duration": "Makama göre değişir (Eyalete göre değişir).",
        "cost": "Eyalete göre değişir.",
        "source": ""
      },
      {
        "name": "Yeminli tercüme / Beglaubigte Übersetzung",
        "officialName": "Yeminli tercüme / *Beglaubigte Übersetzung (durch beeidigte/ermächtigte Übersetzer)*",
        "purpose": "Türkiye’den alınan belgeyi Almanya’da (veya tersini) resmî işlemlerde kullanılabilir hale getirmek; çoğu makam “yeminli/er mächtigte” tercüman şartı arar. ",
        "who": "A+B (TR↔DE belgeleri kullanan herkes).",
        "supportingDocs": "Tercümesi yapılacak belgenin aslı veya talep edilen format.",
        "authority": "Çeviri bir “makam” değil; ancak yeminli tercüman listeleri adlî idare veri tabanlarında tutulur. ",
        "duration": "Çevirmen ve belge yoğunluğuna göre değişir.",
        "cost": "Serbest piyasa ücretidir (Eyalete göre değişir).",
        "source": ""
      }
    ]
  }
];