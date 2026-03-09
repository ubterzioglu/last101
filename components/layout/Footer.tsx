import Link from 'next/link';
import { FOOTER_LINKS } from '@/constants/navigation';
import { SITE_NAME, SOCIAL_LINKS, CONTACT_INFO } from '@/lib/utils/constants';
import { Container } from '@/components/ui/Container';

export function Footer() {
  return (
    <footer className="bg-google-yellow text-gray-900 py-8">
      <Container size="xl">
        <div className="text-center">
          <p className="text-sm">
            yalnız değilsin! almanya101 seninle!
          </p>
        </div>
      </Container>
    </footer>
  );
}
