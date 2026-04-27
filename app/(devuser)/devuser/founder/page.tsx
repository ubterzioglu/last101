import { createMetadata } from '@/lib/seo/metadata';
import { FounderClient } from './FounderClient';

export const metadata = createMetadata({
  title: 'Founder Kayıt',
  description: 'Founder başvurunu gönder, projeni tanıt ve almanya101 topluluğunda onay sürecine gir.',
  path: '/devuser/founder',
  noIndex: true,
});

export default function FounderPage() {
  return <FounderClient />;
}
