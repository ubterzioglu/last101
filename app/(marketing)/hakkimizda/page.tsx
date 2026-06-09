import Image from 'next/image';
import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { HeroSection } from '@/components/sections/HeroSection';
import { Section } from '@/components/ui/Section';
import type { Feature } from '@/types';

export const metadata = createMetadata({
  title: 'Hakkımızda',
  description: 'almanya101 platformu hakkında bilgi. Misyonumuz, vizyonumuz ve değerlerimiz.',
  path: '/hakkimizda',
});

export default function HakkimizdaPage() {
  const features: Feature[] = [
    {
      id: '1',
      title: 'Güvenilir Bilgi',
      description: 'Uzmanlar ve deneyimli kişiler tarafından doğrulanmış bilgiler.',
      icon: '✅',
    },
    {
      id: '2',
      title: 'Topluluk Odaklı',
      description: 'Kullanıcıların deneyimlerini paylaşabileceği destekleyici bir platform.',
      icon: '❤️',
    },
    {
      id: '3',
      title: 'Sürekli Gelişim',
      description: 'Kullanıcı geri bildirimleriyle sürekli iyileştirme.',
      icon: '🚀',
    },
    {
      id: '4',
      title: 'Ücretsiz Erişim',
      description: 'Tüm içeriklere tamamen ücretsiz erişim.',
      icon: '🆓',
    },
  ];

  return (
    <div className="bg-black min-h-screen text-white">
      <HeroSection
        title="Hakkımızda"
        description="almanya101 hakkında bilgi edinin. Biz kimiz, ne yapıyoruz ve neden yapıyoruz?"
        centered={false}
        className="bg-black border-b border-white/10"
      />

      {/* Biz Kimiz - Ekip Kartları */}
      <Section contained className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-6">Biz Kimiz?</h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            almanya101'i birlikte büyüten, bilgi ve deneyimlerini paylaşan ekibimizle tanışın.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-6xl mx-auto">
          {/* Umut Barış Terzioğlu */}
          <div className="relative rounded-[2rem] overflow-hidden border border-google-yellow/30 bg-google-yellow/5 backdrop-blur-md transition-all duration-500 hover:bg-google-yellow/10 hover:border-google-yellow/50 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(251,188,4,0.15)] group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-google-yellow/10 rounded-full blur-[80px] -z-10 group-hover:bg-google-yellow/20 transition-all duration-500"></div>
            
            <div className="relative z-10 p-8 md:p-12 flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-google-yellow mb-8 shadow-[0_0_20px_rgba(251,188,4,0.3)] group-hover:scale-105 transition-transform duration-500">
                <Image
                  src="/images/profil.jpg"
                  alt="Umut Barış Terzioğlu"
                  className="w-full h-full object-cover"
                  width={160}
                  height={160}
                />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Umut Barış Terzioğlu</h3>
              <p className="text-google-yellow font-medium text-lg mb-8 tracking-wide uppercase">Kurucu</p>
              
              <a
                href="https://ubterzioglu.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-8 py-3 bg-google-yellow text-black font-bold rounded-full hover:bg-yellow-400 hover:shadow-[0_0_20px_rgba(251,188,4,0.4)] transition-all duration-300 mb-10"
              >
                Kişisel Web Sayfam
              </a>
              
              <div className="text-white/80 text-base md:text-lg leading-relaxed space-y-5 text-left font-light">
                <p>
                  Ben Umut Barış Terzioğlu. Türkiye'de Barış, Almanya'da Umut :) 1985 doğumluyum. 
                  Aslen Makine Mühendisiyim; bugünlerde yazılım tarafında çalışıyorum. 2021'den beri 
                  eşimle ve iki kedimizle birlikte Dortmund'da yaşıyorum.
                </p>
                <p>
                  Yeni şeyler öğrenmeyi, üretmeyi ve insanlara faydalı olmayı seviyorum. Teknolojiyle 
                  iç içe olsam da günlük hayatta pratik, net ve işe yarayan bilgiye değer veririm. 
                  Boş zamanlarımda bilgisayar oyunları, film/dizi, müzik ve seyahat iyi gelir; kafamı 
                  toparlamanın en güzel yolu bazen de iki kedimizle evde "sessiz bir karmaşa" yaşamak olur.
                </p>
                <p>
                  Almanya'da yaşamaya başladığım günden beri, günlük hayatta karşılaştığım pek çok sorunun 
                  net ve dağınık olmayan bir kaynağa ihtiyaç duyduğunu fark ettim. almanya101.de, tam olarak 
                  bu ihtiyaçtan doğdu.
                </p>
                <p>
                  Bu platformu; Almanya'ya yeni gelenlerin, gelmeyi düşünenlerin ya da burada uzun süredir 
                  yaşayanların güvenilir ve sade bilgilere kolayca ulaşabilmesi için kurdum. Amacım her 
                  şeyi bilen biri olmak değil; öğrenilenleri, tecrübeleri ve faydalı bilgileri tek bir yerde 
                  toplamak.
                </p>
              </div>
              
              <div className="mt-8 p-6 rounded-2xl bg-google-yellow/10 border border-google-yellow/20">
                <p className="text-google-yellow font-medium text-base md:text-lg text-left italic">
                  "almanya101.de yaşayan bir platform. Zamanla gelişiyor, büyüyor ve katkılarla daha da güçleniyor. 
                  Eğer burada birine yardımcı olabiliyorsak, doğru yoldayız demektir."
                </p>
              </div>
            </div>
          </div>

          {/* Şahincan Özbakır */}
          <div className="relative rounded-[2rem] overflow-hidden border border-google-blue/30 bg-google-blue/5 backdrop-blur-md transition-all duration-500 hover:bg-google-blue/10 hover:border-google-blue/50 hover:-translate-y-1 hover:shadow-[0_0_40px_rgba(66,133,244,0.15)] group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-google-blue/10 rounded-full blur-[80px] -z-10 group-hover:bg-google-blue/20 transition-all duration-500"></div>
            
            <div className="relative z-10 p-8 md:p-12 flex flex-col items-center text-center">
              <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-google-blue mb-8 shadow-[0_0_20px_rgba(66,133,244,0.3)] group-hover:scale-105 transition-transform duration-500">
                <Image
                  src="/images/sahin-profil.jpeg"
                  alt="Şahincan Özbakır"
                  className="w-full h-full object-cover"
                  width={160}
                  height={160}
                />
              </div>
              
              <h3 className="text-3xl md:text-4xl font-bold text-white mb-2 tracking-tight">Şahincan Özbakır</h3>
              <p className="text-google-blue font-medium text-lg mb-8 tracking-wide uppercase">Kurucu & Yazılım Geliştirici</p>
              
              <div className="inline-flex items-center justify-center px-8 py-3 bg-google-blue/20 border border-google-blue/50 text-white font-semibold rounded-full mb-10">
                2026'dan Beri Ekibimizde
              </div>
              
              <div className="text-white/80 text-base md:text-lg leading-relaxed space-y-5 text-left font-light">
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
              </div>
              
              <div className="mt-auto pt-8 w-full">
                <div className="p-6 rounded-2xl bg-google-blue/10 border border-google-blue/20">
                  <p className="text-google-blue font-medium text-base md:text-lg text-left italic">
                    "2026 yılında almanya101 ailesine katıldım ve UBT ile bir şeyler yapmaya uğraşıyoruz. 
                    Gelin beraber büyümeye devam edelim. Paylaşalım, eğitelim, destek olalım."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section contained className="py-20 border-t border-white/10">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-6">Değerlerimiz</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Her şeyi yaparken bu değerleri dikkate alıyoruz.
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {features.map((feature) => (
            <div
              key={feature.id}
              className="flex flex-col items-center text-center rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1"
            >
              <div className="text-5xl mb-5">{feature.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-white/70 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section contained className="py-20 mb-10">
        <div className="text-center py-16 px-6 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-[2rem] backdrop-blur-sm max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">Bize Katılın</h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Eğer bizimle çalışmak, içerik üretmek veya diğer şekillerde katkıda bulunmak istiyorsanız, bizimle iletişime geçin.
          </p>
          <Link
            href="/iletisim"
            className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-black bg-white rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-300"
          >
            İletişime Geçin
          </Link>
        </div>
      </Section>
    </div>
  );
}
