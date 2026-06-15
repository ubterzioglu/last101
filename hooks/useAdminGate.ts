'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { clearAdminAuth, loadAdminAuth, verifyAdminKey } from '@/lib/admin/clientAuth';

export type AdminGateStatus = 'checking' | 'authed' | 'redirecting';

/**
 * Single-door admin auth gate for sub-pages.
 *
 * The main `/admin` page is the only place that shows a password form. Every
 * admin sub-client shares the same `sessionStorage` session via
 * `lib/admin/clientAuth`, so here we only need to verify an existing session.
 * If there is no valid session, we send the user back to `/admin` (carrying a
 * `next` param so they return here after logging in) instead of rendering a
 * second login screen.
 *
 * Server-side protection (`isAdminAuthorized` + `x-admin-key` headers) is
 * unaffected: API calls keep using `getAdminHeaders()` from `clientAuth`.
 */
export function useAdminGate(): AdminGateStatus {
  const router = useRouter();
  const pathname = usePathname();
  const [status, setStatus] = useState<AdminGateStatus>('checking');

  useEffect(() => {
    let cancelled = false;

    const redirectToLogin = () => {
      clearAdminAuth();
      if (cancelled) return;
      setStatus('redirecting');
      const next = encodeURIComponent(pathname || '/admin');
      router.replace(`/admin?next=${next}`);
    };

    const saved = loadAdminAuth();
    if (!saved.password) {
      redirectToLogin();
      return;
    }

    verifyAdminKey(saved.password)
      .then(() => {
        if (!cancelled) setStatus('authed');
      })
      .catch(() => {
        redirectToLogin();
      });

    return () => {
      cancelled = true;
    };
  }, [pathname, router]);

  return status;
}
