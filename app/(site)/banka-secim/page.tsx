import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { ToolHero } from '@/components/tools/ToolHero';
import { ToolInfoBand } from '@/components/tools/ToolInfoBand';
import { ToolFaq } from '@/components/tools/ToolFaq';
import BankaClient from './BankaClient';
import { BANKS, QUESTIONS } from './data';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Banka Seçim Aracı',
  description: '20 soruda Almanya için en uygun bankayı bulun. Dijital banka, direkt banka, yerel banka veya yatırım odaklı seçenekler.',
  path: '/banka-secim',
});

const FAQ_ITEMS = [
  {
    question: 'Almanya banka seçim aracı nasıl çalışır?',
    answer:
      '20 kısa soruyla bankacılık alışkanlıklarınızı (dijital kullanım, şube ihtiyacı, yatırım, ücret hassasiyeti) ölçer ve size en uygun banka türünü (dijital banka, direkt banka, yerel banka veya yatırım odaklı banka) önerir. Sonuç anında ekranda görünür ve kişisel veri istemez.',
  },
  {
    question: 'Almanya’da yeni gelenler için hangi banka türü uygun?',
    answer:
      'Almanca’ya yeni başlayan ve hızlı hesap açmak isteyenler için genellikle dijital/direkt bankalar (örneğin tamamen çevrimiçi başvuru imkânı sunanlar) pratiktir. Şubede yüz yüze hizmet ve nakit işlem ihtiyacı yüksekse yerel bankalar (Sparkasse, Volksbank) daha uygundur.',
  },
  {
    question: 'Almanya’da banka hesabı açmak için hangi belgeler gerekir?',
    answer:
      'Genellikle kimlik/pasaport, Almanya adres kaydı (Anmeldung) ve bazı bankalarda vergi numarası (Steuer-ID) gerekir. Dijital bankalar kimlik doğrulamayı video ile (VideoIdent) yapabilir.',
  },
  {
    question: 'Bu araç ücretli mi ve banka tavsiyesi mi veriyor?',
    answer:
      'Araç tamamen ücretsizdir ve bağımsızdır; belirli bir bankayı satmaz. Yalnızca ihtiyaçlarınıza göre hangi banka türünün size uyabileceğini yönlendirir. Nihai kararı vermeden önce bankaların güncel koşullarını kontrol etmeniz önerilir.',
  },
];

const INTRO =
  '20 soruda Almanya için en uygun bankayı bulun. Dijital banka, direkt banka, yerel banka veya yatırım odaklı seçenekler.';

const STATS = [
  { value: String(QUESTIONS.length), label: 'soru' },
  { value: String(BANKS.length), label: 'banka' },
  { value: '3', label: 'öneri' },
];

const HOW_IT_WORKS = [
  'Bu araç 20 soruyla size en uygun bankacılık profilini önerir.',
  'Sonuçlar yönlendirme amaçlıdır.',
  'Son kararınızı vermeden önce bankanın güncel şartlarını kontrol edin.',
  'Ücretler, kart koşulları, şube erişimi ve müşteri hizmetleri bankaya göre değişebilir.',
];

const WHY =
  "Almanya'da banka seçmek göründüğü kadar basit değil. N26, Revolut gibi tam dijital bankalar; DKB, ING gibi direkt bankalar; Sparkasse, Volksbank gibi şubeli yerel bankalar; Trade Republic gibi yatırım odaklı platformlar… Hangisinin sana uygun olduğu, günlük alışkanlıklarına, yatırım ihtiyacına, şube gereksinimlerine ve expat statüne göre değişir. Bu araç, 20 kısa soruyla profilini çıkarır ve sana en uygun banka kategorisini somut gerekçelerle önerir.";

export default function BankaSecimPage() {
  const pageUrl = new URL('/banka-secim', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Banka Seçim Aracı"
        description="20 soruda Almanya için en uygun bankayı bulun. Dijital banka, direkt banka, yerel banka veya yatırım odaklı seçenekler."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Banka Seçim Aracı', url: pageUrl },
        ]}
      />
      <FaqJsonLd items={FAQ_ITEMS} />
      <ToolHero
        title="Banka Seçim Aracı"
        intro={INTRO}
        stats={STATS}
        howItWorksTitle="Nasıl Çalışır?"
        howItWorks={HOW_IT_WORKS}
      />
      <BankaClient />
      <ToolInfoBand why={WHY} />
      <ToolFaq name="banka-secim-sss" items={FAQ_ITEMS} />
    </>
  );
}
