import { createMetadata } from '@/lib/seo/metadata';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { CTASection } from '@/components/sections/CTASection';
import { Section } from '@/components/ui/Section';
import type { Feature } from '@/types';

export const metadata = createMetadata({
  title: 'Topluluk',
  description: 'Almanya\'da yaşayan Türkler için topluluk platformu. Sorular sorun, cevaplar verin, deneyim paylaşın.',
  path: '/topluluk',
});

export default function ToplulukPage() {
  const features: Feature[] = [
    {
      id: '1',
      title: 'Sorularınızı Sorun',
      description: 'Almanya ile ilgili her türlü soruyu sorun. Deneyimli kullanıcılardan cevap alın.',
      icon: '❓',
    },
    {
      id: '2',
      title: 'Deneyimlerinizi Paylaşın',
      description: 'Kendi deneyimlerinizi paylaşın. Başkalarına yardım edin ve topluluğa katkı sağlayın.',
      icon: '💬',
    },
    {
      id: '3',
      title: 'Dostluklar Kurun',
      description: 'Almanya\'daki diğer Türklerle tanışın. Yeni dostluklar ve network kurun.',
      icon: '🤝',
    },
    {
      id: '4',
      title: 'Etkinliklere Katılın',
      description: 'Çevrim içi ve çevrim dışı etkinliklere katılın. Yeni insanlarla tanışın.',
      icon: '🎉',
    },
  ];

  return (
    <>
      <HeroSection
        title="Topluluğumuza Katılın"
        description="Binlerce Türk Almanya'da yaşadığı deneyimleri paylaşmaya hazır. Sorular sorun, cevaplar verin, dostluklar kurun."
        centered={false}
      />

      <Section contained>
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Topluluk Özellikleri</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Sizin için neler yapabileceğimizi keşfedin.
          </p>
        </div>
        <FeatureGrid features={features} columns={4} />
      </Section>

      <Section contained>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Yakında!</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-6">
            Topluluk platformu şu anda geliştirme aşamasında. Yakında tamamlanacak ve size daha iyi bir deneyim sunacak.
          </p>
          <div className="flex items-center justify-center gap-2 text-google-blue">
            <span className="w-3 h-3 bg-google-blue rounded-full animate-pulse"></span>
            <span className="font-medium">Geliştiriliyor</span>
          </div>
        </div>
      </Section>

      <CTASection
        title="Hemen Kayıt Olun"
        description="Platform yayına girdiğinde ilk bilgilendirilen siz olun. Bültenimize kayıt olun."
        primaryAction={{ label: 'Bültenimize Kayıt Olun', href: '/iletisim' }}
        secondaryAction={{ label: 'Daha Fazla Bilgi', href: '/hakkimizda' }}
        variant="blue"
      />
    </>
  );
}
