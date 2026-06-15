import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
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
          { name: 'Vize Seçim Aracı', url: pageUrl },
        ]}
      />
      <FaqJsonLd items={FAQ_ITEMS} />
      <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <VizeClient />

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
