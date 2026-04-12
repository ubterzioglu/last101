import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { HeroSection } from '@/components/sections/HeroSection';
import { InfoGrid } from '@/components/sections/InfoBlock';
import { ArticleGrid } from '@/components/sections/ArticleCard';
import { Section } from '@/components/ui/Section';
import type { InfoBlock as InfoBlockType, Article } from '@/types';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Almanya\'da Yaşam',
  description: 'Almanya\'da yaşamla ilgili kapsamlı bilgi rehberi. İkamet izni, sağlık sigortası, dil öğrenimi ve daha fazlası.',
  path: '/almanyada-yasam',
});

export default function AlmanyaYasamPage() {
  const pageUrl = new URL('/almanyada-yasam', SITE_URL).toString();
  const infoBlocks: InfoBlockType[] = [
    {
      id: 'ikamet',
      title: 'İkamet İzni',
      icon: '📋',
      items: [
        'Dönüş İzni (Daueraufenthaltstitel)',
        'Geçici İkamet İzni',
        'Avrupa Mavi Kart',
        'Aile Birleşimi Vizesi',
        'Öğrenci Vizesi',
      ],
    },
    {
      id: 'saglik',
      title: 'Sağlık Sigortası',
      icon: '🏥',
      items: [
        'Zorunlu Sağlık Sigortası',
        'Yasal Sağlık Sigortaları',
        'Özel Sağlık Sigortaları',
        'Sigorta Karşılaştırması',
        'Aile Sigortası',
      ],
    },
    {
      id: 'dil',
      title: 'Dil Öğrenimi',
      icon: '🗣️',
      items: [
        'Almanca Kursları',
        'Integration Kursu',
        'Online Dil Öğrenimi',
        'B1/B2 Sınav Hazırlığı',
        'Dil Okulları',
      ],
    },
  ];

  const articles: Article[] = [
    {
      id: '1',
      title: 'Almanya\'da Konut Kiralama Rehberi',
      excerpt: 'Kiracı hakları, sözleşme koşulları, depozito ve taşınma süreci hakkında bilmeniz gerekenler.',
      category: 'Konut',
      date: '14 Ocak 2025',
      readTime: '10 dk',
    },
    {
      id: '2',
      title: 'Almanya\'da Banka Hesabı Açmak',
      excerpt: 'Gerekli belgeler, hesap türleri, online bankacılık ve önerilen bankalar.',
      category: 'Finans',
      date: '11 Ocak 2025',
      readTime: '7 dk',
    },
    {
      id: '3',
      title: 'Almanya\'da Eğitim Sistemi',
      excerpt: 'Okul sistemi, üniversite başvuruları, burslar ve eğitim olanakları.',
      category: 'Eğitim',
      date: '8 Ocak 2025',
      readTime: '15 dk',
    },
  ];

  return (
    <>
      <WebPageJsonLd
        title="Almanya'da Yaşam"
        description="Almanya'da yaşamla ilgili kapsamlı bilgi rehberi. İkamet izni, sağlık sigortası, dil öğrenimi ve daha fazlası."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: "Almanya'da Yaşam", url: pageUrl },
        ]}
      />

      <HeroSection
        title="Almanya'da Yaşam Rehberi"
        description="Almanya'da yeni bir hayat kurmak isteyenler için kapsamlı rehber. Resmi işlemler, yaşam koşulları ve daha fazlası."
        centered={false}
        className="bg-google-blue"
      />

      <Section contained>
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Temel Bilgiler</h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Almanya'da yaşamla ilgili en önemli konular hakkında hızlı ve güvenilir bilgiler.
          </p>
        </div>
        <InfoGrid blocks={infoBlocks} columns={3} />
      </Section>

      <Section contained>
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">İlgili Yazılar</h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Bu konu hakkında daha fazla bilgi edinmek için rehberlerimizi okuyun.
          </p>
        </div>
        <ArticleGrid articles={articles} columns={3} />
        <div className="text-center mt-8">
          <Link
            href="/rehber"
            className="text-google-blue hover:text-blue-700 font-medium transition-colors"
          >
            Tüm Rehberleri Gör →
          </Link>
        </div>
      </Section>
    </>
  );
}
