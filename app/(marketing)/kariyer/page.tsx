import { Code, Megaphone, PenLine, Users } from 'lucide-react';
import { createMetadata } from '@/lib/seo/metadata';
import { ArrowLink } from '@/components/site/ArrowLink';
import { DarkBand } from '@/components/site/DarkBand';
import { PageHead } from '@/components/site/PageHead';
import { PhotoCard } from '@/components/site/PhotoCard';
import { SectionHeader } from '@/components/site/SectionHeader';
import { ServiceGrid } from '@/components/site/ServiceGrid';
import type { ServiceItem } from '@/components/site/ServiceTile';
import { Button } from '@/components/ui/Button';
import { Section } from '@/components/ui/Section';

export const metadata = createMetadata({
  title: 'Kariyer',
  description:
    'almanya101 ekibine katıl. İçerik üretimi, yazılım geliştirme, topluluk yönetimi ve sosyal medya alanlarında gönüllü olarak katkı sağla.',
  path: '/kariyer',
});

// Every area is a way into the volunteer team, so each tile leads to the join page.
const AREAS: ServiceItem[] = [
  {
    href: '/ekibimize-katil',
    icon: PenLine,
    title: 'İçerik Üretimi',
    description: 'Almanya’da yaşam, vize, iş ve günlük hayat üzerine yazılar ve rehberler hazırla.',
  },
  {
    href: '/ekibimize-katil',
    icon: Code,
    title: 'Yazılım Geliştirme',
    description: 'Next.js, TypeScript ve Supabase ile platformun araçlarını geliştirmeye yardım et.',
  },
  {
    href: '/ekibimize-katil',
    icon: Users,
    title: 'Topluluk Yönetimi',
    description: 'WhatsApp, Telegram ve diğer kanallardaki topluluğumuzun büyümesine destek ol.',
  },
  {
    href: '/ekibimize-katil',
    icon: Megaphone,
    title: 'Sosyal Medya',
    description: 'Instagram ve diğer platformlarda içerik planla, paylaş ve etkileşimi yönet.',
  },
];

export default function KariyerPage() {
  return (
    <>
      <PageHead
        title="Kariyer"
        description="almanya101 gönüllülerden oluşan bir topluluk projesidir. Aramızda ücretli pozisyon yok; ancak öğrenmek, üretmek ve insanlara faydalı olmak isteyen herkese kapımız açık."
        media={
          <PhotoCard
            src="/images/site/frankfurt-skyline.webp"
            alt="Akşam ışıklarında Main Nehri üzerindeki köprü ve Frankfurt silueti"
            priority
          />
        }
      />

      <Section aria-labelledby="katki-alanlari">
        <SectionHeader
          id="katki-alanlari"
          title="Nasıl Katkı Sağlayabilirsin?"
          description="Hangi alanda iyiysen ya da neyi öğrenmek istiyorsan, sana uygun bir yer mutlaka var. Birlikte büyüyoruz."
        />
        <ServiceGrid items={AREAS} className="mt-10" />
      </Section>

      <DarkBand
        id="aramiza-katil"
        title="Aramıza Katıl"
        description="Katkı sağlamak istediğin bir alan varsa bize bir mesaj atman yeterli. Seninle tanışmayı çok isteriz."
      >
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3">
          <Button href="/ekibimize-katil" arrow>
            Ekibimize Katıl
          </Button>
          <ArrowLink href="/iletisim" tone="light">
            İletişime Geç
          </ArrowLink>
        </div>
      </DarkBand>
    </>
  );
}
