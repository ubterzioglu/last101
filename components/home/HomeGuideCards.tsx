import Link from 'next/link';
import type { ReactNode } from 'react';
import type { AccordionItem } from '@/components/site/Accordion';

const LINK_CLASS = 'font-semibold text-brand-700 underline underline-offset-4 transition-colors hover:text-brand-800';

function CardBody({ children }: { children: ReactNode }) {
  return <div className="space-y-4 [&_strong]:text-ink">{children}</div>;
}

function ExternalLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={LINK_CLASS}>
      {children}
    </a>
  );
}

/** The four home guide cards (copy and links unchanged from the previous home page). */
export const HOME_GUIDE_CARDS: AccordionItem[] = [
  {
    title: "Almanya'da Yaşam Rehberi Nedir, Neden Gerekli?",
    content: (
      <CardBody>
        <p>
          Almanya&apos;ya yeni taşınan biri için ilk problem çoğu zaman bilgi eksikliği değil, <strong>bilgi dağınıklığı</strong>tır. <strong>Adres kaydı</strong>,
          vergi numarası, banka hesabı, sağlık sigortası, telefon hattı ve oturum süreçleri aynı döneme yığıldığında,
          insanlar hangi adımı önce tamamlaması gerektiğini karıştırır. Adres kaydı yasal olarak <strong>14 gün</strong> içinde
          yapılmalıdır ve randevu bulunabildiğinde genellikle birkaç hafta içinde tamamlanır;
          kalan adımlar ise kuruma ve şehre göre birkaç hafta ile birkaç ay daha sürebilir. Bu nedenle bu ana sayfada yalnızca içerik
          listelemek yerine, kullanıcıyı <strong>günlük hayatta en çok etkileyecek başlıklara</strong> doğrudan yönlendiren bir yapı kurduk.
        </p>
        <p>
          Eğer hedefiniz yeni bir başlangıcı daha az stresle yönetmekse, önce{' '}
          <Link href="/almanyada-yasam" className={LINK_CLASS}>
            Almanya&apos;da yaşam rehberi
          </Link>{' '}
          ve ardından{' '}
          <Link href="/hizmet-rehberi" className={LINK_CLASS}>
            hizmet rehberi
          </Link>{' '}
          gibi kaynaklardan <strong>temel çerçeveyi kurmak</strong> gerekir. Adres kaydı için{' '}
          <ExternalLink href="https://service.berlin.de/dienstleistung/120686/">Berlin adres kaydı (Bürgeramt)</ExternalLink>, oturum izni için{' '}
          <ExternalLink href="https://www.bamf.de">BAMF</ExternalLink>{' '}
          gibi resmi kurumlar süreçlerin ilk durağıdır. Böylece resmi işlem, günlük yaşam ve yerel destek başlıkları
          ayrı ayrı değil, <strong>birbirini tamamlayan tek bir yol haritası</strong> halinde okunabilir.
        </p>
      </CardBody>
    ),
  },
  {
    title: "Almanya'da İş Bulma Süreci Nasıl İşler?",
    content: (
      <CardBody>
        <p>
          Almanya&apos;da iş bulma süreci yalnızca ilan sitelerine bakmaktan ibaret değildir. <strong>Özgeçmişin Alman işveren beklentilerine
          göre düzenlenmesi</strong>, başvuru metinlerinin pozisyona göre yeniden yazılması, maaş beklentisinin doğru kurulması ve sektör
          dilinin anlaşılması gerekir. Birçok aday iyi profillere sahip olmasına rağmen <strong>başvuru stratejisi eksik</strong> olduğu için geri
          dönüş alamaz. İlk mülakat davetine kadar gereken başvuru sayısı sektöre ve profile göre değişir.{' '}
          <ExternalLink href="https://www.arbeitsagentur.de">Bundesagentur für Arbeit</ExternalLink>{' '}
          verilerine göre ülkede işsizlik oranı Eylül 2026 itibarıyla %6,4&apos;tür ve Türk kökenli adaylar için dil seviyesi en kritik faktördür. Bu yüzden ana sayfada hem araçlara hem de doğrudan <strong>iş fırsatlarına</strong> giden linkleri görünür hale getirdik.
        </p>
        <p>
          Özellikle{' '}
          <Link href="/is-ilanlari" className={LINK_CLASS}>
            işe alım firmaları
          </Link>
          ,{' '}
          <Link href="/stepstone-karsilastirma" className={LINK_CLASS}>
            maaş karşılaştırma
          </Link>{' '}
          ve{' '}
          <Link href="/maas-hesaplama" className={LINK_CLASS}>
            maaş hesaplama
          </Link>{' '}
          sayfaları birlikte kullanıldığında kullanıcı yalnızca bir ilana başvurmakla kalmaz; aynı zamanda <strong>teklifin gerçek hayatta
          nasıl karşılık bulacağını</strong> da görür. Bu yaklaşım, iş arayışını daha <strong>ölçülebilir ve kontrollü</strong> hale getirir.
        </p>
      </CardBody>
    ),
  },
  {
    title: "Almanya'da Türk Topluluğuyla Bağ Kurmak Neden Önemli?",
    content: (
      <CardBody>
        <p>
          Yeni bir ülkede doğru insanlara ulaşmak, bazen en doğru belgeyi bulmaktan bile daha değerlidir. Çünkü taşınma sürecinde
          sorular yalnızca resmi işlemlerle sınırlı kalmaz; hangi şehir daha uygundur, ilk ev nasıl bulunur, hangi banka daha hızlı
          hesap açar, hangi işverenler Türkçe iletişim konusunda daha rahattır gibi <strong>gündelik ama kritik kararlar</strong> ortaya çıkar.
          Burada Destatis Mikrozensus 2025 ilk sonuçlarına göre <strong>Türkiye kökenli yaklaşık 3 milyon insan</strong> yaşıyor.
          Topluluk, bu noktada hazır cevap değil; <strong>deneyim filtresi</strong> sağlar.
        </p>
        <p>
          Bu nedenle ana sayfada{' '}
          <Link href="/topluluk" className={LINK_CLASS}>
            topluluk sayfası
          </Link>{' '}
          ve WhatsApp erişimi, yalnızca bir sosyal kanal olarak değil, <strong>güvenilir bilgi dolaşımı için temel bir yapı</strong> olarak konumlandı.
          İnsanların birbirine yön verdiği, güncel deneyimleri paylaştığı ve <strong>yanlış bilgi maliyetini azalttığı</strong> bir topluluk; Türk
          topluluğu arayan kullanıcılar için arama sonucundan çok daha yüksek bir değere dönüşür.
        </p>
      </CardBody>
    ),
  },
  {
    title: 'Almanya İçin Hangi Belgeler Hazırlanmalı?',
    content: (
      <CardBody>
        <p>
          Taşınma veya yerleşme sürecinde en çok zaman kaybettiren şeylerden biri, <strong>doğru belgenin doğru anda elinizde olmaması</strong>dır.
          Başvuru yapılacak kurumlar değiştikçe istenen evrak listeleri de değişebilir. Ortalama bir taşınma sürecinde <strong>10-15 farklı belge</strong> ve
          <strong> 5-7 ayrı kurum</strong> ziyareti gerekebilir. Bu nedenle belgeleri, haberleri ve rehber içerikleri
          aynı yapıda görünür kılmak çok önemlidir. Kullanıcı bir yandan bilgi okurken, diğer yandan hemen kullanabileceği <strong>kontrol listeleri</strong>ne
          ulaşabilmelidir.
        </p>
        <p>
          Bunun için{' '}
          <Link href="/belgeler" className={LINK_CLASS}>
            belgeler
          </Link>
          ,{' '}
          <Link href="/haberler" className={LINK_CLASS}>
            güncel haberler
          </Link>{' '}
          ve{' '}
          <Link href="/blog" className={LINK_CLASS}>
            blog köşe yazıları
          </Link>{' '}
          birbirini tamamlayan modüller olarak öne çıkarıldı. Böylece kullanıcı yalnızca <strong>&quot;ne yapmalıyım?&quot;</strong> sorusuna değil, <strong>&quot;bugün hangi adımı
          tamamlamalıyım?&quot;</strong> sorusuna da net bir cevap bulabilir. SEO açısından da bu yaklaşım, <strong>iç linkleme gücünü artırırken</strong> sayfalar arası niyet
          geçişlerini daha doğal hale getirir.
        </p>
      </CardBody>
    ),
  },
];
