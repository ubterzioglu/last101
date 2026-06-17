import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { HeroSection } from '@/components/sections/HeroSection';
import { Section } from '@/components/ui/Section';
import type { Feature } from '@/types';

export const metadata = createMetadata({
  title: 'Kariyer',
  description:
    'almanya101 ekibine katıl. İçerik üretimi, yazılım geliştirme, topluluk yönetimi ve sosyal medya alanlarında gönüllü olarak katkı sağla.',
  path: '/kariyer',
});

export default function KariyerPage() {
  const areas: Feature[] = [
    {
      id: '1',
      title: 'İçerik Üretimi',
      description:
        'Almanya’da yaşam, vize, iş ve günlük hayat üzerine yazılar ve rehberler hazırla.',
      icon: '✍️',
    },
    {
      id: '2',
      title: 'Yazılım Geliştirme',
      description:
        'Next.js, TypeScript ve Supabase ile platformun araçlarını geliştirmeye yardım et.',
      icon: '💻',
    },
    {
      id: '3',
      title: 'Topluluk Yönetimi',
      description:
        'WhatsApp, Telegram ve diğer kanallardaki topluluğumuzun büyümesine destek ol.',
      icon: '🤝',
    },
    {
      id: '4',
      title: 'Sosyal Medya',
      description:
        'Instagram ve diğer platformlarda içerik planla, paylaş ve etkileşimi yönet.',
      icon: '📣',
    },
  ];

  return (
    <div className="bg-black min-h-screen text-white">
      <HeroSection
        title="Kariyer"
        description="almanya101 gönüllülerden oluşan bir topluluk projesidir. Aramızda ücretli pozisyon yok; ancak öğrenmek, üretmek ve insanlara faydalı olmak isteyen herkese kapımız açık."
        centered={false}
        className="bg-black border-b border-white/10"
      />

      <Section contained className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-6">Nasıl Katkı Sağlayabilirsin?</h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            Hangi alanda iyiysen ya da neyi öğrenmek istiyorsan, sana uygun bir yer
            mutlaka var. Birlikte büyüyoruz.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {areas.map((area) => (
            <div
              key={area.id}
              className="flex flex-col items-center text-center rounded-2xl bg-white/5 border border-white/10 p-8 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-white/20 hover:-translate-y-1"
            >
              <div className="text-5xl mb-5">{area.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{area.title}</h3>
              <p className="text-white/70 leading-relaxed">{area.description}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section contained className="py-20 mb-10 border-t border-white/10">
        <div className="text-center py-16 px-6 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-[2rem] backdrop-blur-sm max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
            Aramıza Katıl
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Katkı sağlamak istediğin bir alan varsa bize bir mesaj atman yeterli.
            Seninle tanışmayı çok isteriz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/ekibimize-katil"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-black bg-white rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-300"
            >
              Ekibimize Katıl
            </Link>
            <Link
              href="/iletisim"
              className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-white border border-white/30 rounded-full hover:bg-white/10 transition-all duration-300"
            >
              İletişime Geç
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
