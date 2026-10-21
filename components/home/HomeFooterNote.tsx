import { ArrowUp } from 'lucide-react';
import { Container } from '@/components/ui/Container';

/** Publication dates as a muted line, plus the fixed back-to-top link. */
export function HomeFooterNote() {
  return (
    <>
      <Container className="py-6">
        <p className="text-sm text-muted">
          Yayın tarihi: <time dateTime="2026-01-01">Ocak 2026</time> &middot; Son güncelleme:{' '}
          <time dateTime="2026-10-21">Ekim 2026</time>
        </p>
      </Container>
      <a
        href="#"
        aria-label="Yukarı git"
        className="fixed bottom-4 right-4 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink shadow-float transition-colors hover:border-ink/40"
      >
        <ArrowUp aria-hidden="true" className="h-5 w-5" />
      </a>
    </>
  );
}
