import type { ReactNode } from 'react';
import { Container } from '@/components/ui/Container';
import { ToolSteps } from '@/components/tools/ToolSteps';
import { cn } from '@/lib/utils/cn';

export interface ToolHeroStat {
  value: string;
  label: string;
}

export interface ToolHeroProps {
  /** Small label above the title. Defaults to 'Araç'. */
  eyebrow?: string;
  /** H1 text; keep the existing tool title exactly. */
  title: string;
  intro?: ReactNode;
  stats?: ToolHeroStat[];
  howItWorks: ReactNode[];
  /** Defaults to 'Nasıl çalışır?'. */
  howItWorksTitle?: string;
  className?: string;
}

/** Inner-page split head for tools: title block left, "how it works" card right. */
export function ToolHero({
  eyebrow = 'Araç',
  title,
  intro,
  stats,
  howItWorks,
  howItWorksTitle = 'Nasıl çalışır?',
  className,
}: ToolHeroProps) {
  return (
    <section className={cn('border-b border-line', className)}>
      <Container className="grid gap-[38px] py-12 md:py-16 lg:grid-cols-[1.05fr_1fr] lg:items-start">
        <div>
          <div className="text-[13px] font-bold uppercase tracking-[0.13em] text-brand-700">{eyebrow}</div>
          <h1 className="mt-4 text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-0.04em] text-ink">
            {title}
          </h1>
          {intro && <p className="mt-5 max-w-2xl leading-relaxed text-muted">{intro}</p>}
          {stats && stats.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-x-10 gap-y-4">
              {stats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-[28px] font-extrabold leading-none tracking-[-0.03em] text-ink">{stat.value}</div>
                  <div className="mt-1.5 text-sm text-muted">{stat.label}</div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="rounded-card border border-line bg-white p-6 shadow-float md:p-7">
          <h2 className="text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink">{howItWorksTitle}</h2>
          <ToolSteps steps={howItWorks} className="mt-5" />
        </div>
      </Container>
    </section>
  );
}
