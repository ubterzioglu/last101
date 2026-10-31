'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { CONSENT_EVENT, readConsent, writeConsent } from '@/lib/analytics/consent';

const TEXT_LINK_CLASSES =
  'rounded-sm font-medium text-ink underline underline-offset-4 transition-colors hover:text-brand-700';

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
      <div className="mx-auto max-w-3xl rounded-2xl border border-line bg-white p-5 text-ink shadow-float">
        <p className="text-sm font-semibold">Çerez ve analitik tercihleri</p>
        <p className="mt-2 text-sm leading-6 text-muted">
          Sitemizin çalışması için zorunlu çerezler kullanıyoruz. Analitik ve ölçüm betikleri
          (Google Analytics, GoatCounter, Microsoft Clarity) yalnızca açık izninle yüklenir.
          İznini dilediğin zaman alt bilgideki &quot;Çerez tercihleri&quot; bağlantısından geri
          alabilirsin. Ayrıntılar{' '}
          <Link href="/cerez-politikasi" className={TEXT_LINK_CLASSES}>
            Çerez Politikası
          </Link>{' '}
          ve{' '}
          <Link href="/gizlilik-politikasi" className={TEXT_LINK_CLASSES}>
            Gizlilik Politikası
          </Link>{' '}
          sayfalarında.
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button type="button" variant="primary" onClick={() => writeConsent(true)}>
            Analitik çerezlere izin ver
          </Button>
          <Button type="button" variant="outline" onClick={() => writeConsent(false)}>
            Reddet
          </Button>
        </div>
      </div>
    </div>
  );
}
