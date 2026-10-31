import Image from 'next/image';
import Link from 'next/link';

/** Fields the card needs; `PublicCornerAuthor` and `SITE_AUTHOR`-based data both fit. */
export interface AuthorCardData {
  slug: string;
  displayName: string;
  /** Author profile path, e.g. /blog/yazar/ayse. */
  href: string;
  /** Without an avatar a neutral initial badge is shown. */
  avatarImageUrl?: string;
  shortBio?: string;
}

/** Yazar card: avatar, name (stretched link to the profile), handle and short bio. */
export function AuthorCard({ author }: { author: AuthorCardData }) {
  return (
    <article className="group relative flex flex-col items-center rounded-card border border-line bg-white p-5 text-center transition-colors hover:border-ink/30">
      <div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border border-line bg-band text-2xl font-extrabold text-ink">
        {author.avatarImageUrl ? (
          <Image src={author.avatarImageUrl} alt="" fill sizes="80px" className="object-cover" />
        ) : (
          <span aria-hidden="true">{author.displayName.trim().charAt(0).toLocaleUpperCase('tr-TR')}</span>
        )}
      </div>
      <h3 className="mt-4 break-words text-[17px] font-extrabold leading-snug tracking-[-0.02em] text-ink">
        <Link
          href={author.href}
          className="transition-colors after:absolute after:inset-0 after:rounded-card group-hover:text-brand-700"
        >
          {author.displayName}
        </Link>
      </h3>
      <div className="mt-1 break-all text-xs text-muted">@{author.slug}</div>
      {author.shortBio ? (
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-muted">{author.shortBio}</p>
      ) : null}
    </article>
  );
}
