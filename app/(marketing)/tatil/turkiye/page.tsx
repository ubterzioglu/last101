import { Metadata } from 'next';
import { createMetadata } from '@/lib/seo/metadata';
import { HolidayCalculator } from '@/components/holiday/holiday-calculator';
import { TR_2026_HOLIDAYS, TR_HOLIDAY_TIPS } from '@/constants/holidays/tr-2026';

export const metadata: Metadata = createMetadata({
  title: 'Türkiye 2026 Tatil Hesaplayıcı',
  description: 'Türkiye 2026 tatillerine göre seçtiğin tarih aralığında toplam tatil gününü, izinden giden günleri, hafta sonunu ve iş gününe denk gelen resmî tatilleri hesapla.',
  path: '/tatil/turkiye',
});

export default function TurkiyeTatilPage() {
  return (
    <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <HolidayCalculator
        country="turkiye"
        title="Türkiye 2026 Tatil Hesaplayıcı"
        description="Tarih aralığını seç, sistem toplam tatili ve izinden giden günleri hesaplasın."
        holidays={TR_2026_HOLIDAYS}
        tips={TR_HOLIDAY_TIPS}
      />
    </div>
  );
}
