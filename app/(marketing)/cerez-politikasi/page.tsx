import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { LegalPage, LegalSection } from '@/components/layout/LegalPage';

export const metadata = createMetadata({
  title: 'Çerez Politikası',
  description:
    'almanya101 çerez politikası: kullandığımız çerez türleri, analitik izninin nasıl çalıştığı, kabul/red seçenekleri ve tercihlerinizi nasıl geri alabileceğiniz.',
  path: '/cerez-politikasi',
});

export default function CerezPolitikasiPage() {
  return (
    <LegalPage
      title="Çerez Politikası"
      description="almanya101’i daha iyi sunabilmek için çerezler kullanıyoruz. Bu politika, hangi çerezleri neden kullandığımızı, analitik izninin nasıl çalıştığını ve tercihlerinizi nasıl yönetebileceğinizi açıklar."
      lastUpdated="24 Ekim 2026"
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
            temel işlevleri ve oturum yönetimi (örneğin giriş yaptığınızda
            oturumunuzun korunması) için gereklidir; devre dışı bırakılamaz.
          </li>
          <li>
            <strong className="text-white">Analitik çerezler:</strong> Ziyaretçi
            sayısı ve sayfa kullanımı gibi anonim istatistikleri ölçmemize
            yardımcı olur. Yalnızca açık izninizle yüklenir.
          </li>
          <li>
            <strong className="text-white">Tercih kaydı:</strong> Analitik çerez
            kararınız (kabul veya ret), tarayıcınızın yerel depolamasında
            saklanır; böylece her ziyarette yeniden sorulmaz.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Analitik İzniniz Olmadan Ölçüm Yapmayız">
        <p>
          Sitemizde üç analitik hizmet kullanıyoruz: Google Analytics, GoatCounter
          ve Microsoft Clarity. Bu hizmetlerin betikleri ve çerezleri{' '}
          <strong className="text-white">yalnızca açık izniniz sonrasında</strong>{' '}
          yüklenir. İzin vermezseniz hiçbir analitik istek yapılmaz. Kabul ve ret
          seçenekleri eşdeğerdir; ikisi de tek tıkla kullanılabilir.
        </p>
      </LegalSection>

      <LegalSection heading="4. Üçüncü Taraf Çerezleri">
        <p>
          İzin vermeniz hâlinde Google Analytics (Google Ireland Ltd.),
          GoatCounter ve Microsoft Clarity (Microsoft Corp.) kendi çerezlerini
          kullanabilir. Bu çerezler ilgili sağlayıcının gizlilik politikalarına
          tabidir. Sağlayıcılar anonimleştirilmiş kullanım verilerini kendi
          altyapılarında işleyebilir.
        </p>
      </LegalSection>

      <LegalSection heading="5. Çerezleri Nasıl Yönetirsiniz?">
        <p>
          Analitik çerez kararınızı dilediğiniz zaman her sayfanın alt
          bilgisindeki <strong className="text-white">“Çerez tercihleri”</strong>{' '}
          bağlantısından geri alabilir veya değiştirebilirsiniz. Tercihiniz
          silinir ve sayfa yenilendikten sonra yeniden sorulur; ret sonrası
          analitik betikler bir daha yüklenmez. Ayrıca tarayıcınızın
          ayarlarından tüm çerezleri silebilir veya engelleyebilirsiniz. Zorunlu
          çerezleri devre dışı bırakmanız sitenin bazı bölümlerinin düzgün
          çalışmamasına yol açabilir.
        </p>
      </LegalSection>

      <LegalSection heading="6. Daha Fazla Bilgi">
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
