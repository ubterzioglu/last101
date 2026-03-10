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
  { href: '/biz-kimiz', label: '🧑‍💻 Biz kimiz?', description: 'almanya101 ekibini tanıyın!' },
  { href: '/bize-katil', label: '🤝 Bize Katıl!', description: 'almanya101 ekibine katılmak için tıkla!' },
  { href: '/yazi-dizisi', label: '📝 Yazı Dizisi', description: 'Almanya hayatına dair adım adım yazı serileri.' },
  { href: '/maas-hesaplama', label: '💸 Brütten Nete Maaş Hesaplama', description: 'Maaşınızın netini anında görün.' },
  { href: '/vatandaslik-testi', label: '📝 Vatandaşlık Testi Denemesi', description: 'Almanya vatandaşlık testi için deneme sınavı' },
  { href: '/banka-secim', label: '💳 Banka Seçim Araci', description: '20 soruyla banka profilinizi belirleyin.' },
  { href: '/sigorta-secim', label: '🛡️ Sigorta Seçim Araci', description: '20 soruyla sigortaları önceliklendirin.' },
  { href: '/turk-hizmet-rehberi-ara', label: '👨‍⚕️ Türk Hizmet Rehberi - Ara', description: 'Doktor, avukat, tamirci vs. Türkçe destek bulun!' },
  { href: '/turk-hizmet-rehberi-oner', label: '➕ Türk Hizmet Rehberi - Öner', description: 'Bildiğiniz bir uzman eksikse ekleyin!' },
  { href: '/tatil-planlayici-turkiye', label: '✈️ Tatil Planlayıcı 2026 Türkiye', description: 'Türkiye\'de 2026 tatilinizi planlayın!' },
  { href: '/tatil-planlayici-almanya', label: '🏖️ Tatil Planlayıcı 2026 Almanya', description: 'Almanya\'da 2026 tatilinizi planlayın!' },
  { href: '/para-transferi', label: '🔁 Para Transferi Seçim Aracı', description: 'Size uygun aktarım aracını 20 soruyla bulun!' },
  { href: '/iletisim', label: '✉️ İletişim', description: 'Bizimle hızlıca iletişime geçin.' },
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
          'fixed top-0 right-0 h-[1000px] w-80 max-w-[85vw] bg-black z-50 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-hidden',
          isDrawerOpen ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {/* Drawer Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <span className="text-lg font-light text-white tracking-wide">{SITE_NAME}</span>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={closeDrawer} 
            aria-label="Menüyü kapat"
            className="p-1.5 text-white/70 hover:text-white hover:bg-white/10"
          >
            <X size={20} />
          </Button>
        </div>

        {/* Drawer Content */}
        <nav className="px-4 py-3">
          {DRAWER_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center px-3 py-3.5 text-white/90 hover:text-white hover:bg-white/10 rounded-md transition-all duration-200 group"
              onClick={closeDrawer}
            >
              <span className="font-light text-base tracking-wide group-hover:translate-x-1 transition-transform duration-200">
                {item.label}
              </span>
            </Link>
          ))}
        </nav>


      </div>
    </>
  );
}
