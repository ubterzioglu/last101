import Image from 'next/image';
import { ArrowUpRight } from 'lucide-react';
import { ContactChannelCard } from '@/components/home/ContactChannelCard';
import { DarkBand } from '@/components/site/DarkBand';
import { CONTACT_CHANNELS } from '@/constants/contact-channels';

interface HomeCommunityBandProps {
  whatsappHref?: string;
}

// Primary button look as an external <a>: the ui Button renders a Link without target/rel.
const EXTERNAL_PRIMARY_BUTTON_CLASSES =
  'inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-btn bg-brand-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 sm:w-auto';

function ContactCard({ whatsappHref }: HomeCommunityBandProps) {
  return (
    <>
      {whatsappHref ? (
        <a href={whatsappHref} target="_blank" rel="noopener noreferrer" className={EXTERNAL_PRIMARY_BUTTON_CLASSES}>
          WhatsApp Topluluğuna Katıl
          <ArrowUpRight aria-hidden="true" size={16} className="shrink-0" />
        </a>
      ) : null}
      <h2 className="mt-8 text-2xl font-extrabold leading-snug tracking-[-0.03em] text-ink">
        Bize Nasıl Ulaşabilirsiniz?
      </h2>
      <ul className="mt-5 flex flex-wrap gap-2.5">
        {CONTACT_CHANNELS.map((channel) => (
          <li key={channel.id}>
            <ContactChannelCard channel={channel} iconOnly />
          </li>
        ))}
      </ul>
    </>
  );
}

/** The page's dark band: community invitation left, contact card right. */
export function HomeCommunityBand({ whatsappHref }: HomeCommunityBandProps) {
  return (
    <DarkBand
      id="topluluk"
      title="Almanya101 Topluluğuna Nasıl Katılabilirsiniz?"
      description="Almanya'da yaşamı daha hızlı çözmek isteyenler için topluluk; tavsiye, deneyim ve yönlendirme akışını hızlandırır. Güncel duyurular, şehir bazlı öneriler ve yeni gelenlerin en sık yaşadığı sorunlar için ortak hafıza oluşturan bu ağ, özellikle ilk aylarında desteğe ihtiyaç duyan kullanıcılar için doğrudan fayda sağlar."
      aside={<ContactCard whatsappHref={whatsappHref} />}
    >
      {/* White-lettered mascot logo: only used on the ink band. */}
      <Image
        src="/yeniherologo.png"
        alt="almanya101 logosu ve maskotu"
        width={1160}
        height={400}
        sizes="360px"
        className="h-auto w-full max-w-[360px]"
      />
      <h3 className="mt-8 text-[19px] font-extrabold leading-snug tracking-[-0.02em] text-white">
        Almanya&apos;da networking çoğu zaman doğru çevreye görünür olmakla başlar.
      </h3>
      <p className="mt-3 leading-relaxed text-white/80">
        Berlin, Köln ve Münih gibi şehirlerde iş fırsatları, etkinlikler, topluluk buluşmaları ve güncel haber akışı;
        Almanya&apos;da yeni bir çevre kurmak isteyenler için güçlü bir başlangıç zemini oluşturur. Doğru bilgiye ve doğru
        insanlara daha hızlı ulaşmak, yerleşme ve profesyonel ilerleme sürecini belirgin şekilde kolaylaştırır.
      </p>
    </DarkBand>
  );
}
