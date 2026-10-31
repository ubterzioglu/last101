import { Chip } from '@/components/site/Chip';
import type { SiteTone } from '@/components/site/tones';

export type AdminStatusTone = SiteTone | 'neutral';

/** Durum metni (kucuk harf) -> rozet tonu. Bilinmeyen durumlar notr kalir. */
export const STATUS_TONES: Readonly<Record<string, AdminStatusTone>> = {
  pending: 'yellow',
  bekliyor: 'yellow',
  approved: 'green',
  onaylandı: 'green',
  active: 'green',
  açık: 'green',
  rejected: 'red',
  reddedildi: 'red',
  error: 'red',
  open: 'red',
  closed: 'neutral',
  kapalı: 'neutral',
  inactive: 'neutral',
};

/** Durum metnini rozet tonuna cevirir (buyuk/kucuk harf ve bosluk fark etmez). */
export function statusTone(status: string): AdminStatusTone {
  const key = status.trim().toLowerCase();
  return Object.hasOwn(STATUS_TONES, key) ? STATUS_TONES[key] : 'neutral';
}

export interface AdminStatusBadgeProps {
  status: string;
  /** Verilmezse durum metni gosterilir. */
  label?: string;
  /** Verilmezse durumdan turetilir. */
  tone?: AdminStatusTone;
  className?: string;
}

export function AdminStatusBadge({ status, label, tone, className }: AdminStatusBadgeProps) {
  return (
    <Chip tone={tone ?? statusTone(status)} className={className}>
      {label ?? status}
    </Chip>
  );
}
