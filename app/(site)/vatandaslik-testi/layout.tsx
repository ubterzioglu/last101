import { createMetadata } from '@/lib/seo/metadata';

export const metadata = createMetadata({
  title: 'Vatandaşlık Testi Denemesi',
  description: 'Almanya vatandaşlık testi için deneme sınavı. 33 soruluk sınav formatıyla pratik yapın ve skorunuzu görün.',
  path: '/vatandaslik-testi',
});

export default function VatandaslikTestiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
