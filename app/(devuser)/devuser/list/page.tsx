import { createMetadata } from '@/lib/seo/metadata';
import { ListClient } from './ListClient';

export const metadata = createMetadata({
  title: 'Developer Topluluğu',
  description: 'Almanya\'da yaşayan Türk developer, QA, DevOps ve teknoloji profesyonellerini keşfet.',
  path: '/devuser/list',
  noIndex: true,
});

export default function ListPage() {
  return <ListClient />;
}
