import type { ReactNode } from 'react';
import { TONE_STYLES } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';

/**
 * Admin input / select / textarea için ortak sınıflar. Girdiye doğrudan
 * `className={ADMIN_CONTROL_CLASS}` olarak verilir (AdminField içinde ya da tek başına).
 */
export const ADMIN_CONTROL_CLASS =
  'w-full min-h-[44px] rounded-btn border border-line bg-white px-3 text-ink placeholder:text-muted focus:border-brand-700 disabled:cursor-not-allowed disabled:opacity-60';

interface AdminFieldProps {
  label: string;
  /** Etiket altındaki yardımcı metin; hata varsa gösterilmez. */
  hint?: string;
  /** Hata mesajı; varsa uyarı olarak gösterilir. */
  error?: string;
  className?: string;
  /** input / select / textarea (ADMIN_CONTROL_CLASS ile). */
  children: ReactNode;
}

/** Etiketli form alanı: etiket, kontrol, ipucu ya da hata mesajı. */
export function AdminField({ label, hint, error, className, children }: AdminFieldProps) {
  return (
    <label className={cn('block', className)}>
      <span className="mb-2 block text-sm font-semibold text-ink">{label}</span>
      {children}
      {error ? (
        <span role="alert" className={cn('mt-2 block text-sm font-medium', TONE_STYLES.red.text)}>
          {error}
        </span>
      ) : hint ? (
        <span className="mt-2 block text-xs text-muted">{hint}</span>
      ) : null}
    </label>
  );
}
