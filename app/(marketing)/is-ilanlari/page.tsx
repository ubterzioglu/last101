import { createMetadata } from '@/lib/seo/metadata';
import { CTASection } from '@/components/sections/CTASection';
import { RecruitmentAgencies } from '@/components/sections/RecruitmentAgencies';
import { Section } from '@/components/ui/Section';
import { RECRUITMENT_AGENCIES } from '@/constants/recruitment-agencies';
import type { RecruitmentAgency } from '@/types';

export const metadata = createMetadata({
  title: 'İş İlanları',
  description: 'Türk iş verenler ve Türk dostu şirketlerin iş ilanları. Almanya\'da iş fırsatları.',
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

      <CTASection
        title="İş İlanı Paylaşın"
        description="Şirketinizde açık pozisyonlar var mı? Türk topluluğuna ulaşmak için iş ilanınızı bizimle paylaşın."
        primaryAction={{ label: 'İş İlanı Ekle', href: '#contact' }}
        secondaryAction={{ label: 'İletişime Geçin', href: '/iletisim' }}
      />
    </>
  );
}
