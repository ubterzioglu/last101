'use client';

import { useRef } from 'react';
import { AdminPageHeader } from '@/components/admin/ui/AdminPageHeader';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';

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
    <div className="min-h-screen bg-page text-ink">
      <AdminPageHeader
        title={title}
        description={description}
        actions={
          <>
            <Button href="/admin" variant="outline" size="sm">
              Admin Ana Menü
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={onLogout}>
              Çıkış Yap
            </Button>
          </>
        }
      />

      <div className="px-4 sm:px-6 lg:px-9">
        <nav
          className="flex flex-wrap gap-x-6 border-b border-line"
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
                className={cn(
                  '-mb-px min-h-[44px] border-b-2 px-1 text-sm font-semibold transition-colors',
                  active
                    ? 'border-brand-700 text-brand-800'
                    : 'border-transparent text-muted hover:text-ink',
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </nav>

        <section
          className="py-8"
          id="news-admin-panel"
          role="tabpanel"
          aria-labelledby={`news-admin-tab-${activeTab}`}
        >
          {children}
        </section>
      </div>
    </div>
  );
}
