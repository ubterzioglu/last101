import { useId } from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils/cn';

export interface IntentItem {
  label: string;
  href: string;
  /** New tab; detected automatically for `http(s)` links. */
  external?: boolean;
}

export interface IntentStripProps {
  label: string;
  items: IntentItem[];
  className?: string;
}

const EXTERNAL_HREF = /^https?:\/\//i;
/** U+2060 keeps the arrow on the line of the label's last word. */
const WORD_JOINER = '⁠';

const LINK_CLASSES =
  'flex min-h-[44px] items-center py-1 text-sm text-ink transition-colors hover:text-brand-700 sm:text-[15px] lg:px-4 xl:px-6';

function IntentLink({ label, href, external }: IntentItem) {
  const content = (
    <span className="min-w-0 break-words">
      {label}
      <span className="whitespace-nowrap">
        {WORD_JOINER}
        <ArrowUpRight
          aria-hidden="true"
          className="ml-2 inline-block h-4 w-4 align-[-0.2em] text-brand-700"
        />
      </span>
    </span>
  );

  if (external ?? EXTERNAL_HREF.test(href)) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASSES}>
        {content}
      </a>
    );
  }

  return (
    <Link href={href} className={LINK_CLASSES}>
      {content}
    </Link>
  );
}

/**
 * Corteqs intent strip: full-bleed band between hairlines. Mobile shows the
 * label above a 2-column grid; desktop puts everything in one row with
 * vertical hairlines between the links. Place it outside page containers.
 */
export function IntentStrip({ label, items, className }: IntentStripProps) {
  const labelId = useId();

  return (
    <nav aria-labelledby={labelId} className={cn('border-y border-line', className)}>
      <Container>
        <div className="flex flex-col gap-2 py-5 lg:flex-row lg:items-center lg:gap-0">
          <p id={labelId} className="text-[15px] font-bold text-ink lg:shrink-0 lg:pr-8 xl:pr-12">
            {label}
          </p>
          <ul className="grid grid-cols-2 gap-x-4 lg:flex lg:flex-1">
            {items.map((item, index) => (
              <li
                key={`${index}-${item.href}`}
                // flex-auto: cells grow from their content width, like Corteqs.
                className="min-w-0 lg:flex-auto lg:border-l lg:border-line"
              >
                <IntentLink {...item} />
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </nav>
  );
}
