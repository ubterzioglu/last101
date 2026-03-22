/* =========================================================
   ZGEN – zgen-data.js
   Yol: /zgen/zgen-data.js

   AVATARLAR (erkek + kadın)
   PNG dosyalarını buraya koy:
   /img/

   Gerekli dosya adları:
     /img/generations/gen_silent_m.jpg
     /img/generations/gen_silent_f.jpg
     /img/generations/gen_boomer_m.jpg
     /img/generations/gen_boomer_f.jpg
     /img/generations/gen_genx_m.jpg
     /img/generations/gen_genx_f.jpg
     /img/generations/gen_geny_m.jpg
     /img/generations/gen_geny_f.jpg
     /img/generations/gen_genz_m.jpg
     /img/generations/gen_genz_f.jpg
     /img/generations/gen_alpha_m.jpg
     /img/generations/gen_alpha_f.jpg
     /img/generations/gen_beta_m.jpg
     /img/generations/gen_beta_f.jpg

   Opsiyonel yedekler:
     /img/generations/gen_placeholder_m.jpg
     /img/generations/gen_placeholder_f.jpg

   Uyumluluk TEK YÖNLÜDÜR:
   compat[seninJenerasyonun][digerJenerasyon]
   => { dos: [5], donts: [5] }
   ========================================================= */

/* -----------------------
   PLACEHOLDER YARDIMCILARI
------------------------ */
function placeholderDos() {
  return [
    "Yapılacak #1 (yer tutucu)",
    "Yapılacak #2 (yer tutucu)",
    "Yapılacak #3 (yer tutucu)",
    "Yapılacak #4 (yer tutucu)",
    "Yapılacak #5 (yer tutucu)"
  ];
}

function placeholderDonts() {
  return [
    "Yapılmaması gereken #1 (yer tutucu)",
    "Yapılmaması gereken #2 (yer tutucu)",
    "Yapılmaması gereken #3 (yer tutucu)",
    "Yapılmaması gereken #4 (yer tutucu)",
    "Yapılmaması gereken #5 (yer tutucu)"
  ];
}

// placeholderJoke removed - jokes are no longer used

