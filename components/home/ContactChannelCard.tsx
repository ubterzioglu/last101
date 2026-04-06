import { cn } from '@/lib/utils/cn';
import type { ContactChannel } from '@/constants/contact-channels';
import {
  WhatsAppIcon,
  TelegramIcon,
  PhoneIcon,
  EmailIcon,
  InstagramIcon,
  YouTubeIcon,
  LinkedInIcon,
  TwitterXIcon,
  FacebookIcon,
} from '@/components/icons/ContactIcons';

const ICON_MAP = {
  whatsapp: WhatsAppIcon,
  telegram: TelegramIcon,
  phone: PhoneIcon,
  email: EmailIcon,
  instagram: InstagramIcon,
  youtube: YouTubeIcon,
  linkedin: LinkedInIcon,
  twitter: TwitterXIcon,
  facebook: FacebookIcon,
} as const;

const ICON_ONLY_ACCENT_MAP = {
  whatsapp: 'text-green-400 shadow-[0_16px_40px_rgba(34,197,94,0.28)] hover:shadow-[0_20px_48px_rgba(34,197,94,0.38)]',
  telegram: 'text-sky-300 shadow-[0_16px_40px_rgba(56,189,248,0.28)] hover:shadow-[0_20px_48px_rgba(56,189,248,0.38)]',
  phone: 'text-indigo-300 shadow-[0_16px_40px_rgba(99,102,241,0.28)] hover:shadow-[0_20px_48px_rgba(99,102,241,0.38)]',
  email: 'text-rose-300 shadow-[0_16px_40px_rgba(244,63,94,0.28)] hover:shadow-[0_20px_48px_rgba(244,63,94,0.38)]',
  instagram: 'text-pink-300 shadow-[0_16px_40px_rgba(236,72,153,0.28)] hover:shadow-[0_20px_48px_rgba(236,72,153,0.38)]',
  youtube: 'text-red-300 shadow-[0_16px_40px_rgba(239,68,68,0.28)] hover:shadow-[0_20px_48px_rgba(239,68,68,0.38)]',
  linkedin: 'text-blue-300 shadow-[0_16px_40px_rgba(59,130,246,0.28)] hover:shadow-[0_20px_48px_rgba(59,130,246,0.38)]',
  twitter: 'text-slate-200 shadow-[0_16px_40px_rgba(148,163,184,0.22)] hover:shadow-[0_20px_48px_rgba(148,163,184,0.32)]',
  facebook: 'text-blue-200 shadow-[0_16px_40px_rgba(96,165,250,0.28)] hover:shadow-[0_20px_48px_rgba(96,165,250,0.38)]',
} as const;

interface ContactChannelCardProps {
  channel: ContactChannel;
  className?: string;
  compact?: boolean;
  iconOnly?: boolean;
}

export function ContactChannelCard({
  channel,
  className,
  compact = false,
  iconOnly = false,
}: ContactChannelCardProps) {
  const IconComponent = ICON_MAP[channel.icon];

  return (
    <a
      href={channel.href}
      target={channel.external ? '_blank' : undefined}
      rel={channel.external ? 'noopener noreferrer' : undefined}
      aria-label={channel.label}
      className={cn(
        'flex rounded-xl',
          iconOnly
            ? 'h-[52px] w-[52px] sm:h-[84px] sm:w-[84px] items-center justify-center rounded-full border-white/12 bg-white/6 p-0 backdrop-blur-md transition-all duration-300 hover:-translate-y-1'
          : compact
            ? 'flex-col items-center justify-start gap-3 p-3 text-center'
            : 'items-center gap-3 sm:gap-4 p-4 sm:p-5',
        !iconOnly && 'bg-white/10 hover:bg-white/20 transition-all duration-300',
        !iconOnly && 'backdrop-blur-sm border border-white/20',
        'group',
        className
      )}
    >
      <div
        className={cn(
          iconOnly
            ? 'flex-shrink-0'
            : compact
              ? 'flex-shrink-0 w-11 h-11 rounded-lg'
              : 'flex-shrink-0 w-12 sm:w-14 h-12 sm:h-14 rounded-xl',
          !iconOnly && 'flex items-center justify-center',
          !iconOnly && channel.bgColor
        )}
      >
        <IconComponent
          className={cn(
            iconOnly ? ICON_ONLY_ACCENT_MAP[channel.icon] : 'text-white',
            iconOnly
              ? 'h-[40px] w-[40px] sm:h-[72px] sm:w-[72px] drop-shadow-[0_10px_24px_rgba(255,255,255,0.15)]'
              : compact
                ? 'w-5 h-5'
                : 'w-6 sm:w-7 h-6 sm:h-7'
          )}
        />
      </div>
      {!iconOnly && (
        <div className={compact ? 'w-full' : undefined}>
          <h3
            className={cn(
              'font-semibold text-white group-hover:text-gray-300 transition-colors',
              compact ? 'text-xs leading-tight' : 'text-sm sm:text-base'
            )}
          >
            {channel.label}
          </h3>
          <p
            className={cn(
              'text-gray-400',
              compact ? 'mt-1 text-[11px] leading-tight break-words' : 'text-xs sm:text-sm'
            )}
          >
            {channel.description}
          </p>
        </div>
      )}
    </a>
  );
}
