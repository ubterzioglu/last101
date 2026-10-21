import Image from 'next/image';
import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { HeroSection } from '@/components/sections/HeroSection';
import { CTASection } from '@/components/sections/CTASection';
import { Section } from '@/components/ui/Section';
import { BreadcrumbJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { getPublishedRehberArticles } from '@/lib/rehber-articles';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Rehber',
  description: 'Almanya ile ilgili kapsamlı rehberler ve makaleler. Her konuda detaylı bilgiler.',
  path: '/rehber',
});

export const dynamic = 'force-dynamic';

export default async function RehberPage() {
  const articles = await getPublishedRehberArticles(120);
  const pageUrl = new URL('/rehber', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Kapsamlı Rehberler"
        description="Almanya ile ilgili her konuda detaylı rehberler ve makaleler."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Rehber', url: pageUrl },
        ]}
      />

      <HeroSection
        title="Kapsamlı Rehberler"
        description="Almanya ile ilgili her konuda detaylı rehberler ve makaleler. Uzmanlardan güvenilir bilgiler."
        centered={false}
        className="bg-google-red"
      />

      <Section contained>
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Tüm Rehberler</h2>
          <p className="text-lg text-gray-600 max-w-2xl">
            İhtiyacınız olan bilgiyi hızlıca bulun. Rehberlerimiz düzenli olarak güncellenir.
          </p>
        </div>

        {articles.length === 0 ? (
          <div className="rounded-2xl border border-gray-200 bg-gray-50 px-6 py-12">
            <div className="mx-auto max-w-3xl text-center">
              <h3 className="text-2xl font-bold text-gray-900">Rehber kütüphanesi hazırlanıyor</h3>
              <p className="mt-4 text-gray-600">
                Almanya&apos;da yeni bir hayat kurarken en çok ihtiyaç duyulan konuları adım adım
                anlatan rehberler üzerinde çalışıyoruz. İlk yayın kümesinde şu başlıklar yer alacak:
              </p>
              <ul className="mt-6 grid grid-cols-1 gap-3 text-left sm:grid-cols-2">
                {[
                  'Anmeldung (adres kaydı) ve ilk resmi işlemler',
                  'Oturum ve vize yolları',
                  'Sağlık sigortası seçimi',
                  'Brüt-net maaş ve vergi sistemi',
                  'Banka hesabı açma',
                  'İş arama ve başvuru süreci',
                ].map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-2 rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-700"
                  >
                    <span aria-hidden className="mt-0.5 text-google-blue">•</span>
                    {topic}
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-gray-600">
                Bu sırada mevcut kaynaklardan yararlanabilirsiniz:
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/hizmet-rehberi"
                  className="inline-flex items-center rounded-full bg-google-blue px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Hizmet Rehberi
                </Link>
                <Link
                  href="/almanya-araclari"
                  className="inline-flex items-center rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-google-blue hover:text-google-blue"
                >
                  Almanya Araçları
                </Link>
                <Link
                  href="/haberler"
                  className="inline-flex items-center rounded-full border border-gray-300 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition hover:border-google-blue hover:text-google-blue"
                >
                  Güncel Haberler
                </Link>
              </div>
              <p className="mt-6 text-sm text-gray-500">
                Belirli bir konuda rehber görmek istiyorsanız{' '}
                <Link href="/iletisim" className="font-semibold text-google-blue underline underline-offset-2">
                  bize konu önerin
                </Link>
                ; ilk rehber yayına alındığında bu sayfada listelenecek.
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <Link
                key={article.id}
                href={article.href}
                className="group flex h-full flex-col overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-google-blue hover:shadow-lg"
              >
                <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
                  <Image
                    src={article.coverImageUrl}
                    alt={article.title}
                    fill
                    unoptimized
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, 100vw"
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-grow flex-col p-6">
                  <span className="mb-2 inline-flex w-fit rounded-full bg-google-blue/10 px-3 py-1 text-xs font-semibold text-google-blue">
                    {article.category}
                  </span>
                  <h3 className="mb-2 text-xl font-semibold text-gray-900 line-clamp-2">{article.title}</h3>
                  {article.summary ? (
                    <p className="mb-4 text-gray-600 line-clamp-3">{article.summary}</p>
                  ) : null}
                  <div className="mt-auto flex items-center justify-between border-t border-gray-100 pt-4 text-sm text-gray-500">
                    <span>{article.dateLabel}</span>
                    <span>{article.readingMinutes} dk okuma</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </Section>

      <CTASection
        title="Konu Önerin"
        description="Aradığınız bir konu hakkında rehber bulamadınız mı? Bize konu önerin, uzmanlarımız hazırlasın."
        primaryAction={{ label: 'Konu Öner', href: '/iletisim' }}
        secondaryAction={{ label: 'İletişime Geçin', href: '/iletisim' }}
      />
    </>
  );
}
