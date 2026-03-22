import Link from 'next/link';
import { Container } from '@/components/ui/Container';

export function Footer() {
  return (
    <footer className="bg-black text-white py-8">
      <Container size="xl">
        <div className="text-center space-y-2">
          <p className="text-sm">
            yalnız değilsin! almanya101 seninle!
          </p>
          <p className="text-xs text-gray-700">
            <a
              href="https://www.spindorai.com"
              rel="dofollow"
              target="_blank"
              className="hover:underline"
            >
              Seo Aracı
            </a>
            {' '}ve Seo Hizmetleri Spindora
          </p>
        </div>
      </Container>
    </footer>
  );
}
