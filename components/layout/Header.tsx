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
      <header className="sticky top-0 z-50 bg-google-yellow border-b border-gray-200 shadow-sm">
        <Container size="xl">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <span className="text-xl font-bold text-gray-900">{SITE_NAME}</span>
            </Link>

            {/* Menu Button */}
            <Button 
              variant="ghost" 
              size="md" 
              onClick={openDrawer} 
              aria-label="Menüyü aç"
              className="text-gray-900 hover:bg-white/20"
            >
              Menü
            </Button>
          </div>
        </Container>
      </header>

      {/* Overlay */}
      {isDrawerOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-50 transition-opacity"
          onClick={closeDrawer}
        />
      )}

      {/* Drawer */}
      <div 
        className={cn(
          'fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-white z-50 shadow-xl transform transition-transform duration-300 ease-in-out',
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <span className="text-lg font-bold text-gray-900">{SITE_NAME}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={closeDrawer} 
            aria-label="Menüyü kapat"
            className="p-2"
          >
            <X size={24} />
          </Button>
        </div>

        {/* Drawer Content */}
        <nav className="p-4 space-y-1 overflow-y-auto h-[calc(100%-80px)]">
          {DRAWER_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 text-gray-700 hover:text-google-blue hover:bg-gray-50 rounded-lg transition-colors"
              onClick={closeDrawer}
            >
              <div className="font-medium">{item.label}</div>
              {item.description && (
                <div className="text-sm text-gray-500 mt-0.5">{item.description}</div>
              )}
            </Link>
          ))}
        </nav>

        {/* Drawer Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 bg-white">
          <Button variant="primary" size="md" className="w-full" asChild href="/is-ilanlari" onClick={closeDrawer}>
            İş Başvurusu Yap
          </Button>
        </div>
      </div>
    </>
  );
}
