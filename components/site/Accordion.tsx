import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { TONE_STYLES, toneAt } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';

export interface AccordionItem {
  /** Optional element id for deep links such as `#soru-1`. */
  id?: string;
  title: ReactNode;
  content: ReactNode;
}

export interface AccordionProps {
  /** Shared `<details name>`: the browser keeps only one item of the group open. */
  name: string;
  items: AccordionItem[];
  /** Colour each title (and a small dot) with the firmascope tone rotation. */
  toneCycle?: boolean;
  defaultOpenIndex?: number;
  className?: string;
  itemClassName?: string;
}

/**
 * Hairline accordion on native `<details>`/`<summary>`: works without client
 * JS, toggles with Enter/Space, and stays single-open through the shared name.
 */
export function Accordion({
  name,
  items,
  toneCycle = false,
  defaultOpenIndex,
  className,
  itemClassName,
}: AccordionProps) {
  return (
    <div className={cn('divide-y divide-line border-y border-line', className)}>
      {items.map((item, index) => {
        const tone = toneCycle ? TONE_STYLES[toneAt(index)] : null;

        return (
          <details
            key={item.id ?? index}
            id={item.id}
            name={name}
            open={index === defaultOpenIndex}
            className={cn('group', itemClassName)}
          >
            <summary className="group/summary flex min-h-[44px] cursor-pointer list-none items-center justify-between gap-4 py-5 text-left [&::-webkit-details-marker]:hidden">
              <span
                className={cn(
                  'flex min-w-0 items-start gap-3 text-[17px] font-bold leading-snug transition-colors',
                  tone ? tone.text : 'text-ink group-hover/summary:text-brand-700'
                )}
              >
                {tone ? (
                  <span
                    aria-hidden="true"
                    className={cn('mt-[0.45em] h-2 w-2 shrink-0 rounded-full', tone.solid)}
                  />
                ) : null}
                <span className="min-w-0 break-words">{item.title}</span>
              </span>
              <ChevronDown
                aria-hidden="true"
                className="h-5 w-5 shrink-0 text-muted transition-colors group-open:rotate-180 group-hover/summary:text-ink"
              />
            </summary>
            <div className={cn('pb-5 leading-relaxed text-muted', tone && 'pl-5')}>
              {item.content}
            </div>
          </details>
        );
      })}
    </div>
  );
}
