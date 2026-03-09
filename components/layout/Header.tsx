'use client';

import Link from 'next/link';
import { useState } from 'react';
import { X } from 'lucide-react';
import { SITE_NAME } from '@/lib/utils/constants';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils/cn';

interface DrawerItem {
  href: string;
  label: string;
  description?: string;
}

const DRAWER_ITEMS: DrawerItem[] = [
  { href: '/', label: 'Ana Sayfa' },
  { href: '/almanyada-yasam', label: "Almanya'da Yaşam", description: 'Çalışma, yaşam, eğitim ve sağlık' },
  { href: '/is-ilanlari', label: 'İş İlanları', description: 'Yazılım, mühendislik, satış ve sağlık' },
  { href: '/rehber', label: 'Rehber' },
  { href: '/topluluk', label: 'Topluluk' },
  { href: '/hakkimizda', label: 'Hakkımızda' },
  { href: '/iletisim', label: 'İletişim' },
];

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
              <span className="text-xl font-bold text-white">{SITE_NAME}</span>
            </Link>

            {/* Menu Button */}
            <Button 
              variant="ghost" 
              size="md" 
              onClick={openDrawer} 
              aria-label="Menüyü aç"
              className="text-white hover:bg-white/20"
            >
              Menü
            </Button>
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
          'fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-black z-50 shadow-2xl transform transition-transform duration-300 ease-in-out',
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <span className="text-xl font-light text-white tracking-wide">{SITE_NAME}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={closeDrawer} 
            aria-label="Menüyü kapat"
            className="p-2 text-white/70 hover:text-white hover:bg-white/10"
          >
            <X size={24} />
          </Button>
        </div>

        {/* Drawer Content */}
        <nav className="p-6 space-y-2 overflow-y-auto h-[calc(100%-160px)]">
          {DRAWER_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-4 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200 group"
              onClick={closeDrawer}
            >
              <div className="font-light text-lg tracking-wide group-hover:translate-x-1 transition-transform duration-200">
                {item.label}
              </div>
              {item.description && (
                <div className="text-sm text-white/50 mt-1 font-light">{item.description}</div>
              )}
            </Link>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-white/10 bg-black">
          <Button 
            variant="primary" 
            size="md" 
            className="w-full bg-white text-black hover:bg-white/90 font-medium tracking-wide" 
            asChild 
            href="/is-ilanlari" 
            onClick={closeDrawer}
          >
            İş Başvurusu Yap
          </Button>
        </div>
      </div>
    </>
  );
}
