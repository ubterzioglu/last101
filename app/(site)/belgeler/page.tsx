import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { Accordion } from '@/components/site/Accordion';
import { PageHead } from '@/components/site/PageHead';
import { PhotoCard } from '@/components/site/PhotoCard';
import { SectionHeader } from '@/components/site/SectionHeader';
import { Section } from '@/components/ui/Section';
import { SITE_URL } from '@/lib/utils/constants';
import { MapPin } from 'lucide-react';
import { countDocuments } from './belgeler-helpers';
import { belgelerData } from './data';
import { DocumentCategories } from './DocumentCategories';

export const metadata = createMetadata({
  title: 'Yararlı Belgeler Kataloğu',
  description: 'Almanya’da yaşayan Türkiye kökenli kişiler için en sık gereken resmî belgelerin kapsamlı rehberi: Anmeldung, Steuer-ID, sağlık kartı, oturum ve vatandaşlık belgeleri.',
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
        title="Yararlı Belgeler Kataloğu"
        description="Almanya’da yaşayan Türkiye kökenli kişiler için en sık gereken resmî belgelerin kapsamlı rehberi."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Yararlı Belgeler Kataloğu', url: pageUrl },
        ]}
      />
      <FaqJsonLd items={FAQ_ITEMS} />

      <PageHead
        breadcrumb={[{ label: 'Ana Sayfa', href: '/' }, { label: 'Yararlı Belgeler' }]}
        title="Yararlı Belgeler Kataloğu"
        description="Almanya'da yaşayan veya Almanya'ya taşınmayı planlayan Türkiye kökenli kişiler için en sık gereken resmî belgelerin listesi."
        stats={[
          { value: String(countDocuments(belgelerData)), label: 'Belge' },
          { value: String(belgelerData.length), label: 'Kategori' },
        ]}
        media={
          <PhotoCard
            src="/images/site/berlin-spree.webp"
            alt="Berlin'de Spree nehri kıyısı"
            chip={{ label: 'Berlin', icon: MapPin }}
            priority
          />
        }
      />

      <Section aria-labelledby="belge-kategorileri-baslik">
        <SectionHeader id="belge-kategorileri-baslik" title="Belge kategorileri" className="mb-8" />
        <DocumentCategories categories={belgelerData} />
      </Section>

      <Section tone="band" aria-labelledby="sss-baslik">
        <div className="grid gap-8 lg:grid-cols-[1fr_2fr] lg:gap-16">
          <SectionHeader id="sss-baslik" eyebrow="SSS" title="Sıkça Sorulan Sorular" />
          <Accordion
            name="belgeler-sss"
            toneCycle
            items={FAQ_ITEMS.map((item) => ({ title: item.question, content: <p>{item.answer}</p> }))}
          />
        </div>
      </Section>
    </>
  );
}
