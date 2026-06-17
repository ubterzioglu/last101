import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { LegalPage, LegalSection } from '@/components/layout/LegalPage';

export const metadata = createMetadata({
  title: 'KVKK / GDPR / CCPA',
  description:
    'almanya101 veri koruma uyumu: KVKK (Türkiye), GDPR (AB) ve CCPA (Kaliforniya) kapsamında veri sahibi haklarınız ve başvuru yöntemleri.',
  path: '/kvkk-gdpr-ccpa',
});

export default function KvkkGdprCcpaPage() {
  return (
    <LegalPage
      title="KVKK / GDPR / CCPA"
      description="Kişisel verilerinizi Türkiye (KVKK), Avrupa Birliği (GDPR) ve Kaliforniya (CCPA) düzenlemelerine uygun şekilde işlemeye özen gösteriyoruz."
      lastUpdated="17 Haziran 2026"
    >
      <LegalSection heading="1. Genel">
        <p>
          almanya101, hizmet verdiği farklı bölgelerdeki kullanıcılar için geçerli
          olan veri koruma düzenlemelerine uymayı taahhüt eder. Bu sayfa, KVKK,
          GDPR ve CCPA kapsamındaki haklarınızı özetler. Verilerin nasıl
          işlendiğine dair ayrıntılar için{' '}
          <Link href="/gizlilik-politikasi" className="text-google-yellow hover:underline">
            Gizlilik Politikası
          </Link>{' '}
          sayfasına bakınız.
        </p>
        <p>Veri sorumlusu:</p>
        <address className="not-italic text-white/75">
          Umut Barış Terzioğlu
          <br />
          Gutenbergstraße 28
          <br />
          44139 Dortmund, Almanya
          <br />
          <a href="mailto:info@almanya101.de" className="text-google-yellow hover:underline">
            info@almanya101.de
          </a>
        </address>
      </LegalSection>

      <LegalSection heading="2. KVKK (Türkiye)">
        <p>
          6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında; verilerinizin
          işlenip işlenmediğini öğrenme, işlenmişse buna ilişkin bilgi talep etme,
          işlenme amacını öğrenme, eksik/yanlış işlenen verilerin düzeltilmesini ve
          ilgili koşullarda silinmesini isteme haklarına sahipsiniz.
        </p>
      </LegalSection>

      <LegalSection heading="3. GDPR (Avrupa Birliği)">
        <p>
          AB Genel Veri Koruma Tüzüğü kapsamında; erişim hakkı, düzeltme hakkı,
          silme (“unutulma”) hakkı, işlemenin kısıtlanması hakkı, veri
          taşınabilirliği hakkı ve işlemeye itiraz hakkına sahipsiniz. Verileriniz
          yalnızca meşru bir hukuki dayanağa dayanılarak işlenir.
        </p>
      </LegalSection>

      <LegalSection heading="4. CCPA (Kaliforniya)">
        <p>
          California Consumer Privacy Act kapsamında; hangi kişisel bilgilerin
          toplandığını öğrenme, bu bilgilerin silinmesini talep etme ve verilerin
          satışını reddetme (“opt-out”) haklarına sahipsiniz. Kişisel verilerinizi
          satmıyoruz.
        </p>
      </LegalSection>

      <LegalSection heading="5. Haklarınızı Nasıl Kullanırsınız?">
        <p>
          Yukarıdaki haklardan herhangi birini kullanmak için{' '}
          <a href="mailto:info@almanya101.de" className="text-google-yellow hover:underline">
            info@almanya101.de
          </a>{' '}
          adresine talebinizi iletebilirsiniz. Başvurularınızı, ilgili
          mevzuatın öngördüğü süreler içinde değerlendirip yanıtlarız.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