/* -----------------------
   ANA VERİ
------------------------ */
const ZGEN_DATA = {
  generations: [
    {
      id: "silent",
      name: "Sessiz Kuşak",
      range: [1928, 1945],
      avatars: { m: "../img/generations/gen_silent_m.jpg", f: "../img/generations/gen_silent_f.jpg" },
      avatarAlt: "Sessiz Kuşak avatarı"
    },
    {
      id: "boomer",
      name: "Baby Boomer Kuşağı",
      range: [1946, 1964],
      avatars: { m: "../img/generations/gen_boomer_m.jpg", f: "../img/generations/gen_boomer_f.jpg" },
      avatarAlt: "Baby Boomer avatarı"
    },
    {
      id: "genx",
      name: "X Kuşağı",
      range: [1965, 1980],
      avatars: { m: "../img/generations/gen_genx_m.jpg", f: "../img/generations/gen_genx_f.jpg" },
      avatarAlt: "X Kuşağı avatarı"
    },
    {
      id: "geny",
      name: "Y Kuşağı (Milenyaller)",
      range: [1981, 1996],
      avatars: { m: "../img/generations/gen_geny_m.jpg", f: "../img/generations/gen_geny_f.jpg" },
      avatarAlt: "Y Kuşağı avatarı"
    },
    {
      id: "genz",
      name: "Z Kuşağı",
      range: [1997, 2012],
      avatars: { m: "../img/generations/gen_genz_m.jpg", f: "../img/generations/gen_genz_f.jpg" },
      avatarAlt: "Z Kuşağı avatarı"
    },
    {
      id: "alpha",
      name: "Alfa Kuşağı",
      range: [2013, 2025],
      avatars: { m: "../img/generations/gen_alpha_m.jpg", f: "../img/generations/gen_alpha_f.jpg" },
      avatarAlt: "Alfa Kuşağı avatarı"
    },
    {
      id: "beta",
      name: "Beta Kuşağı",
      range: [2026, 2100],
      avatars: { m: "../img/generations/gen_beta_m.jpg", f: "../img/generations/gen_beta_f.jpg" },
      avatarAlt: "Beta Kuşağı avatarı"
    }
  ],
  /* ===== Profiller: özellikler + hissiyat (Kart 2 için) ===== */
  profiles: {
    silent: {
      traits: [
        "Önce görev, sonra duygular",
        "Kibar muhalefeti bir spor gibi görür",
        "Güven yavaş kazanılır, ömür boyu korunur",
        "Parlak uygulamalar yerine kanıtlanmış araçları tercih eder",
        "Konuşmadan önce ortamı tartar",
        "Tutumluluk refleksidir, trend değil",
        "Kurumsal sadakati yüksektir, değişime temkinlidir",
        "Başarıyı küçültür, sessizce fazlasını sunar",
        "Uzmanlığa ve kıdeme saygı duyar",
        "Sakin ve net iletişim kurar"
      ],
      vibes: [
        "Sessiz yetkinlik, güçlü sonuçlar",
        "Sürece saygı",
        "Az konuş, çok iş yap",
        "İsraf etme, uzun ömürlü kullan",
        "Sağlam plan, sakin eller"
      ]
    },

    boomer: {
      traits: [
        "Çok çalışmanın karşılığını vereceğine inanır",
        "Toplantıları meşru bir üretkenlik aracı görür",
        "Uzun mesaj zincirlerine kıyasla telefon görüşmesini tercih eder",
        "İlişki ve network odaklıdır",
        "Unvanlara, kilometre taşlarına ve net kariyer basamaklarına önem verir",
        "Sunum yapmayı ve ortamı yönetmeyi sever",
        "Mikro detaylardan çok büyük resme odaklanır",
        "Dakiklik ve güvenilirlik bekler",
        "Uzlaşmayı sever ama net kapanış ister",
        "Pratik ve çözüm odaklıdır"
      ],
      vibes: [
        "Hizalanalım ve ilerleyelim",
        "Ara, hallederiz",
        "Sağlam tokalaşma enerjisi",
        "Resmileştirelim",
        "Çok çalış, sonra rahatla"
      ]
    },

    genx: {
      traits: [
        "Şüphecidir ama genelde karamsar değildir",
        "Bağımsız problem çözer, düşük bakım ister",
        "Alkıştan çok otonomi ister",
        "Kurumsal süslemelere alerjisi vardır",
        "Kuru mizahlı, direkt iletişim kurar",
        "Heyecandan çok yetkinliğe değer verir",
        "Sekme öncesi kaos döneminin çoklu görev ustasıdır",
        "Sözden çok aksiyona güvenir",
        "Hızlı uyum sağlar, sessizce şikayet eder",
        "Net hedefler ve minimum denetim ister"
      ],
      vibes: [
        "Meselenin özü ne?",
        "Sessiz ama doğru yap",
        "Daha kötüsünü gördüm",
        "Basit tut lütfen",
        "Dramadan çok sonuç"
      ]
    },
    geny: {
      traits: [
        "Amaç odaklıdır ama teslim tarihinin farkındadır",
        "Geri bildirime açıktır, gelişim ister",
        "Varsayılan olarak işbirlikçidir, silo sevmez",
        "Değişime rahattır ama bağlam ister",
        "Sürpriz toplantılar yerine asenkron netliği tercih eder",
        "Esnekliği bir verimlilik aracı olarak görür",
        "Önce neden, sonra nasıl diye sorar",
        "Hırs ile tükenmişlik arasında denge kurar",
        "Emreden değil koçluk yapan yöneticiler ister",
        "Araçları sistem ve iş akışına dönüştürür"
      ],
      vibes: [
        "Nedenini anlat",
        "Süreci iyileştirelim",
        "Hızlı hizalan, gönder",
        "Esnek ama savruk değil",
        "Anlam ve momentum"
      ]
    },

    genz: {
      traits: [
        "Bilgiyi hızlı tarar, boş laf toleransı düşüktür",
        "Kısa mesajları ve net istekleri tercih eder",
        "Fikirleri erkenden sorgulamaktan çekinmez",
        "Resmiyetten çok samimiyete değer verir",
        "Deneyerek, izleyerek ve yineleyerek öğrenir",
        "Araçların sezgisel ve hızlı olmasını bekler",
        "Zaman ve enerji sınırlarını net çizer",
        "Sosyal, risk ve marka bilinci yüksektir",
        "Şeffaflık ve hızlı geri bildirimle parıldar",
        "Yan projeleri portföye dönüştürür"
      ],
      vibes: [
        "Tek cümlede söyle",
        "Hissi değil kanıtı göster",
        "Gönder, öğren, tekrarla",
        "Gerçek ol",
        "Sınırı koru"
      ]
    },
    alpha: {
      traits: [
        "Dokunarak sezme eğilimi vardır; kılavuzlar opsiyonel hissedilir",
        "Yapay zeka destekli düşünme onun için doğaldır",
        "Her yerde kişiselleştirme bekler",
        "Görsel ve etkileşimli öğrenir",
        "Kısa dikkat süresi ama güçlü desen yakalama yeteneği vardır",
        "İlerlemeyi kendiliğinden oyunlaştırır",
        "Ses, video ve metni birlikte ve doğal kullanır",
        "Tüketmekten çok birlikte üretmeye yatkındır",
        "Yavaş arayüzlere ve yavaş kararlara sabırsızdır",
        "Hız, muhakemenin önüne geçtiği için net sınırlar ister"
      ],
      vibes: [
        "Anında, etkileşimli, sezgisel",
        "Oynanabilir yap",
        "Kaydır ve çöz",
        "Birlikte üret",
        "Sıkıcıysa bozuktur"
      ]
    },

    beta: {
      traits: [
        "Her yerde yapay zekanın olduğu ortamlara doğar",
        "Varsayılan yaklaşımı delegasyondur: sistem halletsin",
        "Kimlik ve gizlilik kontrolünün kusursuz olmasını bekler",
        "Sentetik medyayı günlük içerik olarak görür",
        "UX beklentisi yüksektir, sürtünmeye tahammülü düşüktür",
        "Ajanları ve otomasyonu altyapı gibi kullanır",
        "Doğrulamayı yaratıcılık kadar önemser",
        "Prompt, iş akışı ve orkestrasyonla düşünür",
        "İşbirliği insanları ve araçları birlikte kapsar",
        "Öğrenmeyi kişiselleştirilmiş, sürekli bir akış olarak görür"
      ],
      vibes: [
        "Önce ajan",
        "Sürtünme bir bugdır",
        "Doğrula, sonra hisset",
        "Her şeyi orkestre et",
        "Varsayılan kişiselleştirme"
      ]
    }
  },
  /* ===== Uyumluluk (tek yönlü) ===== */
  compat: {
    silent: {
      boomer: {
        dos: [
          "Konuya bağlam vererek ve ana noktayı en başta söyleyerek başla.",
          "Değişiklik önermeden önce deneyime saygı göster.",
          "Hassas konular için telefon veya yüz yüze iletişimi tercih et.",
          "Verdiğin sözleri hızlı ve eksiksiz yerine getir.",
          "Geri bildirimi özel ve somut tut."
        ],
        donts: [
          "Değişimi sevmediklerini varsayma; önce sor.",
          "Toplantılarda fazla argo veya alaycı dil kullanma.",
          "Sırf mesaj vermek için statüyü herkesin önünde sorgulama.",
          "Kötü haberleri muğlak ifadelerin arkasına saklama.",
          "Resmî ortamlarda unvanları anlamsızmış gibi davranma."
        ],
        joke: "Bir Boomer’dan onay istiyorsan, takvime koy — spontane olmak takvim daveti sayılmaz."
      },

      genx: {
        dos: [
          "Kısa, net ve pratik ol.",
          "Net bir sonuçla birlikte otonomi tanı.",
          "Sözlü anlaşmalardan sonra yazılı not geç.",
          "Abartmadan yetkinliği kabul et.",
          "Zamanlarına saygı duy; toplantıları kısa tut."
        ],
        donts: [
          "Nasıl yapılacağını mikroyönetmeye kalkma.",
          "Aşikâr adımları uzun uzun anlatma.",
          "Her şeyi komite kararına çevirme.",
          "Şüpheciliği ilgisizlik sanma.",
          "Zoraki eğlenceli ekip ritüelleri dayatma."
        ],
        joke: "Gen X planını başıyla onaylar ve sen daha ikinci slayttayken sessizce iyileştirir."
      },

      geny: {
        dos: [
          "Nasıl’dan önce neden’i açıkla.",
          "Gelişime dönük, sonraki adımları içeren geri bildirim ver.",
          "Fikirleri davet et, sonra net karar al.",
          "Muğlak olmayan işbirlikçi bir dil kullan.",
          "Sonuca dönüşen emeği görünür kıl."
        ],
        donts: [
          "Amaç ve adalet olmadan sadakat bekleme.",
          "Kararları sadece hiyerarşiyle gerekçelendirme.",
          "Geri bildirimi yıllık değerlendirmeye bırakma.",
          "İş-yaşam sınırlarını zayıflık gibi görme.",
          "Dijital araçları iş akışında opsiyonel sayma."
        ],
        joke: "Gen Y’ye misyonu anlatırsan koşar; “çünkü ben öyle dedim” dersen LinkedIn’i açar."
      },

      genz: {
        dos: [
          "Net, nazik ve hızlı ol.",
          "Beklentileri yazılı belirle ve bir kez tekrar et.",
          "Geri bildirimi nasıl almak istediklerini sor.",
          "Küçük kazanımlar ve hızlı öğrenme döngüleri sun.",
          "Kısıtları ve takasları şeffaf anlat."
        ],
        donts: [
          "Uzun monologları yönetim tarzı sanma.",
          "Açık sözlülüğü kabalıkla karıştırma.",
          "Sessizliği onay olarak yorumlama.",
          "Yeni araçları veya formatları küçümseme.",
          "Zihinsel yükü ve bağlam değişimini görmezden gelme."
        ],
        joke: "Güncellemen kısa bir videodan uzunsa, Gen Z özetini ister."
      },

      alpha: {
        dos: [
          "Görsel örnekler ve somut demolar kullan.",
          "Görevleri kısa ve net parçalara böl.",
          "Denemelere anında geri bildirim ver.",
          "Kuralları açık ve tutarlı kıl.",
          "Merakı güvenli sınırlarla teşvik et."
        ],
        donts: [
          "İma edilen normlara güvenme; açıkça söyle.",
          "Yavaş araçlara veya kararlara sabır bekleme.",
          "Soruları bölme gibi cezalandırma.",
          "Korku temelli motivasyon kullanma.",
          "Önceliklerin hissedilerek anlaşılacağını varsayma."
        ],
        joke: "Alfa kılavuzu istemez; girişi atlayan tutorial’ı ister."
      },

      beta: {
        dos: [
          "Sakin odak ve düzenli rutinler örnekle.",
          "Basit kontrollerle eleştirel düşünmeyi öğret.",
          "Kısa, dostça prompt’lar ve örnekler kullan.",
          "Yoğunluktan çok tutarlılığı ödüllendir.",
          "Kararların nasıl alınıp değiştiğini açıkla."
        ],
        donts: [
          "Aynı anda çok fazla seçenekle bunaltma.",
          "Belirsiz sahipliği tolere edeceklerini varsayma.",
          "Kafa karışıklığı varken açıklamayı erteleme.",
          "Her şeyi varsayılan olarak rekabete çevirme.",
          "Dikkatin sınırsız olduğunu sanma."
        ],
        joke: "Beta, yetişkinler fontu tartışmayı bitirmeden yayına hazırdır."
      }
    },
    boomer: {
      silent: {
        dos: [
          "Resmî nezaket ve net sınırlar kullan.",
          "Değişiklik önerirken geçmiş deneyim ve kanıt getir.",
          "Tartışmadan önce bakış açılarını sor.",
          "Zor konular için bire bir görüşmeleri tercih et.",
          "Tutarlılık ve düzenli takip ile güven ver."
        ],
        donts: [
          "Düşünme payı tanımadan hızlı karar almaya zorlama.",
          "“Modernleştirme” istediklerini varsayma.",
          "Agresif yüzleşmeyi dürüstlük sanma.",
          "Somut detaylar yerine buzzword kullanma.",
          "Uzun vadeli katkıları için teşekkür etmeyi atlama."
        ],
        joke: "Sessiz Kuşak’la en yüksek sesli hamle, hazırlıklı gelmektir."
      },

      genx: {
        dos: [
          "Hedefi net koy, yolu onlara bırak.",
          "Durum güncellemelerini kısa ve amaçlı tut.",
          "Şüpheciliğe saygı duy, verilerle cevap ver.",
          "Hak edildiğinde takdiri herkesin önünde yap.",
          "Saatlere değil sonuçlara hizalan."
        ],
        donts: [
          "Yetkiyi tek argüman olarak kullanma.",
          "Her meseleyi toplantıya çevirme.",
          "Fazla vaat verip az teslim etme.",
          "Bağımsızlığı saygısızlık sanma.",
          "Komutla heyecan bekleme."
        ],
        joke: "Gen X’in motive konuşmaya ihtiyacı yok; engelin kaldırılmasına ihtiyacı var."
      },

      geny: {
        dos: [
          "Görevleri etki ve öğrenmeyle ilişkilendir.",
          "Geri bildirimi erken ve somut ver.",
          "Sonuçlar iyiyse esneklik tanı.",
          "İşbirliğine davet et, sonra karara bağla.",
          "Terfi kriterlerini şeffaf anlat."
        ],
        donts: [
          "Uzun saatleri bağlılıkla eşitleme.",
          "Soruları otoriteye meydan okuma gibi görme.",
          "Bilgiyi güç aracı olarak saklama.",
          "Araç ve süreç iyileştirme taleplerini görmezden gelme.",
          "Sadece görünür işi ödüllendirip etkili işi kaçırma."
        ],
        joke: "Gen Y çok çalışır — yeter ki buna sonsuza kadar ‘çıraklık’ denmesin."
      },

      genz: {
        dos: [
          "Net beklentiler koy ve hızlı check-in’ler yap.",
          "Doğrudan geri bildirim ver ve düzeltme yolunu göster.",
          "Samimi ol; kurumsal tiyatroyu bırak.",
          "Asenkron çalışmayı yazılı netlikle destekle.",
          "Erken yardım istemeyi normalleştir."
        ],
        donts: [
          "Sınır koymayı tembellik sanma.",
          "Küçük sorunları haftalarca ele alma.",
          "Öğretme aracı olarak alaycılık kullanma.",
          "Kamerayı sadakat testi gibi dayatma.",
          "Ruh sağlığını ‘iş dışı’ sayma."
        ],
        joke: "Gen Z, unvanına Wi-Fi stabiliten kadar saygı duyar."
      },

      alpha: {
        dos: [
          "Göstererek öğret, sonra hızlıca denemelerine izin ver.",
          "Basit kurallar ve anında pekiştirme kullan.",
          "Öğrenmeyi eğlenceli ama hedef odaklı kıl.",
          "Talimatları kısa ve görsel tut.",
          "Sınırları koy, sonra keşfe alan aç."
        ],
        donts: [
          "Uzun talimatları baştan okuyacaklarını varsayma.",
          "Herkesin önünde utandırarak düzeltme yapma.",
          "Molalar ve çeşitlilik olmadan odak bekleme.",
          "Teknolojiyi varsayılan dikkat dağıtıcı sayma.",
          "Her küçük hatayı aşırı düzeltme."
        ],
        joke: "Alfa ‘politika’ kelimesini duyar duymaz geç butonunu arar."
      },

      beta: {
        dos: [
          "Öngörülebilir rutinler ve net roller oluştur.",
          "Güvenli denemelerle merakı teşvik et.",
          "Basit kontrol listeleri ve hatırlatıcılar kullan.",
          "Saygılı fikir ayrılığını örnekle.",
          "Sorumlu teknoloji alışkanlıklarını erken öğret."
        ],
        donts: [
          "Normları kendiliğinden öğreneceklerini varsayma.",
          "Bildirim ve uyarılarla boğma.",
          "Her seferinde hızı doğruluğun önüne koyma.",
          "Her görevi performansa dönüştürme.",
          "Uyum için korku kullanma."
        ],
        joke: "Beta gerçek hayatta bile ‘sürüm geçmişi’ ister."
      }
    },
    genx: {
      silent: {
        dos: [
          "Saygılı ve sakin bir tonla başla.",
          "Sadece eleştiri değil, çözümle gel.",
          "Anlaşmaları yazılı olarak teyit et.",
          "Dakik ve tutarlı ol.",
          "Hikâyeler ve çıkarılan dersleri dinle."
        ],
        donts: [
          "Resmî anlarda sivri mizah kullanma.",
          "Kanıt sunmadan hızlı değişim iste.",
          "Hızlanmak için söz kesme.",
          "Geleneği irrasyonel gibi sunma.",
          "Çatışmayı kapanış yapmadan sürüncemede bırakma."
        ],
        joke: "Sessiz Kuşak ‘sıcak yorum’ istemez; planını ve takvimini ister."
      },

      boomer: {
        dos: [
          "Sonuçları ve geçmiş performansı göster.",
          "Sürece saygı duyarak iyileştirme öner.",
          "Net ve kendinden emin iletişim kur.",
          "Sorunları seçeneklerle erken yükselt.",
          "Halihazırda işe yarayanı takdir et."
        ],
        donts: [
          "‘Eski yöntem’e göz devirmeyle yaklaşma.",
          "Kararları kulis konuşmalarıyla baltalama.",
          "Unvanın dinlemeyecekleri anlamına geldiğini varsayma.",
          "Paydaş yönetimini görmezden gelme.",
          "Sorumluluktan kaçmak için belirsizliğe saklanma."
        ],
        joke: "Boomer’lar yeniliği sever — pilotu, metrikleri ve sunumu hazırsa."
      },

      geny: {
        dos: [
          "Açık sözlü ol ama empati ekle.",
          "Net sorumlulukla birlikte özgürlük tanı.",
          "İşbirlikçi problem çözme kullan.",
          "Karar kriterlerini açık paylaş.",
          "Sadece çıktıyı değil inisiyatifi de takdir et."
        ],
        donts: [
          "İyimserliği saflık sanma.",
          "Rahatsızlık olmasın diye geri bildirimi tutma.",
          "Esnekliği keyfine göre geri alınan bir ayrıcalık gibi görme.",
          "Değer konuşmalarını ‘yumuşak işler’ diye küçümseme.",
          "Kariyer yolu netliği ihtiyacını görmezden gelme."
        ],
        joke: "Gen Y vizyonu sorar; Gen X teslim tarihini."
      },

      genz: {
        dos: [
          "Mesajları kısa tut ve net aksiyon ekle.",
          "Doğrudan geri bildirim ve hızlı iterasyon kullan.",
          "Sınırları ve asenkron iletişimi koru.",
          "Üstten konuşmadan takasları açıkla.",
          "Soruları bahane gibi etiketlemeden teşvik et."
        ],
        donts: [
          "‘Sertleş’ dilini koçluk sanma.",
          "Yazılı olmayan kuralları bildiklerini varsayma.",
          "Bilgiyi rite-of-passage gibi saklama.",
          "Her bildirimi acil gibi ele alma.",
          "Araçlarını veya iletişim tarzlarını alaya alma."
        ],
        joke: "Gen X ‘halledeceksin’ der; Gen Z ‘doküman linkini gönder’ der."
      },

      alpha: {
        dos: [
          "Etkileşimli örneklerle öğret.",
          "Kısa döngüler kullan: dene, gözden geçir, ayarla.",
          "Sınırları net koy ve nedenini açıkla.",
          "Sadece kazanmayı değil öğrenmeyi de kutla.",
          "Katılık olmadan yapı sun."
        ],
        donts: [
          "Tek formata uzun odak bekleme.",
          "Sonuç güvenliyken denemeyi cezalandırma.",
          "‘Profesyonel ol’ gibi muğlak talimatlar verme.",
          "Sessizliği anlama sanma.",
          "Pratik yerine ders anlatımını abartma."
        ],
        joke: "Alfa ‘en iyi uygulamaları’ bir meydan okuma gibi görür."
      },

      beta: {
        dos: [
          "Sistemleri basit ve tekrarlanabilir tut.",
          "Tek görevlilikle odak öğret.",
          "Dostça kontrol listeleri ve ritüeller kullan.",
          "Sakin problem çözmeyi modelle.",
          "Bilgiyi hızlı doğrulamayı göster."
        ],
        donts: [
          "Aynı anda çok fazla araçla karmaşıklaştırma.",
          "Sürekli hareketi ilerleme sanma.",
          "Geri bildirimi sadece sonuçlara indirgeme.",
          "Her zaman çevrimiçi olmayı normalleştirme.",
          "Merakı kesinti gibi görme."
        ],
        joke: "Beta sabah kahveni bitirmeden rutini refactor eder."
      }
    },

    geny: {
      silent: {
        dos: [
          "Nazik bir resmiyet ve sakin bir tempo kullan.",
          "Rehberlik iste ve bunu görünür şekilde uygula.",
          "Taahhütleri net ve tutarlı tut.",
          "Geri bildirimi bire bir vermeyi tercih et.",
          "İdeallerden çok uygulanabilir önerilerle gel."
        ],
        donts: [
          "Resmî ortamlarda fazla kişisel paylaşım yapma.",
          "Her şeyin hemen olmasını bekleme.",
          "Her kararı beyin fırtınasına çevirme.",
          "Hassas konularda aşırı rahat bir dil kullanma.",
          "Kapanışı, kendilerini duyulmuş hissetmeden zorlama."
        ],
        joke: "Sessiz Kuşak motivasyon sözü değil, sözünü tutmanı ister."
      },

      boomer: {
        dos: [
          "Saygıyı göster, sonra iyileştirme öner.",
          "Veri ve müşteri etkisiyle gel.",
          "Hedefleri ve sahipliği net hizala.",
          "Ültimatom değil seçenek sun.",
          "Kısa bir yazılı özetle takip et."
        ],
        donts: [
          "Esnekliğe kapalı olduklarını varsayma; müzakere et.",
          "Jargonu sonuçlara bağlamadan kullanma.",
          "Hiyerarşiyi düşman gibi sunma.",
          "Riski kabul etmeden değişimi itme.",
          "İlk konuşmada anında onay bekleme."
        ],
        joke: "Boomer’lar fikrine, üretimde iki kez çalıştığını gördükten sonra güvenir."
      },

      genx: {
        dos: [
          "Hazırlıklı ve verimli ol.",
          "Bağımsızlığa saygı duy, mikroyönetim yapma.",
          "Mizahı hafif ve doğal kullan.",
          "Girdilerini erken iste, sonra aksiyon al.",
          "Hataları hızlı sahiplen ve devam et."
        ],
        donts: [
          "Heyecanı yetkinlik gibi pazarlama.",
          "Geri bildirimi uzun koçluk seansına çevirme.",
          "Sürekli hizalama toplantıları varsayma.",
          "Sessizliği umursamazlık sanma.",
          "‘Yakında’ gibi muğlak zamanlar kullanma."
        ],
        joke: "Gen X yol haritanı değil, engeller listesini ister."
      },

      genz: {
        dos: [
          "Beklentileri yazılı koy ve ‘bitti’ tanımını netleştir.",
          "Geri bildirimi hızlı ve spesifik ver.",
          "Araç ve iş akışı önerilerini davet et.",
          "‘Bilmiyorum’ demeyi ve öğrenmeyi normalleştir.",
          "Asenkron güncellemelerle odak zamanını koru."
        ],
        donts: [
          "Belirsiz öncelikleri tolere edeceklerini varsayma.",
          "Pasif-agresif imalarla iletişim kurma.",
          "Sınırları varsayılan pazarlık konusu yapma.",
          "Görünürlük için toplantılarla boğma.",
          "Doğrudanlığı saygısızlık gibi etiketleme."
        ],
        joke: "Gen Z, daha az toplantı ve daha iyi dokümantasyon varsa sürecini kabul eder."
      },

      alpha: {
        dos: [
          "Kısa talimatlar ve anında pratik kullan.",
          "Sık ve pozitif-öncelikli geri bildirim ver.",
          "Seçenek sun ama sayısını sınırlı tut.",
          "Konuşmadan çok görseller ve örnekler kullan.",
          "Küçük günlük rutinlerle alışkanlık oluştur."
        ],
        donts: [
          "Yavaş ödül döngülerine sabır bekleme.",
          "Her seferinde anında aşırı düzeltme yapma.",
          "Kuralları günlere göre tutarsız uygulama.",
          "Motivasyon için suçluluk kullanma.",
          "Teknolojiyi ya tamamen iyi ya tamamen kötü görme."
        ],
        joke: "Alfa multitask yapmaz — beyninde birden fazla uygulama çalıştırır."
      },

      beta: {
        dos: [
          "İyi soru sormayı öğret.",
          "Güvenlik ve odak için basit sınırlar koy.",
          "Tutarlılığı ve nezaketi pekiştir.",
          "Kaynakları hızlı doğrulamayı göster.",
          "Hedefleri küçük tut ve ilerlemeyi görünür izle."
        ],
        donts: [
          "Sinyal-gürültü ayrımını tek başına yapacaklarını varsayma.",
          "Sadece hız ve yeniliği ödüllendirme.",
          "Her dakikayı aşırı programlama.",
          "Hataları herkese açık derse çevirme.",
          "Cihazların gerçek iletişimin yerini almasına izin verme."
        ],
        joke: "Beta’nın ilk kelimesi ‘güncelleme’ olabilir; çünkü diğer her şey de alıyor."
      }
    },
    genz: {
      silent: {
        dos: [
          "Saygılı bir dil ve ölçülü bir ton kullan.",
          "Net ve tutarlı ol; güven böyle oluşur.",
          "Keskin geri bildirim vermeden önce izin iste.",
          "Hızlı tartışmalar yerine yapılandırılmış konuşmaları tercih et.",
          "Takdiri somut yollarla göster."
        ],
        donts: [
          "Ciddi konularda sivri mizah kullanma.",
          "Rahat dili otomatik olarak samimiyet sanma.",
          "Hızlanmak için söze girme.",
          "Uzun yıllık deneyimi eskimiş gibi görme.",
          "Yardım istedikten sonra geri dönüş yapmamazlık etme."
        ],
        joke: "Sessiz Kuşak mesajının tamamını okur; marifet, buna değen bir mesaj göndermektir."
      },

      boomer: {
        dos: [
          "Sonuç ve iş değeriyle başla.",
          "Doğrudan ol ama saygıyı koru.",
          "Net metrikleri olan bir pilot plan sun.",
          "İlerlemeyi proaktif şekilde paylaş.",
          "Esneklik istemeden önce sorumluluk göster."
        ],
        donts: [
          "Yeni araçlardan nefret ettiklerini varsayma; faydayı göster.",
          "Anlaşmazlıkta alaycılık kullanma.",
          "Paydaş hizalamasını atlama.",
          "Teslim tarihlerini opsiyonel görme.",
          "Puan toplamak için herkese açık düzeltme yapma."
        ],
        joke: "Boomer’lar aracını daha hızlı benimser — adına ‘yeni standart’ dersen."
      },

      genx: {
        dos: [
          "Kısa ve net ol; süsü atla.",
          "Beklentileri açıkça sor.",
          "Aşırı paylaşmadan inisiyatif göster.",
          "Doğrudan geri bildirimi kabullen ve aksiyon al.",
          "Net sonraki adımlarla asenkron güncellemeler yap."
        ],
        donts: [
          "Şüpheciliği kişisel alma.",
          "Tüm düşünce sürecini uzun uzun anlatma.",
          "Sürekli onay bekleme.",
          "Küçük çatışmaları duygusal tırmandırma.",
          "Bağımsızlığı soğukluk sanma."
        ],
        joke: "Gen X ‘aferin’ demez ama aynı işi tekrar yapmana da engel olmaz."
      },

      geny: {
        dos: [
          "İşbirliği yap ve krediyi açıkça paylaş.",
          "Dürüst geri bildirimi incelikle ver.",
          "Sınırlar ve cevap sürelerinde hizalan.",
          "Modern araçlar kullan ama iş akışını stabil tut.",
          "Net hedeflerle mentorluk iste."
        ],
        donts: [
          "Sosyal veya profesyonel olarak sürekli hazır olmalarını bekleme.",
          "Amaç konuşmalarını göstermelik sanma.",
          "Konuşmaları ghostlayıp güven bekleme.",
          "Daha iyisini önermeden süreci reddetme.",
          "Her şeyi değer tartışmasına çevirme."
        ],
        joke: "Gen Y hırsını sever — ta ki mesaj olabilecek bir şeyi toplantıya çevirene kadar."
      },

      alpha: {
        dos: [
          "Hızlı demolar ve tekrarlarla öğret.",
          "Basit dil ve net sınırlar kullan.",
          "Yaratıcılığı güvenli çerçevelerle teşvik et.",
          "Geri bildirimi anında ve aksiyon odaklı ver.",
          "Oturumları kısa ve çeşitli tut."
        ],
        donts: [
          "Tek izlemeyle öğreneceklerini varsayma.",
          "Aynı anda çok fazla kural yükleme.",
          "Hataları utandırarak düzeltme.",
          "Molasız uzun odak bekleme.",
          "Soruları bölme gibi görme."
        ],
        joke: "Alfa, sen anlatmadan önce öğrenir; sonra neden bu kadar yavaş anlattığını sorar."
      },

      beta: {
        dos: [
          "Sağlıklı dikkat alışkanlıkları ve molaları modelle.",
          "Basit sistemler öğret: kontrol et, doğrula, karar ver.",
          "Kısa prompt’lar ve tutarlı rutinler kullan.",
          "Nezaket ve işbirliğini ödüllendir.",
          "Erken yardım istemeyi göster."
        ],
        donts: [
          "Sürekli bildirimleri normalleştirme.",
          "Her işi içerik veya performansa çevirme.",
          "Anlayış yerine kestirme yolları ödüllendirme.",
          "Yanlış bilgiyi görmezden gelme.",
          "Teknoloji okuryazarlığını muhakeme sanma."
        ],
        joke: "Beta, ortalığı yetişkinlerin yarattığı dijital karmaşadan daha iyi temizler."
      }
    },
    alpha: {
      silent: {
        dos: [
          "Nazik bir dil kullan ve tempoyu yavaşlat.",
          "Dinleyerek ve sabırla saygı göster.",
          "Fikrinden önce niyetini açıkla.",
          "Net bir yazılı özetle geri dön.",
          "Tercih ettikleri iletişim şeklini sor."
        ],
        donts: [
          "Hızlı cevapların zorunlu olduğunu varsayma.",
          "Resmî ortamlarda argo kullanma.",
          "Eğlence için herkese açık meydan okuma yapma.",
          "Geleneği hafife alma.",
          "Geçiş yapmadan konuyu ani değiştirme."
        ],
        joke: "Sessiz Kuşak konuşmadan önce düşünür; Alfa düşünürken üç sekme açar."
      },

      boomer: {
        dos: [
          "Saygılı ol ve hedefleri net ifade et.",
          "Yaptıklarını ve mantığını kısa şekilde göster.",
          "Yapıyı kabul et, sonra içinde optimize et.",
          "Küçük ve sık geri bildirim iste.",
          "Karışıklığı önlemek için ortak doküman kullan."
        ],
        donts: [
          "Kuralların tartışmasız pazarlık konusu olduğunu varsayma.",
          "Deneyimi alakasız gibi görme.",
          "Ciddi konuları meme ile anlatma.",
          "Hizalama olmadan araç değiştirme.",
          "Teslim tarihlerini öneri gibi görme."
        ],
        joke: "Boomer plan ister; Alfa kendini güncelleyen plan ister."
      },

      genx: {
        dos: [
          "Verimli ve kendi kendine yönlenen ol.",
          "Geniş değil, net sorular sor.",
          "Küçük sonuçları erken teslim et.",
          "‘Toplantı yok’ tercihlerine saygı duy.",
          "Geri bildirimi dramatize etmeden al."
        ],
        donts: [
          "Her mikro kararı paylaşma.",
          "Sürekli motivasyon bekleme.",
          "Trend dili kanıt gibi kullanma.",
          "Belirsiz sahipliği tolere edeceklerini varsayma.",
          "İşi sosyal performansa çevirme."
        ],
        joke: "Gen X beş adımlı planına bakar ve ‘hangisi yayına çıkıyor?’ diye sorar."
      },

      geny: {
        dos: [
          "İşini etki ve öğrenmeyle ilişkilendir.",
          "Doğal biçimde işbirliği yap ve krediyi paylaş.",
          "Mentorluk iste ve koçluğu kabul et.",
          "Herkes için sürtünmeyi azaltan araçlar kullan.",
          "Beklentileri ve zaman çizelgesini baştan netleştir."
        ],
        donts: [
          "Her değişikliği acil gibi ele alma.",
          "Bağlamı atlayıp çözüme atlama.",
          "Esnekliği sıfır yapı sanma.",
          "Geri bildirimi ‘eski kafalı’ diye geçiştirme.",
          "Yeniliği güvenilirliğin önüne koyma."
        ],
        joke: "Gen Y gelişimini destekler; yeter ki tüm takvimini işgal etme."
      },

      genz: {
        dos: [
          "Hızlı geri bildirim döngüleri kullan.",
          "İletişimi kısa ve açık tut.",
          "Sınırlar üzerinde anlaş ve saygı duy.",
          "Kaynakları ve şablonları açıkça paylaş.",
          "Erken yardım istemeyi normalleştir."
        ],
        donts: [
          "Kimin daha direkt olduğunu yarıştırma.",
          "Ortak argo = ortak anlam sanma.",
          "Her anlaşmazlığı kimlik meselesine çevirme.",
          "Sürekli bildirimlerle boğma.",
          "Yavaş diye dokümantasyonu atlama."
        ],
        joke: "Alfa ve Gen Z projeyi bir günde bitirir; sonra aracı seçmek için bir hafta harcar."
      },

      beta: {
        dos: [
          "Sakin odak ve sabra örnek ol.",
          "Basit rutinler kur ve tekrar et.",
          "Doğrulama alışkanlıklarını erken öğret.",
          "Rekabetten çok işbirliğini teşvik et.",
          "Hedefleri küçük tut ve tutarlılığı kutla."
        ],
        donts: [
          "Sürekli uyarılarla aşırı uyarma.",
          "Her şeyi yarışa çevirme.",
          "Dikkat çekmeyi öğrenmenin önüne koyma.",
          "Temel adımları atlamayı normalleştirme.",
          "Hataları eğlenceye dönüştürme."
        ],
        joke: "Alfa kısayolu öğretir; Beta kimin onayladığını sorar."
      }
    },

    beta: {
      silent: {
        dos: [
          "Saygılı dil ve net yapı kullan.",
          "Cevap vermeden önce tamamen dinle.",
          "Tutarlı ol ve takip et.",
          "Kuralları ve beklentileri açıkça sor.",
          "Pratik ve somut yardımlar sun."
        ],
        donts: [
          "Hızlı konu değişimleriyle konuşmayı aceleye getirme.",
          "Rahatlığı her zaman hoş karşılanır sanma.",
          "Deneyimi opsiyonel bağlam gibi görme.",
          "Ciddi konularda şaka yapma.",
          "Rehberlik istedikten sonra ortadan kaybolma."
        ],
        joke: "Sessiz Kuşak sabrı değer bilir; Beta kavram hâlâ yükleniyor."
      },

      boomer: {
        dos: [
          "Nazik, net ve sonuç odaklı ol.",
          "Sorumluluk al ve teslim tarihine saygı duy.",
          "Geri bildirim iste ve hızlı uygula.",
          "Herkesi hizalayan basit araçlar kullan.",
          "Savunmacı olmadan mantığını açıkla."
        ],
        donts: [
          "Yapıyı baskı sanma.",
          "Paydaşları bilgilendirmeden yön değiştirme.",
          "Netlik yerine trend dili kullanma.",
          "Davet edildiğin toplantıları opsiyonel görme.",
          "Alternatif önermeden itiraz etme."
        ],
        joke: "Boomer süreci getirir; Beta bir kez bozan otomatik güncellemeyi."
      },

      genx: {
        dos: [
          "Kısa, hazırlıklı ve net ol.",
          "Bağımsızlığı güvenilir icrayla göster.",
          "Spesifik sorular sor, kısa cevapları kabul et.",
          "Sınırları ve düşük toplantı kültürünü koru.",
          "Sonuç teslim et, sonra sessizce yinele."
        ],
        donts: [
          "Sürekli takdir ve güvence bekleme.",
          "Akıllı görünmek için planı karmaşıklaştırma.",
          "Doğrudan geri bildirimi kişisel alma.",
          "İşi popülerlik yarışına çevirme.",
          "Yeni bilgi olmadan tekrar tekrar ping atma."
        ],
        joke: "Gen X uzun mesajını okumaz; ama anlattığı problemi çözer."
      },

      geny: {
        dos: [
          "Amaçta hizalan, sonra metrikleri belirle.",
          "İşbirlikçi ton ve ortak sahiplik kullan.",
          "Kapasite ve engelleri şeffaf paylaş.",
          "Koçluk iste ve hızlı uygula.",
          "Esnekliği korurken sorumluluğu unutma."
        ],
        donts: [
          "Hissin net önceliklerin yerini aldığını sanma.",
          "Geri bildirimi kişisel puanlama gibi görme.",
          "Ekip standartlarını ve araçlarını yok sayma.",
          "İstekli görünmek için aşırı söz verme.",
          "Belirsizlikte kalmayı uzatma."
        ],
        joke: "Gen Y büyümene yardım eder; Beta sadece davetli listesini küçültmeli."
      },

      genz: {
        dos: [
          "Mesajları kısa tut ve net sonraki adımlar ekle.",
          "Sınır ve cevap sürelerine saygı duy.",
          "Hızlı geri bildirim döngüleriyle ayarla.",
          "Kararları ortak bir yerde dokümante et.",
          "Bir şey net değilse erken dürüst ol."
        ],
        donts: [
          "Hızın netlikten önemli olduğunu varsayma.",
          "Doğrudanlığı yarışa çevirme.",
          "Küçük çatışmaları büyütme.",
          "Sohbetleri sürekli güncellemeyle doldurma.",
          "Hizalamayı atlayıp olmasını bekleme."
        ],
        joke: "Beta ve Gen Z bir konuda anlaşır: yazılmadıysa olmamıştır."
      },

      alpha: {
        dos: [
          "Rutinleri basit ve tutarlı tut.",
          "Kısa, etkileşimli öğrenme anları kullan.",
          "Sakin dikkat ve sıra almayı modelle.",
          "Merakı güvenli sınırlarla teşvik et.",
          "Anında ve nazik düzeltmeler yap."
        ],
        donts: [
          "Sürekli geçişlerle aşırı uyarma.",
          "Her şeyi rekabete çevirme.",
          "Öğretirken alaycılık kullanma.",
          "Molasız uzun odak bekleme.",
          "Hayal kırıklığı görünürken duyguları yok sayma."
        ],
        joke: "Beta Alfa’dan yardım ister; Alfa cümle bitmeden tutorial hazırlar."
      }
    }
  }
};

// Make it globally available
if (typeof window !== "undefined") {
  window.ZGEN_DATA = ZGEN_DATA;
}
