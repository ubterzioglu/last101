import { createMetadata } from '@/lib/seo/metadata';
import { PageHead } from '@/components/site/PageHead';
import { SectionHeader } from '@/components/site/SectionHeader';
import { StepList } from '@/components/site/StepList';
import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import HizmetOnerClient from './HizmetOnerClient';

export const metadata = createMetadata({
  title: 'Hizmet Öner',
  description:
    "Almanya'da bildiğiniz Türkçe hizmet veren uzmanları önerin. Admin onayından sonra rehbere eklensin.",
  path: '/hizmet-rehberi/oneri',
});

const STEPS = [
  {
    title: 'Hızlı gönderim',
    description: 'Ad, şehir ve tür yeterli. Elinizde fazlası varsa adres, telefon ve link de ekleyin.',
  },
  {
    title: 'Admin onayı',
    description: 'Öneriler önce kontrol edilir, sonra rehbere aktif kayıt olarak eklenir.',
  },
  {
    title: 'Düşük sürtünme',
    description: 'Uzun form yok. Eksik bilgiler sonradan admin tarafında tamamlanabilir.',
  },
];

const NOTES = [
  {
    title: 'Hangi bilgiler faydalı?',
    text: 'İsim, şehir, telefon, website, uzmanlık ve varsa Google Maps linki onay sürecini hızlandırır.',
  },
  {
    title: 'Eksik bilgi sorun değil',
    text: 'Elinizde sadece isim ve şehir varsa da gönderebilirsiniz. Kalan detaylar daha sonra tamamlanabilir.',
  },
];

export default function HizmetOnerPage() {
  return (
    <>
      <PageHead
        breadcrumb={[
          { label: 'Ana Sayfa', href: '/' },
          { label: 'Hizmet Rehberi', href: '/hizmet-rehberi' },
          { label: 'Hizmet Öner' },
        ]}
        eyebrow="Tüm Türkler / Türk Öner"
        title="Eksik bir hizmet varsa bize bırak, "
        accent="birlikte listeyi büyütelim."
        description="Bildiğiniz Türkçe hizmet veren bir uzmanı kısa bilgilerle önerin. Ekibimiz kontrol edip uygun kaydı listeye eklesin."
        actions={
          <>
            <Button href="/hizmet-rehberi" arrow>
              Türk Bul
            </Button>
            <Button href="#oner-formu" variant="ghost">
              Forma git
            </Button>
          </>
        }
      />

      <section className="py-16">
        <Container className="grid gap-12 lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] lg:items-start lg:gap-[38px]">
          <div className="min-w-0">
            <SectionHeader
              title="Nasıl işliyor?"
              description="Form gönderilir, admin öneriyi inceler, gerekli görürse kaydı listeye aktif olarak ekler."
              titleClassName="text-[28px]"
            />
            <StepList steps={STEPS} className="mt-8" />
            <dl className="mt-10 divide-y divide-line border-y border-line">
              {NOTES.map((note) => (
                <div key={note.title} className="py-5">
                  <dt className="text-[15px] font-bold leading-snug text-ink">{note.title}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-muted">{note.text}</dd>
                </div>
              ))}
            </dl>
          </div>

          <HizmetOnerClient />
        </Container>
      </section>
    </>
  );
}
