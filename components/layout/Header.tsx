'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { useMobileMenu } from '@/hooks/use-mobile-menu';
import { NAVIGATION_ITEMS } from '@/constants/navigation';
import { SITE_NAME } from '@/lib/utils/constants';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils/cn';

interface DropdownItem {
  href: string;
  label: string;
  description?: string;
}

interface NavItemWithDropdown {
  href: string;
  label: string;
  id: string;
  dropdown?: DropdownItem[];
}

const NAV_WITH_DROPDOWN: NavItemWithDropdown[] = [
  { href: '/', label: 'Ana Sayfa', id: 'home' },
  { 
    href: '/almanyada-yasam', 
    label: "Almanya'da Yaşam", 
    id: 'life',
    dropdown: [
      { href: '/almanyada-yasam#calisma', label: 'Çalışma Hayatı', description: 'Almanya\'da iş bulma ve çalışma kültürü' },
      { href: '/almanyada-yasam#yasam', label: 'Yaşam Koşulları', description: 'Konaklama, ulaşım ve günlük yaşam' },
      { href: '/almanyada-yasam#egitim', label: 'Eğitim Sistemi', description: 'Okul ve üniversite eğitimi' },
      { href: '/almanyada-yasam#saglik', label: 'Sağlık Sistemi', description: 'Sağlık sigortası ve hizmetleri' },
    ]
  },
  { 
    href: '/is-ilanlari', 
    label: 'İş İlanları', 
    id: 'jobs',
    dropdown: [
      { href: '/is-ilanlari#yazilim', label: 'Yazılım & IT', description: 'Developer, designer ve IT pozisyonları' },
      { href: '/is-ilanlari#muhendislik', label: 'Mühendislik', description: 'Makine, elektrik ve inşaat mühendisliği' },
      { href: '/is-ilanlari#satis', label: 'Satış & Pazarlama', description: 'Sales ve marketing pozisyonları' },
      { href: '/is-ilanlari#saglik', label: 'Sağlık', description: 'Doktor, hemşire ve sağlık çalışanları' },
    ]
  },
  { href: '/rehber', label: 'Rehber', id: 'guide' },
  { href: '/topluluk', label: 'Topluluk', id: 'community' },
  { href: '/hakkimizda', label: 'Hakkımızda', id: 'about' },
  { href: '/iletisim', label: 'İletişim', id: 'contact' },
];

function DesktopNavItem({ item }: { item: NavItemWithDropdown }) {
  const [isOpen, setIsOpen] = useState(false);

  if (!item.dropdown) {
    return (
      <Link
        href={item.href}
        className="px-4 py-2 text-gray-700 hover:text-google-blue hover:bg-gray-50 rounded-md transition-colors font-medium"
      >
        {item.label}
      </Link>
    );
  }

  return (
    <div 
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button 
        className={cn(
          'flex items-center gap-1 px-4 py-2 rounded-md transition-colors font-medium',
          isOpen ? 'text-google-blue bg-gray-50' : 'text-gray-700 hover:text-google-blue hover:bg-gray-50'
        )}
      >
        {item.label}
        <ChevronDown className={cn('w-4 h-4 transition-transform', isOpen && 'rotate-180')} />
      </button>
      
      {isOpen && (
        <div className="absolute top-full left-0 pt-2 w-72 z-50">
          <div className="bg-white rounded-lg shadow-lg border border-gray-100 py-2">
            {item.dropdown.map((dropdownItem) => (
              <Link
                key={dropdownItem.href}
                href={dropdownItem.href}
                className="block px-4 py-3 hover:bg-gray-50 transition-colors"
              >
                <div className="font-medium text-gray-900">{dropdownItem.label}</div>
                {dropdownItem.description && (
                  <div className="text-sm text-gray-500 mt-0.5">{dropdownItem.description}</div>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export function Header() {
  const { isOpen, toggle, close } = useMobileMenu();
  const [expandedMobileItem, setExpandedMobileItem] = useState<string | null>(null);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
      <Container size="xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-gray-900">{SITE_NAME}</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {NAV_WITH_DROPDOWN.map((item) => (
              <DesktopNavItem key={item.id} item={item} />
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button variant="primary" size="md" asChild href="/is-ilanlari">
              İş Başvurusu Yap
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button 
            variant="ghost" 
            size="md" 
            className="md:hidden" 
            onClick={toggle} 
            aria-label="Menüyü aç"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </Container>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-white">
          <div className="px-4 py-2 space-y-1">
            {NAV_WITH_DROPDOWN.map((item) => (
              <div key={item.id}>
                {item.dropdown ? (
                  <>
                    <button
                      onClick={() => setExpandedMobileItem(
                        expandedMobileItem === item.id ? null : item.id
                      )}
                      className="flex items-center justify-between w-full px-3 py-2 text-gray-700 hover:text-google-blue hover:bg-gray-50 rounded-md transition-colors"
                    >
                      {item.label}
                      <ChevronDown className={cn(
                        'w-4 h-4 transition-transform',
                        expandedMobileItem === item.id && 'rotate-180'
                      )} />
                    </button>
                    {expandedMobileItem === item.id && (
                      <div className="pl-4 space-y-1">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className="block px-3 py-2 text-sm text-gray-600 hover:text-google-blue hover:bg-gray-50 rounded-md transition-colors"
                            onClick={close}
                          >
                            {dropdownItem.label}
                          </Link>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <Link
                    href={item.href}
                    className="block px-3 py-2 text-gray-700 hover:text-google-blue hover:bg-gray-50 rounded-md transition-colors"
                    onClick={close}
                  >
                    {item.label}
                  </Link>
                )}
              </div>
            ))}
            <div className="pt-2">
              <Button variant="primary" size="md" className="w-full" asChild href="/is-ilanlari">
                İş Başvurusu Yap
              </Button>
            </div>
          </div>
        </nav>
      )}
    </header>
  );
}
