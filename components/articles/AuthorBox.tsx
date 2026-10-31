import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@/lib/utils/cn';
import { ARTICLE_TONE_CLASSES } from './articleTone';
import type { ArticleTone } from './articleTone';

interface AuthorBoxProps {
  name: string;
  href: string;
  avatarImageUrl: string;
  bio?: string;
  tone?: ArticleTone;
}

export function AuthorBox({ name, href, avatarImageUrl, bio, tone = 'dark' }: AuthorBoxProps) {
  const classes = ARTICLE_TONE_CLASSES[tone];

  return (
    <aside aria-label="Yazar hakkında" className={cn('flex gap-4 rounded-2xl border p-5 md:p-6', classes.panel)}>
      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border border-white/10">
        <Image src={avatarImageUrl} alt={name} fill unoptimized sizes="64px" className="object-cover" />
      </div>
      <div className="min-w-0">
        <p className={cn('text-xs font-semibold uppercase tracking-[0.18em]', classes.muted)}>Yazar</p>
        <Link href={href} className={cn('text-lg font-bold hover:underline', classes.title)}>
          {name}
        </Link>
        {bio ? <p className={cn('mt-2 text-sm leading-6', classes.muted)}>{bio}</p> : null}
      </div>
    </aside>
  );
}
