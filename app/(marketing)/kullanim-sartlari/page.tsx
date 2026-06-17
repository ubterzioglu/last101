import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { LegalPage, LegalSection } from '@/components/layout/LegalPage';

export const metadata = createMetadata({
  title: 'Kullanım Şartları',
  description:
    'almanya101 kullanım şartları: hizmet kapsamı, sorumluluk reddi, fikri mülkiyet, hesap kuralları ve platformu kullanırken uymanız gereken koşullar.',
  path: '/kullanim-sartlari',
});

export default function KullanimSartlariPage() {
  return (
    <LegalPage
      title="Kullanım Şartları"
      description="almanya101’i kullanarak aşağıdaki şartları kabul etmiş olursunuz. Lütfen platformu kullanmadan önce bu koşulları okuyun."
      lastUpdated="17 Haziran 2026"
    >
      <LegalSection heading="1. Hizmet Kapsamı">
        <p>
          almanya101, Almanya’da yaşayan veya yaşamayı düşünen Türkler için
          bilgilendirici içerikler, hesaplama araçları ve rehberler sunan bir
          topluluk platformudur. Hizmetler olduğu gibi sunulur.
        </p>
      </LegalSection>

      <LegalSection heading="2. Sorumluluk Reddi">
        <p>
          Platformdaki tüm içerik ve araçlar yalnızca bilgilendirme amaçlıdır.
          Maaş hesaplama, vize seçimi, sigorta gibi araçların sonuçları tahmini
          olup resmi danışmanlık, hukuki veya mali tavsiye yerine geçmez. Resmi
          işlemleriniz için ilgili kurumlara ve uzmanlara başvurmanız gerekir.
        </p>
        <p>
          İçeriklerin güncelliği ve doğruluğu için çaba göstersek de hatalardan
          veya bu bilgilere dayanarak verdiğiniz kararlardan sorumlu tutulamayız.
        </p>
      </LegalSection>

      <LegalSection heading="3. Fikri Mülkiyet">
        <p>
          Platformdaki metin, görsel, logo ve yazılımlar almanya101’e veya ilgili
          hak sahiplerine aittir. İzinsiz kopyalanamaz, çoğaltılamaz veya ticari
          amaçla kullanılamaz.
        </p>
      </LegalSection>

      <LegalSection heading="4. Hesap ve Kullanıcı Kuralları">
        <ul className="list-disc space-y-2 pl-6">
          <li>Hesap bilgilerinizin gizliliğinden siz sorumlusunuz.</li>
          <li>Platformu yasalara aykırı amaçlarla kullanamazsınız.</li>
          <li>
            Diğer kullanıcılara zarar verecek, yanıltıcı veya rahatsız edici
            içerik paylaşmamayı kabul edersiniz.
          </li>
        </ul>
      </LegalSection>

      <LegalSection heading="5. Üçüncü Taraf Bağlantıları">
        <p>
          Platform, üçüncü taraf web sitelerine bağlantılar içerebilir. Bu
          sitelerin içeriğinden veya gizlilik uygulamalarından sorumlu değiliz.
        </p>
      </LegalSection>

      <LegalSection heading="6. Değişiklikler">
        <p>
          Bu kullanım şartlarını dilediğimiz zaman güncelleyebiliriz. Güncel
          sürüm bu sayfada yayımlanır. Gizlilikle ilgili bilgi için{' '}
          <Link href="/gizlilik-politikasi" className="text-google-yellow hover:underline">
            Gizlilik Politikası
          </Link>{' '}
          sayfamıza bakabilirsiniz.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
