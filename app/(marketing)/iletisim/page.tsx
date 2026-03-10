import { createMetadata } from '@/lib/seo/metadata';
import { HeroSection } from '@/components/sections/HeroSection';
import { InfoGrid } from '@/components/sections/InfoBlock';
import { ContactForm } from '@/components/sections/ContactForm';
import { Section } from '@/components/ui/Section';
import { CONTACT_INFO } from '@/lib/utils/constants';
import type { InfoBlock as InfoBlockType } from '@/types';

export const metadata = createMetadata({
  title: 'İletişim',
  description: 'almanya101 ile iletişime geçin. Sorularınız mı var? Bize yazın, yardımcı olalım.',
  path: '/iletisim',
});

export default function IletisimPage() {
  const contactInfo: InfoBlockType[] = [
    {
      id: 'contact',
      title: 'İletişim Bilgileri',
      icon: '📞',
      items: [
        `E-posta: ${CONTACT_INFO.email}`,
        `Telefon: ${CONTACT_INFO.phone}`,
        `Adres: ${CONTACT_INFO.address}`,
        'Çalışma Saatleri: Pazartesi - Cuma, 09:00 - 18:00',
      ],
    },
    {
      id: 'social',
      title: 'Sosyal Medya',
      icon: '📱',
      items: [
        'Twitter: @almanya101',
        'Facebook: almanya101',
        'Instagram: @almanya101',
        'YouTube: almanya101',
      ],
    },
  ];

  return (
    <>
      <HeroSection
        title="İletişim"
        description="Sorularınız mı var? Bizimle iletişime geçin, yardımcı olalım."
        centered={false}
        className="bg-google-green"
      />

      <Section contained>
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Bize Ulaşın</h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            Aşağıdaki iletişim bilgilerini kullanarak bizimle irtibata geçebilirsiniz.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <InfoGrid blocks={contactInfo} columns={1} />
          <ContactForm />
        </div>
      </Section>
    </>
  );
}
