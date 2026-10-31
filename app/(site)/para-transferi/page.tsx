import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { TransferSelector } from '@/components/para-transferi/transfer-selector';
import { ToolAccessGate } from '@/components/tools/ToolIntroPanel';
import { ToolHero } from '@/components/tools/ToolHero';
import { ToolInfoBand } from '@/components/tools/ToolInfoBand';
import { ToolFaq } from '@/components/tools/ToolFaq';
import { QUESTIONS } from '@/constants/para-transferi/questions';
import { TRANSFER_SYSTEMS } from '@/constants/para-transferi/systems';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Para Transferi Seçim Aracı',
  description: 'Almanya\'dan Türkiye\'ye para transferi için en uygun aracı bulun. Düşük komisyon, hızlı transfer ve güvenilir seçenekler.',
  path: '/para-transferi',
});

const FAQ_ITEMS = [
  {
    question: 'Para transferi seçim aracı nasıl çalışır?',
    answer:
      'Göndermek istediğiniz tutarı, önceliklerinizi (düşük komisyon, hız, güvenilirlik) ve varsa tercih ettiğiniz ödeme yöntemini seçerek arama yaparsınız. Araç, Almanya\'dan Türkiye\'ye para transferinde öne çıkan yöntemleri (fintech uygulamaları, banka havalesi, döviz büroları) karşılaştırarak size en uygun seçeneği önerir.',
  },
  {
    question: 'Almanya\'dan Türkiye\'ye en düşük komisyonlu transfer yöntemi hangisi?',
    answer:
      'Genel olarak Wise, Remitly ve Paysend gibi fintech uygulamaları, geleneksel banka havalelerine kıyasla çok daha düşük toplam maliyet (komisyon + döviz kuru farkı) sunar. Ancak en avantajlı seçenek transfer tutarına, gönderim hızına ve anlık döviz kuruna göre değişir; bu yüzden göndermeden önce araçtaki karşılaştırmayı kontrol etmeniz önerilir.',
  },
  {
    question: 'Almanya\'dan Türkiye\'ye para transferi ne kadar sürer?',
    answer:
      'Fintech uygulamaları genellikle birkaç dakika ile birkaç saat arasında teslim eder. Banka SWIFT transferleri 1-3 iş günü sürebilir. Hafta sonları ve Türkiye ya da Almanya\'daki resmî tatil günlerinde işlemler gecikmeli gerçekleşebilir. Acil transferlerde ekspres seçeneği sunan ve anlık teslim garantisi veren platformları tercih edebilirsiniz.',
  },
  {
    question: 'Transfer limitleri ve güvenlik konusunda nelere dikkat etmeli?',
    answer:
      'Almanya\'da 10.000 Euro ve üzeri nakit işlemler kara para aklamayla mücadele (AML) kapsamında beyan yükümlülüğüne tabidir. Fintech platformlarının aylık veya işlem başına gönderim limitleri kimlik doğrulama seviyesine göre değişir; limit artırımı için genellikle ek belge (pasaport, gelir belgesi) gerekmektedir. Yalnızca AB veya Almanya\'da lisanslı (BaFin denetimli) platformları kullanmanız güvenliğiniz açısından önemlidir.',
  },
];

const INTRO =
  "Almanya'dan Türkiye'ye para transferi için en uygun aracı bulun. Düşük komisyon, hızlı transfer ve güvenilir seçenekler.";

const STATS = [
  { value: String(QUESTIONS.length), label: 'soru' },
  { value: String(TRANSFER_SYSTEMS.length), label: 'sistem' },
  { value: '3', label: 'öneri' },
];

const HOW_IT_WORKS = [
  'Bu araç 20 soruyla size en uygun para transferi yöntemini önerir.',
  'Sonuçlar yönlendirme amaçlıdır; son kararınızı vermeden önce sağlayıcının güncel şartlarını kontrol edin.',
  'Ücretler (kur farkı + sabit ücret), teslim süresi, kimlik doğrulama ve limitler sağlayıcıya göre değişir.',
];

const WHY =
  "Almanya'dan Türkiye'ye ya da başka ülkelere para gönderirken banka havalesi çoğu zaman yetersiz kalır: komisyon oranları yüksek, döviz kurları banka lehine. Wise, Remitly, Western Union ve benzeri platformlar çok daha uygun koşullar sunabiliyor; ancak hangisinin senin için avantajlı olduğu transfer miktarına, sıklığına ve hedef ülkeye göre değişiyor. Bu araç, birkaç basit soruyla ihtiyacına en uygun para transfer servisini belirler ve gereksiz komisyon kaybını önlemene yardım eder.";

export default function ParaTransferiPage() {
  const pageUrl = new URL('/para-transferi', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Para Transferi Seçim Aracı"
        description="Almanya'dan Türkiye'ye para transferi için en uygun aracı bulun. Düşük komisyon, hızlı transfer ve güvenilir seçenekler."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Para Transferi Seçim Aracı', url: pageUrl },
        ]}
      />
      <FaqJsonLd items={FAQ_ITEMS} />
      <ToolHero
        title="Para Transferi Seçim Aracı"
        intro={INTRO}
        stats={STATS}
        howItWorksTitle="Nasıl Çalışır?"
        howItWorks={HOW_IT_WORKS}
      />
      <ToolAccessGate
        intro={{
          title: 'Para Transferi Seçim Aracı',
          description:
            'Almanya\'dan Türkiye\'ye para gönderirken tutar, öncelik ve ödeme yöntemine göre en uygun transfer seçeneğini karşılaştır: fintech uygulamaları, banka havalesi ve döviz büroları.',
          highlights: [
            'Komisyon, döviz kuru farkı, hız ve güvenilirlik kriterlerini birlikte değerlendirir.',
            'Gönderim tutarına göre toplam maliyeti karşılaştırmalı gösterir.',
            'BaFin denetimli ve lisanslı platformlar üzerinden güvenli seçim yapmana yardımcı olur.',
          ],
          toolPath: '/para-transferi',
        }}
      >
        <TransferSelector />
      </ToolAccessGate>
      <ToolInfoBand why={WHY} />
      <ToolFaq name="para-transferi-sss" items={FAQ_ITEMS} />
    </>
  );
}
