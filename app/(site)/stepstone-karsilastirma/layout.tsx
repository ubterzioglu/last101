import { createMetadata } from '@/lib/seo/metadata';

export const metadata = createMetadata({
  title: 'StepStone 2026 Maaş Karşılaştırma',
  description: 'StepStone 2026 maaş verilerine göre maaşlarınızı karşılaştırın ve analiz edin.',
  path: '/stepstone-karsilastirma',
});

export default function StepstoneKarsilastirmaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
