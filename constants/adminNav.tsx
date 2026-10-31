import type { ReactNode } from 'react';
import type { SiteTone } from '@/components/site/tones';

export type AdminBadgeKey = 'hizmet' | 'broken' | 'security';

export interface AdminNavItem {
  href: string;
  label: string;
  description: string;
  /** İkon aksanı: TONE_STYLES anahtarı (yalnız aktifken uygulanır). */
  tone: SiteTone;
  badgeKey?: AdminBadgeKey;
  icon: ReactNode;
}

const ICON_CLASS = 'h-5 w-5';

function NavIcon({ children }: { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7} className={ICON_CLASS} aria-hidden="true">
      {children}
    </svg>
  );
}

export const ADMIN_NAV_ITEMS: readonly AdminNavItem[] = [
  {
    href: '/admin/uyeler',
    label: 'Üyeler',
    description: 'Yeni kayıtlar & profiller',
    tone: 'blue',
    icon: (
      <NavIcon>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </NavIcon>
    ),
  },
  {
    href: '/admin/software-hub',
    label: 'Software Hub',
    description: 'Topluluk & turnuva',
    tone: 'blue',
    icon: (
      <NavIcon>
        <rect x="3" y="4" width="18" height="12" rx="2" />
        <path d="M8 20h8M12 16v4" />
      </NavIcon>
    ),
  },
  {
    href: '/admin/haberler',
    label: 'Haber Yönetimi',
    description: 'Pipeline & kuyruk',
    tone: 'yellow',
    icon: (
      <NavIcon>
        <path d="M4 5h16v14a1 1 0 0 1-1 1H6a2 2 0 0 1-2-2z" />
        <path d="M8 9h8M8 13h8M8 17h5" />
      </NavIcon>
    ),
  },
  {
    href: '/admin/yazi-dizisi',
    label: 'Arkadaşın Köşesi',
    description: 'Köşe yazıları',
    tone: 'blue',
    icon: (
      <NavIcon>
        <path d="M12 20h9" />
        <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4z" />
      </NavIcon>
    ),
  },
  {
    href: '/admin/hizmet-rehberi',
    label: 'Hizmet Rehberi',
    description: 'Öneri onayları',
    tone: 'red',
    badgeKey: 'hizmet',
    icon: (
      <NavIcon>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
      </NavIcon>
    ),
  },
  {
    href: '/admin/recruitment-agencies',
    label: 'Recruitment Agencies',
    description: 'Ajans listesi',
    tone: 'green',
    icon: (
      <NavIcon>
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </NavIcon>
    ),
  },
  {
    href: '/admin/broken-link-reports',
    label: 'Kırık Link Bildirimleri',
    description: 'Kullanıcı raporları',
    tone: 'orange',
    badgeKey: 'broken',
    icon: (
      <NavIcon>
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
        <path d="M15 3h6v6M10 14L21 3" />
      </NavIcon>
    ),
  },
  {
    href: '/admin/araclar',
    label: 'Araçlar',
    description: 'İnteraktif araçlar & soru sayıları',
    tone: 'blue',
    icon: (
      <NavIcon>
        <path d="M14.7 6.3a4 4 0 0 0-5.4 5.3L3 18l3 3 6.4-6.3a4 4 0 0 0 5.3-5.4l-2.8 2.8-2.1-.6-.6-2.1z" />
      </NavIcon>
    ),
  },
  {
    href: '/admin/rehber',
    label: 'Rehberler',
    description: 'Tüm panel kılavuzu',
    tone: 'green',
    icon: (
      <NavIcon>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <circle cx="12" cy="9.5" r="2.2" />
        <path d="M12 11.7v2.3" />
      </NavIcon>
    ),
  },
  {
    href: '/admin/guvenlik-notlari',
    label: 'Güvenlik Notları',
    description: 'Uyarılar & aksiyonlar',
    tone: 'red',
    badgeKey: 'security',
    icon: (
      <NavIcon>
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </NavIcon>
    ),
  },
];
