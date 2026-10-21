import { TONE_STYLES, type SiteTone } from '@/components/site/tones';
import { Card } from '@/components/ui/Card';
import { getQuestionnaireDimensionLabel } from '@/lib/tools/survey';
import { cn } from '@/lib/utils/cn';

function getCategoryTone(category: string): SiteTone {
  if (category === 'Güçlü uyum') {
    return 'green';
  }
  if (category === 'Kullanılabilir') {
    return 'blue';
  }
  if (category === 'Belirsiz / geliştirmeli') {
    return 'yellow';
  }

  return 'red';
}

interface QuestionnaireSummaryProps {
  toolScore: number;
  category: string;
  dimensionScores: Record<string, number>;
}

/** Featured score card shown after the 15-question layer is complete. */
export function QuestionnaireSummary({ toolScore, category, dimensionScores }: QuestionnaireSummaryProps) {
  const tone = TONE_STYLES[getCategoryTone(category)];
  const dimensions = Object.entries(dimensionScores);

  return (
    <Card variant="featured" className="rounded-card p-5 md:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-muted">Anket skoru</p>
          <h3 className="mt-1 text-[clamp(2rem,3.5vw,2.5rem)] font-extrabold leading-none tracking-[-0.03em] text-ink">
            %{toolScore}
          </h3>
        </div>
        <div className={cn('rounded-full border px-3 py-1 text-sm font-semibold', tone.tint, tone.border, tone.text)}>
          {category}
        </div>
      </div>

      {dimensions.length > 0 && (
        <div className="mt-6 grid gap-px overflow-hidden rounded-tile border border-line bg-line sm:grid-cols-2 md:grid-cols-3">
          {dimensions.map(([key, value]) => (
            <div key={key} className="bg-white p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                {getQuestionnaireDimensionLabel(key)}
              </p>
              <p className="mt-1.5 text-2xl font-extrabold text-ink">%{value}</p>
            </div>
          ))}
        </div>
      )}

      <p className="mt-6 border-t border-line pt-5 text-sm leading-relaxed text-muted">
        Bu skor, mevcut araç sonucunu değiştirmez. Ama hangi alanlarda daha güçlü,
        hangi alanlarda daha kırılgan olduğunu daha ölçülebilir biçimde gösterir.
      </p>
    </Card>
  );
}
