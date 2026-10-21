import { createMetadata } from '@/lib/seo/metadata';
import { ToolHubView } from './ToolHubView';

export const metadata = createMetadata({
  title: 'Almanya Araçları Hub',
  description:
    'Almanya101 içindeki tüm interaktif araçları tek sayfada incele, kategori bazında gez ve ilgili araca doğrudan eriş.',
  path: '/almanya-araclari',
});

export default function AlmanyaAraclariPage() {
  return (
    <ToolHubView
      eyebrow="Almanya101 Araç Hub’ı"
      title="Tüm araçları tek sayfada incele, "
      accent="karşılaştır ve doğrudan aç"
      description="Yol seçimi, iş bulma, maaş beklentisi, şehir uyumu, ilk 90 gün planı ve destek kanalları dahil tüm araçları tek merkezde topladık. Her kartta ne işe yaradığını görebilir ve ilgili araca butonla geçebilirsin."
    />
  );
}
