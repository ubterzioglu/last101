import { CheckCircle, XCircle } from 'lucide-react';
import { MetricCell, MetricGrid } from '@/components/calc/MetricGrid';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils/cn';
import { GECME_SINIRI, type TestModu } from './vatandaslik-data';

interface QuizResultProps {
  total: number;
  dogruSayisi: number;
  aktifMod: TestModu;
  onReset: () => void;
}

export function QuizResult({ total, dogruSayisi, aktifMod, onReset }: QuizResultProps) {
  const gecti = dogruSayisi >= GECME_SINIRI;
  const VerdictIcon = gecti ? CheckCircle : XCircle;

  return (
    <Card variant="featured" className="p-5 md:p-7" data-pw="vatandaslik-result">
      <h2 className="text-[clamp(1.5rem,2.6vw,2rem)] font-extrabold leading-tight tracking-[-0.03em] text-ink">
        Test Sonucu
      </h2>
      <p className="mt-2 leading-relaxed text-muted">
        Toplam <span className="font-bold text-ink">{total}</span> sorudan{' '}
        <span className="font-bold text-alm-green-ink">{dogruSayisi}</span> tanesini doğru cevapladınız.
      </p>

      <MetricGrid className="mt-5 grid-cols-2">
        <MetricCell label="Doğru" value={dogruSayisi} tone="green" icon={CheckCircle} valueTestId="vatandaslik-dogru" />
        <MetricCell label="Yanlış" value={total - dogruSayisi} tone="red" icon={XCircle} valueTestId="vatandaslik-yanlis" />
      </MetricGrid>

      {aktifMod === 'real' && (
        <div
          role="status"
          className={cn(
            'mt-5 flex items-start gap-3 rounded-tile border p-4 text-sm font-semibold text-ink',
            gecti ? 'border-alm-green/20 bg-alm-green/5' : 'border-alm-red/20 bg-alm-red/5'
          )}
        >
          <VerdictIcon
            aria-hidden="true"
            className={cn('mt-0.5 h-4 w-4 shrink-0', gecti ? 'text-alm-green-ink' : 'text-alm-red-ink')}
          />
          {gecti
            ? 'Tebrikler! Sınavı geçtiniz!'
            : 'Maalesef sınavı geçemediniz. En az 17 doğru cevap gerekiyor.'}
        </div>
      )}

      <div className="mt-6 border-t border-line pt-5">
        <Button type="button" onClick={onReset}>
          Sınav Modunu Değiştir
        </Button>
      </div>
    </Card>
  );
}
