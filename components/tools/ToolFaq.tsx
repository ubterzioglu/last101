import type { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { TONE_STYLES, toneAt } from '@/components/site/tones';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils/cn';

interface ToolFaqItem {
  question: string;
  answer: ReactNode;
}

interface ToolFaqProps {
  items: ToolFaqItem[];
  /** Defaults to 'Sıkça Sorulan Sorular'. */
  title?: string;
  /** Shared `<details name>` so only one answer is open at a time. */
  name: string;
}

/** FAQ section (visual only; FAQ JSON-LD stays in the page scaffold). */
export function ToolFaq({ items, title = 'Sıkça Sorulan Sorular', name }: ToolFaqProps) {
  if (items.length === 0) {
    return null;
  }

  const headingId = `${name}-baslik`;

  return (
    <section className="py-16" aria-labelledby={headingId}>
      <Container>
        <div className="text-[13px] font-bold uppercase tracking-[0.13em] text-brand-700">SSS</div>
        <h2
          id={headingId}
          className="mt-3 text-[clamp(2rem,3.5vw,2.8rem)] font-extrabold leading-[1.12] tracking-[-0.04em] text-ink"
        >
          {title}
        </h2>
        <div className="mt-8 divide-y divide-line border-y border-line">
          {items.map((item, index) => {
            const tone = TONE_STYLES[toneAt(index)];
            return (
              <details key={item.question} name={name} className="group">
                <summary className="flex cursor-pointer list-none items-center gap-3 py-5 [&::-webkit-details-marker]:hidden">
                  <span className={cn('h-2 w-2 shrink-0 rounded-full', tone.solid)} aria-hidden="true" />
                  <h3 className={cn('flex-1 text-[17px] font-bold leading-snug', tone.text)}>{item.question}</h3>
                  <ChevronDown
                    className="h-5 w-5 shrink-0 text-muted transition-transform group-open:rotate-180 motion-reduce:transition-none"
                    aria-hidden="true"
                  />
                </summary>
                <div className="pb-5 pl-5 leading-relaxed text-muted">{item.answer}</div>
              </details>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
