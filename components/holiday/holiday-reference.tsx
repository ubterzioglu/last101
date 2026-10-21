import { Accordion } from '@/components/site/Accordion';
import { Container } from '@/components/ui/Container';
import type { Holiday } from '@/constants/holidays/tr-2026';
import { cn } from '@/lib/utils/cn';
import { formatHolidayLabelTR } from '@/lib/utils/holiday-calculator';

interface HolidayTip {
  title: string;
  description: string;
  efficiency: string;
}

interface HolidayReferenceProps {
  /** Official holiday list (Turkey page only). */
  holidays?: Holiday[];
  tips: readonly HolidayTip[];
}

const TITLE = 'text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink';

/** "2026 Resmî Tatiller" hairline list and "Tatil Tüyoları" accordion below the calculator. */
export function HolidayReference({ holidays, tips }: HolidayReferenceProps) {
  const sorted = holidays ? holidays.slice().sort((a, b) => a.date.localeCompare(b.date)) : [];

  return (
    <section className="border-t border-line py-12 md:py-16">
      <Container className={cn('grid gap-12', sorted.length > 0 && 'lg:grid-cols-2')}>
        {sorted.length > 0 && (
          <div>
            <h2 className={TITLE}>2026 Resmî Tatiller</h2>
            <ul className="mt-5 divide-y divide-line border-y border-line">
              {sorted.map((holiday) => (
                <li key={holiday.date} className="flex items-baseline justify-between gap-4 py-3 text-sm">
                  <span className="shrink-0 tabular-nums text-muted">{formatHolidayLabelTR(holiday.date)}</span>
                  <span className="text-right text-ink">
                    {holiday.name}
                    {holiday.weight === 0.5 && <span className="ml-1 text-alm-orange-ink">(yarım)</span>}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        <div>
          <h2 className={TITLE}>Tatil Tüyoları</h2>
          <Accordion
            name="tatil-tuyolari"
            toneCycle
            className="mt-5"
            items={tips.map((tip, index) => ({
              id: `tatil-tuyosu-${index + 1}`,
              title: tip.title,
              content: (
                <>
                  <p>{tip.description}</p>
                  <p className="mt-2 text-sm font-semibold text-alm-green-ink">Verimlilik: {tip.efficiency}</p>
                </>
              ),
            }))}
          />
        </div>
      </Container>
    </section>
  );
}
