import { extractHeadings } from '@/lib/articles/headings';
import { cn } from '@/lib/utils/cn';

interface ArticleTocProps {
  content: string;
  className?: string;
}

const MIN_HEADINGS = 3;

/** İçindekiler: H2/H3 başlıklarına bağlantılar; üçten az başlık varsa gösterilmez. */
export function ArticleToc({ content, className }: ArticleTocProps) {
  const headings = extractHeadings(content);
  if (headings.length < MIN_HEADINGS) return null;

  return (
    <nav aria-label="İçindekiler" className={cn('rounded-card border border-line bg-band p-5 md:p-6', className)}>
      <p className="text-[13px] font-bold uppercase tracking-[0.13em] text-muted">İçindekiler</p>
      <ol className="mt-3 space-y-1 text-base">
        {headings.map((heading) => (
          <li key={heading.id} className={cn(heading.level === 3 && 'pl-5 text-[0.95em]')}>
            <a
              href={`#${heading.id}`}
              className="inline-flex min-h-[32px] items-center font-medium text-ink transition-colors hover:text-brand-700 motion-reduce:transition-none"
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
