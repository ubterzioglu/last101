import Image from 'next/image';
import Link from 'next/link';
import { SITE_AUTHOR, SITE_AUTHOR_SHORT_BIO } from '@/lib/authors';
import type { ArticleAuthorKind } from '@/lib/authors';

/** Publishing principles live on the about page. */
const PUBLISHING_POLICY_HREF = '/hakkimizda';

interface AuthorBoxProps {
  name: string;
  /** Author profile path, e.g. /blog/yazar/almanya101. */
  href: string;
  /** Without an avatar a neutral initial badge is shown. */
  avatarImageUrl?: string;
  bio?: string;
  /**
   * 'Organization' renders the editorial (corporate) variant: site logo avatar,
   * the short editorial bio and a "Yayın ilkeleri" link. Default 'Person'.
   */
  kind?: ArticleAuthorKind;
}

export function AuthorBox({ name, href, avatarImageUrl, bio, kind = 'Person' }: AuthorBoxProps) {
  const isOrganization = kind === 'Organization';
  const avatar = avatarImageUrl ?? (isOrganization ? SITE_AUTHOR.avatarUrl : undefined);
  const resolvedBio = bio ?? (isOrganization ? SITE_AUTHOR_SHORT_BIO : undefined);

  return (
    <section aria-label="Yazar hakkında" className="flex gap-4 rounded-card border border-line bg-white p-5">
      <div className="relative flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-full border border-line bg-band text-lg font-extrabold text-ink">
        {avatar ? (
          <Image src={avatar} alt="" fill sizes="56px" className="object-cover" />
        ) : (
          <span aria-hidden="true">{name.trim().charAt(0).toLocaleUpperCase('tr-TR')}</span>
        )}
      </div>
      <div className="min-w-0">
        <p className="text-[13px] font-bold uppercase tracking-[0.13em] text-muted">Yazar</p>
        <Link
          href={href}
          rel="author"
          className="mt-1 block break-words text-[17px] font-extrabold leading-snug tracking-[-0.02em] text-ink transition-colors hover:text-brand-700 motion-reduce:transition-none"
        >
          {name}
        </Link>
        {resolvedBio ? <p className="mt-2 text-sm leading-relaxed text-muted">{resolvedBio}</p> : null}
        {isOrganization ? (
          <Link
            href={PUBLISHING_POLICY_HREF}
            className="mt-3 inline-block text-sm font-semibold text-brand-700 underline-offset-4 hover:underline"
          >
            Yayın ilkeleri
          </Link>
        ) : null}
      </div>
    </section>
  );
}
