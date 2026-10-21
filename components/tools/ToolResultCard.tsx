import { ArrowLink } from '@/components/site/ArrowLink';
import { TONE_STYLES } from '@/components/site/tones';
import { ToolSteps } from '@/components/tools/ToolSteps';
import { Card } from '@/components/ui/Card';
import { getRelatedToolItems } from '@/components/tools/tool-links';
import { cn } from '@/lib/utils/cn';
import type { ToolResult } from '@/lib/tools/types';

const subheading = 'text-sm font-bold text-ink';

export function ToolResultCard({ result }: { result: ToolResult }) {
  const tone = TONE_STYLES[result.tone];
  const relatedTools = getRelatedToolItems(result.relatedTools);

  return (
    <Card variant="featured" className="rounded-card p-5 md:p-7" data-pw="tool-result">
      <span className={cn('inline-flex rounded-full px-3 py-1 text-xs font-semibold', tone.tint, tone.text)}>
        {result.matchLabel}
      </span>
      <h2 className="mt-3 text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink">
        {result.title}
      </h2>
      <p className="mt-3 max-w-3xl leading-relaxed text-muted">{result.summary}</p>

      {result.metrics && result.metrics.length > 0 && (
        <div className="mt-6 grid gap-px overflow-hidden rounded-tile border border-line bg-line sm:grid-cols-2">
          {result.metrics.map((metric) => (
            <div key={metric.label} className="bg-white p-4">
              <span
                className={cn('mb-2 block h-1.5 w-6 rounded-full', TONE_STYLES[metric.tone ?? result.tone].solid)}
                aria-hidden="true"
              />
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">{metric.label}</p>
              <p className="mt-1.5 text-xl font-extrabold text-ink">{metric.value}</p>
            </div>
          ))}
        </div>
      )}

      <div className="mt-6 grid gap-6 border-t border-line pt-6 lg:grid-cols-2">
        <div>
          <h3 className={subheading}>Neden bu sonuç çıktı?</h3>
          <ul className="mt-3 space-y-2.5">
            {result.why.map((item) => (
              <li key={item} className="flex gap-3 text-sm leading-relaxed text-ink">
                <span className={cn('mt-2 h-1.5 w-1.5 shrink-0 rounded-full', tone.solid)} aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className={subheading}>Sonraki adımlar</h3>
          <ToolSteps steps={result.steps} className="mt-3 space-y-3 text-sm" />
        </div>
      </div>

      {result.caution && (
        <div className="mt-6 rounded-tile border border-alm-yellow/20 bg-alm-yellow/5 p-4 text-sm leading-relaxed text-ink">
          {result.caution}
        </div>
      )}

      {result.officialSources && result.officialSources.length > 0 && (
        <div className="mt-6 border-t border-line pt-5">
          <h3 className={subheading}>Bu sonuç için resmi kaynaklar</h3>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {result.officialSources.map((source) => (
              <ArrowLink key={source.href} href={source.href}>
                {source.label}
              </ArrowLink>
            ))}
          </div>
        </div>
      )}

      {relatedTools.length > 0 && (
        <div className="mt-5 border-t border-line pt-5">
          <h3 className={subheading}>Sonra bakabileceğin araçlar</h3>
          <div className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
            {relatedTools.map((item) => (
              <ArrowLink key={item.href} href={item.href} tone="brand">
                {item.title}
              </ArrowLink>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
