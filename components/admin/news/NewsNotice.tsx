import type { ReactNode } from 'react';
import { TONE_STYLES } from '@/components/site/tones';
import type { SiteTone } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';

interface NewsNoticeProps {
  /** red: hata, green: başarı, yellow: uyarı. */
  tone: Extract<SiteTone, 'red' | 'green' | 'yellow'>;
  children: ReactNode;
  className?: string;
}

/** Haber yönetimi ekranlarında ortak durum / hata / uyarı kutusu. */
export function NewsNotice({ tone, children, className }: NewsNoticeProps) {
  const styles = TONE_STYLES[tone];
  return (
    <div
      role={tone === 'red' ? 'alert' : 'status'}
      className={cn('rounded-btn border px-4 py-3 text-sm', styles.tint, styles.border, styles.text, className)}
    >
      {children}
    </div>
  );
}
