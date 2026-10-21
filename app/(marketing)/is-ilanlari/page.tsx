import { MapPin } from 'lucide-react';
import { createMetadata } from '@/lib/seo/metadata';
import { RecruitmentAgencies } from '@/components/sections/RecruitmentAgencies';
import { PageHead } from '@/components/site/PageHead';
import { PhotoCard } from '@/components/site/PhotoCard';
import { Container } from '@/components/ui/Container';
import { RECRUITMENT_AGENCIES } from '@/constants/recruitment-agencies';
import type { RecruitmentAgency } from '@/types';

export const metadata = createMetadata({
  title: 'İş Bulma Ajansları ve Kariyer Platformları',
  description:
    'Almanya\'daki iş bulma ajansları, İngilizce işe alan şirketler ve kariyer platformlarının kapsamlı listesi. İş arama süreciniz için doğru ajansı bulun.',
  path: '/is-ilanlari',
});

function countCategory(agencies: RecruitmentAgency[], category: string): string {
  return String(agencies.filter((agency) => agency.category === category).length);
}

export default function IsIlanlariPage() {
  // Convert agencies data to proper format
  const agencies: RecruitmentAgency[] = RECRUITMENT_AGENCIES.map((agency, index) => ({
    ...agency,
    id: (index + 1).toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }));

  return (
    <>
      <PageHead
        eyebrow="İş İlanları"
        title="Almanya'daki İş Bulma Ajansları ve Şirketler"
        description="Almanya'da faaliyet gösteren işe alım ajansları, kafa avcıları ve personel şirketlerinin kapsamlı listesi. Kariyer veya işe alım ihtiyaçlarınız için doğru ajansı bulun."
        stats={[
          { value: countCategory(agencies, 'İş Bulma Ajansları'), label: 'İş Bulma Ajansı' },
          { value: countCategory(agencies, 'İngilizce İşe Alan Şirketler'), label: 'İngilizce İşe Alan Şirket' },
          { value: countCategory(agencies, 'İş ve Kariyer Platformları'), label: 'İş ve Kariyer Platformu' },
        ]}
        media={
          <PhotoCard
            src="/images/site/berlin-brandenburger-tor-aksam.webp"
            alt="Akşam ışığında Brandenburg Kapısı"
            chip={{ label: 'Berlin', icon: MapPin }}
            priority
          />
        }
      />
      <Container className="py-12">
        <RecruitmentAgencies agencies={agencies} />
      </Container>
    </>
  );
}
