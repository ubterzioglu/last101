'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { clearAdminAuth, getAdminHeaders } from '@/lib/admin/clientAuth';

type BadgeKey = 'hizmet' | 'broken';

interface AdminNavItem {
  href: string;
  label: string;
  description: string;
  accent: string;
  badgeKey?: BadgeKey;
  icon: React.ReactNode;
}

const NAV_ITEMS: AdminNavItem[] = [
  {
    href: '/admin/software-hub',
    label: 'Software Hub',
    description: 'Topluluk & turnuva',
    accent: 'text-google-blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </svg>
    ),
  },
  {
    href: '/admin/haberler',
    label: 'Haber Yönetimi',
    description: 'Pipeline & kuyruk',
    accent: 'text-google-yellow',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
        <path d="M4 5h16v14a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2z" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </svg>
    ),
  },
  {
    href: '/admin/yazi-dizisi',
    label: 'Arkadaşın Köşesi',
    description: 'Köşe yazıları',
    accent: 'text-google-blue',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
      </svg>
    ),
  },
  {
    href: '/admin/hizmet-rehberi',
    label: 'Hizmet Rehberi',
    description: 'Öneri onayları',
    accent: 'text-google-red',
    badgeKey: 'hizmet',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    href: '/admin/recruitment-agencies',
    label: 'Recruitment Agencies',
    description: 'Ajans listesi',
    accent: 'text-google-green',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    href: '/admin/broken-link-reports',
    label: 'Kırık Link Bildirimleri',
    description: 'Kullanıcı raporları',
    accent: 'text-google-orange',
    badgeKey: 'broken',
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className="h-5 w-5">
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <path d="M15 3h6v6M10 14L21 3" />
      </svg>
    ),
  },
];

async function fetchBadgeCounts(): Promise<Record<BadgeKey, number>> {
  const counts: Record<BadgeKey, number> = { hizmet: 0, broken: 0 };

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
  const [badges, setBadges] = useState<Record<BadgeKey, number>>({ hizmet: 0, broken: 0 });

  useEffect(() => {
    let cancelled = false;
    fetchBadgeCounts().then((counts) => {
      if (!cancelled) setBadges(counts);
    });
    return () => {
      cancelled = true;
    };
  }, [pathname]);

  function handleLogout() {
    clearAdminAuth();
    onClose();
    router.replace('/admin');
  }

  return (
    <>
      {/* Mobil arka plan örtüsü */}
      {mobileOpen ? (
        <div
          className="fixed inset-0 z-30 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      ) : null}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 flex w-[264px] flex-col border-r border-white/10 bg-white/[0.03] backdrop-blur-xl transition-transform duration-300 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex items-center justify-between gap-2 border-b border-white/10 px-5 py-5">
          <Link href="/admin" className="flex items-center" onClick={onClose}>
            <Image
              src="/almanya101.png"
              alt="almanya101"
              width={150}
              height={40}
              priority
              className="h-8 w-auto object-contain"
            />
          </Link>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-white/60 transition hover:bg-white/10 hover:text-white lg:hidden"
            aria-label="Menüyü kapat"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="h-5 w-5">
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4" aria-label="Admin bölümleri">
          {NAV_ITEMS.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group relative flex items-center gap-3 rounded-xl px-3 py-2.5 transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black',
                  active ? 'bg-white/[0.08] text-white' : 'text-white/65 hover:bg-white/[0.05] hover:text-white',
                )}
              >
                {active ? (
                  <span className="absolute inset-y-2 left-0 w-0.5 rounded-full bg-google-blue" aria-hidden="true" />
                ) : null}
                <span className={cn('shrink-0 transition', active ? item.accent : 'text-white/50 group-hover:text-white/80')}>
                  {item.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-semibold leading-tight">{item.label}</span>
                  <span className="block truncate text-[11px] text-white/40">{item.description}</span>
                </span>
                {badgeCount > 0 ? (
                  <span className="ml-1 inline-flex min-w-5 items-center justify-center rounded-full bg-google-red/20 px-1.5 py-0.5 text-[11px] font-bold text-red-200">
                    {badgeCount > 99 ? '99+' : badgeCount}
                  </span>
                ) : null}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-white/10 p-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-200/90 transition hover:bg-red-500/10 hover:text-red-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
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
