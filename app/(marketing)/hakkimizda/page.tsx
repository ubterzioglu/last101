import { BadgeCheck, Gift, HeartHandshake, TrendingUp } from 'lucide-react';
import { createMetadata } from '@/lib/seo/metadata';
import { CtaRow } from '@/components/site/CtaRow';
import { PageHead } from '@/components/site/PageHead';
import { PhotoCard } from '@/components/site/PhotoCard';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ServiceGrid } from '@/components/site/ServiceGrid';
import type { ServiceItem } from '@/components/site/ServiceTile';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';
import { TEAM } from './team';
import { TeamMemberCard } from './TeamMemberCard';

export const metadata = createMetadata({
  title: 'Hakkımızda',
  description: 'almanya101 platformu hakkında bilgi. Misyonumuz, vizyonumuz ve değerlerimiz.',
  path: '/hakkimizda',
});

// Each value links to the part of the site that puts it into practice.
const VALUES: ServiceItem[] = [
  {
    href: '/rehber',
    icon: BadgeCheck,
    title: 'Güvenilir Bilgi',
    description: 'Uzmanlar ve deneyimli kişiler tarafından doğrulanmış bilgiler.',
  },
  {
    href: '/topluluk',
    icon: HeartHandshake,
    title: 'Topluluk Odaklı',
    description: 'Kullanıcıların deneyimlerini paylaşabileceği destekleyici bir platform.',
  },
  {
    href: '/iletisim',
    icon: TrendingUp,
    title: 'Sürekli Gelişim',
    description: 'Kullanıcı geri bildirimleriyle sürekli iyileştirme.',
  },
  {
    href: '/almanya-araclari',
    icon: Gift,
    title: 'Ücretsiz Erişim',
    description: 'Tüm içeriklere tamamen ücretsiz erişim.',
  },
];

export default function HakkimizdaPage() {
  return (
    <>
      <PageHead
        title="Hakkımızda"
        description="almanya101 hakkında bilgi edinin. Biz kimiz, ne yapıyoruz ve neden yapıyoruz?"
        media={
          <PhotoCard
            src="/images/site/berlin-spree.webp"
            alt="Gün batımında Spree Nehri ve Televizyon Kulesi ile Berlin"
            priority
          />
        }
      />

      <Section tone="band" aria-labelledby="biz-kimiz">
        <SectionHeader
          id="biz-kimiz"
          title="Biz Kimiz?"
          description="almanya101'i birlikte büyüten, bilgi ve deneyimlerini paylaşan ekibimizle tanışın."
        />
        <ul className="mt-10 grid gap-[22px] lg:grid-cols-2">
          {TEAM.map((member) => (
            <li key={member.name}>
              <TeamMemberCard member={member} />
            </li>
          ))}
        </ul>
      </Section>

      <Section aria-labelledby="degerlerimiz">
        <SectionHeader
          id="degerlerimiz"
          title="Değerlerimiz"
          description="Her şeyi yaparken bu değerleri dikkate alıyoruz."
        />
        <ServiceGrid items={VALUES} className="mt-10" />
      </Section>

      <CtaRow
        title="Bize Katılın"
        description="Eğer bizimle çalışmak, içerik üretmek veya diğer şekillerde katkıda bulunmak istiyorsanız, bizimle iletişime geçin."
        action={
          <Button href="/iletisim" arrow>
            İletişime Geçin
          </Button>
        }
      />
    </>
  );
}
