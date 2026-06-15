import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import BankaClient from './BankaClient';
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
      <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <BankaClient />

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
