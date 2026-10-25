'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';
import { CONSENT_EVENT, readConsent } from '@/lib/analytics/consent';

const GOATCOUNTER_ENDPOINT = 'https://almanya101de.goatcounter.com/count';

/**
 * İzleme betikleri yalnızca açık analitik izin verildiğinde yüklenir.
 * İzin geri alındığında (tercih temizlenip sayfa yenilendiğinde) hiçbir
 * betik istenmez.
 */
export function AnalyticsScripts() {
  const [granted, setGranted] = useState(false);

  useEffect(() => {
    const sync = () => setGranted(readConsent()?.analytics === true);
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    return () => window.removeEventListener(CONSENT_EVENT, sync);
  }, []);

  if (!granted) return null;

  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-GNYJ39RG89"
        strategy="afterInteractive"
      />
      <Script
        id="goatcounter"
        src="https://gc.zgo.at/count.js"
        data-goatcounter={GOATCOUNTER_ENDPOINT}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','G-GNYJ39RG89');`}
      </Script>
      <Script id="microsoft-clarity" strategy="afterInteractive">
        {`(function(c,l,a,r,i,t,y){c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);})(window,document,"clarity","script","walpfs3c2q");`}
      </Script>
    </>
  );
}
