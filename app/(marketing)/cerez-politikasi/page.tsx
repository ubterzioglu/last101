import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { LegalPage, LegalSection } from '@/components/layout/LegalPage';

export const metadata = createMetadata({
  title: 'Çerez Politikası',
  description:
    'almanya101 çerez politikası: kullandığımız çerez türleri, kullanım amaçları ve tarayıcınızdan çerezleri nasıl yönetebileceğiniz.',
  path: '/cerez-politikasi',
});

export default function CerezPolitikasiPage() {
  return (
    <LegalPage
      title="Çerez Politikası"
      description="almanya101’i daha iyi sunabilmek için çerezler kullanıyoruz. Bu politika, hangi çerezleri neden kullandığımızı ve onları nasıl yönetebileceğinizi açıklar."
      lastUpdated="17 Haziran 2026"
    >
      <LegalSection heading="1. Çerez Nedir?">
        <p>
          Çerezler, bir web sitesini ziyaret ettiğinizde tarayıcınıza kaydedilen
          küçük metin dosyalarıdır. Sitenin düzgün çalışmasını ve kullanım
          deneyiminizin iyileştirilmesini sağlarlar.
        </p>
      </LegalSection>

      <LegalSection heading="2. Kullandığımız Çerez Türleri">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="text-white">Zorunlu çerezler:</strong> Sitenin
            temel işlevleri ve oturum yönetimi için gereklidir; devre dışı
            bırakılamaz.
          </li>
          <li>
            <strong className="text-white">Analitik çerezler:</strong> Ziyaretçi
            sayısı ve sayfa kullanımı gibi anonim istatistikleri ölçmemize yardımcı
            olur.
          </li>
          <li>
            <strong className="text-white">Tercih çerezleri:</strong> Dil ve
            görünüm gibi tercihlerinizi hatırlar.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Üçüncü Taraf Çerezleri">
        <p>
          Analiz ve içerik gömme amacıyla üçüncü taraf hizmetler (örneğin analiz
          araçları) kendi çerezlerini kullanabilir. Bu çerezler ilgili sağlayıcının
          gizlilik politikalarına tabidir.
        </p>
      </LegalSection>

      <LegalSection heading="4. Çerezleri Nasıl Yönetirsiniz?">
        <p>
          Tarayıcınızın ayarlarından çerezleri silebilir veya engelleyebilirsiniz.
          Ancak zorunlu çerezleri devre dışı bırakmanız sitenin bazı bölümlerinin
          düzgün çalışmamasına yol açabilir.
        </p>
      </LegalSection>

      <LegalSection heading="5. Daha Fazla Bilgi">
        <p>
          Kişisel verilerinizin işlenmesiyle ilgili ayrıntılar için{' '}
          <Link href="/gizlilik-politikasi" className="text-google-yellow hover:underline">
            Gizlilik Politikası
          </Link>{' '}
          sayfamızı inceleyebilirsiniz.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
