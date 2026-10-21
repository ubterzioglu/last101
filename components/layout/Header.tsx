'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useRef, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Menu } from 'lucide-react';
import { WhatsAppIcon } from '@/components/icons/ContactIcons';
import { HEADER_DRAWER_ID, HeaderDrawer } from '@/components/layout/HeaderDrawer';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import { CONTACT_CHANNELS } from '@/constants/contact-channels';
import { HEADER_PRIMARY_LINKS } from '@/constants/navigation';
import { useAuthUser } from '@/hooks/useAuthUser';
import { SITE_NAME } from '@/lib/utils/constants';

const WHATSAPP_HREF =
  CONTACT_CHANNELS.find((channel) => channel.id === 'whatsapp')?.href ?? '/iletisim';

const NAV_LINK =
  'whitespace-nowrap text-sm font-medium text-ink underline-offset-[10px] transition-colors hover:text-brand-700 xl:text-[15px] aria-[current=page]:underline aria-[current=page]:decoration-brand-700 aria-[current=page]:decoration-2';
// Desktop-only text actions on the right; below lg they live in the drawer.
const TEXT_ACTION =
  'hidden min-h-[44px] items-center gap-1.5 whitespace-nowrap text-sm font-medium text-ink transition-colors hover:text-brand-700 lg:inline-flex';

function isActivePath(pathname: string | null, href: string): boolean {
  return pathname === href || Boolean(pathname?.startsWith(`${href}/`));
}

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { status, signOut } = useAuthUser();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerPathname, setDrawerPathname] = useState(pathname);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const isAuthed = status === 'authed';

  // Any route change (link, back/forward, redirect) closes the drawer.
  if (drawerPathname !== pathname) {
    setDrawerPathname(pathname);
    setIsDrawerOpen(false);
  }

  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const handleSignOut = async () => {
    await signOut();
    closeDrawer();
    router.refresh();
  };

  return (
    <>
      <header className="sticky top-0 z-50 h-20 border-b border-line bg-page/95 backdrop-blur-sm">
        <Container className="flex h-full items-center justify-between gap-6">
          <Link href="/" className="shrink-0">
            <Image
              src="/almanya101header.png"
              alt={SITE_NAME}
              width={1500}
              height={350}
              priority
              className="h-8 w-auto"
            />
          </Link>

          <nav aria-label="Ana menü" className="hidden lg:block">
            <ul className="flex items-center gap-4 xl:gap-7">
              {HEADER_PRIMARY_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={isActivePath(pathname, href) ? 'page' : undefined}
                    className={NAV_LINK}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="flex items-center gap-4 xl:gap-5">
            <a
              href={WHATSAPP_HREF}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp Topluluğu"
              className={TEXT_ACTION}
            >
              <span aria-hidden="true" className="inline-flex">
                <WhatsAppIcon className="h-[18px] w-[18px]" />
              </span>
              <span className="sr-only xl:not-sr-only">WhatsApp</span>
            </a>

            {isAuthed ? (
              <button type="button" onClick={handleSignOut} aria-label="Çıkış yap" className={TEXT_ACTION}>
                Çıkış
              </button>
            ) : (
              <>
                <Link href="/giris" className={TEXT_ACTION}>
                  Giriş yap
                </Link>
                <Button href="/giris" size="sm" arrow className="hidden lg:inline-flex">
                  Üye Ol
                </Button>
              </>
            )}

            <button
              ref={menuButtonRef}
              type="button"
              onClick={() => setIsDrawerOpen(true)}
              aria-haspopup="dialog"
              aria-expanded={isDrawerOpen}
              aria-controls={isDrawerOpen ? HEADER_DRAWER_ID : undefined}
              className="inline-flex min-h-[44px] items-center gap-2 rounded-btn border border-line bg-white px-4 text-sm font-semibold text-ink transition-colors hover:border-ink lg:hidden"
            >
              <Menu aria-hidden="true" size={18} />
              Menü
            </button>
          </div>
        </Container>
      </header>

      {isDrawerOpen && (
        <HeaderDrawer
          pathname={pathname}
          authStatus={status}
          whatsappHref={WHATSAPP_HREF}
          onClose={closeDrawer}
          onSignOut={handleSignOut}
          returnFocusRef={menuButtonRef}
        />
      )}
    </>
  );
}
