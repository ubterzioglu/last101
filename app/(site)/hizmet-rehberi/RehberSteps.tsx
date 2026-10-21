import { DarkBand } from '@/components/site/DarkBand';
import { StepList } from '@/components/site/StepList';

const STEPS = [
  {
    title: 'Listeyi daralt',
    description: 'Kategori, şehir ve uzmanlık seçerek sana uygun kayıtları öne çıkar.',
  },
  {
    title: 'Doğrudan ulaş',
    description: 'Kayıttaki telefon, e-posta veya web sitesi üzerinden hizmet verenle iletişime geç.',
  },
  {
    title: 'Kapsamı netleştir',
    description: 'Hizmet dilini, ücreti ve koşulları görüşmeden önce hizmet verenle teyit et.',
  },
];

/** The page's one dark band: three numbered steps (Corteqs listing). */
export function RehberSteps() {
  return (
    <DarkBand id="rehber-nasil" eyebrow="Ne olacağını bilerek ilerle" title="Bul. Ulaş. Karar ver.">
      <StepList steps={STEPS} tone="light" layout="columns" />
    </DarkBand>
  );
}
