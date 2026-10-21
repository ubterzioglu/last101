'use client';

import Link from 'next/link';
import { useId, useRef, useState } from 'react';
import type { RefObject } from 'react';
import { ArrowUpRight, ChevronDown, Home, X } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/ContactIcons';
import { useDrawerA11y } from '@/components/layout/useDrawerA11y';
import { Button } from '@/components/ui/Button';
import { DRAWER_CATEGORIES, DRAWER_ITEMS } from '@/constants/navigation';
import type { AuthStatus } from '@/hooks/useAuthUser';
import { cn } from '@/lib/utils/cn';

export const HEADER_DRAWER_ID = 'site-menu';

type CategoryKey = keyof typeof DRAWER_CATEGORIES;

const DRAWER_GROUPS = (Object.keys(DRAWER_CATEGORIES) as CategoryKey[])
  .sort((a, b) => DRAWER_CATEGORIES[a].order - DRAWER_CATEGORIES[b].order)
  .map((key) => ({
    key,
    label: DRAWER_CATEGORIES[key].label,
    items: DRAWER_ITEMS.filter((item) => item.category === key),
  }))
  .filter((group) => group.items.length > 0);

// The desktop "Araçlar" link points at the tools hub; keep it reachable on mobile too.
const TOOLS_HUB = { href: '/almanya-araclari', label: 'Tüm araçlar' };

const LINK_ROW =
  'flex min-h-[44px] items-center text-[15px] text-ink transition-colors hover:text-brand-700 aria-[current=page]:font-semibold aria-[current=page]:text-brand-700';
const TEXT_ACTION =
  'inline-flex min-h-[44px] items-center gap-2 text-[15px] font-semibold text-ink transition-colors hover:text-brand-700';

interface HeaderDrawerProps {
  pathname: string | null;
  authStatus: AuthStatus;
  whatsappHref: string;
  onClose: () => void;
  onSignOut: () => void;
  /** Element that receives focus again when the drawer closes (the Menü trigger). */
  returnFocusRef: RefObject<HTMLElement | null>;
}

export function HeaderDrawer({
  pathname,
  authStatus,
  whatsappHref,
  onClose,
  onSignOut,
  returnFocusRef,
}: HeaderDrawerProps) {
  const idPrefix = useId();
  const titleId = `${idPrefix}-title`;
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [openGroups, setOpenGroups] = useState<Partial<Record<CategoryKey, boolean>>>({});

  useDrawerA11y({ panelRef, initialFocusRef: closeButtonRef, returnFocusRef, onClose });

  const toggleGroup = (key: CategoryKey) =>
    setOpenGroups((previous) => ({ ...previous, [key]: !previous[key] }));
  const currentFor = (href: string) => (pathname === href ? 'page' : undefined);

  return (
    <div className="fixed inset-0 z-[60]">
      <div aria-hidden="true" className="absolute inset-0 bg-ink/40" onClick={onClose} />

      <div
        ref={panelRef}
        id={HEADER_DRAWER_ID}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="absolute inset-y-0 right-0 flex w-[88vw] max-w-sm flex-col border-l border-line bg-page"
      >
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-line px-5">
          <p id={titleId} className="text-[13px] font-bold uppercase tracking-[0.13em] text-ink">
            Menü
          </p>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={onClose}
            aria-label="Menüyü kapat"
            className="inline-flex h-11 w-11 items-center justify-center rounded-btn border border-line bg-white text-ink transition-colors hover:border-ink"
          >
            <X aria-hidden="true" size={20} />
          </button>
        </div>

        <nav aria-label="Site menüsü" className="flex-1 overflow-y-auto px-5">
          <Link
            href="/"
            onClick={onClose}
            aria-current={currentFor('/')}
            className={cn(LINK_ROW, 'gap-3 border-b border-line font-semibold')}
          >
            <Home aria-hidden="true" size={18} className="shrink-0" />
            Ana Sayfa
          </Link>

          {DRAWER_GROUPS.map((group) => {
            const isOpen = Boolean(openGroups[group.key]);
            const listId = `${idPrefix}-${group.key}`;

            return (
              <div key={group.key} className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-controls={listId}
                  onClick={() => toggleGroup(group.key)}
                  className="flex min-h-[52px] w-full items-center justify-between gap-3 text-left text-[15px] font-bold text-ink transition-colors hover:text-brand-700"
                >
                  {group.label}
                  <ChevronDown
                    aria-hidden="true"
                    size={18}
                    className={cn('shrink-0 text-muted', isOpen && 'rotate-180')}
                  />
                </button>
                <ul id={listId} hidden={!isOpen} className="pb-3">
                  {group.items.map((item) => (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={currentFor(item.href)}
                        className={cn(LINK_ROW, 'pl-3')}
                      >
                        {item.label}
                      </Link>
                    </li>
                  ))}
                  {group.key === 'tools' && (
                    <li>
                      <Link
                        href={TOOLS_HUB.href}
                        onClick={onClose}
                        aria-current={currentFor(TOOLS_HUB.href)}
                        className={cn(LINK_ROW, 'gap-1.5 pl-3 font-semibold text-brand-700')}
                      >
                        {TOOLS_HUB.label}
                        <ArrowUpRight aria-hidden="true" size={14} className="shrink-0" />
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            );
          })}
        </nav>

        <div className="shrink-0 space-y-2 border-t border-line px-5 py-4">
          <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={TEXT_ACTION}>
            <span aria-hidden="true" className="inline-flex">
              <WhatsAppIcon className="h-5 w-5" />
            </span>
            WhatsApp
          </a>

          {authStatus === 'authed' ? (
            <button type="button" onClick={onSignOut} aria-label="Çıkış yap" className={TEXT_ACTION}>
              Çıkış
            </button>
          ) : (
            <div className="flex items-center gap-5">
              <Link href="/giris" onClick={onClose} className={TEXT_ACTION}>
                Giriş yap
              </Link>
              <Button href="/giris" onClick={onClose} arrow className="flex-1">
                Üye Ol
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
