import Link from 'next/link';
import { createMetadata } from '@/lib/seo/metadata';
import { HeroSection } from '@/components/sections/HeroSection';
import { Section } from '@/components/ui/Section';

export const metadata = createMetadata({
  title: 'Blog',
  description:
    'almanya101 blog: Almanya’da yaşam, vize, iş, maaş, bankacılık ve daha fazlası üzerine yazılar, haberler ve rehberler tek bir yerde.',
  path: '/blog',
});

interface BlogHubCard {
  href: string;
  title: string;
  description: string;
  icon: string;
  cardClass: string;
  linkClass: string;
}

const BLOG_HUB_CARDS: BlogHubCard[] = [
  {
    href: '/yazi-dizisi',
    title: 'Arkadaşın Köşesi',
    description:
      'Almanya’da yaşayanların kişisel yazıları, deneyimleri ve samimi notları.',
    icon: '✍️',
    cardClass:
      'border-google-yellow/30 bg-google-yellow/5 hover:bg-google-yellow/10 hover:border-google-yellow/50',
    linkClass: 'text-google-yellow',
  },
  {
    href: '/haberler',
    title: 'Haberler',
    description:
      'Almanya’daki Türk topluluğunu ilgilendiren güncel haberler ve gelişmeler.',
    icon: '📰',
    cardClass:
      'border-google-blue/30 bg-google-blue/5 hover:bg-google-blue/10 hover:border-google-blue/50',
    linkClass: 'text-google-blue',
  },
  {
    href: '/rehber',
    title: 'Rehber',
    description:
      'Vize, oturum, iş, sağlık ve günlük hayata dair adım adım rehber içerikleri.',
    icon: '📚',
    cardClass:
      'border-google-green/30 bg-google-green/5 hover:bg-google-green/10 hover:border-google-green/50',
    linkClass: 'text-google-green',
  },
];

export default function BlogPage() {
  return (
    <div className="bg-black min-h-screen text-white">
      <HeroSection
        title="Blog"
        description="Almanya’da yaşam üzerine yazılarımız, haberlerimiz ve rehberlerimiz. İhtiyacınız olan bilgiyi sade ve güvenilir bir şekilde tek bir yerde topladık."
        centered={false}
        className="bg-black border-b border-white/10"
      />

      <Section contained className="py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-6">Ne Okumak İstersin?</h2>
          <p className="text-xl text-white/70 max-w-3xl mx-auto leading-relaxed">
            almanya101 içerikleri farklı köşelerde topluyor. Aşağıdan ilgilendiğin
            alana göz atabilirsin.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {BLOG_HUB_CARDS.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className={`group flex flex-col rounded-2xl border p-8 transition-all duration-300 hover:-translate-y-1 ${card.cardClass}`}
            >
              <div className="text-5xl mb-5">{card.icon}</div>
              <h3 className="text-xl font-bold text-white mb-3">{card.title}</h3>
              <p className="text-white/70 leading-relaxed">{card.description}</p>
              <span className={`mt-6 font-medium group-hover:underline ${card.linkClass}`}>
                Keşfet →
              </span>
            </Link>
          ))}
        </div>
      </Section>

      <Section contained className="py-20 mb-10 border-t border-white/10">
        <div className="text-center py-16 px-6 bg-gradient-to-br from-white/5 to-white/10 border border-white/10 rounded-[2rem] backdrop-blur-sm max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-white mb-6">
            Yazmak İster misin?
          </h2>
          <p className="text-xl text-white/70 max-w-2xl mx-auto mb-10 leading-relaxed font-light">
            Almanya’daki deneyimlerini paylaşmak, yeni gelenlere yol göstermek
            istiyorsan blogumuzda sana da yer var.
          </p>
          <Link
            href="/ekibimize-katil"
            className="inline-flex items-center justify-center px-10 py-4 text-lg font-bold text-black bg-white rounded-full hover:bg-gray-200 hover:scale-105 transition-all duration-300"
          >
            Ekibimize Katıl
          </Link>
        </div>
      </Section>
    </div>
  );
}
