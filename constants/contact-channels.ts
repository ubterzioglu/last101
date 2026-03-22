/**
 * Contact channel configuration
 * Centralized contact information for the application
 */

export interface ContactChannel {
  id: string;
  href: string;
  label: string;
  description: string;
  icon: 'whatsapp' | 'telegram' | 'phone' | 'email' | 'instagram' | 'youtube' | 'linkedin' | 'twitter' | 'facebook';
  bgColor: string;
  external?: boolean;
}

export const CONTACT_CHANNELS: ContactChannel[] = [
  {
    id: 'whatsapp',
    href: 'https://chat.whatsapp.com/JXzMvjJoc57EKDDABSB0jo',
    label: 'WhatsApp',
    description: '+90 530 240 4995',
    icon: 'whatsapp',
    bgColor: 'bg-green-500',
    external: true,
  },
  {
    id: 'telegram',
    href: 'https://t.me/+UV4iuTECIIg0OWY0',
    label: 'Telegram',
    description: 'Anlık bildirimler',
    icon: 'telegram',
    bgColor: 'bg-blue-400',
    external: true,
  },
  {
    id: 'phone',
    href: 'tel:+491739569429',
    label: 'Telefon',
    description: '+49 173 956 9429',
    icon: 'phone',
    bgColor: 'bg-indigo-500',
  },
  {
    id: 'email',
    href: 'mailto:info@almanya101.de',
    label: 'E-Posta',
    description: 'info@almanya101.de',
    icon: 'email',
    bgColor: 'bg-red-500',
  },
  {
    id: 'instagram',
    href: 'https://instagram.com/almanya101',
    label: 'Instagram',
    description: '@almanya101',
    icon: 'instagram',
    bgColor: 'bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400',
    external: true,
  },
  {
    id: 'youtube',
    href: 'https://www.youtube.com/@almanya101de',
    label: 'YouTube',
    description: '@almanya101de',
    icon: 'youtube',
    bgColor: 'bg-red-600',
    external: true,
  },
  {
    id: 'linkedin',
    href: 'https://www.linkedin.com/in/ubterzioglu',
    label: 'LinkedIn',
    description: '/in/ubterzioglu',
    icon: 'linkedin',
    bgColor: 'bg-blue-600',
    external: true,
  },
  {
    id: 'twitter',
    href: 'https://x.com/101Almanya46905',
    label: 'Twitter / X',
    description: '@101Almanya46905',
    icon: 'twitter',
    bgColor: 'bg-gray-800',
    external: true,
  },
  {
    id: 'facebook',
    href: 'https://www.facebook.com/almanya101/',
    label: 'Facebook',
    description: '/almanya101',
    icon: 'facebook',
    bgColor: 'bg-blue-700',
    external: true,
  },
];
