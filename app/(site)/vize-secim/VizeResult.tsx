import { ArrowLeft, Check, Lightbulb, RotateCcw } from 'lucide-react';
import type { VisaResult } from './data';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Container } from '@/components/ui/Container';
import { Chip } from '@/components/site/Chip';
import { TONE_STYLES } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';

interface VizeResultProps {
  result: VisaResult;
  onReset: () => void;
  onBack: () => void;
}

const subheading = 'text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink';

export function VizeResult({ result, onReset, onBack }: VizeResultProps) {
  const tone = TONE_STYLES[result.color];

  return (
    <Container className="py-10 md:py-12">
      <Card variant="featured" className="md:p-8">
        <Chip tone={result.color}>Önerilen Vize Türü</Chip>
        <h2 className="mt-3 text-[clamp(1.75rem,3vw,2.4rem)] font-extrabold leading-[1.12] tracking-[-0.04em] text-ink">
          {result.title}
        </h2>
        <p className="mt-2 leading-relaxed text-muted">{result.subtitle}</p>

        <div className="mt-8 grid gap-8 border-t border-line pt-8 lg:grid-cols-2">
          <div>
            <h3 className={subheading}>Temel Şartlar</h3>
            <ul className="mt-4 divide-y divide-line border-y border-line">
              {result.requirements.map((req, i) => (
                <li key={i} className="flex items-start gap-3 py-3 text-sm leading-relaxed text-ink">
                  <Check className={cn('mt-0.5 h-4 w-4 shrink-0', tone.text)} aria-hidden="true" />
                  <span>{req}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className={subheading}>Sonraki Adımlar</h3>
            <ol className="mt-4 space-y-3">
              {result.steps.map((step, i) => (
                <li key={i} className="flex items-start gap-3 text-sm leading-relaxed text-ink">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-current text-xs font-bold text-brand-700">
                    {i + 1}
                  </span>
                  <span className="pt-1">{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>

        {result.note && (
          <div className="mt-8 flex gap-3 rounded-tile border border-alm-yellow/20 bg-alm-yellow/5 p-4">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-alm-yellow-ink" aria-hidden="true" />
            <p className="text-sm leading-relaxed text-ink">{result.note}</p>
          </div>
        )}

        <div className="mt-8 flex flex-col gap-3 border-t border-line pt-6 sm:flex-row sm:flex-wrap">
          <Button onClick={onReset}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            Yeniden Başla
          </Button>
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Son Soruya Dön
          </Button>
          <Button href="/" variant="outline">
            Ana Sayfaya Dön
          </Button>
        </div>
      </Card>
    </Container>
  );
}
