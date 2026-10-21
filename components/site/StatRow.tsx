import { cn } from '@/lib/utils/cn';

export interface StatItem {
  value: string;
  label: string;
}

export interface StatRowProps {
  stats: StatItem[];
  /** `ink` on light surfaces, `light` on the dark band. */
  tone?: 'ink' | 'light';
  className?: string;
}

/**
 * Corteqs page-head numbers. A description list: the label (`dt`) comes first in
 * the DOM for screen readers; `flex-col-reverse` shows the value on top.
 */
export function StatRow({ stats, tone = 'ink', className }: StatRowProps) {
  if (stats.length === 0) return null;

  const light = tone === 'light';

  return (
    <dl className={cn('flex flex-wrap gap-x-8 gap-y-5', className)}>
      {stats.map((stat, index) => (
        <div key={`${index}-${stat.label}`} className="flex flex-col-reverse gap-2">
          <dt className={cn('text-sm', light ? 'text-white/75' : 'text-muted')}>{stat.label}</dt>
          <dd
            className={cn(
              'text-[28px] font-extrabold leading-none tracking-[-0.03em]',
              light ? 'text-white' : 'text-ink'
            )}
          >
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
