import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface AdminPageHeaderProps {
  /** Küçük üst etiket (ör. "Yönetim"). */
  eyebrow?: string;
  /** Sayfa başlığı (sayfanın tek h1'i). */
  title: string;
  description?: string;
  /** Sağ üstte hizalanan eylemler (butonlar). */
  actions?: ReactNode;
  className?: string;
}

/**
 * Admin sayfa başlığı: eyebrow + h1 + açıklama + sağ eylem alanı. Sayfa kenar
 * boşluğunu kendisi verir; `<main>` kullanmaz (kök layout tek `<main>` sağlar).
 */
export function AdminPageHeader({ eyebrow, title, description, actions, className }: AdminPageHeaderProps) {
  return (
    // Not a <header>: globals.css hides every `body[data-admin] header` (site chrome).
    <div className={cn('border-b border-line bg-page px-4 py-8 sm:px-6 lg:px-9', className)}>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0 max-w-2xl">
          {eyebrow ? (
            <div className="text-[13px] font-bold uppercase leading-snug tracking-[0.13em] text-brand-700">
              {eyebrow}
            </div>
          ) : null}
          <h1
            className={cn(
              'text-[28px] font-extrabold leading-[1.1] tracking-[-0.03em] text-ink sm:text-[32px]',
              eyebrow && 'mt-2',
            )}
          >
            {title}
          </h1>
          {description ? <p className="mt-3 text-sm leading-relaxed text-muted">{description}</p> : null}
        </div>
        {actions ? <div className="flex flex-wrap items-center gap-3">{actions}</div> : null}
      </div>
    </div>
  );
}
