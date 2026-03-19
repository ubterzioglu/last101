import { Metadata } from 'next';
import { createMetadata } from '@/lib/seo/metadata';
import { TransferSelector } from '@/components/para-transferi/transfer-selector';

export const metadata: Metadata = createMetadata({
  title: 'Para Transferi Seçim Aracı',
  description: '20 soruda Türkiye↔Almanya para transferi için en uygun yol: banka SWIFT, transfer servisi, nakit teslim, çoklu döviz hesap. Ücretsiz ve Türkçe.',
  path: '/para-transferi',
});

export default function ParaTransferiPage() {
  return <TransferSelector />;
}
