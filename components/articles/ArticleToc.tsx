import { extractHeadings } from '@/lib/articles/headings';
import { cn } from '@/lib/utils/cn';
import { ARTICLE_TONE_CLASSES } from './articleTone';
import type { ArticleTone } from './articleTone';

interface ArticleTocProps {
  content: string;
  tone?: ArticleTone;
}

const MIN_HEADINGS = 3;

export function ArticleToc({ content, tone = 'dark' }: ArticleTocProps) {
  const headings = extractHeadings(content);
  if (headings.length < MIN_HEADINGS) return null;

  const classes = ARTICLE_TONE_CLASSES[tone];

  return (
    <nav aria-label="İçindekiler" className={cn('rounded-2xl border p-5 md:p-6', classes.panel)}>
      <p className={cn('text-sm font-semibold uppercase tracking-[0.18em]', classes.muted)}>İçindekiler</p>
      <ol className="mt-3 space-y-2 text-base">
        {headings.map((heading) => (
          <li key={heading.id} className={cn(heading.level === 3 && 'pl-5 text-[0.95em]')}>
            <a href={`#${heading.id}`} className={cn('transition', classes.link)}>
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
