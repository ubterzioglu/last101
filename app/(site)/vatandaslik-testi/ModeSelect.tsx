import type { LucideIcon } from 'lucide-react';
import { BookOpen, ClipboardCheck, MapPin } from 'lucide-react';
import { FIELD_CONTROL_CLASS, FIELD_LABEL_CLASS, PANEL_TITLE_CLASS } from '@/components/calc/field-styles';
import { TONE_STYLES, type SiteTone } from '@/components/site/tones';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import { EYALETLER, type TestModu } from './vatandaslik-data';

interface ModeCardProps {
  icon: LucideIcon;
  tone: SiteTone;
  title: string;
  subtitle?: string;
  description: string;
  /** When set, the card shows the state select (shared selection). */
  selectId?: string;
  seciliEyalet: string;
  onEyaletChange: (eyalet: string) => void;
  onStart: () => void;
}

/**
 * The heading is a direct child of the card root on purpose: the e2e spec
 * scopes the select and the start button to the nearest div around it.
 */
function ModeCard({
  icon: Icon,
  tone,
  title,
  subtitle,
  description,
  selectId,
  seciliEyalet,
  onEyaletChange,
  onStart,
}: ModeCardProps) {
  const toneStyle = TONE_STYLES[tone];

  return (
    <div className="flex h-full flex-col rounded-card border border-line bg-white p-5 transition-colors hover:border-ink/30 md:p-6">
      <span
        aria-hidden="true"
        className={cn('flex h-10 w-10 items-center justify-center rounded-tile', toneStyle.tint, toneStyle.text)}
      >
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-ink">{title}</h3>
      {subtitle && <p className="mt-0.5 text-xs font-semibold text-muted">{subtitle}</p>}
      <p className="mt-2 text-sm leading-relaxed text-muted">{description}</p>

      {selectId && (
        <div className="mt-4">
          <label htmlFor={selectId} className={FIELD_LABEL_CLASS}>
            Eyalet Seçin
          </label>
          <select
            id={selectId}
            value={seciliEyalet}
            onChange={(e) => onEyaletChange(e.target.value)}
            className={FIELD_CONTROL_CLASS}
          >
            <option value="">Seçiniz</option>
            {EYALETLER.map((eyalet) => (
              <option key={eyalet} value={eyalet}>
                {eyalet}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-auto pt-5">
        <Button type="button" onClick={onStart} disabled={Boolean(selectId) && !seciliEyalet} className="w-full">
          Sınava Başla
        </Button>
      </div>
    </div>
  );
}

interface ModeSelectProps {
  seciliEyalet: string;
  onEyaletChange: (eyalet: string) => void;
  onStart: (mod: Exclude<TestModu, null>) => void;
}

/** Three mode cards; both state-based modes share one state selection (as before). */
export function ModeSelect({ seciliEyalet, onEyaletChange, onStart }: ModeSelectProps) {
  const shared = { seciliEyalet, onEyaletChange };

  return (
    <>
      <h2 className={PANEL_TITLE_CLASS}>Sınav Modunu Seç</h2>
      <div className="grid gap-4 md:grid-cols-3">
        <ModeCard
          {...shared}
          icon={BookOpen}
          tone="blue"
          title="Tüm Sorular (300)"
          description="Genel soruların tamamı arasından 300 soru ile tam test yapın."
          onStart={() => onStart('all')}
        />
        <ModeCard
          {...shared}
          icon={ClipboardCheck}
          tone="orange"
          title="Gerçek Deneme Sınavı"
          subtitle="(30 genel + 3 eyalet)"
          description="Genel sorulardan 30, seçtiğiniz eyaletten 3 soru ile klasik sınav formatı."
          selectId="vatandaslik-eyalet-gercek"
          onStart={() => onStart('real')}
        />
        <ModeCard
          {...shared}
          icon={MapPin}
          tone="green"
          title="Eyalet Soruları (10)"
          description="Sadece seçtiğiniz eyalete özel 10 soru ile hızlı test."
          selectId="vatandaslik-eyalet-eyalet"
          onStart={() => onStart('state')}
        />
      </div>
    </>
  );
}
