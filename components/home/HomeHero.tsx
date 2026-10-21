import { Calculator, MapPin, MessageCircle } from 'lucide-react';
import { ArrowLink } from '@/components/site/ArrowLink';
import { HeadingAccent } from '@/components/site/HeadingAccent';
import { PhotoCard } from '@/components/site/PhotoCard';
import { ShortcutTile } from '@/components/site/ShortcutTile';
import { SplitHero } from '@/components/site/SplitHero';
import { Button } from '@/components/ui/Button';

interface HomeHeroProps {
  /** WhatsApp community invite; the WhatsApp shortcut is left out without it. */
  whatsappHref?: string;
}

const HERO_DESCRIPTION =
  'Almanya101, bu ülkeye taşınmayı planlayan veya burada yaşayan Türkler için hazırlanmış kapsamlı bir Türkçe rehber platformudur. Günlük yaşam, resmi işlemler, iş bulma süreci, belgeler ve topluluk bağlantıları gibi konularda adım adım yönlendirme sunar. Banka, sigorta, maaş hesaplama, vize ve para transferi gibi pratik kararlar için araçlar; belgeler, yazı dizileri ve topluluk kanallarıyla ise bir sonraki adımınızı netleştirmenizi sağlar.';

/** Home hero. The `home-hero` class is the Speakable JSON-LD target (`.home-hero p`). */
export function HomeHero({ whatsappHref }: HomeHeroProps) {
  return (
    <SplitHero
      decorated
      className="home-hero"
      eyebrow="Yaşam rehberi, iş fırsatları ve güçlü topluluk bağlantıları"
      title={
        <>
          <span className="block">Almanya&apos;da</span>{' '}
          <span className="block">
            <HeadingAccent>Yaşam ve İş</HeadingAccent> İçin
          </span>{' '}
          <span className="block">Türkçe Rehber</span>
        </>
      }
      description={HERO_DESCRIPTION}
      actions={
        <>
          <Button href="/is-ilanlari" arrow>
            İşe Alım Firmaları
          </Button>
          <ArrowLink href="/haberler">Güncel Haberleri Oku</ArrowLink>
        </>
      }
      media={
        <PhotoCard
          src="/images/site/berlin-brandenburger-tor.webp"
          alt="Berlin'de Brandenburg Kapısı ve önündeki meydanda yürüyen insanlar"
          priority
          chip={{ label: 'Berlin', icon: MapPin }}
          footer={
            <>
              <span>Yalnız değilsin! almanya101 seninle.</span>
              <ArrowLink href="/topluluk">Topluluğa katıl</ArrowLink>
            </>
          }
        />
      }
      aside={
        <div className="grid grid-cols-2 gap-3">
          <ShortcutTile href="/maas-hesaplama" icon={Calculator} label="Brütten nete maaş hesapla" tone="brand" />
          {whatsappHref ? (
            <ShortcutTile
              href={whatsappHref}
              icon={MessageCircle}
              label="WhatsApp topluluğuna katıl"
              tone="band"
              external
            />
          ) : null}
        </div>
      }
    />
  );
}
