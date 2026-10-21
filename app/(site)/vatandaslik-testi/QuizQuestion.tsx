import Image from 'next/image';
import type { LucideIcon } from 'lucide-react';
import { CheckCircle, Timer, XCircle } from 'lucide-react';
import { ToolOption } from '@/components/tools/ToolOption';
import { ToolProgress } from '@/components/tools/ToolProgress';
import { ToolQuestionCard } from '@/components/tools/ToolQuestionCard';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { formatSure, type Soru } from './vatandaslik-data';

function FeedbackTag({ icon: Icon, label, className }: { icon: LucideIcon; label: string; className: string }) {
  return (
    <span className={cn('ml-2 inline-flex items-center gap-1 align-middle text-xs font-bold', className)}>
      <Icon aria-hidden="true" className="h-4 w-4" />
      {label}
    </span>
  );
}

interface QuizQuestionProps {
  soru: Soru;
  index: number;
  total: number;
  timerAktif: boolean;
  kalanSure: number;
  cevapVerildi: boolean;
  secilenCevap: string | null;
  onAnswer: (cevap: string) => void;
  onNext: () => void;
  onReset: () => void;
}

export function QuizQuestion({
  soru,
  index,
  total,
  timerAktif,
  kalanSure,
  cevapVerildi,
  secilenCevap,
  onAnswer,
  onNext,
  onReset,
}: QuizQuestionProps) {
  const dogruMu = secilenCevap === soru.dogru_cevap;

  return (
    <>
      <ToolProgress
        current={index + 1}
        total={total}
        barTestId="vatandaslik-progress-bar"
        label={
          <span className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span>
              Soru {index + 1} / {total}
            </span>
            {timerAktif && (
              <span className="inline-flex items-center gap-1.5 font-bold text-ink">
                <Timer aria-hidden="true" className="h-4 w-4 text-brand-700" />
                <span className="sr-only">Kalan süre</span>
                {formatSure(kalanSure)}
              </span>
            )}
          </span>
        }
      />

      <ToolQuestionCard category={soru.eyalet} title={soru.soru_almanca} description={soru.soru_turkce}>
        {soru.image_url && (
          <Image
            src={soru.image_url}
            alt="Soru görseli"
            className="mb-4 max-h-64 w-full rounded-tile object-contain"
            width={1200}
            height={640}
            unoptimized
          />
        )}

        <div className="space-y-2">
          {Object.entries(soru.secenekler).map(([key, value]) => {
            const isSelected = secilenCevap === key;
            const isCorrect = soru.dogru_cevap === key;
            const showCorrect = cevapVerildi && isCorrect;
            const showWrong = cevapVerildi && isSelected && !isCorrect;

            return (
              <ToolOption
                key={key}
                selected={isSelected}
                disabled={cevapVerildi}
                onClick={() => onAnswer(key)}
                testId="vatandaslik-option"
                className={cn(
                  showCorrect && 'border-alm-green bg-alm-green/10 disabled:opacity-100',
                  showWrong && 'border-alm-red bg-alm-red/10 disabled:opacity-100'
                )}
              >
                <span className="font-semibold">{key.toUpperCase()})</span> {value}
                {showCorrect && <FeedbackTag icon={CheckCircle} label="Doğru cevap" className="text-alm-green-ink" />}
                {showWrong && <FeedbackTag icon={XCircle} label="Yanlış" className="text-alm-red-ink" />}
              </ToolOption>
            );
          })}
        </div>

        <p role="status" className="sr-only">
          {cevapVerildi ? (dogruMu ? 'Doğru cevap.' : `Yanlış. Doğru cevap: ${soru.dogru_cevap.toUpperCase()})`) : ''}
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 border-t border-line pt-5 sm:flex-row sm:items-center sm:justify-between">
          <Button type="button" variant="outline" onClick={onReset}>
            Sınav Modunu Değiştir
          </Button>
          <Button type="button" onClick={onNext} disabled={!cevapVerildi}>
            {index < total - 1 ? 'Sonraki Soru' : 'Testi Bitir'}
          </Button>
        </div>
      </ToolQuestionCard>
    </>
  );
}
