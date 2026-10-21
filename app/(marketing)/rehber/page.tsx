import { BookOpen } from 'lucide-react';
import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { EmptyState } from '@/components/news/EmptyState';
import { realCoverUrl } from '@/components/news/cover';
import { CtaRow } from '@/components/site/CtaRow';
import { MediaCard } from '@/components/site/MediaCard';
import { PageHead } from '@/components/site/PageHead';
import { PhotoCard } from '@/components/site/PhotoCard';
import { SectionHeader } from '@/components/site/SectionHeader';
import { toneAt } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { getPublishedRehberArticles } from '@/lib/rehber-articles';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Rehber',
  description: 'Almanya ile ilgili kapsamlı rehberler ve makaleler. Her konuda detaylı bilgiler.',
  path: '/rehber',
});

export const dynamic = 'force-dynamic';

export default async function RehberPage() {
  const articles = await getPublishedRehberArticles(120);
  const pageUrl = new URL('/rehber', SITE_URL).toString();
  const categoryCount = new Set(articles.map((article) => article.category)).size;

  return (
    <>
      <WebPageJsonLd
        title="Kapsamlı Rehberler"
        description="Almanya ile ilgili her konuda detaylı rehberler ve makaleler."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Rehber', url: pageUrl },
        ]}
      />

      <PageHead
        breadcrumb={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Rehber' }]}
        title="Kapsamlı Rehberler"
        description="Almanya ile ilgili her konuda detaylı rehberler ve makaleler. Uzmanlardan güvenilir bilgiler."
        stats={
          articles.length > 0
            ? [
                { value: String(articles.length), label: 'rehber' },
                { value: String(categoryCount), label: 'kategori' },
              ]
            : undefined
        }
        media={
          <PhotoCard
            src="/images/site/berlin-spree.webp"
            alt="Berlin'de Spree nehri ve şehir manzarası"
            priority
          />
        }
      />

      <Section>
        <SectionHeader
          title="Tüm Rehberler"
          description="İhtiyacınız olan bilgiyi hızlıca bulun. Rehberlerimiz düzenli olarak güncellenir."
        />
        <div className="mt-10">
          {articles.length === 0 ? (
            <EmptyState
              as="h3"
              title="Henüz yayınlanmış rehber yok."
              description="İlk rehber yayına alındığında burada görünecek."
            />
          ) : (
            <div className="grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
              {articles.map((article, index) => {
                const cover = realCoverUrl(article.coverImageUrl);

                return (
                  <MediaCard
                    key={article.id}
                    href={article.href}
                    title={article.title}
                    description={article.summary || undefined}
                    image={cover ? { src: cover, alt: article.title } : undefined}
                    fallback={{ icon: BookOpen, tone: toneAt(index) }}
                    tag={{ label: article.category }}
                    meta={`${article.dateLabel} · ${article.readingMinutes} dk okuma`}
                  />
                );
              })}
            </div>
          )}
        </div>
      </Section>

      <CtaRow
        title="Konu Önerin"
        description="Aradığınız bir konu hakkında rehber bulamadınız mı? Bize konu önerin, uzmanlarımız hazırlasın."
        action={
          <div className="flex flex-wrap gap-3">
            <Button href="/iletisim" arrow>
              Konu Öner
            </Button>
            <Button href="/iletisim" variant="outline">
              İletişime Geçin
            </Button>
          </div>
        }
      />
    </>
  );
}
