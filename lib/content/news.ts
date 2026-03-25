export interface NewsArticle {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  image: string;
  publishedAt: string;
  dateLabel: string;
  category: string;
  readingMinutes: number;
  sourceName?: string;
  sourceUrl?: string;
  body: string[];
}

export interface NewsItem {
  id: string;
  slug: string;
  href: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category?: string;
}

export const NEWS_ARTICLES: NewsArticle[] = [
  {
    id: '1',
    slug: 'almanya-yeni-calisma-vizesi-duzenlemeleri-2025',
    title: "Almanya'da Yeni Çalışma Vizesi Düzenlemeleri 2025",
    excerpt:
      'Almanya, 2025 yılında nitelikli işçiler için vize süreçlerini kolaylaştıran yeni düzenlemeleri hayata geçiriyor.',
    image:
      'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=600&fit=crop',
    publishedAt: '2025-03-15T09:00:00.000Z',
    dateLabel: '15 Mart 2025',
    category: 'Güncelleme',
    readingMinutes: 4,
    sourceName: 'almanya101 editör ekibi',
    body: [
      "Almanya, nitelikli göç politikasını daha erişilebilir hale getirmek için çalışma vizesi süreçlerinde yeni bir sadeleştirmeye gidiyor. Özellikle başvuru dosyalarının değerlendirme süresini kısaltmak ve işveren tarafındaki belirsizlikleri azaltmak öncelikli hedefler arasında yer alıyor.",
      'Yeni çerçevede diploma denkliği, iş sözleşmesi ve mesleki tecrübe belgelerinin daha standart bir formatta sunulması bekleniyor. Bu da başvuru sahiplerinin hangi belgeleri hazırlaması gerektiğini daha net görmesini sağlayacak.',
      "Bu değişikliklerin en önemli etkisi, Almanya'ya taşınmayı planlayan Türk profesyonellerin sürece daha erken hazırlanabilmesi olacak. Almanya101 olarak önümüzdeki günlerde gerekli evrak listeleri ve başvuru adımlarını sade bir rehber halinde yayınlayacağız.",
    ],
  },
  {
    id: '2',
    slug: 'yeni-topluluk-etkinlikleri-duyurusu',
    title: 'Yeni Topluluk Etkinlikleri Duyurusu',
    excerpt:
      "Bu ay Berlin, Münih ve Frankfurt'ta Türk topluluğu için özel etkinlikler düzenleniyor.",
    image:
      'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
    publishedAt: '2025-03-12T17:30:00.000Z',
    dateLabel: '12 Mart 2025',
    category: 'Etkinlik',
    readingMinutes: 3,
    sourceName: 'almanya101 topluluk ekibi',
    body: [
      "Berlin, Münih ve Frankfurt'ta planlanan yeni buluşmalar; networking, günlük yaşam deneyimleri ve şehir bazlı tavsiye paylaşımı etrafında kurgulanıyor. Etkinlikler özellikle Almanya'ya yeni taşınan veya taşınma sürecinde olan kişileri bir araya getirmeyi amaçlıyor.",
      'Her buluşmada farklı bir tema olacak: iş arama süreci, resmi işlemler, konut deneyimleri ve sosyal çevre oluşturma. Böylece sadece sohbet değil, gerçekten işe yarayan bilgi paylaşımı da sağlanacak.',
      'Etkinlik tarihleri netleştikçe almanya101 ana sayfası ve topluluk kanallarımız üzerinden duyuracağız. Katılım formu ve bekleme listesi desteğini de ayrı bir sayfada açmayı planlıyoruz.',
    ],
  },
  {
    id: '3',
    slug: 'almanca-ogrenme-platformu-yenilendi',
    title: 'Almanca Öğrenme Platformu Yenilendi',
    excerpt:
      'almanya101 Almanca öğrenme bölümü yeni interaktif dersler ve pratik egzersizlerle güncellendi.',
    image:
      'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
    publishedAt: '2025-03-10T08:45:00.000Z',
    dateLabel: '10 Mart 2025',
    category: 'Haber',
    readingMinutes: 3,
    sourceName: 'almanya101 ürün ekibi',
    body: [
      "Yeni güncelleme ile Almanca öğrenme alanı daha görev odaklı bir yapıya kavuştu. Kullanıcılar artık sadece konu anlatımı değil, günlük hayatta karşılarına çıkacak cümle kalıpları üzerinden de pratik yapabilecek.",
      'Özellikle randevu alma, evrak teslim etme, iş görüşmesi ve markette iletişim gibi gerçek kullanım senaryoları öne çıkarıldı. Bu sayede ezber yerine bağlam içinde öğrenme hedefleniyor.',
      'Önümüzdeki aşamada kısa quizler, ilerleme takibi ve seviye bazlı içerik etiketleri de eklemeyi planlıyoruz. Böylece öğrenme alanı doğrudan diğer rehberlerle de bağlantılı hale gelecek.',
    ],
  },
  {
    id: '4',
    slug: 'is-fuari-2025-kayitlar-basladi',
    title: 'İş Fuarı 2025 - Kayıtlar Başladı',
    excerpt:
      "Almanya'daki en büyük Türk işverenleriyle buluşma fırsatı. Online ve yüz yüze katılım seçenekleri.",
    image:
      'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
    publishedAt: '2025-03-08T11:15:00.000Z',
    dateLabel: '8 Mart 2025',
    category: 'Duyuru',
    readingMinutes: 4,
    sourceName: 'almanya101 kariyer ekibi',
    body: [
      "İş Fuarı 2025 için ön kayıt süreci açıldı. Etkinlikte Almanya'da faaliyet gösteren şirketlerle doğrudan temas kurulabilecek, ayrıca özgeçmiş değerlendirmesi ve kısa kariyer oturumları da yer alacak.",
      'Online katılım seçeneği sayesinde farklı şehirlerde yaşayan kullanıcılar da etkinliği takip edebilecek. Yüz yüze katılım tarafında ise sınırlı kontenjan nedeniyle erken başvuru öne çıkıyor.',
      'Bu sayfanın bir sonraki sürümünde başvuru bağlantıları, konuşmacı listesi ve takvim akışı da yer alacak. Admin panelindeki haber modülünü bu tip duyurular için merkez haline getirmeyi planlıyoruz.',
    ],
  },
];

export const NEWS_ITEMS: NewsItem[] = NEWS_ARTICLES.map((article) => ({
  id: article.id,
  slug: article.slug,
  href: `/haberler/${article.slug}`,
  title: article.title,
  excerpt: article.excerpt,
  image: article.image,
  date: article.dateLabel,
  category: article.category,
}));

export function getAllNewsArticles(): NewsArticle[] {
  return NEWS_ARTICLES;
}

export function getNewsArticleBySlug(slug: string): NewsArticle | undefined {
  return NEWS_ARTICLES.find((article) => article.slug === slug);
}

export function getRelatedNewsArticles(currentSlug: string, limit = 3): NewsArticle[] {
  return NEWS_ARTICLES.filter((article) => article.slug !== currentSlug).slice(0, limit);
}
