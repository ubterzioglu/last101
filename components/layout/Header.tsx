'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { SITE_NAME } from '@/lib/utils/constants';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils/cn';
import { DRAWER_ITEMS, DRAWER_CATEGORIES } from '@/constants/navigation';

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({});

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-black border-b border-white/10 shadow-sm">
        <Container size="xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/almanya101header.png"
                alt={SITE_NAME}
                width={420}
                height={140}
                className="h-8 w-auto"
                priority
              />
            </Link>

            {/* Menu Button + Home Button */}
            <div className="flex items-center justify-end">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={openDrawer} 
                aria-label="Menüyü aç"
                className="text-white hover:bg-white/20 text-xs px-2 py-1 h-auto"
              >
                Menü
              </Button>
              <span className="h-3 w-px bg-white/20 mx-1" aria-hidden="true" />
              <a
                href="https://chat.whatsapp.com/JXzMvjJoc57EKDDABSB0jo"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Whatsapp Topluluğu"
                className="inline-flex items-center justify-center rounded-md px-2 py-1 text-xs font-medium text-white transition-colors hover:bg-white/20 h-auto"
              >
                Whatsapp
              </a>
              <span className="h-3 w-px bg-white/20 mx-1" aria-hidden="true" />
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  aria-label="Ana Sayfa"
                  className="text-white hover:bg-white/20 text-xs px-2 py-1 h-auto"
                >
                  Ana Sayfa
                </Button>
              </Link>
            </div>
          </div>
        </Container>
      </header>

      {/* Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div
        className={cn(
          'fixed top-0 right-0 h-dvh w-80 max-w-[85vw] bg-black z-50 shadow-2xl transform transition-transform duration-300 ease-in-out',
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-4 py-2 border-b border-white/10">
          <span className="text-base font-light text-white tracking-wide">{SITE_NAME}</span>
          <Button
            variant="ghost"
            size="sm"
            onClick={closeDrawer}
            aria-label="Menüyü kapat"
            className="p-1 text-white/70 hover:text-white hover:bg-white/10"
          >
            <X size={18} />
          </Button>
        </div>

        {/* Drawer Content */}
        <nav className="px-3 py-1">
          {/* Ana Sayfa - En üstte */}
          <Link
            href="/"
            className="flex items-center px-2 py-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200 group border-b border-white/10 mb-2"
            onClick={closeDrawer}
          >
            <span className="font-medium text-sm tracking-wide group-hover:translate-x-1 transition-transform duration-200">
              🏠 Ana Sayfa
            </span>
          </Link>

          {/* Kategorilere göre gruplandırılmış menü */}
          {(Object.entries(DRAWER_CATEGORIES) as [keyof typeof DRAWER_CATEGORIES, { label: string; order: number }][])
            .sort((a, b) => a[1].order - b[1].order)
            .map(([catKey, cat]) => {
              const items = DRAWER_ITEMS.filter(i => i.category === catKey);
              if (items.length === 0) return null;
              const isOpen = openCategories[catKey] || false;
              return (
                <div key={catKey} className="mb-0.5">
                  <button 
                    onClick={() => setOpenCategories(prev => ({ ...prev, [catKey]: !prev[catKey] }))}
                    className="w-full flex items-center justify-between px-2 py-1.5 text-left group hover:bg-white/5 rounded-md transition-colors"
                  >
                    <span className="text-[11px] font-semibold text-white/40 uppercase tracking-widest group-hover:text-white/60">
                      {cat.label}
                    </span>
                    <ChevronDown size={14} className={cn("text-white/40 transition-transform duration-200", isOpen && "rotate-180")} />
                  </button>
                  <div className={cn("grid transition-all duration-200 ease-in-out", isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                    <div className="overflow-hidden flex flex-col">
                      {items.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          className="flex items-center pl-4 pr-2 py-1 text-white/80 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200 group"
                          onClick={closeDrawer}
                        >
                          <span className="font-light text-[13px] leading-tight tracking-wide group-hover:translate-x-1 transition-transform duration-200">
                            {item.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
        </nav>
      </div>
    </>
  );
}
