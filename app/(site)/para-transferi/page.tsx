import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { TransferSelector } from '@/components/para-transferi/transfer-selector';
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
          { name: 'Para Transferi', url: pageUrl },
        ]}
      />
      <FaqJsonLd items={FAQ_ITEMS} />
      <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <TransferSelector />

        <section className="mt-12 border-t border-white/10 pt-10" aria-labelledby="sss-baslik">
          <h2 id="sss-baslik" className="text-2xl font-bold text-white md:text-3xl">
            Sıkça Sorulan Sorular
          </h2>
          <div className="mt-6 space-y-4">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-white/10 bg-white/[0.03] p-5"
              >
                <summary className="cursor-pointer list-none text-lg font-semibold text-white">
                  {item.question}
                </summary>
                <p className="mt-3 leading-7 text-white/75">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
