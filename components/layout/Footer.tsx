import Link from 'next/link';
import { FOOTER_LINKS } from '@/constants/navigation';
import { SITE_NAME, SOCIAL_LINKS, CONTACT_INFO } from '@/lib/utils/constants';
import { Container } from '@/components/ui/Container';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <Container size="xl">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-white mb-4">{SITE_NAME}</h3>
            <p className="text-gray-400 text-sm">
              Almanya'da yaşayan veya taşınmayı planlayan Türkler için kapsamlı bilgi rehberi.
            </p>
          </div>

          {/* Site Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Site</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.site.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-google-blue transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* About Links */}
          <div>
            <h4 className="font-semibold text-white mb-4">Hakkımızda</h4>
            <ul className="space-y-2">
              {FOOTER_LINKS.about.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="hover:text-google-blue transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold text-white mb-4">İletişim</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href={`mailto:${CONTACT_INFO.email}`} className="hover:text-google-blue transition-colors">
                  {CONTACT_INFO.email}
                </a>
              </li>
              <li>
                <a href={`tel:${CONTACT_INFO.phone}`} className="hover:text-google-blue transition-colors">
                  {CONTACT_INFO.phone}
                </a>
              </li>
              <li>{CONTACT_INFO.address}</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-sm text-gray-400">
              © {currentYear} {SITE_NAME}. Tüm hakları saklıdır.
            </p>

            {/* Social Links - Placeholders */}
            <div className="flex space-x-4">
              {Object.entries(SOCIAL_LINKS).map(([key, href]) => (
                <a
                  key={key}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-google-blue transition-colors"
                  aria-label={`${key.charAt(0).toUpperCase() + key.slice(1)} link`}
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" />
                  </svg>
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex space-x-4 text-sm">
              {FOOTER_LINKS.legal.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-gray-400 hover:text-google-blue transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
