import Image from 'next/image';
import Link from 'next/link';
import type { PublicCornerAuthor } from '@/lib/corner';

/** Köşe yazarı card: avatar, name (stretched link), handle and short bio. */
export function AuthorCard({ author }: { author: PublicCornerAuthor }) {
  return (
    <article className="group relative flex flex-col items-center rounded-card border border-line bg-white p-5 text-center transition-colors hover:border-ink/30">
      <div className="relative h-20 w-20 overflow-hidden rounded-full border border-line bg-band">
        <Image src={author.avatarImageUrl} alt="" fill sizes="80px" className="object-cover" />
      </div>
      <h3 className="mt-4 break-words text-[17px] font-extrabold leading-snug tracking-[-0.02em] text-ink">
        <Link
          href={author.href}
          className="transition-colors after:absolute after:inset-0 after:rounded-card group-hover:text-brand-700"
        >
          {author.displayName}
        </Link>
      </h3>
      <div className="mt-1 break-all text-xs text-muted">/{author.slug}</div>
      {author.shortBio ? (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{author.shortBio}</p>
      ) : null}
    </article>
  );
}
