import { createMetadata } from '@/lib/seo/metadata';
import { HeroSection } from '@/components/sections/HeroSection';
import { ArticleGrid } from '@/components/sections/ArticleCard';
import { CTASection } from '@/components/sections/CTASection';
import { Section } from '@/components/ui/Section';
import type { Article } from '@/types';

export const metadata = createMetadata({
  title: 'Rehber',
  description: 'Almanya ile ilgili kapsamlı rehberler ve makaleler. Her konuda detaylı bilgiler.',
  path: '/rehber',
});

export default function RehberPage() {
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
    {
      id: '4',
      title: 'Almanya\'da Konut Kiralama Rehberi',
      excerpt: 'Kiracı hakları, sözleşme koşulları, depozito ve taşınma süreci hakkında bilmeniz gerekenler.',
      category: 'Konut',
      date: '14 Ocak 2025',
      readTime: '10 dk',
    },
    {
      id: '5',
      title: 'Almanya\'da Banka Hesabı Açmak',
      excerpt: 'Gerekli belgeler, hesap türleri, online bankacılık ve önerilen bankalar.',
      category: 'Finans',
      date: '11 Ocak 2025',
      readTime: '7 dk',
    },
    {
      id: '6',
      title: 'Almanya\'da Eğitim Sistemi',
      excerpt: 'Okul sistemi, üniversite başvuruları, burslar ve eğitim olanakları.',
      category: 'Eğitim',
      date: '8 Ocak 2025',
      readTime: '15 dk',
    },
  ];

  return (
    <>
      <HeroSection
        title="Kapsamlı Rehberler"
        description="Almanya ile ilgili her konuda detaylı rehberler ve makaleler. Uzmanlardan güvenilir bilgiler."
        centered={false}
      />

      <Section contained>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tüm Rehberler</h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Kategorilere göre filtreleyin veya arayın. İhtiyacınız olan bilgiyi hızlıca bulun.
          </p>
        </div>
        <ArticleGrid articles={articles} columns={3} />
      </Section>

      <CTASection
        title="Konu Önerin"
        description="Aradığınız bir konu hakkında rehber bulamadınız mı? Bize konu önerin, uzmanlarımız hazırlasın."
        primaryAction={{ label: 'Konu Öner', href: '/iletisim' }}
        secondaryAction={{ label: 'İletişime Geçin', href: '/iletisim' }}
      />
    </>
  );
}
