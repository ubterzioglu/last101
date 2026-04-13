import { createMetadata } from '@/lib/seo/metadata';
import { Section } from '@/components/ui/Section';
import { ContactChannelCard } from '@/components/home/ContactChannelCard';
import { CONTACT_CHANNELS } from '@/constants/contact-channels';

export const metadata = createMetadata({
  title: 'İletişim',
  description: 'almanya101 ile iletişime geçin. Sosyal medya hesaplarımız üzerinden bize ulaşabilirsiniz.',
  path: '/iletisim',
});

export default function IletisimPage() {
  return (
    <div className="min-h-screen bg-black pt-32 pb-16">
      <Section contained>
        <div className="flex flex-col items-center justify-center min-h-[40vh]">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Sosyal Medya Kanallarımız</h2>
            <p className="text-lg text-white/80 max-w-2xl mx-auto">
              Aşağıdaki platformlar üzerinden bizi takip edebilir ve iletişime geçebilirsiniz.
            </p>
          </div>

          <div className="mx-auto flex w-full max-w-5xl flex-wrap items-center justify-center gap-4 py-4 sm:gap-6">
            {CONTACT_CHANNELS.map((channel) => (
              <ContactChannelCard
                key={channel.id}
                channel={channel}
                iconOnly
                className="flex-shrink-0"
              />
            ))}
          </div>
        </div>
      </Section>
    </div>
  );
}
