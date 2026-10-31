'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { clearAdminAuth, getAdminHeaders } from '@/lib/admin/clientAuth';
import { SOFTWARE_HUB_SECTIONS } from '@/constants/adminSoftwareHubSections';
import { ADMIN_NAV_ITEMS } from '@/constants/adminNav';
import type { AdminBadgeKey } from '@/constants/adminNav';
import { TONE_STYLES } from '@/components/site/tones';
import { getTrapTarget } from '@/components/layout/useDrawerA11y';

/** Id of the sidebar element; the mobile menu button points aria-controls at it. */
export const ADMIN_SIDEBAR_ID = 'admin-sidebar';

const SOFTWARE_HUB_HREF = '/admin/software-hub';

type BadgeCounts = Record<AdminBadgeKey, number>;

async function fetchBadgeCounts(): Promise<BadgeCounts> {
  const counts: BadgeCounts = { hizmet: 0, broken: 0, security: 0 };

  try {
    const response = await fetch('/api/provider-submissions-admin-list?status=pending&limit=1', {
      headers: getAdminHeaders({ Accept: 'application/json' }),
    });
    if (response.ok) {
      const payload = await response.json().catch(() => ({}));
      counts.hizmet = Number(payload?.stats?.pending || 0);
    }
  } catch {
    // Sessizce yok say — rozet opsiyonel.
  }

  try {
    const response = await fetch('/api/broken-link-reports-admin-list', {
      headers: getAdminHeaders({ Accept: 'application/json' }),
    });
    if (response.ok) {
      const payload = await response.json().catch(() => ({}));
      counts.broken = Array.isArray(payload?.reports) ? payload.reports.length : 0;
    }
  } catch {
    // Sessizce yok say.
  }

  try {
    const response = await fetch('/api/admin/security-notes?status=open', {
      headers: getAdminHeaders({ Accept: 'application/json' }),
    });
    if (response.ok) {
      const payload = await response.json().catch(() => ({}));
      counts.security = Number(payload?.stats?.open || 0);
    }
  } catch {
    // Sessizce yok say.
  }

  return counts;
}

interface AdminSidebarProps {
  /** Mobil drawer açık mı (layout shell yönetir). */
  mobileOpen: boolean;
  onClose: () => void;
}

