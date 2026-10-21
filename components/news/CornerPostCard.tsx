import Image from 'next/image';
import { PenLine } from 'lucide-react';
import { MediaCard } from '@/components/site/MediaCard';
import { toneAt } from '@/components/site/tones';
import { realCoverUrl } from '@/components/news/cover';
import type { PublicCornerPost } from '@/lib/corner';

const DEFAULT_AVATAR = '/images/profil.jpg';

interface CornerPostCardProps {
  post: PublicCornerPost;
  /** Position in the grid; picks the fallback tile colour. */
  index: number;
  /** Show the author avatar and name (hub page); the author page shows reading time instead. */
  showAuthor?: boolean;
}

function AuthorMeta({ post }: { post: PublicCornerPost }) {
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative h-6 w-6 shrink-0 overflow-hidden rounded-full border border-line bg-band">
        <Image src={post.authorAvatarImageUrl || DEFAULT_AVATAR} alt="" fill sizes="24px" className="object-cover" />
      </span>
      <span>
        {post.authorName || 'Yazar'} · {post.dateLabel}
      </span>
    </span>
  );
}

/** Arkadaşın Köşesi post as a Corteqs photo-top card. */
export function CornerPostCard({ post, index, showAuthor = false }: CornerPostCardProps) {
  const cover = realCoverUrl(post.coverImageUrl);

  return (
    <MediaCard
      href={post.href}
      title={post.title}
      description={post.summary || undefined}
      image={cover ? { src: cover, alt: post.title } : undefined}
      fallback={{ icon: PenLine, tone: toneAt(index) }}
      meta={showAuthor ? <AuthorMeta post={post} /> : `${post.dateLabel} · ${post.readingMinutes} dk okuma`}
      linkLabel="Yazıyı oku"
    />
  );
}
