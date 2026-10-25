import { CookieSettingsButton } from '@/components/analytics/CookieSettingsButton';
import { HomeFooterNav } from '@/components/home/HomeFooterNav';

/**
 * Tüm herkese açık sayfalarda görünen site alt bilgisi: <footer> landmark,
 * kurumsal/yasal bağlantılar, içerik kısayolları ve çerez tercihi geri alma.
 * devuser/admin sayfalarında globals.css body[data-devuser] footer kuralıyla
 * gizlenir.
 */
export function SiteFooter() {
  return (
    <footer className="bg-black">
      <HomeFooterNav />
      <div className="mx-auto flex max-w-3xl flex-col gap-3 px-4 pb-10 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <p className="text-sm text-white/55">
          © {new Date().getFullYear()} almanya101 — Almanya&apos;da yaşayan Türkler için Türkçe
          rehber.
        </p>
        <CookieSettingsButton />
      </div>
    </footer>
  );
}
