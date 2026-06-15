import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Vatandaşlık Testi Denemesi',
  description: 'Almanya vatandaşlık testi için deneme sınavı. 33 soruluk sınav formatıyla pratik yapın ve skorunuzu görün.',
  path: '/vatandaslik-testi',
});

const FAQ_ITEMS = [
  {
    question: 'Almanya vatandaşlık testi deneme sınavı nasıl çalışır?',
    answer:
      'Deneme sınavı, gerçek Einbürgerungstest (vatandaşlık testi) formatını yansıtır: 33 çoktan seçmeli soru sunulur, her soruda 4 seçenek bulunur ve yalnızca 1 doğru cevap vardır. Sınav tamamlandığında kaç soruyu doğru yanıtladığınız ve hangi sorularda hata yaptığınız gösterilir. Böylece eksik konularınızı tespit ederek gerçek sınava daha hazırlıklı girebilirsiniz.',
  },
  {
    question: 'Gerçek Einbürgerungstest\'te kaç soru var ve kaç doğru gerekir?',
    answer:
      'Gerçek Einbürgerungstest 33 sorudan oluşur; bunların 30 tanesi Almanya genelini kapsayan ortak sorular, 3 tanesi ise başvuruyu yaptığınız eyalete özgü sorulardır. Sınavı geçmek için en az 17 soruyu doğru yanıtlamanız gerekir; bu da yaklaşık %51 başarı oranına karşılık gelir.',
  },
  {
    question: 'Vatandaşlık testi hangi konuları kapsar?',
    answer:
      'Sınav üç ana başlık altında sorular içerir: Almanya\'nın demokratik düzeni, temel haklar ve anayasa (Grundgesetz); Almanya\'nın tarihi ve toplumsal yapısı; ve başvurduğunuz federal eyalete ait yerel tarih, kültür ve siyaset. Sorular Almanca olup günlük hayatta kullanılan sade bir dil düzeyindedir.',
  },
  {
    question: 'Bu deneme sınavı ücretsiz mi ve resmî bağlantısı var mı?',
    answer:
      'Deneme sınavı tamamen ücretsizdir. Resmî sınav soruları Almanya Federal Göç ve Mülteciler Ofisi (BAMF) tarafından yayımlanmakta olup soru havuzu kamuya açıktır. Bu araç, BAMF\'ın yayımladığı soru havuzunu baz alarak bağımsız bir pratik ortamı sunar; resmî sınavla veya herhangi bir devlet kurumuyla doğrudan bağlantısı yoktur.',
  },
];

export default function VatandaslikTestiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pageUrl = new URL('/vatandaslik-testi', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Vatandaşlık Testi Denemesi"
        description="Almanya vatandaşlık testi için deneme sınavı. 33 soruluk sınav formatıyla pratik yapın ve skorunuzu görün."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Vatandaşlık Testi', url: pageUrl },
        ]}
      />
      <FaqJsonLd items={FAQ_ITEMS} />
      {children}
    </>
  );
}
