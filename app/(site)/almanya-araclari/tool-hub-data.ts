import {
  Briefcase,
  CalendarDays,
  ClipboardCheck,
  Compass,
  GraduationCap,
  HeartHandshake,
  ListOrdered,
  MapPin,
  Route,
  Sofa,
  Wallet,
  type LucideIcon,
} from 'lucide-react';
import type { ServiceItem } from '@/components/site/ServiceTile';
import type { SiteTone } from '@/components/site/tones';
import { getToolHref } from '@/lib/tools/catalog';
import type { ToolCatalogItem } from '@/lib/tools/types';

export type ToolCategory = ToolCatalogItem['category'];

export const TOOL_CATEGORY_ORDER: readonly ToolCategory[] = [
  'Rota ve Strateji',
  'Kariyer ve Gelir',
  'Hazırlık ve Yerleşim',
  'Yaşam ve Destek',
];

const CATEGORY_META: Record<ToolCategory, { description: string; tone: SiteTone; icon: LucideIcon }> = {
  'Rota ve Strateji': {
    description: 'Önce hangi yoldan ilerlemen gerektiğini ve büyük karar sırasını netleştirir.',
    tone: 'blue',
    icon: Compass,
  },
  'Kariyer ve Gelir': {
    description: 'İş bulma gücü, maaş beklentisi ve kariyer gerçekçiliği üzerine odaklanır.',
    tone: 'green',
    icon: Briefcase,
  },
  'Hazırlık ve Yerleşim': {
    description: 'Başvuru öncesi hazırlığı, ilk gün operasyonlarını ve blokaj sıralamasını düzenler.',
    tone: 'orange',
    icon: ClipboardCheck,
  },
  'Yaşam ve Destek': {
    description: 'Şehir, yaşam ritmi ve destek kanallarıyla ilgili kararları daha görünür hale getirir.',
    tone: 'yellow',
    icon: HeartHandshake,
  },
};

const TOOL_ICONS: Record<string, LucideIcon> = {
  'almanya-yolunu-sec': Route,
  'kariyer-ve-egitim-rotasi': GraduationCap,
  'almanya-maas-beklentisi': Wallet,
  'almanyada-is-bulma-olasiligi': Briefcase,
  'almanyaya-hazir-misin': ClipboardCheck,
  'ilk-90-gun-planlayici': CalendarDays,
  'once-hangi-sorunu-cozmelisin': ListOrdered,
  'hangi-sehir-sana-uygun': MapPin,
  'topluluk-ve-danismanlik': HeartHandshake,
  'almanya-yasam-tarzi-uyumu': Sofa,
};

export interface ToolHubGroup {
  /** Anchor id, e.g. `rota-ve-strateji` (unchanged from the old page). */
  id: string;
  title: ToolCategory;
  description: string;
  tone: SiteTone;
  items: ServiceItem[];
}

/** Turkish-aware anchor slug: "Hazırlık ve Yerleşim" -> "hazirlik-ve-yerlesim". */
export function slugifyCategory(value: string): string {
  return value
    .toLocaleLowerCase('tr')
    .replaceAll(' ', '-')
    .replaceAll('ı', 'i')
    .replaceAll('ğ', 'g')
    .replaceAll('ü', 'u')
    .replaceAll('ş', 's')
    .replaceAll('ö', 'o')
    .replaceAll('ç', 'c');
}

function toServiceItem(tool: ToolCatalogItem): ServiceItem {
  const meta = CATEGORY_META[tool.category];

  return {
    href: getToolHref(tool.slug),
    icon: TOOL_ICONS[tool.slug] ?? meta.icon,
    title: tool.title,
    description: tool.description,
    tone: meta.tone,
  };
}

/** Groups catalog tools by category in display order; empty categories are dropped. */
export function groupToolsByCategory(tools: readonly ToolCatalogItem[]): ToolHubGroup[] {
  return TOOL_CATEGORY_ORDER.map((category) => ({
    id: slugifyCategory(category),
    title: category,
    description: CATEGORY_META[category].description,
    tone: CATEGORY_META[category].tone,
    items: tools.filter((tool) => tool.category === category).map(toServiceItem),
  })).filter((group) => group.items.length > 0);
}
