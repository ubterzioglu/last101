import { createMetadata } from '@/lib/seo/metadata';
import { HeroSection } from '@/components/sections/HeroSection';
import { InfoGrid } from '@/components/sections/InfoBlock';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { Section } from '@/components/ui/Section';
import type { InfoBlock as InfoBlockType, Feature } from '@/types';

export const metadata = createMetadata({
  title: 'Hakkımızda',
  description: 'almanya101 platformu hakkında bilgi. Misyonumuz, vizyonumuz ve değerlerimiz.',
  path: '/hakkimizda',
});

export default function HakkimizdaPage() {
  const infoBlocks: InfoBlockType[] = [
    {
      id: 'misyon',
      title: 'Misyonumuz',
      icon: '🎯',
      items: [
        'Almanya\'da yaşayan Türklerin yaşamlarını kolaylaştırmak',
        'Doğru ve güncel bilgileri sağlamak',
        'Topluluk bilinci oluşturmak',
        'Birbirimizi desteklemeyi teşvik etmek',
      ],
    },
    {
      id: 'vizyon',
      title: 'Vizyonumuz',
      icon: '🌟',
      items: [
        'Türk topluluğunun en güvenilir bilgi kaynağı olmak',
        'Almanya ile Türkiye arasında köprü olmak',
        'Herkesin eşit şartlarda fırsatlara erişmesini sağlamak',
        'Kapsayıcı bir topluluk oluşturmak',
      ],
    },
  ];

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
    <>
      <HeroSection
        title="Hakkımızda"
        description="almanya101 hakkında bilgi edinin. Biz kimiz, ne yapıyoruz ve neden yapıyoruz?"
        centered={false}
        className="bg-google-blue"
      />

      <Section contained>
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Biz Kimiz?</h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            almanya101, Almanya'da yaşayan veya taşınmayı planlayan Türkler için oluşturulmuş kapsamlı bir bilgi ve topluluk platformudur.
            Amacımız, Almanya'daki Türk topluluğunun yaşamlarını kolaylaştırmak ve onları birbirleriyle birleştirmektir.
          </p>
        </div>

        <InfoGrid blocks={infoBlocks} columns={2} />
      </Section>

      {/* Ekip Üyeleri */}
      <Section contained className="bg-gray-50 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ekibimiz</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            almanya101'i birlikte büyüten, bilgi ve deneyimlerini paylaşan ekibimizle tanışın.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Şahincan Özbakır */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-google-blue mb-6 shadow-md">
                <img
                  src="/images/sahin-profil.jpeg"
                  alt="Şahincan Özbakır"
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Şahincan Özbakır</h3>
              <p className="text-google-blue font-medium mb-4">Kurucu & Yazılım Geliştirici</p>
              <div className="text-gray-600 text-left space-y-3 text-sm leading-relaxed">
                <p>
                  1994 İstanbul doğumluyum. Aslen turizm profesyoneli olarak başladığım kariyerime,
                  2021 tarihinden beri yazılım geliştirme alanında çalışıyorum.
                </p>
                <p>
                  2022 yılından beri Almanya Magdeburg'ta eşim ve 2 kızımla birlikte yaşıyorum.
                </p>
                <p>
                  İşkolik bir insanım ve yeni bir şeyler öğretip öğrenmeyi çok seviyorum.
                  Turizm sektöründe iken aldığım pedagojik formasyonum hayatıma çok büyük bir vizyon kattı.
                </p>
                <p>
                  Gereksiz angarya işleri sevmediğim için, her işin önce SWOT analizini yapar ve kolay yollarını ararım.
                  Zorsa da kolaylaştırırım 😊 Oyun oynamayı ve gitar çalmayı severim.
                </p>
                <p>
                  Genelde ulaşılabilir biriyimdir ve yukardan bakma gibi saçma egolarım yoktur.
                  Her zaman ulaşabilirsiniz.
                </p>
                <p className="text-google-green font-medium">
                  2026 yılında almanya101 ailesine katıldım ve UBT ile bir şeyler yapmaya uğraşıyoruz.
                </p>
              </div>
            </div>
          </div>

          {/* İkinci Ekip Üyesi - Placeholder */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow duration-300">
            <div className="p-8 flex flex-col items-center text-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-google-green mb-6 shadow-md bg-gray-100 flex items-center justify-center">
                <span className="text-5xl">👤</span>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ekibimizden</h3>
              <p className="text-google-green font-medium mb-4">Pozisyon</p>
              <div className="text-gray-500 text-center space-y-3 text-sm leading-relaxed">
                <p>Yakında ekip üyemiz hakkında detaylı bilgi burada yer alacak.</p>
                <p className="italic">Birlikte büyümeye, paylaşmaya ve destek olmaya devam ediyoruz.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-google-blue font-medium text-lg">
            Gelin beraber büyümeye devam edelim. Paylaşalım, eğitelim, destek olalım. 🤝
          </p>
        </div>
      </Section>

      <Section contained>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Değerlerimiz</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Her şeyi yaparken bu değerleri dikkate alıyoruz.
          </p>
        </div>
        <FeatureGrid features={features} columns={4} />
      </Section>

      <Section contained>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Bize Katılın</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Eğer bizimle çalışmak, içerik üretmek veya diğer şekillerde katkıda bulunmak istiyorsanız, bizimle iletişime geçin.
          </p>
          <a
            href="/iletisim"
            className="inline-flex items-center justify-center px-6 py-3 text-base font-medium text-white bg-google-blue rounded-md hover:bg-blue-600 transition-colors"
          >
            İletişime Geçin
          </a>
        </div>
      </Section>
    </>
  );
}
