import { ToolAccessGate } from '@/components/tools/ToolIntroPanel';
import VatandaslikTestiClient from './VatandaslikTestiClient';

export default function VatandaslikTestiPage() {
  return (
    <div className="min-h-screen bg-black pt-0 pb-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
    </div>
  );
}
