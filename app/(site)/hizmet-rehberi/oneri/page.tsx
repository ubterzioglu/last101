import { createMetadata } from '@/lib/seo/metadata';
import HizmetOnerClient from './HizmetOnerClient';

export const metadata = createMetadata({
  title: 'Hizmet Öner',
  description:
    "Almanya'da bildiğiniz Türkçe hizmet veren uzmanları önerin. Admin onayından sonra rehbere eklensin.",
  path: '/hizmet-rehberi/oneri',
});

export default function HizmetOnerPage() {
  return <HizmetOnerClient />;
}
