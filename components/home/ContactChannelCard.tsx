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
}

export function ContactChannelCard({ channel, className }: ContactChannelCardProps) {
  const IconComponent = ICON_MAP[channel.icon];

  return (
    <a
      href={channel.href}
      target={channel.external ? '_blank' : undefined}
      rel={channel.external ? 'noopener noreferrer' : undefined}
      className={cn(
        'flex items-center gap-3 sm:gap-4 p-4 sm:p-5 rounded-xl',
        'bg-white/10 hover:bg-white/20 transition-all duration-300',
        'backdrop-blur-sm border border-white/20 group',
        className
      )}
    >
      <div
        className={cn(
          'flex-shrink-0 w-12 sm:w-14 h-12 sm:h-14 rounded-xl',
          'flex items-center justify-center',
          channel.bgColor
        )}
      >
        <IconComponent className="w-6 sm:w-7 h-6 sm:h-7 text-white" />
      </div>
      <div>
        <h3 className="font-semibold text-white text-sm sm:text-base group-hover:text-gray-300 transition-colors">
          {channel.label}
        </h3>
        <p className="text-xs sm:text-sm text-gray-400">{channel.description}</p>
      </div>
    </a>
  );
}
