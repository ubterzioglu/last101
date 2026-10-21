import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { ArrowLink } from '@/components/site/ArrowLink';
import { Eyebrow } from '@/components/site/Eyebrow';
import { WhatsAppShareButton } from '@/components/news/WhatsAppShareButton';

export interface AsideSource {
  name: string;
  dateLabel: string;
  url?: string;
}

const OUTLINE_LINK_CLASSES =
  'inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-btn border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-ink motion-reduce:transition-none';

/** Share card: optional source facts, WhatsApp share and the original source link. */
export function AsideShareCard({ shareText, source }: { shareText: string; source?: AsideSource }) {
  return (
    <div className="rounded-card border border-line bg-white p-5">
      {source ? (
        <dl className="mb-5 grid grid-cols-2 gap-4 border-b border-line pb-5 text-sm">
          <div className="min-w-0">
            <dt className="text-muted">Kaynak</dt>
            <dd className="mt-1 break-words font-semibold text-ink">{source.name}</dd>
          </div>
          <div className="min-w-0">
            <dt className="text-muted">Kaynak Tarihi</dt>
            <dd className="mt-1 font-semibold text-ink">{source.dateLabel}</dd>
          </div>
        </dl>
      ) : null}
      <div className="flex flex-col gap-3">
        <WhatsAppShareButton text={shareText} className="w-full" />
        {source?.url ? (
          <a href={source.url} target="_blank" rel="noopener noreferrer" className={OUTLINE_LINK_CLASSES}>
            Kaynak bağlantısını aç
            <ArrowUpRight aria-hidden="true" size={16} className="shrink-0" />
          </a>
        ) : null}
      </div>
    </div>
  );
}

export interface AsideLink {
  href: string;
  label: string;
}

/** Compact hairline list of related internal links. */
export function AsideLinkList({ links }: { links: AsideLink[] }) {
  if (links.length === 0) return null;

  return (
    <ul className="divide-y divide-line border-y border-line">
      {links.map((link) => (
        <li key={link.href}>
          <Link
            href={link.href}
            className="flex min-h-[48px] items-center justify-between gap-3 py-3 text-sm font-semibold text-ink transition-colors hover:text-brand-700 motion-reduce:transition-none"
          >
            <span className="min-w-0 break-words">{link.label}</span>
            <ArrowUpRight aria-hidden="true" size={16} className="shrink-0" />
          </Link>
        </li>
      ))}
    </ul>
  );
}

/** Community invite on the band surface (same copy as the site navigation). */
export function AsideCommunityCard() {
  return (
    <div className="rounded-card bg-band p-5">
      <Eyebrow>Topluluk</Eyebrow>
      <p className="mt-3 text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink">
        Türk topluluğuna dahil olun.
      </p>
      <ArrowLink href="/topluluk" className="mt-1">
        Topluluğa Katıl
      </ArrowLink>
    </div>
  );
}
