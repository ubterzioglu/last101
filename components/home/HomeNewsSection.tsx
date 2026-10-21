import { NewsCarousel } from '@/components/sections/NewsCarousel';
import type { NewsCarouselItem } from '@/components/sections/NewsCarousel';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Section } from '@/components/ui/Section';

interface HomeNewsSectionProps {
  items: NewsCarouselItem[];
}

/** Full-bleed band with the latest published news. */
export function HomeNewsSection({ items }: HomeNewsSectionProps) {
  return (
    <Section tone="band" aria-labelledby="home-news-title">
      <SectionHeader
        id="home-news-title"
        eyebrow="Gündem"
        title="Almanya Haberleri Neleri Takip Etmeli?"
        link={{ href: '/haberler', label: 'Tüm haberler' }}
        className="mb-10"
      />
      <NewsCarousel items={items} />
    </Section>
  );
}
