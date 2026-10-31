import Image from 'next/image';
import { BookOpen, PenLine } from 'lucide-react';
import { NewsListCard } from '@/components/news/NewsListCard';
import { realCoverUrl } from '@/components/news/cover';
import { ArrowLink } from '@/components/site/ArrowLink';
import { MediaCard } from '@/components/site/MediaCard';
import { PageHead } from '@/components/site/PageHead';
import { SectionHeader } from '@/components/site/SectionHeader';
import { toneAt } from '@/components/site/tones';
import { Section } from '@/components/ui/Section';
import { SITE_AUTHOR, SITE_AUTHOR_SHORT_BIO } from '@/lib/authors';
import type { SiteAuthorContent } from './siteAuthorContent';

const FALLBACK_PRINCIPLES: readonly string[] = [
  'Rehber ve haber içeriklerinde, mümkün olduğunda resmî kurumların ve ilgili kaynakların bilgileri esas alınır.',
  'İçeriklerde yayın ve güncelleme tarihleri görünür biçimde belirtilir.',
  'Yanlış veya eski bir bilgi fark edilirse iletişim sayfasından bildirilebilir; bildirimler incelenir ve gerekli düzeltmeler yapılır.',
];

type BioBlock =
  | { kind: 'heading'; text: string }
  | { kind: 'paragraph'; text: string }
  | { kind: 'list'; items: string[] };

const HEADING_MAX_LENGTH = 40;

function isHeadingLine(text: string): boolean {
  return text.length <= HEADING_MAX_LENGTH && !/[.!?:;]$/.test(text) && !text.startsWith('- ');
}

/** Splits plain-text bio content into headings, paragraphs and bullet lists. */
function parseBio(raw: string): BioBlock[] {
  return raw
    .split(/\n{2,}/)
    .map((block) => block.trim())
    .filter(Boolean)
    .map((block): BioBlock => {
      const lines = block.split('\n').map((line) => line.trim());
      if (lines.every((line) => line.startsWith('- '))) {
        return { kind: 'list', items: lines.map((line) => line.slice(2).trim()) };
      }
      if (lines.length === 1 && isHeadingLine(block)) {
        return { kind: 'heading', text: block };
      }
      return { kind: 'paragraph', text: lines.join(' ') };
    });
}

