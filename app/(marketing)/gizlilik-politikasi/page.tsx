import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { LegalPage, LegalSection } from '@/components/layout/LegalPage';

export const metadata = createMetadata({
  title: 'Gizlilik Politikası',
  description:
    'almanya101 gizlilik politikası: hangi verileri topladığımız, nasıl kullandığımız, ne kadar sakladığımız ve kullanıcı haklarınız hakkında bilgi.',
  path: '/gizlilik-politikasi',
});

export default function GizlilikPolitikasiPage() {
  return (
    <LegalPage
      title="Gizlilik Politikası"
      description="Kişisel verilerinizin gizliliği bizim için önemlidir. Bu politika, almanya101’i kullanırken hangi verilerin işlendiğini ve haklarınızı açıklar."
      lastUpdated="17 Haziran 2026"
    >
      <LegalSection heading="1. Veri Sorumlusu">
        <p>
          Bu platform almanya101 ekibi tarafından işletilmektedir. Gizlilikle
          ilgili her türlü soru ve talebiniz için{' '}
          <a href="mailto:info@almanya101.de" className="text-google-yellow hover:underline">
            info@almanya101.de
          </a>{' '}
          adresinden bize ulaşabilirsiniz.
        </p>
      </LegalSection>

      <LegalSection heading="2. Hangi Verileri Topluyoruz?">
        <ul className="list-disc space-y-2 pl-6">
          <li>
            <strong className="text-white">İletişim bilgileri:</strong> Bize
            yazdığınızda paylaştığınız e-posta adresi ve mesaj içeriği.
          </li>
          <li>
            <strong className="text-white">Hesap bilgileri:</strong> Üyelik
            (devuser) hesabı oluşturduğunuzda sağladığınız profil bilgileri.
          </li>
          <li>
            <strong className="text-white">Kullanım verileri:</strong> Sayfa
            görüntülemeleri ve anonim analiz verileri (ziyaret istatistikleri).
          </li>
          <li>
            <strong className="text-white">Çerezler:</strong> Tarayıcınızda
            saklanan teknik ve analitik çerezler.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="3. Verileri Neden İşliyoruz?">
        <p>
          Verilerinizi yalnızca hizmeti sunmak, taleplerinize yanıt vermek,
          platformu geliştirmek ve yasal yükümlülüklerimizi yerine getirmek için
          işleriz. Verilerinizi pazarlama amacıyla üçüncü taraflara satmayız.
        </p>
      </LegalSection>

      <LegalSection heading="4. Verilerin Saklanması ve Güvenliği">
        <p>
          Kişisel verileriniz, işlenme amacının gerektirdiği süre boyunca veya
          yasal saklama süreleri kadar saklanır. Verileriniz, makul teknik ve
          idari güvenlik önlemleriyle korunur.
        </p>
      </LegalSection>

      <LegalSection heading="5. Haklarınız">
        <p>
          Kişisel verilerinize erişme, düzeltme, silme, işlemeyi kısıtlama ve
          taşınabilirlik haklarına sahipsiniz. Haklarınızı kullanmak için bizimle
          iletişime geçebilirsiniz. Ayrıntılar için{' '}
          <Link href="/kvkk-gdpr-ccpa" className="text-google-yellow hover:underline">
            KVKK / GDPR / CCPA
          </Link>{' '}
          sayfamıza bakabilirsiniz.
        </p>
      </LegalSection>

      <LegalSection heading="6. Çerezler">
        <p>
          Çerez kullanımımız hakkında ayrıntılı bilgi için{' '}
          <Link href="/cerez-politikasi" className="text-google-yellow hover:underline">
            Çerez Politikası
          </Link>{' '}
          sayfamızı inceleyebilirsiniz.
        </p>
      </LegalSection>

      <LegalSection heading="7. Değişiklikler">
        <p>
          Bu gizlilik politikasını zaman zaman güncelleyebiliriz. Güncellemeler bu
          sayfada yayımlandığı andan itibaren geçerli olur.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
