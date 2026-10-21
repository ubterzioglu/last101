import { Compass, HandHeart, Instagram, Mail, MessageCircle, Send } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';
import { createMetadata } from '@/lib/seo/metadata';
import { PhotoCard } from '@/components/site/PhotoCard';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ServiceGrid } from '@/components/site/ServiceGrid';
import type { ServiceItem } from '@/components/site/ServiceTile';
import { TONE_STYLES } from '@/components/site/tones';
import type { SiteTone } from '@/components/site/tones';
import { Container } from '@/components/ui/Container';
import { Section } from '@/components/ui/Section';
import { cn } from '@/lib/utils/cn';

export const metadata = createMetadata({
  title: 'Ekibimize Katıl',
  description: 'almanya101 ekibine katıl. Gönüllü içerik üretimi, teknik geliştirme ve topluluk yönetimi için bize ulaş.',
  path: '/ekibimize-katil',
});

interface InfoCard {
  icon: LucideIcon;
  tone: SiteTone;
  body: ReactNode;
}

const INFO_CARDS: InfoCard[] = [
  {
    icon: HandHeart,
    tone: 'yellow',
    body: (
      <>
        <strong className="font-semibold text-ink">Gönüllü olarak içerik üretmek</strong>, teknik geliştirme,
        sosyal medya veya topluluk yönetimi gibi konularda destek olabilirsin.
        Her katkı, topluluğumuz için çok değerli.
      </>
    ),
  },
  {
    icon: Compass,
    tone: 'blue',
    body: (
      <>
        Eğer Almanya&apos;da yaşam deneyimlerini paylaşmak, yeni gelenlere rehberlik etmek
        veya platformumuzu geliştirmeye yardımcı olmak istiyorsan, seninle tanışmayı çok isteriz.
      </>
    ),
  },
];

const CONTACT_LINKS: ServiceItem[] = [
  {
    href: 'https://chat.whatsapp.com/JXzMvjJoc57EKDDABSB0jo',
    icon: MessageCircle,
    title: 'WhatsApp',
    description: '+90 530 240 4995',
    tone: 'green',
  },
  { href: 'mailto:info@almanya101.de', icon: Mail, title: 'E-Posta', description: 'info@almanya101.de', tone: 'red' },
  {
    href: 'https://instagram.com/almanya101de',
    icon: Instagram,
    title: 'Instagram',
    description: '@almanya101',
    tone: 'orange',
  },
  { href: 'https://t.me/+UV4iuTECIIg0OWY0', icon: Send, title: 'Telegram', description: '@almanya101', tone: 'blue' },
];

export default function EkibimizeKatilPage() {
  return (
    <>
      <section className="py-12 md:py-16">
        <Container className="grid items-center gap-10 lg:grid-cols-2 lg:gap-[38px]">
          <div className="min-w-0">
            <h1 className="text-[clamp(2.25rem,4vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-0.04em] text-ink">
              Ekibimize Katıl!
            </h1>
            <p className="mt-6 text-lg font-semibold leading-snug text-ink">
              almanya101 ekibimize katılmak ister misin?
            </p>
            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted md:text-[17px]">
              Fikirlerin, projelerin veya katkı sağlamak istediğin bir alan varsa bize ulaşabilirsin.
              Almanya&apos;da yaşayan Türk topluluğuna destek olmak isteyen herkesi aramıza bekliyoruz.
            </p>
          </div>
          {/* Photo left on desktop; text stays first in the DOM and on mobile. */}
          <PhotoCard
            src="/images/site/ofis-ekip.webp"
            alt="Aydınlık bir açık ofiste bilgisayarları başında çalışan ekip"
            priority
            className="lg:order-first"
          />
        </Container>
      </section>

      <section className="bg-band py-16">
        <Container>
          <ul className="grid gap-[22px] md:grid-cols-2">
            {INFO_CARDS.map(({ icon: Icon, tone, body }) => (
              <li key={tone} className="rounded-card border border-line bg-white p-6 md:p-7">
                <span
                  aria-hidden="true"
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-tile',
                    TONE_STYLES[tone].tint,
                    TONE_STYLES[tone].text
                  )}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </span>
                <p className="mt-5 text-base leading-relaxed text-muted">{body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <Section aria-labelledby="bize-ulas">
        <SectionHeader
          id="bize-ulas"
          title="Bize Nasıl Ulaşabilirsin?"
          description="Katılmak için iletişim kanallarından bize yazman yeterli!"
        />
        <ServiceGrid items={CONTACT_LINKS} className="mt-10" />
      </Section>
    </>
  );
}
