import type { Metadata } from 'next';
import { ListClient } from './ListClient';

export const metadata: Metadata = {
  title: 'de tr software dashboard | Developer Topluluğu - almanya101',
  description: 'Almanya\'da yaşayan Türk developer, QA, DevOps ve tech profesyonellerini keşfet.',
  robots: { index: false, follow: false },
};

export default function ListPage() {
  return <ListClient />;
}
