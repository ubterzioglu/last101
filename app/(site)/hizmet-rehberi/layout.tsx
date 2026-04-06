import { createMetadata } from '@/lib/seo/metadata';

export const metadata = createMetadata({
  title: 'Tüm Türkler',
  description: 'Almanya\'da Türkçe hizmet veren doktor, avukat, restoran, market ve diğer uzmanları bulun. Şehir ve uzmanlık alanına göre filtreleyin.',
  path: '/hizmet-rehberi',
});

export default function HizmetRehberiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
