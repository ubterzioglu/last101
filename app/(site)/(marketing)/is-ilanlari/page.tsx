import { createMetadata } from '@/lib/seo/metadata';
import { HeroSection } from '@/components/sections/HeroSection';
import { JobList } from '@/components/sections/JobCard';
import { CTASection } from '@/components/sections/CTASection';
import { Section } from '@/components/ui/Section';
import type { Job } from '@/types';

export const metadata = createMetadata({
  title: 'İş İlanları',
  description: 'Türk iş verenler ve Türk dostu şirketlerin iş ilanları. Almanya\'da iş fırsatları.',
  path: '/is-ilanlari',
});

export default function IsIlanlariPage() {
  const jobs: Job[] = [
    {
      id: '1',
      title: 'Senior Software Developer',
      company: 'TechCorp Berlin',
      location: 'Berlin',
      salary: '€60,000 - €80,000 / yıl',
      type: 'Tam Zamanlı',
      postedDate: '2 gün önce',
    },
    {
      id: '2',
      title: 'Marketing Manager',
      company: 'DigitalAgency München',
      location: 'Münih',
      salary: '€50,000 - €65,000 / yıl',
      type: 'Tam Zamanlı',
      postedDate: '3 gün önce',
    },
    {
      id: '3',
      title: 'Web Designer',
      company: 'Creative Studio Hamburg',
      location: 'Hamburg',
      salary: '€45,000 - €55,000 / yıl',
      type: 'Tam Zamanlı',
      postedDate: '5 gün önce',
    },
    {
      id: '4',
      title: 'Customer Support Specialist',
      company: 'ServicePro Berlin',
      location: 'Berlin',
      salary: '€35,000 - €40,000 / yıl',
      type: 'Yarı Zamanlı',
      postedDate: '1 hafta önce',
    },
    {
      id: '5',
      title: 'Junior Data Analyst',
      company: 'DataDriven Frankfurt',
      location: 'Frankfurt',
      salary: '€40,000 - €50,000 / yıl',
      type: 'Tam Zamanlı',
      postedDate: '1 hafta önce',
    },
    {
      id: '6',
      title: 'UX/UI Designer',
      company: 'DesignHub Stuttgart',
      location: 'Stuttgart',
      salary: '€55,000 - €70,000 / yıl',
      type: 'Tam Zamanlı',
      postedDate: '2 hafta önce',
    },
  ];

  return (
    <>
      <HeroSection
        title="Almanya'da İş Fırsatları"
        description="Türk iş verenler ve Türk dostu şirketlerden güncel iş ilanları. Hayalinizdeki işi bulun."
        centered={false}
        className="bg-google-green"
      />

      <Section contained>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Son İş İlanları</h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            En güncel iş fırsatlarını keşfedin. Yeni ilanlar her gün ekleniyor.
          </p>
        </div>
        <JobList jobs={jobs} columns={2} />
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
