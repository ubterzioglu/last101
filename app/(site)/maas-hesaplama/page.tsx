import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import MaasClient from './MaasClient';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Maaş Hesaplayıcı',
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

export default function MaasHesaplamaPage() {
  const pageUrl = new URL('/maas-hesaplama', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Maaş Hesaplayıcı"
        description="Almanya'da brüt maaşınızı net maaşa, net maaşınızı brüt maaşa dönüştürün. Vergi sınıfı, eyalet, çocuk durumu ve daha fazlasını hesaplayın."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Maaş Hesaplayıcı', url: pageUrl },
        ]}
      />
      <FaqJsonLd items={FAQ_ITEMS} />
      <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <MaasClient />

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
