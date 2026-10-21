import { SectionHeader } from '@/components/site/SectionHeader';
import { ServiceGrid } from '@/components/site/ServiceGrid';
import type { ServiceGroup } from '@/components/site/ServiceGrid';
import { Section } from '@/components/ui/Section';
import { HOMEPAGE_ITEMS, HOME_SERVICE_GROUPS } from '@/constants/home-data';

const SERVICE_GROUPS: ServiceGroup[] = HOME_SERVICE_GROUPS.map((group) => ({
  title: group.title,
  tone: group.tone,
  items: HOMEPAGE_ITEMS.filter((item) => item.group === group.id).map(({ href, icon, title, description }) => ({
    href,
    icon,
    title,
    description,
  })),
}));

/** All home cards as a grouped 4-column hairline grid (Corteqs service grid). */
export function HomeServicesSection() {
  return (
    <Section aria-labelledby="home-services-title">
      <SectionHeader
        id="home-services-title"
        eyebrow="Araçlar ve içerikler"
        title="Yalnız değilsin!"
        accent="Araçlarımız ve bir sürü içerik seninle!"
        link={{ href: '/almanya-araclari', label: 'Tüm araçlar' }}
        className="mb-10"
      />
      {/* One-line descriptions: the full text stays in the DOM for search and screen readers. */}
      <ServiceGrid groups={SERVICE_GROUPS} columns={4} className="[&_p]:line-clamp-1" />
    </Section>
  );
}
