import { Metadata } from 'next';
import { createMetadata } from '@/lib/seo/metadata';
import { GermanHolidayCalculator } from '@/components/holiday/german-holiday-calculator';

export const metadata: Metadata = createMetadata({
  title: 'Almanya 2026 Tatil Planlayıcı',
  description: 'Almanya 2026: Bundesland ve tarih aralığı seç – sistem toplam tatil, gerekli izin günleri, hafta sonları ve resmi tatilleri hesaplasın.',
  path: '/tatil/almanya',
});

export default function AlmanyaTatilPage() {
  return (
    <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <GermanHolidayCalculator />
    </div>
  );
}
