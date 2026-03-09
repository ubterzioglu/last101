'use client';

import { Container } from '@/components/ui/Container';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Instagram, 
  Youtube, 
  Linkedin, 
  Twitter, 
  Facebook, 
  Globe 
} from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface ContactChannel {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  href: string;
  color: string;
  hoverColor: string;
}

const contactChannels: ContactChannel[] = [
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    description: '+90 530 240 4995',
    icon: MessageCircle,
    href: 'https://wa.me/905302404995',
    color: 'bg-green-500',
    hoverColor: 'hover:bg-green-600',
  },
  {
    id: 'telegram',
    name: 'Telegram',
    description: 'Anlık bildirimler ve güncellemeler',
    icon: MessageCircle,
    href: 'https://t.me/almanya101',
    color: 'bg-blue-400',
    hoverColor: 'hover:bg-blue-500',
  },
  {
    id: 'phone',
    name: 'Telefon',
    description: '+49 173 956 9429',
    icon: Phone,
    href: 'tel:+491739569429',
    color: 'bg-indigo-500',
    hoverColor: 'hover:bg-indigo-600',
  },
  {
    id: 'email',
    name: 'E-Posta',
    description: 'info@almanya101.de',
    icon: Mail,
    href: 'mailto:info@almanya101.de',
    color: 'bg-red-500',
    hoverColor: 'hover:bg-red-600',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    description: '@almanya101',
    icon: Instagram,
    href: 'https://instagram.com/almanya101',
    color: 'bg-pink-500',
    hoverColor: 'hover:bg-pink-600',
  },
  {
    id: 'youtube',
    name: 'YouTube',
    description: '@almanya101de',
    icon: Youtube,
    href: 'https://www.youtube.com/@almanya101de',
    color: 'bg-red-600',
    hoverColor: 'hover:bg-red-700',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    description: '/in/ubterzioglu',
    icon: Linkedin,
    href: 'https://www.linkedin.com/in/ubterzioglu',
    color: 'bg-blue-600',
    hoverColor: 'hover:bg-blue-700',
  },
  {
    id: 'twitter',
    name: 'Twitter / X',
    description: '@101Almanya46905',
    icon: Twitter,
    href: 'https://x.com/101Almanya46905',
    color: 'bg-sky-500',
    hoverColor: 'hover:bg-sky-600',
  },
  {
    id: 'facebook',
    name: 'Facebook',
    description: '/almanya101',
    icon: Facebook,
    href: 'https://www.facebook.com/almanya101/',
    color: 'bg-blue-700',
    hoverColor: 'hover:bg-blue-800',
  },
];

interface ContactChannelsProps {
  title?: string;
  subtitle?: string;
}

export function ContactChannels({ 
  title = 'Bize Ulaşın',
  subtitle = 'Sorularınız için 9 farklı kanaldan bize ulaşabilirsiniz'
}: ContactChannelsProps) {
  return (
    <section className="py-16 md:py-24 bg-white">
      <Container>
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {contactChannels.map((channel) => {
            const IconComponent = channel.icon;
            return (
              <a
                key={channel.id}
                href={channel.href}
                target={channel.id !== 'phone' && channel.id !== 'email' ? '_blank' : undefined}
                rel={channel.id !== 'phone' && channel.id !== 'email' ? 'noopener noreferrer' : undefined}
                className={cn(
                  'flex items-center gap-4 p-5 rounded-xl transition-all duration-300',
                  'bg-gray-50 hover:shadow-lg hover:-translate-y-1',
                  'border border-gray-100 hover:border-transparent',
                  'group'
                )}
              >
                <div className={cn(
                  'flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-colors',
                  channel.color,
                  channel.hoverColor
                )}>
                  <IconComponent className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-google-yellow transition-colors">
                    {channel.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {channel.description}
                  </p>
                </div>
              </a>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
