import { ToolHero } from '@/components/tools/ToolHero';
import { ToolInfoBand } from '@/components/tools/ToolInfoBand';
import { DE_HOLIDAY_TIPS, GERMAN_STATES } from '@/constants/holidays/de-2026';
import { GermanHolidayTool } from './german-holiday-tool';
import { HolidayReference } from './holiday-reference';

const HOW_IT_WORKS = [
  'Eyalete göre farklı tatil günleri otomatik hesaplanır.',
  'Hafta sonları (Cumartesi, Pazar) otomatik düşülür.',
  'Resmî tatiller eyalete göre değişir.',
];

const WHY_TEXT =
  "Almanya'da çalışıyorsan izin planlamak biraz hesap işi gerektirir; üstelik her eyaletin kendine özgü resmi tatil listesi var. Bavyera'da tatil olan bir günün Berlin'de iş günü sayılması gibi durumlar sürpriz yaratabilir. Bu araç, seçtiğin eyaleti ve tarih aralığını baz alarak kaç resmi tatilin haftaiçine denk geldiğini, gerçekte kaç günlük izin harcaman gerektiğini ve hafta sonu/iş günü dağılımını otomatik hesaplar. Yıllık izni optimize etmek ve uzun tatil köprüleri bulmak için pratik bir yardımcı.";

const HERO_STATS = [
  { value: String(GERMAN_STATES.length), label: 'eyalet' },
  { value: String(DE_HOLIDAY_TIPS.length), label: 'tatil tüyosu' },
  { value: 'Ücretsiz', label: 'kayıt gerekmez' },
];

/** Germany holiday planner page body: hero, calculator, tips, info band. */
export function GermanHolidayCalculator() {
  return (
    <>
      <ToolHero
        title="Almanya 2026 Tatil Planlayıcı"
        intro="Almanya 2026: Bundesland ve tarih aralığı seç – sistem toplam tatil, gerekli izin günleri, hafta sonları ve resmi tatilleri hesaplasın."
        stats={HERO_STATS}
        howItWorksTitle="Nasıl Çalışır?"
        howItWorks={HOW_IT_WORKS}
      />
      <GermanHolidayTool />
      <HolidayReference tips={DE_HOLIDAY_TIPS} />
      <ToolInfoBand why={WHY_TEXT} />
    </>
  );
}
