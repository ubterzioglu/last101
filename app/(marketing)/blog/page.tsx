import { BookOpen, MapPin, Newspaper, PenLine, type LucideIcon } from 'lucide-react';
import { createMetadata } from '@/lib/seo/metadata';
import { CtaRow } from '@/components/site/CtaRow';
import { MediaCard } from '@/components/site/MediaCard';
import { PageHead } from '@/components/site/PageHead';
import { PhotoCard } from '@/components/site/PhotoCard';
import { SectionHeader } from '@/components/site/SectionHeader';
import type { SiteTone } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

export const metadata = createMetadata({
  title: 'Blog — Yazı, Haber ve Rehber Merkezi',
  description:
    'almanya101 blog: Almanya’da yaşam, vize, iş, maaş, bankacılık ve daha fazlası üzerine yazılar, haberler ve rehberler tek bir yerde.',
  path: '/blog',
});

interface BlogHubCard {
  href: string;
  title: string;
  description: string;
  icon: LucideIcon;
  tone: SiteTone;
}

const BLOG_HUB_CARDS: BlogHubCard[] = [
  {
    href: '/yazi-dizisi',
    title: 'Arkadaşın Köşesi',
    description:
      'Almanya’da yaşayanların kişisel yazıları, deneyimleri ve samimi notları.',
    icon: PenLine,
    tone: 'yellow',
  },
  {
    href: '/haberler',
    title: 'Haberler',
    description:
      'Almanya’daki Türk topluluğunu ilgilendiren güncel haberler ve gelişmeler.',
    icon: Newspaper,
    tone: 'blue',
  },
  {
    href: '/rehber',
    title: 'Rehber',
    description:
      'Vize, oturum, iş, sağlık ve günlük hayata dair adım adım rehber içerikleri.',
    icon: BookOpen,
    tone: 'green',
  },
];

export default function BlogPage() {
  return (
    <>
      <PageHead
        title="Blog"
        description="Almanya’da yaşam üzerine yazılarımız, haberlerimiz ve rehberlerimiz. İhtiyacınız olan bilgiyi sade ve güvenilir bir şekilde tek bir yerde topladık."
        media={
          <PhotoCard
            src="/images/site/berlin-spree.webp"
            alt="Berlin'de Spree nehri kıyısı"
            chip={{ label: 'Berlin', icon: MapPin }}
            priority
          />
        }
      />

      <Section aria-labelledby="blog-ne-okumak">
        <SectionHeader
          id="blog-ne-okumak"
          title="Ne Okumak İstersin?"
          description="almanya101 içerikleri farklı köşelerde topluyor. Aşağıdan ilgilendiğin alana göz atabilirsin."
          className="mb-10"
        />
        <ul className="grid grid-cols-1 gap-[22px] md:grid-cols-3">
          {BLOG_HUB_CARDS.map((card) => (
            <li key={card.href} className="flex">
              <MediaCard
                href={card.href}
                title={card.title}
                description={card.description}
                fallback={{ icon: card.icon, tone: card.tone }}
                linkLabel="Keşfet"
                className="w-full"
              />
            </li>
          ))}
        </ul>
      </Section>

      <CtaRow
        title="Yazmak İster misin?"
        description="Almanya’daki deneyimlerini paylaşmak, yeni gelenlere yol göstermek istiyorsan blogumuzda sana da yer var."
        action={
          <Button href="/ekibimize-katil" arrow>
            Ekibimize Katıl
          </Button>
        }
      />
    </>
  );
}
