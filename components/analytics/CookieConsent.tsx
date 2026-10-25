'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { CONSENT_EVENT, readConsent, writeConsent } from '@/lib/analytics/consent';
import { cn } from '@/lib/utils/cn';

/**
 * Türkçe çerez/analitik izin arayüzü: kabul ve ret eşdeğer seçeneklerdir,
 * tercih kalıcıdır ve alt bilgideki "Çerez tercihleri" düğmesiyle geri
 * alınabilir. Karar verilmeden hiçbir izleme betiği yüklenmez.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const sync = () => setVisible(readConsent() === null);
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!visible) return null;

  return (
    <div
      role="region"
      aria-label="Çerez ve analitik tercihleri"
      className="cookie-consent fixed inset-x-0 bottom-0 z-[60] px-4 pb-4"
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-white/15 bg-black/95 p-5 text-white shadow-2xl backdrop-blur">
        <p className="text-sm font-semibold">Çerez ve analitik tercihleri</p>
        <p className="mt-2 text-sm leading-6 text-white/75">
          Sitemizin çalışması için zorunlu çerezler kullanıyoruz. Analitik ve ölçüm betikleri
          (Google Analytics, GoatCounter, Microsoft Clarity) yalnızca açık izninle yüklenir.
          İznini dilediğin zaman alt bilgideki &quot;Çerez tercihleri&quot; bağlantısından geri
          alabilirsin. Ayrıntılar{' '}
          <Link href="/cerez-politikasi" className="underline underline-offset-4 hover:text-white">
            Çerez Politikası
          </Link>{' '}
          ve{' '}
          <Link
            href="/gizlilik-politikasi"
            className="underline underline-offset-4 hover:text-white"
          >
            Gizlilik Politikası
          </Link>{' '}
          sayfalarında.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <button
            type="button"
            onClick={() => writeConsent(true)}
            className={cn(
              'rounded-xl bg-google-blue px-5 py-2.5 text-sm font-semibold text-white',
              'transition-colors hover:bg-blue-600 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-google-yellow'
            )}
          >
            Analitik çerezlere izin ver
          </button>
          <button
            type="button"
            onClick={() => writeConsent(false)}
            className={cn(
              'rounded-xl border border-white/25 px-5 py-2.5 text-sm font-semibold text-white/90',
              'transition-colors hover:border-white/50 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-google-yellow'
            )}
          >
            Reddet
          </button>
        </div>
      </div>
    </div>
  );
}
