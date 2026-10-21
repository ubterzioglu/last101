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

/** Light icon tile shared by every variant (44px+, hairline border, ink icon). */
const ICON_TILE_CLASSES = 'flex shrink-0 items-center justify-center rounded-btn border border-line bg-white text-ink';

export function ContactChannelCard({
  channel,
  className,
  compact = false,
  iconOnly = false,
}: ContactChannelCardProps) {
  const IconComponent = ICON_MAP[channel.icon];
  const linkProps = {
    href: channel.href,
    target: channel.external ? '_blank' : undefined,
    rel: channel.external ? 'noopener noreferrer' : undefined,
  };

  if (iconOnly) {
    return (
      <a
        {...linkProps}
        aria-label={channel.label}
        title={channel.label}
        className={cn(ICON_TILE_CLASSES, 'h-12 w-12 transition-colors hover:border-ink/40', className)}
      >
        <IconComponent className="h-5 w-5" />
      </a>
    );
  }

  return (
    <a
      {...linkProps}
      aria-label={channel.label}
      className={cn(
        'group flex rounded-card border border-line bg-white text-ink transition-colors hover:border-ink/40',
        compact ? 'flex-col items-center justify-start gap-3 p-3 text-center' : 'items-center gap-4 p-4 sm:p-5',
        className
      )}
    >
      <span aria-hidden="true" className={cn(ICON_TILE_CLASSES, 'h-11 w-11')}>
        <IconComponent className="h-5 w-5" />
      </span>
      <div className={compact ? 'w-full' : 'min-w-0'}>
        <h3
          className={cn(
            'font-semibold text-ink transition-colors group-hover:text-brand-700',
            compact ? 'text-xs leading-tight' : 'text-sm sm:text-base'
          )}
        >
          {channel.label}
        </h3>
        <p className={cn('text-muted', compact ? 'mt-1 break-words text-[11px] leading-tight' : 'text-xs sm:text-sm')}>
          {channel.description}
        </p>
      </div>
    </a>
  );
}
