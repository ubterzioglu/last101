import { NewsCarousel } from '@/components/sections/NewsCarousel';
import type { NewsCarouselItem } from '@/components/sections/NewsCarousel';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Section } from '@/components/ui/Section';
import { areHomeNewsArchived } from '@/lib/news/home-news-status';

interface HomeNewsSectionProps {
  items: Array<NewsCarouselItem & { publishedAt: string }>;
}

/** Full-bleed band with the latest published news; relabelled as an archive once the news is stale. */
export function HomeNewsSection({ items }: HomeNewsSectionProps) {
  const newsAreArchived = areHomeNewsArchived(items);

  return (
    <Section tone="band" aria-labelledby="home-news-title">
      <SectionHeader
        id="home-news-title"
        eyebrow="Gündem"
        title={newsAreArchived ? 'Haber Arşivi' : 'Almanya Haberleri Neleri Takip Etmeli?'}
        description={
          newsAreArchived
            ? 'Bu bölümdeki haberler geçmiş dönemlere aittir. Yayın tarihlerini kartlarda görebilirsiniz.'
            : undefined
        }
        link={{ href: '/haberler', label: 'Tüm haberler' }}
        className="mb-10"
      />
      <NewsCarousel items={items} />
    </Section>
  );
}
