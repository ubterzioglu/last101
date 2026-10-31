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
      className="rounded-sm text-sm text-muted underline-offset-4 transition-colors hover:text-ink hover:underline"
    >
      Çerez tercihleri
    </button>
  );
}
