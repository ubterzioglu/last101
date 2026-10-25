'use client';

import { clearConsent } from '@/lib/analytics/consent';

/**
 * Verilen izni geri almak için: tercih temizlenir ve sayfa yenilenir; böylece
 * izin verilmiş durumda yüklenmiş betikler yeni oturumda bir daha istenmez.
 */
export function CookieSettingsButton() {
  return (
    <button
      type="button"
      onClick={() => {
        clearConsent();
        window.location.reload();
      }}
      className="rounded-sm text-sm text-white/75 underline-offset-4 transition-colors hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-google-yellow"
    >
      Çerez tercihleri
    </button>
  );
}
