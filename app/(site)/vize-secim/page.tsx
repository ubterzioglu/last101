import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { ToolAccessGate } from '@/components/tools/ToolIntroPanel';
import { ToolHero } from '@/components/tools/ToolHero';
import { ToolInfoBand } from '@/components/tools/ToolInfoBand';
import { ToolFaq } from '@/components/tools/ToolFaq';
import VizeClient from './VizeClient';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Almanya Vize Seçim Aracı',
  description: 'Hangi Almanya vizesine başvurmanız gerektiğini 10-13 soruyla öğrenin. EU Mavi Kart, Fachkräftevisa, Chancenkarte, IT Uzmanı Vizesi ve daha fazlası.',
  path: '/vize-secim',
});

const FAQ_ITEMS = [
  {
    question: 'Almanya vize seçim aracı nasıl çalışır?',
    answer:
      '10-13 kısa soruyla mesleğinizi, eğitim durumunuzu, iş teklifinizin olup olmadığını ve maaş beklentinizi ölçer; ardından size en uygun Almanya çalışma izni veya vize türünü (EU Mavi Kart, Fachkräftevisa, Chancenkarte, IT Uzmanı Vizesi vb.) önerir. Sonuç anında görünür ve kişisel veri saklanmaz.',
  },
  {
    question: 'EU Mavi Kart (Blaue Karte EU) kimler için uygulanabilir?',
    answer:
      'EU Mavi Kart, Almanya\'da tanınan bir üniversite diplomasına sahip ve Almanya\'da iş teklifi bulunan yabancı uyruklu nitelikli çalışanlar için tasarlanmıştır. 2024 itibarıyla yıllık brüt maaş eşiği genel meslekler için yaklaşık 45.300 Euro, mühendislik/BT/tıp gibi şortaj meslekleri için yaklaşık 41.000 Euro\'dur. Mavi Kart, 21 ay sonra kalıcı oturma iznine (Niederlassungserlaubnis) başvuru hakkı tanır.',
  },
  {
    question: 'Chancenkarte (Fırsat Kartı) nedir, kimler başvurabilir?',
    answer:
      'Chancenkarte, 2024\'te yürürlüğe giren ve iş teklifi olmaksızın Almanya\'ya gelerek iş aramanıza olanak tanıyan puanlı bir vize türüdür. Başvurmak için tanınan bir diploma ve puanlama sisteminden en az 6 puan almanız gerekir; puanlar dil bilgisi, deneyim, yaş ve Almanya bağlantısı gibi kriterlerden elde edilir. Bir yıl süreyle Almanya\'da iş arayabilir, bu süre içinde haftada 20 saate kadar çalışabilirsiniz.',
  },
  {
    question: 'Almanya çalışma vizesi için hangi belgeler gerekir?',
    answer:
      'Temel belgeler şunlardır: geçerli pasaport, biyometrik fotoğraf, doldurulmuş vize başvuru formu, Almanya\'da tanınan diploma veya mesleki yeterlilik belgesi, iş sözleşmesi veya ön iş teklifi mektubu (EU Mavi Kart ve Fachkräftevisa için zorunlu), özgeçmiş ve bazı vize türleri için Almanca ya da İngilizce dil sertifikası. Tüm belgeler güncel koşullar için Almanya Dışişleri Bakanlığı\'nın (Auswärtiges Amt) resmi sitesinden teyit edilmelidir.',
  },
];

const INTRO =
  'Hangi Almanya vizesine başvurmanız gerektiğini 10-13 soruyla öğrenin. EU Mavi Kart, Fachkräftevisa, Chancenkarte, IT Uzmanı Vizesi ve daha fazlası.';

const STATS = [
  { value: '8', label: 'amaç kategorisi' },
  { value: '12+', label: 'vize sonucu' },
];

const HOW_IT_WORKS = [
  'Dallanmalı sorularla profilinize en uygun vize tipini belirler.',
  '8 amaç kategorisi, 12+ farklı vize sonucu ve adım adım rehber.',
  'Sonuç bilgilendirme amaçlıdır; kesin karar için göçmenlik danışmanına başvurunuz.',
  'Kaynak: 2024/2025 Almanya göçmenlik mevzuatı (AufenthG, Fachkräfteeinwanderungsgesetz).',
];

const WHY =
  "Almanya'ya göç etmek isteyenler için en büyük belirsizliklerden biri hangi vize türüne başvurmaları gerektiğidir. EU Mavi Kart, Fachkräftevisa, Chancenkarte, BT Uzmanı Vizesi, Ausbildung, Serbest Meslek, Dil Kursu… Her birinin farklı şartları ve süreçleri var. Bu araç, eğitim durumu, iş teklifi, maaş, deneyim ve hedef gibi temel değişkenleri sorarak size en uygun vize yolunu belirler ve ne yapmanız gerektiğini adım adım açıklar.";

export default function VizeSecimPage() {
  const pageUrl = new URL('/vize-secim', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Almanya Vize Seçim Aracı"
        description="Hangi Almanya vizesine başvurmanız gerektiğini 10-13 soruyla öğrenin. EU Mavi Kart, Fachkräftevisa, Chancenkarte, IT Uzmanı Vizesi ve daha fazlası."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Almanya Vize Seçim Aracı', url: pageUrl },
        ]}
      />
      <FaqJsonLd items={FAQ_ITEMS} />
      <ToolHero
        title="Almanya Vize Seçim Aracı"
        intro={INTRO}
        stats={STATS}
        howItWorksTitle="Nasıl Çalışır?"
        howItWorks={HOW_IT_WORKS}
      />
      <ToolAccessGate
        intro={{
          title: 'Almanya Vize Seçim Aracı',
          description:
            '10-13 kısa soruyla mesleğini, eğitim durumunu, iş teklifin olup olmadığını ve maaş beklentini değerlendirir; sana en uygun Almanya çalışma izni veya vize türünü önerir.',
          highlights: [
            'EU Mavi Kart, Fachkräftevisa, Chancenkarte ve IT Uzmanı Vizesi gibi güncel izin türlerini karşılaştırır.',
            'Profiline göre hangi vize yolunun gerçekçi olduğunu gerekçesiyle gösterir.',
            'Sonuç anında görünür; kişisel veri saklanmaz, hukuki danışmanlık yerine geçmez.',
          ],
          toolPath: '/vize-secim',
        }}
      >
        <VizeClient />
      </ToolAccessGate>
      <ToolInfoBand why={WHY} />
      <ToolFaq name="vize-secim-sss" items={FAQ_ITEMS} />
    </>
  );
}
