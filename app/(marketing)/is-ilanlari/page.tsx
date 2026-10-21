import { createMetadata } from '@/lib/seo/metadata';
import { RecruitmentAgencies } from '@/components/sections/RecruitmentAgencies';
import { Section } from '@/components/ui/Section';
import { RECRUITMENT_AGENCIES } from '@/constants/recruitment-agencies';
import type { RecruitmentAgency } from '@/types';

export const metadata = createMetadata({
  title: 'İş Bulma Ajansları ve Kariyer Platformları',
  description:
    'Almanya\'daki iş bulma ajansları, İngilizce işe alan şirketler ve kariyer platformlarının kapsamlı listesi. İş arama süreciniz için doğru ajansı bulun.',
  path: '/is-ilanlari',
});

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
      <Section contained className="bg-gray-50">
        <RecruitmentAgencies agencies={agencies} />
      </Section>
    </>
  );
}
