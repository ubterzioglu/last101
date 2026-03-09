'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useMobileMenu } from '@/hooks/use-mobile-menu';
import { NAVIGATION_ITEMS } from '@/constants/navigation';
import { SITE_NAME } from '@/lib/utils/constants';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';

export function Header() {
  const { isOpen, toggle, close } = useMobileMenu();

  return (
    <header className="sticky top-0 z-50 bg-google-yellow border-b border-gray-200 shadow-sm">
      <Container size="xl">
        <div className="flex items-center justify-center h-16">
          {/* Desktop Navigation */}
          <nav className="flex items-center space-x-1">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="px-3 py-2 text-gray-700 hover:text-google-blue hover:bg-gray-50 rounded-md transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Mobile Menu Button */}
          <Button variant="ghost" size="md" className="md:hidden absolute right-4 top-4" onClick={toggle} aria-label="Menüyü aç">
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </Container>

      {/* Mobile Navigation */}
      {isOpen && (
        <nav className="md:hidden border-t border-gray-200">
          <div className="px-4 py-2 space-y-1 text-center">
            {NAVIGATION_ITEMS.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="inline-block px-3 py-2 text-gray-700 hover:text-google-blue hover:bg-gray-50 rounded-md transition-colors"
                onClick={close}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}
