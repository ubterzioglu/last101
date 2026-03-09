import { createMetadata } from '@/lib/seo/metadata';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { ArticleGrid } from '@/components/sections/ArticleCard';
import { CTASection } from '@/components/sections/CTASection';
import { Section } from '@/components/ui/Section';
import type { Feature, Article } from '@/types';

export const metadata = createMetadata({
  title: 'Ana Sayfa',
  description: "Almanya'da yaşayan veya taşınmayı planlayan Türkler için kapsamlı bilgi rehberi, iş ilanları ve topluluk platformu.",
  path: '/',
});

export default function HomePage() {
  const features: Feature[] = [
    {
      id: '1',
      title: 'Yaşam Rehberi',
      description: 'Almanya\'da yaşamla ilgili tüm bilgileri tek yerden bulun. İkamet, sağlık, dil ve daha fazlası.',
      icon: '🏠',
    },
    {
      id: '2',
      title: 'İş İlanları',
      description: 'Türk iş verenler ve Türk dostu şirketlerin iş ilanlarını keşfedin.',
      icon: '💼',
    },
    {
      id: '3',
      title: 'Kapsamlı Rehberler',
      description: 'Her konuda detaylı rehberler ve makaleler. Uzmanlardan ipuçları.',
      icon: '📚',
    },
    {
      id: '4',
      title: 'Topluluk',
      description: 'Diğer Türklerle tanışın, deneyimlerinizi paylaşın ve destek alın.',
      icon: '👥',
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

  return (
    <>
      <HeroSection
        title="almanya101'e hoş geldin!"
        description="yalnız değilsin! almanya101 seninle!"
        primaryAction={{ label: 'Hemen Başlayın', href: '/almanyada-yasam' }}
        secondaryAction={{ label: 'Topluluğa Katılın', href: '/topluluk' }}
        backgroundImage="/images/hero-background.jpg"
        overlay
      />

      <div className="bg-google-yellow">
        <Section contained>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Neden Almanya101?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Sizin için her şeyi tek yerde topladık. Yaşam, iş, eğitim ve topluluk.
            </p>
          </div>
          <FeatureGrid features={features} columns={4} />
        </Section>

        <Section contained>
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Popüler Rehberler</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              En çok okunan rehberler ve makaleler.
            </p>
          </div>
          <ArticleGrid articles={articles} columns={3} />
          <div className="text-center mt-8">
            <a
              href="/rehber"
              className="text-google-blue hover:text-blue-700 font-medium transition-colors"
            >
              Tüm Rehberleri Gör →
            </a>
          </div>
        </Section>

        <CTASection
          title="Topluluğumuza Katılın"
          description="Binlerce Türk Almanya'da yaşadığı deneyimleri paylaşmaya hazır. Sorular sorun, cevaplar verin, dostluklar kurun."
          primaryAction={{ label: 'Hemen Kayıt Olun', href: '/topluluk' }}
          secondaryAction={{ label: 'Daha Fazla Bilgi', href: '/topluluk' }}
          variant="yellow"
        />
      </div>
    </>
  );
}
