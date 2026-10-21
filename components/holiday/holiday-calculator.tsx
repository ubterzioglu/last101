import { ToolHero } from '@/components/tools/ToolHero';
import { ToolInfoBand } from '@/components/tools/ToolInfoBand';
import { Holiday, TR_HOLIDAY_TIPS } from '@/constants/holidays/tr-2026';
import { HolidayReference } from './holiday-reference';
import { TurkeyHolidayTool } from './turkey-holiday-tool';

interface HolidayCalculatorProps {
  country: 'turkiye' | 'almanya';
  title: string;
  description: string;
  holidays: Holiday[];
  tips: typeof TR_HOLIDAY_TIPS;
}

const HOW_IT_WORKS = [
  'Hafta sonları ve resmî tatiller otomatik düşülür.',
  'Arefeler yarım gün sayılır.',
  'Bu sürüm sadece TR 2026 içindir.',
];

const WHY_TEXT =
  "Türkiye'nin resmi tatil takvimine göre yıllık izin planlamanı optimize etmek artık çok daha kolay. Hangi tatil günlerinin pazartesi ya da cumaya denk geldiğini, kaç gün izin ekleyerek kaç günlük kesintisiz tatil yapabileceğini tek bakışta görürsün. Bu araç, seçtiğin tarih aralığındaki tüm resmi tatilleri listeler, hafta sonu ve iş günü dağılımını hesaplar ve gerçekte kaç gün izin kullanman gerektiğini net biçimde ortaya koyar. Hem yakınlarınla tatil planlarken hem de şirkete izin bildirimi hazırlarken işe yarar.";

/** Turkey holiday planner page body: hero, calculator, holiday list and tips, info band. */
export function HolidayCalculator({ title, description, holidays, tips }: HolidayCalculatorProps) {
  return (
    <>
      <ToolHero
        title={title}
        intro={description}
        stats={[
          { value: String(holidays.length), label: 'resmî tatil' },
          { value: String(tips.length), label: 'tatil tüyosu' },
          { value: 'Ücretsiz', label: 'kayıt gerekmez' },
        ]}
        howItWorksTitle="Nasıl Çalışır?"
        howItWorks={HOW_IT_WORKS}
      />
      <TurkeyHolidayTool />
      <HolidayReference holidays={holidays} tips={tips} />
      <ToolInfoBand why={WHY_TEXT} />
    </>
  );
}
