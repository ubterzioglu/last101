import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

interface AuthSplitLayoutProps {
  /** Sağ panel başlığı (sayfa h1'i). */
  title: string;
  /** Başlık altı kısa açıklama. */
  subtitle?: string;
  /** Sol görsel panelindeki büyük tanıtım metni. */
  heroTitle?: string;
  /** Sol görsel panelindeki açıklama. */
  heroSubtitle?: string;
  /** Sol paneldeki vurgu rengi (gradient ve aksanlar). */
  accent?: 'blue' | 'green' | 'yellow';
  /** Sağ panel form/içerik alanı. */
  children: React.ReactNode;
}

const ACCENT_GRADIENT: Record<NonNullable<AuthSplitLayoutProps['accent']>, string> = {
  blue: 'from-google-blue/30 via-black to-google-green/20',
  green: 'from-google-green/30 via-black to-google-blue/20',
  yellow: 'from-google-yellow/25 via-black to-google-red/20',
};

const ACCENT_GLOW: Record<NonNullable<AuthSplitLayoutProps['accent']>, string> = {
  blue: 'bg-google-blue/30',
  green: 'bg-google-green/30',
  yellow: 'bg-google-yellow/30',
};

/**
 * Ortak kimlik doğrulama düzeni: solda görsel/marka paneli, sağda form.
 * Üye girişi, köşe yazarı girişi ve admin girişi bu düzeni paylaşır.
 * Mobilde sol panel gizlenir, form tam genişlikte gösterilir.
 */
export function AuthSplitLayout({
  title,
  subtitle,
  heroTitle = 'Almanya101',
  heroSubtitle = 'Almanya yolculuğun için ihtiyacın olan tüm araçlar tek yerde.',
  accent = 'blue',
  children,
}: AuthSplitLayoutProps) {
  return (
    <div className="grid min-h-screen grid-cols-1 bg-black text-white lg:grid-cols-2">
      {/* Sol görsel / marka paneli — mobilde gizli */}
      <aside
        className={cn(
          'relative hidden overflow-hidden bg-gradient-to-br lg:flex lg:flex-col lg:justify-between',
          ACCENT_GRADIENT[accent],
        )}
      >
        <div
          className={cn('pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl', ACCENT_GLOW[accent])}
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl"
          aria-hidden="true"
        />

        <div className="relative p-10">
          <Image
            src="/almanya101.png"
            alt="almanya101"
            width={180}
            height={48}
            priority
            className="h-10 w-auto object-contain"
          />
        </div>

        <div className="relative max-w-lg p-10">
          <h2 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">{heroTitle}</h2>
          <p className="mt-5 text-base leading-8 text-white/75 md:text-lg">{heroSubtitle}</p>

          <ul className="mt-8 space-y-3 text-sm text-white/70">
            <li className="flex items-center gap-3">
              <CheckDot />
              Ücretsiz interaktif Almanya araçları
            </li>
            <li className="flex items-center gap-3">
              <CheckDot />
              Topluluk, köşe yazıları ve güncel haberler
            </li>
            <li className="flex items-center gap-3">
              <CheckDot />
              Kişisel planlama ve karar destek
            </li>
          </ul>
        </div>

        <div className="relative p-10 text-xs text-white/45">
          © {''}
          almanya101 — Almanya&apos;da yaşayan Türkler için.
        </div>
      </aside>

      {/* Sağ form paneli */}
      <main className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobilde logo (sol panel gizli olduğu için) */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Image
              src="/almanya101.png"
              alt="almanya101"
              width={160}
              height={42}
              priority
              className="h-9 w-auto object-contain"
            />
          </div>

          <div className="mb-8 text-center lg:text-left">
            <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{title}</h1>
            {subtitle ? <p className="mt-3 text-sm leading-7 text-white/60">{subtitle}</p> : null}
          </div>

          {children}
        </div>
      </main>
    </div>
  );
}

function CheckDot() {
  return (
    <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/10 text-white">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} className="h-3 w-3">
        <path d="M20 6 9 17l-5-5" />
      </svg>
    </span>
  );
}