function BioBlocks({ blocks }: { blocks: BioBlock[] }) {
  return (
    <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted">
      {blocks.map((block, index) => {
        if (block.kind === 'heading') {
          return (
            <h3 key={index} className="pt-2 text-lg font-extrabold tracking-[-0.02em] text-ink">
              {block.text}
            </h3>
          );
        }
        if (block.kind === 'list') {
          return (
            <ul key={index} className="list-disc space-y-2 pl-5">
              {block.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          );
        }
        return <p key={index}>{block.text}</p>;
      })}
    </div>
  );
}

function FallbackBio() {
  return (
    <div className="max-w-3xl space-y-4 text-base leading-relaxed text-muted">
      <p>
        {SITE_AUTHOR.name}, Almanya’da yaşayan veya Almanya’ya taşınmayı düşünen Türkçe konuşan kullanıcılar için
        hazırlanan bir bilgi platformudur. Rehberleri, haberleri ve araçları editör ekibi hazırlar.
      </p>
      <h3 className="pt-2 text-lg font-extrabold tracking-[-0.02em] text-ink">Yayın ilkeleri</h3>
      <ul className="list-disc space-y-2 pl-5">
        {FALLBACK_PRINCIPLES.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ul>
      <p>İçerikler genel bilgilendirme amacı taşır; hukuki, mali veya bireysel danışmanlık yerine geçmez.</p>
    </div>
  );
}

interface SiteAuthorProfileProps {
  content: SiteAuthorContent;
}

/** Profile page of the editorial organisation author (works without a DB row). */
export function SiteAuthorProfile({ content }: SiteAuthorProfileProps) {
  const { profile, guides, news, blogPosts } = content;
  const shortBio = profile?.shortBio || SITE_AUTHOR_SHORT_BIO;
  const bioBlocks = profile?.bioContent ? parseBio(profile.bioContent) : [];
  const avatar = profile?.avatarImageUrl || SITE_AUTHOR.avatarUrl;

  return (
    <>
      <PageHead
        breadcrumb={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Blog', href: '/blog' },
          { label: SITE_AUTHOR.name },
        ]}
        eyebrow="Editör ekibi"
        title={profile?.displayName || SITE_AUTHOR.name}
        description={shortBio}
        media={
          <div className="flex flex-col items-center justify-center gap-4 rounded-card bg-band px-6 py-10">
            <div className="relative h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-white">
              {avatar ? (
                <Image
                  src={avatar}
                  alt={SITE_AUTHOR.name}
                  fill
                  priority
                  sizes="144px"
                  className="object-contain p-4"
                />
              ) : null}
            </div>
            <div className="text-sm font-semibold text-muted">Kurumsal yazar</div>
          </div>
        }
      />

      <Section aria-labelledby="yazar-yayin-ilkeleri">
        <SectionHeader
          id="yazar-yayin-ilkeleri"
          title="Hakkında ve yayın ilkeleri"
          description="İçeriklerin nasıl hazırlandığı ve düzeltme bildirimleri hakkında."
          className="mb-8"
        />
        {bioBlocks.length > 0 ? <BioBlocks blocks={bioBlocks} /> : <FallbackBio />}
        <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1">
          <ArrowLink href="/hakkimizda" tone="brand">
            Hakkımızda
          </ArrowLink>
          <ArrowLink href="/iletisim" tone="brand">
            İletişim ve düzeltme bildirimi
          </ArrowLink>
        </div>
      </Section>

      {guides.length > 0 ? (
        <Section tone="band" aria-labelledby="yazar-son-rehberler">
          <SectionHeader
            id="yazar-son-rehberler"
            title="Son rehberler"
            link={{ href: '/rehber', label: 'Tüm rehberler' }}
          />
          <ul className="mt-10 grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
            {guides.map((guide, index) => {
              const cover = realCoverUrl(guide.coverImageUrl);
              return (
                <li key={guide.id} className="flex">
                  <MediaCard
                    href={guide.href}
                    title={guide.title}
                    description={guide.summary || undefined}
                    image={cover ? { src: cover, alt: guide.title } : undefined}
                    fallback={{ icon: BookOpen, tone: toneAt(index) }}
                    meta={`${guide.category} · ${guide.dateLabel}`}
                    linkLabel="Rehberi oku"
                    className="w-full"
                  />
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}

      {news.length > 0 ? (
        <Section aria-labelledby="yazar-son-haberler">
          <SectionHeader
            id="yazar-son-haberler"
            title="Son haberler"
            link={{ href: '/haberler', label: 'Tüm haberler' }}
          />
          <ul className="mt-10 grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
            {news.map((item) => (
              <li key={item.id} className="flex">
                <NewsListCard item={item} />
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {blogPosts.length > 0 ? (
        <Section tone="band" aria-labelledby="yazar-blog-yazilari">
          <SectionHeader
            id="yazar-blog-yazilari"
            title="Blog yazıları"
            link={{ href: '/blog', label: 'Tüm yazılar' }}
          />
          <ul className="mt-10 grid gap-[22px] sm:grid-cols-2 lg:grid-cols-3">
            {blogPosts.map((post, index) => {
              const cover = realCoverUrl(post.coverImageUrl);
              return (
                <li key={post.id} className="flex">
                  <MediaCard
                    href={post.href}
                    title={post.title}
                    description={post.summary || undefined}
                    image={cover ? { src: cover, alt: post.title } : undefined}
                    fallback={{ icon: PenLine, tone: toneAt(index) }}
                    meta={`${post.dateLabel} · ${post.readingMinutes} dk okuma`}
                    linkLabel="Yazıyı oku"
                    className="w-full"
                  />
                </li>
              );
            })}
          </ul>
        </Section>
      ) : null}
    </>
  );
}
