import { createMetadata } from '@/lib/seo/metadata';
import { HeroSection } from '@/components/sections/HeroSection';
import { InfoGrid } from '@/components/sections/InfoBlock';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { Section } from '@/components/ui/Section';
import type { InfoBlock as InfoBlockType, Feature } from '@/types';

export const metadata = createMetadata({
  title: 'Hakkımızda',
  description: 'Almanya101 platformu hakkında bilgi. Misyonumuz, vizyonumuz ve değerlerimiz.',
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
        description="Almanya101 hakkında bilgi edinin. Biz kimiz, ne yapıyoruz ve neden yapıyoruz?"
        centered={false}
        className="bg-google-blue"
      />

      <Section contained>
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Biz Kimiz?</h2>
          <p className="text-lg text-gray-600 max-w-3xl">
            Almanya101, Almanya'da yaşayan veya taşınmayı planlayan Türkler için oluşturulmuş kapsamlı bir bilgi ve topluluk platformudur.
            Amacımız, Almanya'daki Türk topluluğunun yaşamlarını kolaylaştırmak ve onları birbirleriyle birleştirmektir.
          </p>
        </div>

        <InfoGrid blocks={infoBlocks} columns={2} />
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
