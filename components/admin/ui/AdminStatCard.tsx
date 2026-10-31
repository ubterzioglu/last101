import Link from 'next/link';
import { TONE_STYLES } from '@/components/site/tones';
import type { SiteTone } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';

interface AdminStatCardProps {
  label: string;
  value: number | string;
  /** Kartın gittiği admin sayfası. */
  href: string;
  /** Değerin rengi: TONE_STYLES anahtarı. */
  tone: SiteTone;
  className?: string;
}

/** Dashboard özet kartı: etiket, büyük değer ve "Görüntüle" bağlantısı. Tüm kart tıklanabilir. */
export function AdminStatCard({ label, value, href, tone, className }: AdminStatCardProps) {
  return (
    <Link
      href={href}
      className={cn(
        'group flex flex-col items-start rounded-card border border-line bg-white p-6 text-left transition-colors hover:border-ink/30',
        className,
      )}
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">{label}</span>
      <span className={cn('mt-3 text-[28px] font-extrabold leading-none', TONE_STYLES[tone].text)}>{value}</span>
      <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-brand-700 transition-all group-hover:gap-2">
        Görüntüle
        <span aria-hidden="true">→</span>
      </span>
    </Link>
  );
}
