'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { ADMIN_AUTH_CHANGED_EVENT, loadAdminAuth } from '@/lib/admin/clientAuth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';

/**
 * Premium admin shell: fixed glassmorphism sidebar on the left, page content
 * on the right. The sidebar is shown only once a session exists, so the
 * `/admin` login screen renders full-width without it. Auth is enforced
 * server-side (`isAdminAuthorized`) and by `useAdminGate` on each page — this
 * shell only decides whether to paint the navigation chrome.
 */
export function AdminLayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hasSession, setHasSession] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Hide site header/footer for a consistent full-screen dark panel.
  useEffect(() => {
    document.body.setAttribute('data-devuser', 'true');
    return () => {
      document.body.removeAttribute('data-devuser');
    };
  }, []);

  // Re-check the shared session whenever the route changes (covers
  // login/logout transitions without a full reload).
  useEffect(() => {
    setHasSession(Boolean(loadAdminAuth().password));
    setMobileOpen(false);
  }, [pathname]);

  // React to same-tab login/logout (e.g. logging in on /admin without navigating).
  useEffect(() => {
    const sync = () => setHasSession(Boolean(loadAdminAuth().password));
    window.addEventListener(ADMIN_AUTH_CHANGED_EVENT, sync);
    return () => window.removeEventListener(ADMIN_AUTH_CHANGED_EVENT, sync);
  }, []);

  if (!hasSession) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <AdminSidebar mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Mobil üst bar — sadece hamburger */}
      <div className="sticky top-0 z-20 flex items-center gap-3 border-b border-white/10 bg-black/80 px-4 py-3 backdrop-blur lg:hidden">
        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          className="rounded-lg border border-white/10 bg-white/5 p-2 text-white/80 transition hover:bg-white/10"
          aria-label="Menüyü aç"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
            <path d="M3 12h18M3 6h18M3 18h18" />
          </svg>
        </button>
        <span className="text-sm font-semibold">Admin Paneli</span>
      </div>

      {/* `data-admin-main` lets globals.css restore the sidebar gutter that the
          `body[data-devuser] main { margin: 0 }` reset would otherwise strip. */}
      <main data-admin-main className="min-w-0 lg:ml-[264px]">{children}</main>
    </div>
  );
}
