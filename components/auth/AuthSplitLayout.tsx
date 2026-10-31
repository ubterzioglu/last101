import Image from 'next/image';
import { Check } from 'lucide-react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils/cn';

type AuthAccent = 'blue' | 'green' | 'yellow';

interface AuthSplitLayoutProps {
  /** Sağ panel başlığı (sayfa h1'i). */
  title: string;
  /** Başlık altı kısa açıklama. */
  subtitle?: string;
  /** Sol görsel panelindeki büyük tanıtım metni. */
  heroTitle?: string;
  /** Sol görsel panelindeki açıklama. */
  heroSubtitle?: string;
  /** Sol paneldeki vurgu rengi (gradient ve aksanlar). Sadece koyu tonda kullanılır. */
  accent?: AuthAccent;
  /**
   * `dark` (varsayılan): admin ve köşe yazarı panelinin koyu görünümü.
   * `light`: public site (/giris); fotoğraflı marka paneli ve beyaz form kartı.
   */
  tone?: 'dark' | 'light';
  /** Sol paneldeki madde listesi. Yalnızca `light` düzende kullanılır; varsayılan ortak liste. */
  highlights?: readonly string[];
  /** Sağ panel form/içerik alanı. */
  children: React.ReactNode;
}

interface PanelProps {
  title: string;
  subtitle?: string;
  heroTitle: string;
  heroSubtitle: string;
  children: React.ReactNode;
}

const ACCENT_GRADIENT: Record<AuthAccent, string> = {
  blue: 'from-google-blue/30 via-black to-google-green/20',
  green: 'from-google-green/30 via-black to-google-blue/20',
  yellow: 'from-google-yellow/25 via-black to-google-red/20',
};

const ACCENT_GLOW: Record<AuthAccent, string> = {
  blue: 'bg-google-blue/30',
  green: 'bg-google-green/30',
  yellow: 'bg-google-yellow/30',
};

const HIGHLIGHTS = [
  'Ücretsiz interaktif Almanya araçları',
  'Topluluk, köşe yazıları ve güncel haberler',
  'Kişisel planlama ve karar destek',
] as const;

const LIGHT_PHOTO = '/images/site/berlin-brandenburger-tor-aksam.webp';
const BRAND_SLOGAN = 'yalnız değilsin! almanya101 seninle!';

/**
 * Ortak kimlik doğrulama düzeni: solda görsel/marka paneli, sağda form.
 * Üye girişi (`tone="light"`), köşe yazarı girişi ve admin girişi (koyu, varsayılan)
 * bu düzeni paylaşır. Mobilde sol panel gizlenir, form tam genişlikte gösterilir.
 */
export function AuthSplitLayout({
  title,
  subtitle,
  heroTitle = 'Almanya101',
  heroSubtitle = 'Almanya yolculuğun için ihtiyacın olan tüm araçlar tek yerde.',
  accent = 'blue',
  tone = 'dark',
  highlights = HIGHLIGHTS,
  children,
}: AuthSplitLayoutProps) {
  const panel: PanelProps = { title, subtitle, heroTitle, heroSubtitle, children };

  return tone === 'light' ? (
    <LightAuthLayout {...panel} highlights={highlights} />
  ) : (
    <DarkAuthLayout {...panel} accent={accent} />
  );
}

/** Admin ve köşe yazarı paneli: önceki koyu görünüm, birebir korunur. */
function DarkAuthLayout({ title, subtitle, heroTitle, heroSubtitle, accent, children }: PanelProps & { accent: AuthAccent }) {
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
            alt="Almanya101 logosu"
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
            {HIGHLIGHTS.map((item) => (
              <li key={item} className="flex items-center gap-3">
                <CheckDot />
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="relative p-10 text-xs text-white/45">
          © {''}
          almanya101 — Almanya&apos;da yaşayan Türkler için.
        </div>
      </aside>

      {/* Sağ form paneli */}
      <div className="flex min-h-screen items-center justify-center px-4 py-12 sm:px-8">
        <div className="w-full max-w-md">
          {/* Mobilde logo (sol panel gizli olduğu için) */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Image
              src="/almanya101.png"
              alt="Almanya101 logosu"
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
      </div>
    </div>
  );
}

/**
 * Public üye girişi: solda Berlin fotoğrafı ve marka sloganı (sadece lg+), sağda
 * sayfa zemininde beyaz öne çıkan form kartı. Kök layout zaten `<main>` verdiği
 * için burada ikinci bir `<main>` kullanılmaz.
 */
function LightAuthLayout({
  title,
  subtitle,
  heroTitle,
  heroSubtitle,
  highlights,
  children,
}: PanelProps & { highlights: readonly string[] }) {
  return (
    <div className="bg-page text-ink">
      <Container className="grid gap-[38px] py-10 md:py-16 lg:grid-cols-[1.05fr_1fr]">
        <aside className="relative hidden min-h-[620px] overflow-hidden rounded-card bg-band lg:block">
          <Image
            src={LIGHT_PHOTO}
            alt="Akşam ışıklarıyla aydınlanan Brandenburg Kapısı, Berlin"
            fill
            priority
            sizes="(min-width: 1280px) 620px, 50vw"
            className="object-cover"
          />
          <p className="absolute left-4 top-4 inline-flex min-h-[32px] items-center rounded-full bg-white px-3 text-[13px] font-semibold">
            {BRAND_SLOGAN}
          </p>
          <div className="absolute inset-x-4 bottom-4 rounded-card bg-white p-6">
            <h2 className="text-[28px] font-extrabold leading-tight tracking-[-0.03em]">{heroTitle}</h2>
            <p className="mt-2 leading-relaxed text-muted">{heroSubtitle}</p>
            <ul className="mt-5 space-y-2.5 text-sm font-medium">
              {highlights.map((item) => (
                <li key={item} className="flex items-center gap-3">
                  <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-50 text-brand-700">
                    <Check aria-hidden="true" className="h-3.5 w-3.5" strokeWidth={2.5} />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <div className="flex items-center justify-center">
          <div className="w-full max-w-[480px] rounded-card border border-line bg-white p-6 shadow-float sm:p-8">
            <h1 className="text-[clamp(2rem,3vw,2.5rem)] font-extrabold leading-[1.1] tracking-[-0.04em]">{title}</h1>
            {subtitle ? <p className="mt-3 text-sm leading-relaxed text-muted">{subtitle}</p> : null}
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </Container>
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
