import Image from 'next/image';
import { createMetadata } from '@/lib/seo/metadata';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
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
    <>
      <Section contained className="bg-gray-50 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-16 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Biz Kimiz?</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            almanya101&apos;i birlikte büyüten, bilgi ve deneyimlerini paylaşan ekibimizle tanışın.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/images/backgrounds/berlin-skyline.jpg)' }}
            />
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 p-8 md:p-10 flex flex-col items-center text-center">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-google-yellow mb-6 shadow-lg">
                <Image
                  src="/images/profil.jpg"
                  alt="Umut Barış Terzioğlu"
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Umut Barış Terzioğlu</h2>
              <p className="text-gray-300 mb-6">Kurucu</p>

              <a
                href="https://ubterzioglu.dev"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center px-6 py-2.5 bg-google-yellow text-gray-900 font-medium rounded-md hover:bg-yellow-400 transition-colors mb-6"
              >
                Kişisel Web Sayfam
              </a>

              <div className="text-gray-200 text-sm md:text-base leading-relaxed space-y-4 text-left">
                <p>
                  Ben Umut Barış Terzioğlu. Türkiye&apos;de Barış, Almanya&apos;da Umut :) 1985 doğumluyum.
                  Aslen makine mühendisiyim; bugünlerde yazılım tarafında çalışıyorum. 2021&apos;den beri
                  eşimle ve iki kedimizle birlikte Dortmund&apos;da yaşıyorum.
                </p>
                <p>
                  Yeni şeyler öğrenmeyi, üretmeyi ve insanlara faydalı olmayı seviyorum. Teknolojiyle
                  iç içe olsam da günlük hayatta pratik, net ve işe yarayan bilgiye değer veririm.
                  Boş zamanlarımda bilgisayar oyunları, film-dizi, müzik ve seyahat iyi gelir; kafamı
                  toparlamanın en güzel yolu bazen de iki kedimizle evde sessiz bir karmaşa yaşamaktır.
                </p>
                <p>
                  Almanya&apos;da yaşamaya başladığımdan beri, günlük hayatta karşılaştığım pek çok sorunun
                  net ve dağınık olmayan bir kaynağa ihtiyaç duyduğunu fark ettim. almanya101.de tam
                  olarak bu ihtiyaçtan doğdu.
                </p>
                <p>
                  Bu platformu; Almanya&apos;ya yeni gelenlerin, gelmeyi düşünenlerin ya da burada uzun
                  süredir yaşayanların güvenilir ve sade bilgilere kolayca ulaşabilmesi için kurdum.
                  Amacım her şeyi bilen biri olmak değil; öğrenilenleri, tecrübeleri ve faydalı bilgileri
                  tek bir yerde toplamak.
                </p>
              </div>

              <p className="text-google-yellow font-medium text-sm md:text-base mt-6 text-left">
                almanya101.de yaşayan bir platform. Zamanla gelişiyor, büyüyor ve katkılarla daha da
                güçleniyor. Eğer burada birine yardımcı olabiliyorsak, doğru yoldayız demektir.
              </p>
            </div>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{ backgroundImage: 'url(/images/backgrounds/berlin-skyline.jpg)' }}
            />
            <div className="absolute inset-0 bg-black/60" />

            <div className="relative z-10 p-8 md:p-10 flex flex-col items-center text-center">
              <div className="w-36 h-36 rounded-full overflow-hidden border-4 border-google-blue mb-6 shadow-lg">
                <Image
                  src="/images/sahin-profil.jpeg"
                  alt="Şahincan Özbakır"
                  width={144}
                  height={144}
                  className="w-full h-full object-cover"
                />
              </div>

              <h2 className="text-2xl md:text-3xl font-bold text-white mb-1">Şahincan Özbakır</h2>
              <p className="text-gray-300 mb-6">Kurucu & Yazılım Geliştirici</p>

              <button
                className="inline-flex items-center justify-center px-6 py-2.5 bg-google-blue text-white font-medium rounded-md hover:bg-blue-600 transition-colors mb-6 cursor-default"
              >
                2026&apos;dan Beri Ekibimizde
              </button>

              <div className="text-gray-200 text-sm md:text-base leading-relaxed space-y-4 text-left">
                <p>
                  1994 İstanbul doğumluyum. Aslen turizm profesyoneli olarak başladığım kariyerime,
                  2021 tarihinden beri yazılım geliştirme alanında çalışıyorum.
                </p>
                <p>
                  2022 yılından beri Almanya Magdeburg&apos;ta eşim ve 2 kızımla birlikte yaşıyorum.
                </p>
                <p>
                  İşkolik bir insanım ve yeni bir şeyler öğretip öğrenmeyi çok seviyorum. Turizm
                  sektöründe iken aldığım pedagojik formasyonum hayatıma çok büyük bir vizyon kattı.
                </p>
                <p>
                  Gereksiz angarya işleri sevmediğim için, her işin önce SWOT analizini yapar ve kolay
                  yollarını ararım. Zorsa da kolaylaştırırım 🙂 Oyun oynamayı ve gitar çalmayı severim.
                </p>
                <p>
                  Genelde ulaşılabilir biriyimdir ve yukarıdan bakma gibi saçma egolarım yoktur.
                  Her zaman ulaşabilirsiniz.
                </p>
              </div>

              <p className="text-google-blue font-medium text-sm md:text-base mt-6 text-left">
                2026 yılında almanya101 ailesine katıldım ve UBT ile bir şeyler yapmaya uğraşıyoruz.
                Gelin beraber büyümeye devam edelim. Paylaşalım, eğitelim, destek olalım.
              </p>
            </div>
          </div>
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
            Eğer bizimle çalışmak, içerik üretmek veya diğer şekillerde katkıda bulunmak istiyorsanız,
            bizimle iletişime geçin.
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
