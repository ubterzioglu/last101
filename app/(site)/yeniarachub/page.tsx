import { createMetadata } from '@/lib/seo/metadata';
import { ToolHubView } from '@/app/(site)/almanya-araclari/ToolHubView';

export const metadata = createMetadata({
  title: 'Yeni Araç Hub',
  description:
    'Almanya101 içindeki yeni planlama araçlarını tek sayfada incele, kategori bazında gez ve ilgili araca doğrudan eriş.',
  path: '/yeniarachub',
});

export default function YeniAracHubPage() {
  return (
    <ToolHubView
      eyebrow="Almanya101 Yeni Araç Hub’ı"
      title="Yeni eklenen araçları tek sayfada incele, "
      accent="karşılaştır ve doğrudan aç"
      description="Yol seçimi, iş bulma, maaş beklentisi, şehir uyumu, ilk 90 gün planı ve destek kanalları dahil yeni planlama araçlarını tek merkezde topladık. Her kartta ne işe yaradığını görebilir ve ilgili araca butonla geçebilirsin."
    />
  );
}
