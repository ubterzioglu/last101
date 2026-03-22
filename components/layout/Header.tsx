'use client';

import Link from 'next/link';
import { useState } from 'react';
import { X } from 'lucide-react';
import { SITE_NAME } from '@/lib/utils/constants';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils/cn';
import { DRAWER_ITEMS, DRAWER_CATEGORIES } from '@/constants/navigation';

export function Header() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = () => setIsDrawerOpen(true);
  const closeDrawer = () => setIsDrawerOpen(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-black border-b border-white/10 shadow-sm">
        <Container size="xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img src="/almanya101.png" alt={SITE_NAME} className="h-8 w-auto" />
            </Link>

            {/* Menu Button + Home Button */}
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="md" 
                onClick={openDrawer} 
                aria-label="Menüyü aç"
                className="text-white hover:bg-white/20"
              >
                Menü
              </Button>
              <Link href="/">
                <Button 
                  variant="ghost" 
                  size="md" 
                  aria-label="Ana Sayfa"
                  className="text-white hover:bg-white/20"
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
              return (
                <div key={catKey} className="mb-1">
                  <p className="px-2 py-0.5 text-xs font-semibold text-white/40 uppercase tracking-widest">
                    {cat.label}
                  </p>
                  {items.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center px-2 py-1.5 text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200 group"
                      onClick={closeDrawer}
                    >
                      <span className="font-light text-sm tracking-wide group-hover:translate-x-1 transition-transform duration-200">
                        {item.label}
                      </span>
                    </Link>
                  ))}
                </div>
              );
            })}
        </nav>
      </div>
    </>
  );
}
