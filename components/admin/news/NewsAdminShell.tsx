'use client';

import Link from 'next/link';
import { useRef } from 'react';

export type NewsAdminTab = 'kuyruk' | 'editor' | 'kaynaklar' | 'pipeline' | 'ayarlar';

export interface NewsAdminTabItem {
  id: NewsAdminTab;
  label: string;
}

interface NewsAdminShellProps {
  title: string;
  description: string;
  tabs: NewsAdminTabItem[];
  activeTab: NewsAdminTab;
  onTabChange: (tab: NewsAdminTab) => void;
  onLogout: () => void;
  children: React.ReactNode;
}

/**
 * Pure presentation frame for the single-page news admin panel.
 *
 * Owns no auth or routing logic: it renders the header band (title,
 * description, logout) and an accessible tablist, then renders the active
 * section as `children`. State and auth live in `NewsAdminPanel`.
 */
export function NewsAdminShell({
  title,
  description,
  tabs,
  activeTab,
  onTabChange,
  onLogout,
  children,
}: NewsAdminShellProps) {
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);

  function handleKeyDown(event: React.KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft' && event.key !== 'Home' && event.key !== 'End') {
      return;
    }
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowRight') nextIndex = (index + 1) % tabs.length;
    if (event.key === 'ArrowLeft') nextIndex = (index - 1 + tabs.length) % tabs.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabs.length - 1;

    const nextTab = tabs[nextIndex];
    onTabChange(nextTab.id);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="border-b border-white/10">
        <div className="container py-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <Link
                href="/admin"
                className="inline-flex rounded-full border border-white/15 bg-white/[0.05] px-4 py-2 text-xs uppercase tracking-[0.18em] text-white/68 transition hover:bg-white/[0.1] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-google-blue focus-visible:ring-offset-2 focus-visible:ring-offset-black"
              >
                Admin Ana Menü
              </Link>
              <h1 className="mt-4 text-4xl font-black">{title}</h1>
              <p className="mt-3 max-w-3xl text-sm leading-7 text-white/68">{description}</p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-full border border-red-400/20 bg-red-500/10 px-4 py-2 text-xs font-semibold text-red-100 transition hover:bg-red-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              Çıkış Yap
            </button>
          </div>

          <nav
            className="mt-8 flex flex-wrap gap-2"
            role="tablist"
            aria-label="Haber yönetimi bölümleri"
          >
            {tabs.map((tab, index) => {
              const active = tab.id === activeTab;
              return (
                <button
                  key={tab.id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  type="button"
                  role="tab"
                  id={`news-admin-tab-${tab.id}`}
                  aria-selected={active}
                  aria-controls="news-admin-panel"
                  tabIndex={active ? 0 : -1}
                  onClick={() => onTabChange(tab.id)}
                  onKeyDown={(event) => handleKeyDown(event, index)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-black ${
                    active
                      ? 'bg-google-yellow text-black focus-visible:ring-google-yellow'
                      : 'border border-white/10 bg-white/[0.04] text-white/74 hover:bg-white/[0.08] focus-visible:ring-google-blue'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>
      </section>

      <section
        className="container py-8"
        id="news-admin-panel"
        role="tabpanel"
        aria-labelledby={`news-admin-tab-${activeTab}`}
      >
        {children}
      </section>
    </div>
  );
}
