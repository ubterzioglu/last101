import { ArrowUpRight } from 'lucide-react';
import { createMetadata } from '@/lib/seo/metadata';
import { ContactChannelCard } from '@/components/home/ContactChannelCard';
import { CtaRow } from '@/components/site/CtaRow';
import { PageHead } from '@/components/site/PageHead';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Section } from '@/components/ui/Section';
import { CONTACT_CHANNELS } from '@/constants/contact-channels';

export const metadata = createMetadata({
  title: 'İletişim',
  description: 'almanya101 ile iletişime geçin. Sosyal medya hesaplarımız üzerinden bize ulaşabilirsiniz.',
  path: '/iletisim',
});

const WHATSAPP_HREF = CONTACT_CHANNELS.find((channel) => channel.id === 'whatsapp')?.href;

// The ui Button only renders internal links, so the external WhatsApp CTA mirrors its primary look.
const EXTERNAL_CTA_CLASS =
  'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-btn bg-brand-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800';

export default function IletisimPage() {
  return (
    <>
      <PageHead
        eyebrow="İletişim"
        title="Bize Nasıl "
        accent="Ulaşabilirsiniz?"
        description="Aşağıdaki platformlar üzerinden bizi takip edebilir ve iletişime geçebilirsiniz."
      />

      <Section aria-labelledby="iletisim-kanallari">
        <SectionHeader id="iletisim-kanallari" title="Sosyal Medya Kanallarımız" />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {CONTACT_CHANNELS.map((channel) => (
            <li key={channel.id}>
              <ContactChannelCard channel={channel} className="h-full" />
            </li>
          ))}
        </ul>
      </Section>

      {WHATSAPP_HREF ? (
        <CtaRow
          title="Almanya101 Topluluğuna Nasıl Katılabilirsiniz?"
          description="Almanya'da yaşamı daha hızlı çözmek isteyenler için topluluk; tavsiye, deneyim ve yönlendirme akışını hızlandırır."
          action={
            <a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className={EXTERNAL_CTA_CLASS}>
              WhatsApp Topluluğuna Katıl
              <ArrowUpRight aria-hidden="true" size={16} className="shrink-0" />
            </a>
          }
        />
      ) : null}
    </>
  );
}