export function AdminSidebar({ mobileOpen, onClose }: AdminSidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const asideRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [badges, setBadges] = useState<BadgeCounts>({ hizmet: 0, broken: 0, security: 0 });

  const onSoftwareHub = pathname === SOFTWARE_HUB_HREF || pathname.startsWith(`${SOFTWARE_HUB_HREF}/`);

  // Active Software Hub sub-section, derived from `?section=`. `usePathname`
  // does not observe query changes, so we read `window.location.search` and
  // refresh it on pathname changes and on history navigation.
  const [activeSection, setActiveSection] = useState<string | null>(null);

  useEffect(() => {
    const readSection = () => {
      if (typeof window === 'undefined') return;
      setActiveSection(new URLSearchParams(window.location.search).get('section'));
    };
    readSection();
    window.addEventListener('popstate', readSection);
    return () => window.removeEventListener('popstate', readSection);
  }, [pathname]);

  useEffect(() => {
    let cancelled = false;
    fetchBadgeCounts().then((counts) => {
      if (!cancelled) setBadges(counts);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  // Mobile drawer a11y: while open, focus moves into it, Escape closes it, Tab
  // stays inside, and focus returns to the trigger on close. Scoped to the open
  // state (the sidebar is always mounted, so useDrawerA11y's mount-time scroll
  // lock does not fit); the desktop sidebar is unaffected (lg:hidden controls).
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!mobileOpen) return;
    const panel = asideRef.current;
    const returnTarget = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    closeButtonRef.current?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;
      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>('a[href], button:not([disabled])'),
      ).filter((element) => element.getClientRects().length > 0);
      const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const target = getTrapTarget(focusables, active, event.shiftKey);
      if (target || focusables.length === 0) event.preventDefault();
      target?.focus();
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      returnTarget?.focus();
    };
  }, [mobileOpen]);

  function handleLogout() {
    clearAdminAuth();
    onClose();
    router.replace('/admin');
  }

  return (
    <>
      {/* Mobil arka plan örtüsü */}
      {mobileOpen ? (
        <div className="fixed inset-0 z-30 bg-ink/40 lg:hidden" onClick={onClose} aria-hidden="true" />
      ) : null}

      <aside
        ref={asideRef}
        id={ADMIN_SIDEBAR_ID}
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-line bg-white transition-[transform,visibility] duration-300 lg:visible lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : 'invisible -translate-x-full',
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-line px-5 py-5">
          <Link href="/admin" className="flex items-center" onClick={onClose}>
            <Image
              src="/almanya101header.png"
              alt="almanya101"
              width={150}
              height={35}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            className="inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-btn text-muted transition-colors hover:bg-band hover:text-ink lg:hidden"
            aria-label="Menüyü kapat"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Admin bölümleri">
          {ADMIN_NAV_ITEMS.map((item) => {
            const isSoftwareHub = item.href === SOFTWARE_HUB_HREF;
            const onRoute = pathname === item.href || pathname.startsWith(`${item.href}/`);
            // Software Hub's main link only counts as "active" on its menu page
            // (no `?section=`); otherwise a sub-section is highlighted instead.
            const active = isSoftwareHub ? onRoute && !activeSection : onRoute;
            const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;
            return (
              <div key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => {
                    if (isSoftwareHub) setActiveSection(null);
                    onClose();
                  }}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'group relative flex min-h-[44px] items-center gap-3 rounded-btn px-3 py-2.5 transition-colors',
                    active ? 'bg-brand-50 text-brand-800' : 'text-muted hover:bg-band hover:text-ink',
                  )}
                >
                  {active ? (
                    <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-brand-600" aria-hidden="true" />
                  ) : null}
                  <span className={cn('shrink-0 transition-colors', active ? TONE_STYLES[item.tone].text : 'text-muted')}>
                    {item.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-semibold leading-tight">{item.label}</span>
                    <span className="block truncate text-[11px] text-muted">{item.description}</span>
                  </span>
                  {badgeCount > 0 ? (
                    <span
                      className={cn(
                        'ml-1 inline-flex min-w-5 items-center justify-center rounded-full border px-1.5 py-0.5 text-[11px] font-bold',
                        TONE_STYLES.red.tint,
                        TONE_STYLES.red.border,
                        TONE_STYLES.red.text,
                      )}
                    >
                      {badgeCount > 99 ? '99+' : badgeCount}
                    </span>
                  ) : null}
                </Link>

                {/* Software Hub alt bölümleri — sadece bu sayfadayken göster.
                    Ara menü sayfası /admin/software-hub olarak erişilebilir kalır. */}
                {isSoftwareHub && onSoftwareHub ? (
                  <ul className="mt-1 ml-4 space-y-0.5 border-l border-line pl-3">
                    {SOFTWARE_HUB_SECTIONS.map((section) => {
                      const sectionActive = activeSection === section.key;
                      return (
                        <li key={section.key}>
                          <Link
                            href={`${SOFTWARE_HUB_HREF}?section=${section.key}`}
                            onClick={() => {
                              setActiveSection(section.key);
                              onClose();
                            }}
                            aria-current={sectionActive ? 'page' : undefined}
                            className={cn(
                              'block min-h-[36px] truncate rounded-tile px-3 py-1.5 text-[13px] transition-colors',
                              sectionActive
                                ? 'bg-brand-50 font-semibold text-brand-800'
                                : 'text-muted hover:bg-band hover:text-ink',
                            )}
                          >
                            {section.label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                ) : null}
              </div>
            );
          })}
        </nav>

        <div className="border-t border-line p-3">
          <button
            type="button"
            onClick={handleLogout}
            className={cn(
              'flex min-h-[44px] w-full items-center gap-3 rounded-btn px-3 py-2.5 text-sm font-semibold transition-colors hover:bg-band',
              TONE_STYLES.red.text,
            )}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9" />
            </svg>
            Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  );
}
