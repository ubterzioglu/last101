import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { ToolAccessGate } from '@/components/tools/ToolIntroPanel';
import { ToolHero } from '@/components/tools/ToolHero';
import { ToolInfoBand } from '@/components/tools/ToolInfoBand';
import { ToolFaq } from '@/components/tools/ToolFaq';
import SigortaClient from './SigortaClient';
import { INSURANCE_TYPES, QUESTIONS } from './data';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Sigorta Seçim Aracı',
  description: '20 soruda Almanya için sigortalarınızı önceliklendirin. Önce Al, Güçlü Öneri, Opsiyonel kategorileri.',
  path: '/sigorta-secim',
});

const FAQ_ITEMS = [
  {
    question: 'Almanya sigorta seçim aracı nasıl çalışır?',
    answer:
      '20 kısa soruyla yaşam durumunuzu (medeni hal, çocuk, araba, kira vb.) ve risk önceliklerinizi ölçer; ardından her sigorta türü için "Önce Al", "Güçlü Öneri" veya "Opsiyonel" etiketiyle kişiselleştirilmiş bir öncelik listesi oluşturur. Sonuç anında görünür, kişisel veri saklanmaz ve araç tamamen ücretsizdir.',
  },
  {
    question: 'Almanya\'da zorunlu sigortalar hangileri?',
    answer:
      'Almanya\'da yasal olarak zorunlu olan tek sigorta türü sağlık sigortasıdır (Krankenversicherung); çalışanlar işverenle yarı yarıya paylaşılan katkıyla devlet sağlık kasasına (GKV) kaydolmak zorundadır. Araç sahipleri için trafik sorumluluk sigortası (Kfz-Haftpflicht) da kanunen zorunludur. Bunların dışındaki sigortalar zorunlu olmamakla birlikte kişisel duruma göre kuvvetle tavsiye edilebilir.',
  },
  {
    question: 'Almanya\'ya yeni gelen biri önce hangi sigortayı almalı?',
    answer:
      'İlk yapılacak iş sağlık sigortası kaydıdır; işe başlamadan veya Anmeldung\'dan kısa süre sonra tamamlanması gerekir. İkinci öncelik kişisel sorumluluk sigortasıdır (Haftpflichtversicherung); çok düşük primle günlük hayattaki büyük riskleri karşılar ve neredeyse herkes için önerilir. Kiracıysanız ev eşyası sigortası (Hausratversicherung) da erken alınması gereken sigortalar arasındadır.',
  },
  {
    question: 'Bu araç belirli bir sigorta şirketini mi öneriyor, ücretli mi?',
    answer:
      'Araç tamamen bağımsız ve ücretsizdir; belirli bir sigorta şirketini veya ürününü satmaz, komisyon almaz. Yalnızca yaşam koşullarınıza göre hangi sigorta türlerinin öncelikli olduğunu gösterir. Seçtiğiniz ürünü satın almadan önce güncel fiyat ve koşulları sigorta sağlayıcılarından bizzat teyit etmeniz önerilir.',
  },
];

const INTRO = '20 soruda Almanya için sigortalarınızı önceliklendirin.';

const STATS = [
  { value: String(QUESTIONS.length), label: 'soru' },
  { value: String(Object.keys(INSURANCE_TYPES).length), label: 'sigorta türü' },
  { value: '3', label: 'öncelik grubu' },
];

const HOW_IT_WORKS = [
  'Bu araç 20 soruyla sigortalarınızı önceliklendirir.',
  'Sonuçlar bilgilendirme amaçlıdır.',
  'Sözleşme öncesi kapsam ve şartları kontrol edin.',
];

const WHY =
  "Almanya'da yaşamak, doğru sigortaları seçmeyi neredeyse zorunlu kılar. Sağlık sigortası yasal olarak zorunlu, ancak bunun yanı sıra kira sigortası, kişisel sorumluluk sigortası (Haftpflicht), araç sigortası, iş göremezlik sigortası ve daha pek çok seçenek var. Hangilerini almanın şart, hangilerinin tavsiye edilebilir, hangilerinin opsiyonel olduğu ise yaşam durumuna ve önceliklerine göre değişir. Bu araç, birkaç soruyla senin için önemli olan sigortaları öncelik sırasıyla listeler.";

export default function SigortaSecimPage() {
  const pageUrl = new URL('/sigorta-secim', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Sigorta Seçim Aracı"
        description="20 soruda Almanya için sigortalarınızı önceliklendirin. Önce Al, Güçlü Öneri, Opsiyonel kategorileri."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Sigorta Seçim Aracı', url: pageUrl },
        ]}
      />
      <FaqJsonLd items={FAQ_ITEMS} />
      <ToolHero
        title="Sigorta Seçim Aracı"
        intro={INTRO}
        stats={STATS}
        howItWorksTitle="Nasıl Çalışır?"
        howItWorks={HOW_IT_WORKS}
      />
      <ToolAccessGate
        intro={{
          title: 'Sigorta Seçim Aracı',
          description:
            '20 kısa soruyla yaşam durumunu ve risk önceliklerini ölçer; her sigorta türü için "Önce Al", "Güçlü Öneri" veya "Opsiyonel" etiketiyle kişiselleştirilmiş bir öncelik listesi oluşturur.',
          highlights: [
            'Medeni hal, çocuk, araba, kira ve benzeri yaşam bilgilerine göre sigortaları önceliklendirir.',
            'Zorunlu sağlık sigortası (Krankenversicherung) ve trafik sorumluluk sigortası (Kfz-Haftpflicht) gibi yasal gereklilikleri ayrıca işaretler.',
            'Sonuç anında görünür; tamamen ücretsiz ve bağımsızdır, belirli bir sigorta şirketini önermez.',
          ],
          toolPath: '/sigorta-secim',
        }}
      >
        <SigortaClient />
      </ToolAccessGate>
      <ToolInfoBand why={WHY} />
      <ToolFaq name="sigorta-secim-sss" items={FAQ_ITEMS} />
    </>
  );
}
