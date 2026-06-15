import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/utils/constants';
import { BelgelerClient } from './BelgelerClient';

export const metadata = createMetadata({
  title: 'Yararlı Belgeler',
  description: 'Almanya’da yaşayan Türkiye kökenli kişiler için en sık gereken resmî belgelerin kapsamlı rehberi.',
  path: '/belgeler',
});

const FAQ_ITEMS = [
  {
    question: 'Almanya’da en sık gereken resmî belgeler hangileri?',
    answer:
      'Almanya’ya yeni taşınanlar için en kritik belgeler şunlardır: adres kaydı (Anmeldung), ikamet izni (Aufenthaltstitel), vergi numarası (Steuer-ID), sabıka kaydı (Führungszeugnis) ve bazı başvurularda noter ya da yeminli tercüman onaylı Türkçe doğum/evlilik belgeleri. Bu belgeler iş, konut ve resmî işlemlerin neredeyse tamamında istenir.',
  },
  {
    question: 'Anmeldung nedir ve neden bu kadar önemli?',
    answer:
      'Anmeldung, Almanya’daki ikamet adresinizi yerel nüfus müdürlüğüne (Einwohnermeldeamt veya Bürgeramt) tescil ettirme işlemidir. Almanya’ya taşındıktan sonra genellikle 14 gün içinde yapılması yasal zorunluluktur. Anmeldung olmadan banka hesabı açmak, sağlık sigortasına kaydolmak, Steuer-ID almak ve çoğu resmî işlemi tamamlamak mümkün değildir; bu nedenle Almanya’daki tüm süreçlerin temelini oluşturur.',
  },
  {
    question: 'Steuer-ID (vergi kimlik numarası) nasıl alınır?',
    answer:
      'Steuer-ID, Anmeldung yaptırdıktan sonra Bundeszentralamt für Steuern (BZSt) tarafından otomatik olarak posta adresinize gönderilir; ayrıca başvuru yapmanıza gerek yoktur. Genellikle 2-4 hafta içinde ulaşır. Steuer-ID’niz kaybolursa BZSt’nin web sitesi üzerinden çevrimiçi tekrar talep edebilirsiniz. Bu numara ömür boyu değişmez ve bordro, vergi beyannamesi ile banka işlemlerinde gereklidir.',
  },
  {
    question: 'Belge tercümeleri ne zaman ve kimden alınmalı?',
    answer:
      'Almanya’da resmî kurumlara sunulacak Türkçe belgeler (nüfus cüzdanı, doğum belgesi, evlilik cüzdanı, diploma vb.) genellikle yeminli tercüman (vereidigter Übersetzer) tarafından yapılmış ve noter onaylı çevirilerle birlikte kabul edilir. Serbest piyasada yapılan tercümeler çoğunlukla kabul görmez. Almanya’daki Türk konsolosluğu veya Almanya Yeminli Tercümanlar Birliği (BDÜ) listesinden uygun tercüman bulabilirsiniz.',
  },
];

export default function BelgelerPage() {
  const pageUrl = new URL('/belgeler', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Yararlı Belgeler"
        description="Almanya’da yaşayan Türkiye kökenli kişiler için en sık gereken resmî belgelerin kapsamlı rehberi."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Yararlı Belgeler', url: pageUrl },
        ]}
      />
      <FaqJsonLd items={FAQ_ITEMS} />

      <div className="min-h-screen bg-black">
        <BelgelerClient />
        <section
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 mt-12 border-t border-white/10"
          aria-labelledby="sss-baslik"
        >
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
