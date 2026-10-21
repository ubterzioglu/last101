import { ClipboardList, HeartPulse, Languages, MapPin, type LucideIcon } from 'lucide-react';
import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { Chip } from '@/components/site/Chip';
import { PageHead } from '@/components/site/PageHead';
import { PhotoCard } from '@/components/site/PhotoCard';
import { SectionHeader } from '@/components/site/SectionHeader';
import { TONE_STYLES, toneAt } from '@/components/site/tones';
import { Section } from '@/components/ui/Section';
import type { Article } from '@/types';
import { SITE_URL } from '@/lib/utils/constants';
import { cn } from '@/lib/utils/cn';

export const metadata = createMetadata({
  title: 'Almanya\'da Yaşam',
  description: 'Almanya\'da yaşamla ilgili kapsamlı bilgi rehberi. İkamet izni, sağlık sigortası, dil öğrenimi ve daha fazlası.',
  path: '/almanyada-yasam',
});

interface InfoTopic {
  id: string;
  title: string;
  icon: LucideIcon;
  items: string[];
}

const INFO_TOPICS: InfoTopic[] = [
  {
    id: 'ikamet',
    title: 'İkamet İzni',
    icon: ClipboardList,
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
    icon: HeartPulse,
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
    icon: Languages,
    items: [
      'Almanca Kursları',
      'Integration Kursu',
      'Online Dil Öğrenimi',
      'B1/B2 Sınav Hazırlığı',
      'Dil Okulları',
    ],
  },
];

const ARTICLES: Article[] = [
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

function InfoTopics() {
  return (
    <ul className="grid grid-cols-1 border-y border-line md:grid-cols-3">
      {INFO_TOPICS.map(({ id, title, icon: Icon, items }, index) => {
        const tone = TONE_STYLES[toneAt(index)];
        return (
          <li
            key={id}
            className={cn('px-[18px] py-6', index > 0 && 'border-t border-line md:border-l md:border-t-0')}
          >
            <span aria-hidden="true" className={cn('flex h-10 w-10 items-center justify-center rounded-tile', tone.tint, tone.text)}>
              <Icon className="h-5 w-5" strokeWidth={1.75} />
            </span>
            <h3 className="mt-4 text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink">{title}</h3>
            <ul className="mt-3 space-y-2">
              {items.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-muted">
                  <span aria-hidden="true" className={cn('mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full', tone.solid)} />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </li>
        );
      })}
    </ul>
  );
}

function ArticleCards() {
  return (
    <ul className="grid grid-cols-1 gap-[22px] md:grid-cols-2 lg:grid-cols-3">
      {ARTICLES.map((article, index) => (
        <li key={article.id}>
          <article className="flex h-full flex-col rounded-card border border-line bg-white p-5">
            <Chip tone={toneAt(index)} className="mb-3 w-fit">
              {article.category}
            </Chip>
            <h3 className="line-clamp-2 text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink">
              {article.title}
            </h3>
            <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-muted">{article.excerpt}</p>
            <div className="mt-auto pt-4">
              <div className="flex items-center justify-between border-t border-line pt-4 text-sm text-muted">
                <span>{article.date}</span>
                <span>{article.readTime} okuma</span>
              </div>
            </div>
          </article>
        </li>
      ))}
    </ul>
  );
}

export default function AlmanyaYasamPage() {
  const pageUrl = new URL('/almanyada-yasam', SITE_URL).toString();

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

      <PageHead
        breadcrumb={[{ label: 'Ana Sayfa', href: '/' }, { label: "Almanya'da Yaşam" }]}
        title="Almanya'da Yaşam Rehberi"
        description="Almanya'da yeni bir hayat kurmak isteyenler için kapsamlı rehber. Resmi işlemler, yaşam koşulları ve daha fazlası."
        media={
          <PhotoCard
            src="/images/site/berlin-brandenburger-tor.webp"
            alt="Berlin'de Brandenburg Kapısı"
            chip={{ label: 'Berlin', icon: MapPin }}
            priority
          />
        }
      />

      <Section aria-labelledby="yasam-temel-bilgiler">
        <SectionHeader
          id="yasam-temel-bilgiler"
          title="Temel Bilgiler"
          description="Almanya'da yaşamla ilgili en önemli konular hakkında hızlı ve güvenilir bilgiler."
          className="mb-10"
        />
        <InfoTopics />
      </Section>

      <Section tone="band" aria-labelledby="yasam-ilgili-yazilar">
        <SectionHeader
          id="yasam-ilgili-yazilar"
          title="İlgili Yazılar"
          description="Bu konu hakkında daha fazla bilgi edinmek için rehberlerimizi okuyun."
          link={{ href: '/rehber', label: 'Tüm Rehberleri Gör' }}
          className="mb-10"
        />
        <ArticleCards />
      </Section>
    </>
  );
}
