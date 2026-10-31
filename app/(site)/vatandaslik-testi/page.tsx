import { ToolAccessGate } from '@/components/tools/ToolIntroPanel';
import { ToolHero } from '@/components/tools/ToolHero';
import { ToolInfoBand } from '@/components/tools/ToolInfoBand';
import VatandaslikTestiClient from './VatandaslikTestiClient';

const HOW_IT_WORKS = [
  'Toplam 33 sorudan en az 17 doğru cevap sınavı geçmek için yeterlidir.',
  'Her sorunun yalnızca 1 doğru cevabı vardır.',
  'İlerledikçe doğru sayınız hesaplanır ve test sonunda sonuç gösterilir.',
];

const WHY_TEXT =
  "Almanya vatandaşlığı için başvuru yapacaksanız Einbürgerungstest'i geçmek zorundasınız. Sınav, Bundesamt für Migration und Flüchtlinge (BAMF) tarafından hazırlanan 310 soruluk havuzdan rastgele seçilen 33 sorudan oluşur ve en az 17 doğru yanıt gereklidir. Bu araç, resmi soru havuzunu kullanarak gerçek sınav formatında pratik yapmanızı sağlar. Tüm sorular, eyalet sorularıyla ya da gerçek sınav simülasyonuyla çalışabilirsiniz; anlık geri bildirim ve sonuç özeti ile hangi konuları pekiştirmeniz gerektiğini hızla görebilirsiniz.";

const HERO_STATS = [
  { value: '33', label: 'soru (gerçek deneme)' },
  { value: '17', label: 'doğru ile geçer' },
  { value: '60 dk', label: 'sınav süresi' },
];

export default function VatandaslikTestiPage() {
  return (
    <>
      <ToolHero
        eyebrow="Hazırlık ve Yerleşim"
        title="Almanya Vatandaşlık Testi"
        intro="Almanya vatandaşlık testi için deneme sınavı. 33 soruluk sınav formatıyla pratik yapın ve skorunuzu görün."
        stats={HERO_STATS}
        howItWorksTitle="Nasıl Çalışır?"
        howItWorks={HOW_IT_WORKS}
      />
      <ToolAccessGate
        intro={{
          title: 'Almanya Vatandaşlık Testi',
          description:
            'Gerçek Einbürgerungstest formatında 33 soruluk deneme sınavı: her soruda 4 seçenek ve tek doğru cevap. Süre tut, skorunu gör ve eksik konularını tespit et.',
          highlights: [
            'BAMF soru havuzunu temel alan bağımsız bir pratik ortamı sunar.',
            'Almanya\'nın demokratik düzeni, tarihi, toplumsal yapısı ve eyalet bilgisi sorularını kapsar.',
            'Sınav sonunda doğru sayını ve geçme eşiğine (en az 17 doğru) göre durumunu gösterir.',
          ],
          toolPath: '/vatandaslik-testi',
        }}
      >
        <VatandaslikTestiClient />
      </ToolAccessGate>
      <ToolInfoBand why={WHY_TEXT} />
    </>
  );
}
