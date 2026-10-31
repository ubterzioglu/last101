import { FileText } from 'lucide-react';
import { realCoverUrl } from '@/components/news/cover';
import { MediaCard } from '@/components/site/MediaCard';
import { SectionHeader } from '@/components/site/SectionHeader';
import { toneAt } from '@/components/site/tones';
import { Section } from '@/components/ui/Section';

export interface RelatedArticleItem {
  id: string;
  href: string;
  title: string;
  summary: string;
  coverImageUrl: string;
  dateLabel: string;
}

interface RelatedArticlesProps {
  heading: string;
  items: ReadonlyArray<RelatedArticleItem>;
  linkLabel?: string;
}

/** İlgili içerikler: bant zemin üzerinde MediaCard ızgarası. */
export function RelatedArticles({ heading, items, linkLabel }: RelatedArticlesProps) {
  if (items.length === 0) return null;

  return (
    <Section tone="band">
      <SectionHeader title={heading} />
      <div className="mt-10 grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item, index) => {
          const cover = realCoverUrl(item.coverImageUrl);
          return (
            <MediaCard
              key={item.id}
              href={item.href}
              title={item.title}
              description={item.summary || undefined}
              image={cover ? { src: cover, alt: item.title } : undefined}
              fallback={{ icon: FileText, tone: toneAt(index) }}
              meta={item.dateLabel}
              linkLabel={linkLabel}
            />
          );
        })}
      </div>
    </Section>
  );
}
