import { Briefcase, ClipboardCheck, Compass, HeartHandshake, type LucideIcon } from 'lucide-react';
import type { SiteTone } from '@/components/site/tones';
import { getToolCatalogItem, getToolHref } from '@/lib/tools/catalog';
import type { ToolCatalogItem } from '@/lib/tools/types';

export interface RelatedToolItem {
  href: string;
  icon: LucideIcon;
  title: string;
  description?: string;
  tone?: SiteTone;
}

const CATEGORY_STYLE: Record<ToolCatalogItem['category'], { icon: LucideIcon; tone: SiteTone }> = {
  'Rota ve Strateji': { icon: Compass, tone: 'blue' },
  'Kariyer ve Gelir': { icon: Briefcase, tone: 'green' },
  'Hazırlık ve Yerleşim': { icon: ClipboardCheck, tone: 'orange' },
  'Yaşam ve Destek': { icon: HeartHandshake, tone: 'yellow' },
};

/** Maps tool slugs to ServiceGrid-compatible items, skipping unknown slugs. */
export function getRelatedToolItems(slugs: readonly string[] | undefined): RelatedToolItem[] {
  return (slugs ?? []).flatMap((slug) => {
    const item = getToolCatalogItem(slug);
    if (!item) {
      return [];
    }

    const style = CATEGORY_STYLE[item.category];
    return [
      {
        href: getToolHref(slug),
        icon: style.icon,
        title: item.title,
        description: item.description,
        tone: style.tone,
      },
    ];
  });
}

/** Rough completion time: about 15 seconds per question, at least one minute. */
export function estimateMinutes(questionCount: number): number {
  return Math.max(1, Math.ceil(questionCount / 4));
}
