import {
  Beef,
  Brain,
  Calculator,
  Car,
  Coffee,
  Croissant,
  MapPin,
  Scale,
  Scissors,
  Shield,
  ShoppingCart,
  Stethoscope,
  Truck,
  UserPlus,
  UtensilsCrossed,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { toneAt, type SiteTone } from '@/components/site/tones';
import { PROVIDER_CATEGORIES, type ProviderType } from '@/lib/rehber/types';

const CATEGORY_ICONS: Partial<Record<ProviderType, LucideIcon>> = {
  doctor: Stethoscope,
  lawyer: Scale,
  terapist: Brain,
  ebe: UserPlus,
  tamir: Wrench,
  tamirci_otomobil: Wrench,
  tamirci_tesisat: Wrench,
  tamirci_boyaci: Wrench,
  nakliyat: Truck,
  sigorta: Shield,
  vergi_danismani: Calculator,
  berber: Scissors,
  kuafor: Scissors,
  surucu_kursu: Car,
  restaurant: UtensilsCrossed,
  cafe: Coffee,
  market: ShoppingCart,
  kasap: Beef,
  bakery: Croissant,
};

const TAMIRCI_TYPES: readonly ProviderType[] = ['tamirci_otomobil', 'tamirci_tesisat', 'tamirci_boyaci'];

/** Legacy repair subtypes share the `tamir` category. */
export function categoryKeyOf(type: ProviderType): ProviderType {
  return TAMIRCI_TYPES.includes(type) ? 'tamir' : type;
}

export function providerIcon(type: ProviderType): LucideIcon {
  return CATEGORY_ICONS[type] ?? MapPin;
}

/** Category colour from the firmascope rotation, stable per category position. */
export function providerTone(type: ProviderType): SiteTone {
  const index = PROVIDER_CATEGORIES.findIndex((category) => category.id === categoryKeyOf(type));
  return toneAt(Math.max(index, 0));
}

/** Corteqs monogram: first letters of the first two words ("abc multilingua" -> "AM"). */
export function getMonogram(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .map((word) => word.replace(/^[^\p{L}\p{N}]+/u, ''))
    .filter(Boolean);

  if (words.length === 0) {
    return '?';
  }

  const letters = words.length === 1 ? Array.from(words[0]).slice(0, 2) : [words[0][0], words[1][0]];
  return letters.join('').toLocaleUpperCase('tr-TR');
}

export const PAGE_SIZE = 12;

/** How many results to show: the stored count only applies to the filter set it was made for. */
export function visibleResultCount(
  paging: { key: string; count: number },
  filterKey: string,
  total: number
): number {
  const count = paging.key === filterKey ? paging.count : PAGE_SIZE;
  return Math.min(count, total);
}
