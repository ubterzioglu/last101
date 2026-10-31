import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { ToolFaq } from '@/components/tools/ToolFaq';
import { ToolAccessGate } from '@/components/tools/ToolIntroPanel';
import { ToolHero } from '@/components/tools/ToolHero';
import { ToolInfoBand } from '@/components/tools/ToolInfoBand';
import { STATES, TAX_CLASSES } from '@/lib/salary/types';
import MaasClient from './MaasClient';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Almanya Maaş Hesaplayıcı',
  description: 'Almanya\'da brüt maaşınızı net maaşa, net maaşınızı brüt maaşa dönüştürün. Vergi sınıfı, eyalet, çocuk durumu ve daha fazlasını hesaplayın.',
  path: '/maas-hesaplama',
});

const FAQ_ITEMS = [
  {
    question: 'Almanya maaş hesaplayıcı nasıl çalışır?',
    answer:
      'Brüt maaşınızı, vergi sınıfınızı (Steuerklasse), ikamet ettiğiniz eyaleti (Bundesland), çocuk sayınızı ve kilise vergisi (Kirchensteuer) gibi bilgileri girerek hesaplayıcıya sunarsınız. Araç, Almanya\'nın yürürlükteki gelir vergisi tarifeleri ve sosyal sigorta primlerini kullanarak tahmini net maaşınızı anında hesaplar.',
  },
  {
    question: 'Vergi sınıfı (Steuerklasse) net maaşı nasıl etkiler?',
    answer:
      'Almanya\'da 1\'den 6\'ya kadar olan vergi sınıfları, işverenin aylık kesiği vergi avansını doğrudan belirler. Steuerklasse 1 bekâr ve bağımsız çalışanlar için varsayılan sınıftır. Steuerklasse 3, evli çiftlerde daha yüksek kazanan eş için en avantajlı sınıftır ve net maaşı önemli ölçüde artırır. Steuerklasse 5 ise daha düşük kazanan eşe uygulanır ve kesintiler daha yüksek olur. Steuerklasse 2 yalnız ebeveynlere, Steuerklasse 6 ise birden fazla işyerinde çalışanlara uygulanır.',
  },
  {
    question: 'Brüt maaştan hangi kesintiler yapılır?',
    answer:
      'Brüt maaştan dört temel sosyal sigorta kalemi kesilir: sağlık sigortası (Krankenversicherung, yaklaşık %7,3), emeklilik sigortası (Rentenversicherung, yaklaşık %9,3), işsizlik sigortası (Arbeitslosenversicherung, yaklaşık %1,3) ve bakım sigortası (Pflegeversicherung, yaklaşık %1,7). Bunların üstüne gelir vergisi (Lohnsteuer) ve varsa kilise vergisi (Kirchensteuer, yaklaşık %8-9 ek vergi) eklenir.',
  },
  {
    question: 'Hesaplama ne kadar doğru ve resmî mi?',
    answer:
      'Araç, Almanya Maliye Bakanlığı\'nın yayımladığı yıllık vergi tablolarına ve sosyal sigorta prim oranlarına dayalı tahminî bir hesaplama sunar. Sonuçlar genel bir yönlendirme niteliğindedir; bireysel vergi durumunuza (özel indirimler, yan gelirler, yıllık beyan vb.) göre gerçek net maaş farklılık gösterebilir. Kesin rakamlar için Steuerberater (vergi danışmanı) desteği önerilir.',
  },
];

const HOW_IT_WORKS = [
  'Kullanıcı verileri saklanmaz.',
  <span key="kv">
    <strong>KV (Krankenkasse)</strong>: Yasal sağlık sigortası kesintisi. Standart oran %14.6&apos;dır.
  </span>,
  <span key="zusatz">
    <strong>Zusatzbeitrag</strong>: Ek prim, genelde %1.6 – %2.5 arasındadır.
  </span>,
  'Her iki prim de çalışan ve işveren arasında yarı yarıya paylaşılır.',
];

const WHY_TEXT =
  "Almanya'da çalışıyorsan ya da çalışmayı planlıyorsan, eline ne geçeceğini önceden bilmek hayati önem taşır. Brüt maaş rakamları iş ilanlarında cazip görünür, ancak Almanya'nın vergi ve sigorta sistemi ciddi kesintiler getirir. Bu araç, girdiğin brüt maaştan Lohnsteuer, Krankenversicherung, Pflegeversicherung, Rentenversicherung ve Arbeitslosenversicherung kesintilerini eyalete, vergi sınıfına ve aile durumuna göre hesaplar. Tersine de çalışır: hedef net rakamını girer, gerekli brütü öğrenirsin. Dienstwagen (şirket aracı) kullananlar için ek vergi etkisini de dahil edebilirsin.";

const HERO_STATS = [
  { value: String(TAX_CLASSES.length), label: 'vergi sınıfı' },
  { value: String(STATES.length), label: 'eyalet' },
  { value: 'Ücretsiz', label: 'üyelere açık' },
];

export default function MaasHesaplamaPage() {
  const pageUrl = new URL('/maas-hesaplama', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Almanya Maaş Hesaplayıcı"
        description="Almanya'da brüt maaşınızı net maaşa, net maaşınızı brüt maaşa dönüştürün. Vergi sınıfı, eyalet, çocuk durumu ve daha fazlasını hesaplayın."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Almanya Maaş Hesaplayıcı', url: pageUrl },
        ]}
      />
      <FaqJsonLd items={FAQ_ITEMS} />
      <ToolHero
        eyebrow="Kariyer ve Gelir"
        title="Almanya Maaş Hesaplayıcı — Brüt → Net → Brüt"
        intro="Almanya'da brüt maaşınızı net maaşa, net maaşınızı brüt maaşa dönüştürün. Vergi sınıfı, eyalet, çocuk durumu ve daha fazlasını hesaplayın."
        stats={HERO_STATS}
        howItWorksTitle="Nasıl Çalışır?"
        howItWorks={HOW_IT_WORKS}
      />
      <ToolAccessGate
        intro={{
          title: 'Almanya Maaş Hesaplayıcı',
          description:
            'Almanya\'da brüt maaşını net maaşa, net maaşını brüt maaşa dönüştür. Vergi sınıfı, eyalet, çocuk durumu, kilise vergisi ve sosyal sigorta kesintilerini yürürlükteki oranlarla hesapla.',
          highlights: [
            'Brütten nete ve netten brüte çift yönlü hesaplama yapar.',
            'Steuerklasse, Bundesland, çocuk sayısı, kilise vergisi ve bakım sigortası gibi değişkenleri dikkate alır.',
            'Gelir vergisi ile sağlık, emeklilik, işsizlik ve bakım sigortası kesintilerini kalem kalem gösterir.',
          ],
          toolPath: '/maas-hesaplama',
        }}
      >
        <MaasClient />
      </ToolAccessGate>
      <ToolInfoBand why={WHY_TEXT} />
      <ToolFaq name="maas-hesaplama-sss" items={FAQ_ITEMS} />
    </>
  );
}
