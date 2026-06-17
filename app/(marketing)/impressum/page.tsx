import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { LegalPage, LegalSection } from '@/components/layout/LegalPage';

export const metadata = createMetadata({
  title: 'Impressum',
  description:
    'almanya101 Impressum — § 5 DDG uyarınca yasal sağlayıcı bilgileri ve iletişim.',
  path: '/impressum',
});

export default function ImpressumPage() {
  return (
    <LegalPage
      title="Impressum"
      description="§ 5 DDG (Digitale-Dienste-Gesetz) uyarınca yasal bilgiler."
      lastUpdated="17 Haziran 2026"
    >
      <LegalSection heading="Sağlayıcı (Diensteanbieter)">
        <address className="not-italic text-white/75">
          Umut Barış Terzioğlu
          <br />
          Gutenbergstraße 28
          <br />
          44139 Dortmund, Almanya
        </address>
      </LegalSection>

      <LegalSection heading="İletişim (Kontakt)">
        <p>
          E-posta:{' '}
          <a href="mailto:info@almanya101.de" className="text-google-yellow hover:underline">
            info@almanya101.de
          </a>
        </p>
      </LegalSection>

      <LegalSection heading="İçerikten Sorumlu (Verantwortlich i. S. d. § 18 Abs. 2 MStV)">
        <address className="not-italic text-white/75">
          Umut Barış Terzioğlu
          <br />
          Gutenbergstraße 28
          <br />
          44139 Dortmund, Almanya
        </address>
      </LegalSection>

      <LegalSection heading="Sorumluluk Reddi (Haftungsausschluss)">
        <p>
          <strong className="text-white">İçerik sorumluluğu:</strong> Bu sitedeki
          içerikler büyük bir özenle hazırlanmıştır. Ancak içeriğin doğruluğu,
          eksiksizliği ve güncelliği için sorumluluk üstlenilmez. § 7 Abs. 1 DDG
          uyarınca kendi içeriklerimizden genel yasalara göre sorumluyuz; ancak
          § 8–10 DDG uyarınca iletilen veya saklanan üçüncü taraf bilgilerini
          izlemek ya da hukuka aykırılık belirtisi araştırmakla yükümlü değiliz.
        </p>
        <p>
          <strong className="text-white">Bağlantı sorumluluğu:</strong> Sitemiz,
          içeriği üzerinde hiçbir etkimizin olmadığı üçüncü taraf web sitelerine
          bağlantılar içerir. Bu nedenle bu dış içerikler için sorumluluk
          üstlenemeyiz. Bağlantı verilen sayfaların içeriğinden her zaman ilgili
          sağlayıcı veya işletmeci sorumludur.
        </p>
      </LegalSection>

      <LegalSection heading="Telif Hakkı (Urheberrecht)">
        <p>
          Bu sitedeki içerik ve eserler Alman telif hakkı yasasına tabidir.
          Çoğaltma, işleme, dağıtma ve her türlü kullanım, yazarın veya ilgili hak
          sahibinin yazılı izni olmaksızın yapılamaz.
        </p>
      </LegalSection>

      <LegalSection heading="İlgili Sayfalar">
        <p>
          <Link href="/gizlilik-politikasi" className="text-google-yellow hover:underline">
            Gizlilik Politikası
          </Link>{' '}
          ·{' '}
          <Link href="/kvkk-gdpr-ccpa" className="text-google-yellow hover:underline">
            KVKK / GDPR / CCPA
          </Link>{' '}
          ·{' '}
          <Link href="/kullanim-sartlari" className="text-google-yellow hover:underline">
            Kullanım Şartları
          </Link>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
