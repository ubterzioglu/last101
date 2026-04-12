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
            ? 'h-11 w-11 sm:h-12 sm:w-12 items-center justify-center rounded-lg border border-google-yellow/45 bg-black/55 p-0 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-google-yellow/70 shadow-[0_0_0_1px_rgba(251,188,5,0.24),0_8px_20px_rgba(251,188,5,0.22),0_0_16px_rgba(251,188,5,0.28)] hover:shadow-[0_0_0_1px_rgba(251,188,5,0.35),0_10px_24px_rgba(251,188,5,0.32),0_0_22px_rgba(251,188,5,0.42)]'
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
            iconOnly ? 'text-google-yellow' : 'text-white',
            iconOnly
              ? 'h-5 w-5 sm:h-6 sm:w-6 drop-shadow-[0_0_8px_rgba(251,188,5,0.92)]'
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
