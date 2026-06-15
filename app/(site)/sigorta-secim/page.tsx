import { createMetadata } from '@/lib/seo/metadata';
import { BreadcrumbJsonLd, FaqJsonLd, WebPageJsonLd } from '@/components/seo/JsonLd';
import SigortaClient from './SigortaClient';
import { SITE_URL } from '@/lib/utils/constants';

export const metadata = createMetadata({
  title: 'Sigorta Seçim Aracı',
  description: '20 soruda Almanya için sigortalarınızı önceliklendirin. Önce Al, Güçlü Öneri, Opsiyonel kategorileri.',
  path: '/sigorta-secim',
});

const FAQ_ITEMS = [
  {
    question: 'Almanya sigorta seçim aracı nasıl çalışır?',
    answer:
      '20 kısa soruyla yaşam durumunuzu (medeni hal, çocuk, araba, kira vb.) ve risk önceliklerinizi ölçer; ardından her sigorta türü için "Önce Al", "Güçlü Öneri" veya "Opsiyonel" etiketiyle kişiselleştirilmiş bir öncelik listesi oluşturur. Sonuç anında görünür, kişisel veri saklanmaz ve araç tamamen ücretsizdir.',
  },
  {
    question: 'Almanya\'da zorunlu sigortalar hangileri?',
    answer:
      'Almanya\'da yasal olarak zorunlu olan tek sigorta türü sağlık sigortasıdır (Krankenversicherung); çalışanlar işverenle yarı yarıya paylaşılan katkıyla devlet sağlık kasasına (GKV) kaydolmak zorundadır. Araç sahipleri için trafik sorumluluk sigortası (Kfz-Haftpflicht) da kanunen zorunludur. Bunların dışındaki sigortalar zorunlu olmamakla birlikte kişisel duruma göre kuvvetle tavsiye edilebilir.',
  },
  {
    question: 'Almanya\'ya yeni gelen biri önce hangi sigortayı almalı?',
    answer:
      'İlk yapılacak iş sağlık sigortası kaydıdır; işe başlamadan veya Anmeldung\'dan kısa süre sonra tamamlanması gerekir. İkinci öncelik kişisel sorumluluk sigortasıdır (Haftpflichtversicherung); çok düşük primle günlük hayattaki büyük riskleri karşılar ve neredeyse herkes için önerilir. Kiracıysanız ev eşyası sigortası (Hausratversicherung) da erken alınması gereken sigortalar arasındadır.',
  },
  {
    question: 'Bu araç belirli bir sigorta şirketini mi öneriyor, ücretli mi?',
    answer:
      'Araç tamamen bağımsız ve ücretsizdir; belirli bir sigorta şirketini veya ürününü satmaz, komisyon almaz. Yalnızca yaşam koşullarınıza göre hangi sigorta türlerinin öncelikli olduğunu gösterir. Seçtiğiniz ürünü satın almadan önce güncel fiyat ve koşulları sigorta sağlayıcılarından bizzat teyit etmeniz önerilir.',
  },
];

export default function SigortaSecimPage() {
  const pageUrl = new URL('/sigorta-secim', SITE_URL).toString();

  return (
    <>
      <WebPageJsonLd
        title="Sigorta Seçim Aracı"
        description="20 soruda Almanya için sigortalarınızı önceliklendirin. Önce Al, Güçlü Öneri, Opsiyonel kategorileri."
        url={pageUrl}
      />
      <BreadcrumbJsonLd
        items={[
          { name: 'Ana Sayfa', url: new URL('/', SITE_URL).toString() },
          { name: 'Sigorta Seçim Aracı', url: pageUrl },
        ]}
      />
      <FaqJsonLd items={FAQ_ITEMS} />
      <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <SigortaClient />

        <section className="mt-12 border-t border-white/10 pt-10" aria-labelledby="sss-baslik">
          <h2 id="sss-baslik" className="text-2xl font-bold text-white md:text-3xl">
            Sıkça Sorulan Sorular
          </h2>
          <div className="mt-6 space-y-4">
            {FAQ_ITEMS.map((item) => (
              <details
                key={item.question}
                className="group rounded-xl border border-white/10 bg-white/[0.03] p-5"
              >
                <summary className="cursor-pointer list-none text-lg font-semibold text-white">
                  {item.question}
                </summary>
                <p className="mt-3 leading-7 text-white/75">{item.answer}</p>
              </details>
            ))}
          </div>
        </section>
      </div>
    </>
  );
}
