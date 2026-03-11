import { createMetadata } from '@/lib/seo/metadata';
import { NewsCarousel } from '@/components/sections/NewsCarousel';
import { ArticleGrid } from '@/components/sections/ArticleCard';
import type { Article } from '@/types';

interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
  date: string;
  category?: string;
}

export const metadata = createMetadata({
  title: 'Ana Sayfa',
  description: "Almanya'da yaşayan veya taşınmayı planlayan Türkler için kapsamlı bilgi rehberi, iş ilanları ve topluluk platformu.",
  path: '/',
});

export default function HomePage() {
  const newsItems: NewsItem[] = [
    {
      id: '1',
      title: 'Almanya\'da Yeni Çalışma Vizesi Düzenlemeleri 2025',
      excerpt: 'Almanya, 2025 yılında nitelikli işçiler için vize süreçlerini kolaylaştıran yeni düzenlemeleri hayata geçiriyor.',
      image: 'https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=600&fit=crop',
      date: '15 Mart 2025',
      category: 'Güncelleme',
    },
    {
      id: '2',
      title: 'Yeni Topluluk Etkinlikleri Duyurusu',
      excerpt: 'Bu ay Berlin, Münih ve Frankfurt\'ta Türk topluluğu için özel etkinlikler düzenleniyor.',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800&h=600&fit=crop',
      date: '12 Mart 2025',
      category: 'Etkinlik',
    },
    {
      id: '3',
      title: 'Almanca Öğrenme Platformu Yenilendi',
      excerpt: 'almanya101 Almanca öğrenme bölümü yeni interaktif dersler ve pratik egzersizlerle güncellendi.',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&h=600&fit=crop',
      date: '10 Mart 2025',
      category: 'Haber',
    },
    {
      id: '4',
      title: 'İş Fuarı 2025 - Kayıtlar Başladı',
      excerpt: 'Almanya\'daki en büyük Türk işverenleriyle buluşma fırsatı. Online ve yüz yüze katılım seçenekleri.',
      image: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&h=600&fit=crop',
      date: '8 Mart 2025',
      category: 'Duyuru',
    },
  ];

  const articles: Article[] = [
    {
      id: '1',
      title: 'Almanya\'da İş Bulmak: Kapsamlı Rehber',
      excerpt: 'Almanya\'da iş arama süreci, CV hazırlama, mülakat teknikleri ve iş bulma stratejileri hakkında bilmeniz gereken her şey.',
      category: 'Kariyer',
      date: '15 Ocak 2025',
      readTime: '8 dk',
    },
    {
      id: '2',
      title: 'İkamet İzni Türleri ve Başvuru Süreci',
      excerpt: 'Almanya\'daki farklı ikamet izni türleri, başvuru şartları ve adım adım başvuru süreci.',
      category: 'Vize',
      date: '12 Ocak 2025',
      readTime: '12 dk',
    },
    {
      id: '3',
      title: 'Almanya\'da Sağlık Sigortası Nasıl Alınır?',
      excerpt: 'Zorunlu sağlık sigortası sistemleri, karşılaştırma ve doğru sigortayı seçme rehberi.',
      category: 'Sağlık',
      date: '10 Ocak 2025',
      readTime: '6 dk',
    },
  ];

  const menuItems = [
    {
      href: '/biz-kimiz',
      label: 'Biz kimiz?',
      description: 'almanya101 ekibini tanıyın!',
      image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=300&fit=crop'
    },
    {
      href: '/bize-katil',
      label: 'Bize Katıl!',
      description: 'Ekibimize katılmak için tıkla!',
      image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=400&h=300&fit=crop'
    },
    {
      href: '/yazi-dizisi',
      label: 'Yazı Dizisi',
      description: 'Adım adım yazı serileri.',
      image: 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&h=300&fit=crop'
    },
    {
      href: '/maas-hesaplama',
      label: 'Maaş Hesaplama',
      description: 'Net maaşınızı anında görün.',
      image: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop'
    },
    {
      href: '/vatandaslik-testi',
      label: 'Vatandaşlık Testi',
      description: 'Deneme sınavı çözün.',
      image: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=400&h=300&fit=crop'
    },
    {
      href: '/banka-secim',
      label: 'Banka Seçim',
      description: 'Banka profilinizi belirleyin.',
      image: 'https://images.unsplash.com/photo-1541354329998-f4d9a9f9297f?w=400&h=300&fit=crop'
    },
    {
      href: '/sigorta-secim',
      label: 'Sigorta Seçim',
      description: 'Sigortaları önceliklendirin.',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&h=300&fit=crop'
    },
    {
      href: '/turk-hizmet-rehberi-ara',
      label: 'Hizmet Rehberi',
      description: 'Türkçe destek bulun!',
      image: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=300&fit=crop'
    },
    {
      href: '/turk-hizmet-rehberi-oner',
      label: 'Hizmet Öner',
      description: 'Uzman ekleyin!',
      image: 'https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=400&h=300&fit=crop'
    },
    {
      href: '/tatil-planlayici-turkiye',
      label: 'Tatil Türkiye',
      description: '2026 tatilinizi planlayın.',
      image: 'https://images.unsplash.com/photo-1527838832700-5059252407fa?w=400&h=300&fit=crop'
    },
    {
      href: '/tatil-planlayici-almanya',
      label: 'Tatil Almanya',
      description: '2026 tatilinizi planlayın.',
      image: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=400&h=300&fit=crop'
    },
    {
      href: '/para-transferi',
      label: 'Para Transferi',
      description: 'Uygun aracı bulun!',
      image: 'https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?w=400&h=300&fit=crop'
    },
    {
      href: '/iletisim',
      label: 'İletişim',
      description: 'Bize hızlıca ulaşın.',
      image: 'https://images.unsplash.com/photo-1423666639041-f56000c27a9a?w=400&h=300&fit=crop'
    },
    {
      href: '/software-hub',
      label: 'Software Hub',
      description: 'Yazılım projelerimizi keşfedin!',
      image: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=300&fit=crop'
    },
    {
      href: '/topluluk',
      label: 'Topluluğa Katıl',
      description: 'Türk topluluğuna dahil olun!',
      image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=400&h=300&fit=crop'
    },
  ];

  return (
    <>
      {/* Hero Section - Almanya Landscape */}
      <section
        className="min-h-screen flex flex-col items-center justify-center relative bg-cover bg-center py-8"
        style={{ backgroundImage: 'url(/images/backgrounds/hero.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">almanya101'e hoş geldin!</h1>
            <p className="text-base sm:text-lg md:text-xl text-gray-200">yalnız değilsin! almanya101 seninle!</p>
          </div>
          
          {/* Menu Cards Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 max-w-6xl mx-auto mb-8">
            {menuItems.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="group flex flex-col bg-white/95 hover:bg-white rounded-xl overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg min-h-[220px] sm:min-h-[280px]"
              >
                {/* Image - Top Half */}
                <div className="h-1/2 min-h-[110px] sm:min-h-[140px] relative overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.label}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
                </div>
                
                {/* Content - Bottom Half */}
                <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center">
                  {/* Title */}
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 text-center mb-1 sm:mb-2 line-clamp-1">
                    {item.label}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-xs sm:text-sm text-gray-600 text-center line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-[10px] bg-black" />

      {/* News Section - Berlin */}
      <section 
        className="min-h-[60vh] sm:min-h-[80vh] flex items-center relative bg-cover bg-center py-12 sm:py-0"
        style={{ backgroundImage: 'url(/images/backgrounds/berlin1.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">Haberler & Duyurular & Güncellemeler</h2>
          </div>
          <NewsCarousel items={newsItems} />
        </div>
      </section>

      {/* Divider */}
      <div className="h-[10px] bg-black" />

      {/* Biz Kimiz Section - Berlin 2 */}
      <section 
        className="min-h-[60vh] sm:min-h-[80vh] flex items-center relative bg-cover bg-center py-12 sm:py-0"
        style={{ backgroundImage: 'url(/images/backgrounds/berlin2.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-3">Biz Kimiz?</h2>
            <p className="text-sm sm:text-base text-gray-300">almanya101 ekibi hakkında bilgi</p>
          </div>

          {/* Profile Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
            {/* Umut Barış Terzioğlu */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/30">
              {/* Profile Image */}
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                  <img 
                    src="/images/profil.jpg" 
                    alt="Umut Barış Terzioğlu" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Name & Title */}
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Umut Barış Terzioğlu</h3>
                <p className="text-sm text-gray-400">Kurucu</p>
              </div>

              {/* Personal Website Link */}
              <div className="flex justify-center mb-8">
                <a 
                  href="https://ubterzioglu.de" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center px-5 py-2.5 bg-google-yellow text-gray-900 text-sm font-medium rounded-lg hover:bg-yellow-400 transition-colors"
                >
                  Kişisel Web Sayfam
                </a>
              </div>

              {/* Description - Justified Text */}
              <div className="text-gray-200 text-sm sm:text-base leading-relaxed space-y-4 text-justify">
                <p>
                  Ben Umut Barış Terzioğlu. Türkiye'de Barış, Almanya'da Umut :). 1985 doğumluyum. Aslen Makine Mühendisiyim; 
                  bugünlerde yazılım tarafında çalışıyorum. 2021'den beri eşimle ve iki kedimizle birlikte Dortmund'da yaşıyorum.
                </p>
                <p>
                  Yeni şeyler öğrenmeyi, üretmeyi ve insanlara faydalı olmayı seviyorum. Teknolojiyle iç içe olsam da günlük 
                  hayatta pratik, net ve işe yarayan bilgiye değer veririm. Boş zamanlarımda bilgisayar oyunları, film/dizi, müzik 
                  ve seyahat iyi gelir; kafamı toparlamanın en güzel yolu bazen de iki kedimizle evde "sessiz bir karmaşa" yaşamak 
                  olur.
                </p>
                <p>
                  Almanya'da yaşamaya başladığım günden beri, günlük hayatta karşılaştığım pek çok sorunun net ve dağınık olmayan 
                  bir kaynağa ihtiyaç duyduğunu fark ettim. almanya101.de, tam olarak bu ihtiyaçtan doğdu.
                </p>
                <p>
                  Bu platformu; Almanya'ya yeni gelenlerin, gelmeyi düşünenlerin ya da burada uzun süredir yaşayanların güvenilir 
                  ve sade bilgilere kolayca ulaşabilmesi için kurdum. Amacım her şeyi bilen biri olmak değil; öğrenilenleri, 
                  tecrübeleri ve faydalı bilgileri tek bir yerde toplamak.
                </p>
                <p className="text-google-yellow font-medium">
                  almanya101.de yaşayan bir platform. Zamanla gelişiyor, büyüyor ve katkılarla daha da güçleniyor. Eğer burada 
                  birine yardımcı olabiliyorsak, doğru yoldayız demektir.
                </p>
              </div>
            </div>

            {/* Şahincan Özbakır */}
            <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 sm:p-8 border border-white/30">
              {/* Profile Image */}
              <div className="flex justify-center mb-6">
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-4 border-white/30 shadow-xl">
                  <img 
                    src="/images/sahin-profil.jpeg" 
                    alt="Şahincan Özbakır" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* Name & Title */}
              <div className="text-center mb-6">
                <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Şahincan Özbakır</h3>
                <p className="text-sm text-gray-400">Kurucu & Yazılım Geliştirici</p>
              </div>

              {/* Button */}
              <div className="flex justify-center mb-8">
                <span className="inline-flex items-center justify-center px-5 py-2.5 bg-google-blue text-white text-sm font-medium rounded-lg">
                  2026'dan Beri Ekibimizde
                </span>
              </div>

              {/* Description - Justified Text */}
              <div className="text-gray-200 text-sm sm:text-base leading-relaxed space-y-4 text-justify">
                <p>
                  1994 İstanbul doğumluyum. Aslen turizm profesyoneli olarak başladığım kariyerime, 
                  2021 tarihinden beri yazılım geliştirme alanında çalışıyorum.
                </p>
                <p>
                  2022 yılından beri Almanya Magdeburg'ta eşim ve 2 kızımla birlikte yaşıyorum.
                </p>
                <p>
                  İşkolik bir insanım ve yeni bir şeyler öğretip öğrenmeyi çok seviyorum. Turizm 
                  sektöründe iken aldığım pedagojik formasyonum hayatıma çok büyük bir vizyon kattı.
                </p>
                <p>
                  Gereksiz angarya işleri sevmediğim için, her işin önce SWOT analizini yapar ve kolay 
                  yollarını ararım. Zorsa da kolaylaştırırım 😊 Oyun oynamayı ve gitar çalmayı severim.
                </p>
                <p>
                  Genelde ulaşılabilir biriyimdir ve yukardan bakma gibi saçma egolarım yoktur. 
                  Her zaman ulaşabilirsiniz.
                </p>
                <p className="text-google-blue font-medium">
                  2026 yılında almanya101 ailesine katıldım ve UBT ile bir şeyler yapmaya uğraşıyoruz. 
                  Gelin beraber büyümeye devam edelim. Paylaşalım, eğitelim, destek olalım.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-[10px] bg-black" />

      {/* Placeholder 2 - Berlin 3 */}
      <section 
        className="min-h-[60vh] sm:min-h-[80vh] flex items-center relative bg-cover bg-center py-12 sm:py-0"
        style={{ backgroundImage: 'url(/images/backgrounds/berlin3.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">Placeholder Bölüm 2</h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-200 max-w-2xl mx-auto mb-6 sm:mb-8">
            Bu bölüm için içerik yakında eklenecektir. Şu an placeholder olarak kullanılmaktadır.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a href="#" className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black text-sm sm:text-base font-medium rounded-md hover:bg-gray-100 transition-colors">
              Daha Fazla Bilgi
            </a>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-[10px] bg-black" />

      {/* Placeholder 3 - Frankfurt Skyline */}
      <section 
        className="min-h-[60vh] sm:min-h-[80vh] flex items-center relative bg-cover bg-center py-12 sm:py-0"
        style={{ backgroundImage: 'url(/images/backgrounds/frankfurt1.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">Placeholder Bölüm 3</h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-200 max-w-2xl mx-auto mb-6 sm:mb-8">
            Bu bölüm için içerik yakında eklenecektir. Şu an placeholder olarak kullanılmaktadır.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a href="#" className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black text-sm sm:text-base font-medium rounded-md hover:bg-gray-100 transition-colors">
              Daha Fazla Bilgi
            </a>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-[10px] bg-black" />

      {/* Articles Section - Frankfurt 2 */}
      <section 
        className="min-h-[60vh] sm:min-h-[80vh] flex items-center relative bg-cover bg-center py-12 sm:py-0"
        style={{ backgroundImage: 'url(/images/backgrounds/frankfurt2.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">Popüler Rehberler</h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-200 max-w-2xl mx-auto">
              En çok okunan rehberler ve makaleler.
            </p>
          </div>
          <ArticleGrid articles={articles} columns={3} />
          <div className="text-center mt-6 sm:mt-8">
            <a href="/rehber" className="text-white hover:text-gray-300 text-sm sm:text-base font-medium transition-colors underline">
              Tüm Rehberleri Gör →
            </a>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-[10px] bg-black" />

      {/* CTA Section - Berlin */}
      <section 
        className="min-h-[60vh] sm:min-h-[80vh] flex items-center relative bg-cover bg-center py-12 sm:py-0"
        style={{ backgroundImage: 'url(/images/backgrounds/berlin4.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/60" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">Topluluğumuza Katılın</h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-200 max-w-2xl mx-auto mb-6 sm:mb-8">
            Binlerce Türk Almanya'da yaşadığı deneyimleri paylaşmaya hazır. Sorular sorun, cevaplar verin, dostluklar kurun.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <a href="/topluluk" className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-white text-black text-sm sm:text-base font-medium rounded-md hover:bg-gray-100 transition-colors">
              Hemen Kayıt Olun
            </a>
            <a href="/topluluk" className="inline-flex items-center justify-center px-4 sm:px-6 py-2.5 sm:py-3 bg-transparent text-white text-sm sm:text-base font-medium rounded-md hover:bg-white/10 transition-colors border border-white/50">
              Daha Fazla Bilgi
            </a>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="h-[10px] bg-black" />

      {/* Contact Section - Berlin */}
      <section 
        className="min-h-[60vh] sm:min-h-[80vh] flex items-center relative bg-cover bg-center py-12 sm:py-0"
        style={{ backgroundImage: 'url(/images/backgrounds/berlin5.jpg)' }}
      >
        <div className="absolute inset-0 bg-black/70" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-4">Bize Ulaşın</h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-300 max-w-2xl mx-auto">
              Sorularınız için 9 farklı kanaldan bize ulaşabilirsiniz
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 max-w-5xl mx-auto">
            {/* WhatsApp */}
            <a href="https://wa.me/905302404995" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 group">
              <div className="flex-shrink-0 w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center bg-green-500">
                <svg className="w-6 sm:w-7 h-6 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base group-hover:text-gray-300 transition-colors">WhatsApp</h3>
                <p className="text-xs sm:text-sm text-gray-400">+90 530 240 4995</p>
              </div>
            </a>

            {/* Telegram */}
            <a href="https://t.me/almanya101" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 group">
              <div className="flex-shrink-0 w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center bg-blue-400">
                <svg className="w-6 sm:w-7 h-6 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/></svg>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base group-hover:text-gray-300 transition-colors">Telegram</h3>
                <p className="text-xs sm:text-sm text-gray-400">Anlık bildirimler</p>
              </div>
            </a>

            {/* Phone */}
            <a href="tel:+491739569429" className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 group">
              <div className="flex-shrink-0 w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center bg-indigo-500">
                <svg className="w-6 sm:w-7 h-6 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base group-hover:text-gray-300 transition-colors">Telefon</h3>
                <p className="text-xs sm:text-sm text-gray-400">+49 173 956 9429</p>
              </div>
            </a>

            {/* Email */}
            <a href="mailto:info@almanya101.de" className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 group">
              <div className="flex-shrink-0 w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center bg-red-500">
                <svg className="w-6 sm:w-7 h-6 sm:h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base group-hover:text-gray-300 transition-colors">E-Posta</h3>
                <p className="text-xs sm:text-sm text-gray-400">info@almanya101.de</p>
              </div>
            </a>

            {/* Instagram */}
            <a href="https://instagram.com/almanya101" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 group">
              <div className="flex-shrink-0 w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400">
                <svg className="w-6 sm:w-7 h-6 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base group-hover:text-gray-300 transition-colors">Instagram</h3>
                <p className="text-xs sm:text-sm text-gray-400">@almanya101</p>
              </div>
            </a>

            {/* YouTube */}
            <a href="https://www.youtube.com/@almanya101de" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 group">
              <div className="flex-shrink-0 w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center bg-red-600">
                <svg className="w-6 sm:w-7 h-6 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base group-hover:text-gray-300 transition-colors">YouTube</h3>
                <p className="text-xs sm:text-sm text-gray-400">@almanya101de</p>
              </div>
            </a>

            {/* LinkedIn */}
            <a href="https://www.linkedin.com/in/ubterzioglu" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 group">
              <div className="flex-shrink-0 w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center bg-blue-600">
                <svg className="w-6 sm:w-7 h-6 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base group-hover:text-gray-300 transition-colors">LinkedIn</h3>
                <p className="text-xs sm:text-sm text-gray-400">/in/ubterzioglu</p>
              </div>
            </a>

            {/* Twitter/X */}
            <a href="https://x.com/101Almanya46905" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 group">
              <div className="flex-shrink-0 w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center bg-gray-800">
                <svg className="w-6 sm:w-7 h-6 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base group-hover:text-gray-300 transition-colors">Twitter / X</h3>
                <p className="text-xs sm:text-sm text-gray-400">@101Almanya46905</p>
              </div>
            </a>

            {/* Facebook */}
            <a href="https://www.facebook.com/almanya101/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl bg-white/10 hover:bg-white/20 transition-all duration-300 backdrop-blur-sm border border-white/20 group">
              <div className="flex-shrink-0 w-12 sm:w-14 h-12 sm:h-14 rounded-xl flex items-center justify-center bg-blue-700">
                <svg className="w-6 sm:w-7 h-6 sm:h-7 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </div>
              <div>
                <h3 className="font-semibold text-white text-sm sm:text-base group-hover:text-gray-300 transition-colors">Facebook</h3>
                <p className="text-xs sm:text-sm text-gray-400">/almanya101</p>
              </div>
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
