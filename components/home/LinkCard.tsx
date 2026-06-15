import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import type { ToolItem } from '@/constants/home-data';

interface LinkCardProps {
  item: ToolItem;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

const CATEGORY_STYLES = {
  tool: {
    mobileCard: 'border-google-green/30 bg-[linear-gradient(180deg,rgba(52,168,83,0.16),rgba(8,12,10,0.72))]',
    mobileHover: 'hover:border-google-green/60 hover:shadow-[0_24px_60px_rgba(52,168,83,0.3)]',
    band: 'border-google-green/25 bg-gradient-to-r from-google-green/30 via-emerald-400/22 to-google-yellow/22',
    accent: 'bg-google-green',
  },
  career: {
    mobileCard: 'border-google-blue/30 bg-[linear-gradient(180deg,rgba(66,133,244,0.16),rgba(8,10,14,0.72))]',
    mobileHover: 'hover:border-google-blue/60 hover:shadow-[0_24px_60px_rgba(66,133,244,0.3)]',
    band: 'border-google-blue/25 bg-gradient-to-r from-google-blue/30 via-sky-400/22 to-cyan-300/22',
    accent: 'bg-google-blue',
  },
  content: {
    mobileCard: 'border-google-yellow/30 bg-[linear-gradient(180deg,rgba(251,188,5,0.15),rgba(14,11,6,0.72))]',
    mobileHover: 'hover:border-google-yellow/60 hover:shadow-[0_24px_60px_rgba(251,188,5,0.28)]',
    band: 'border-google-yellow/25 bg-gradient-to-r from-google-yellow/32 via-amber-300/26 to-orange-300/18',
    accent: 'bg-google-yellow',
  },
  news: {
    mobileCard: 'border-google-red/30 bg-[linear-gradient(180deg,rgba(234,67,53,0.16),rgba(14,9,8,0.72))]',
    mobileHover: 'hover:border-google-red/60 hover:shadow-[0_24px_60px_rgba(234,67,53,0.3)]',
    band: 'border-google-red/25 bg-gradient-to-r from-google-red/32 via-rose-400/22 to-orange-300/22',
    accent: 'bg-google-red',
  },
  document: {
    mobileCard: 'border-violet-400/30 bg-[linear-gradient(180deg,rgba(167,139,250,0.15),rgba(11,9,14,0.72))]',
    mobileHover: 'hover:border-violet-400/60 hover:shadow-[0_24px_60px_rgba(167,139,250,0.28)]',
    band: 'border-violet-300/25 bg-gradient-to-r from-violet-400/28 via-fuchsia-300/22 to-indigo-300/18',
    accent: 'bg-violet-400',
  },
  team: {
    mobileCard: 'border-pink-400/30 bg-[linear-gradient(180deg,rgba(236,72,153,0.15),rgba(14,9,12,0.72))]',
    mobileHover: 'hover:border-pink-400/60 hover:shadow-[0_24px_60px_rgba(236,72,153,0.28)]',
    band: 'border-pink-300/25 bg-gradient-to-r from-pink-400/28 via-rose-300/22 to-orange-200/18',
    accent: 'bg-pink-400',
  },
  about: {
    mobileCard: 'border-slate-300/25 bg-[linear-gradient(180deg,rgba(148,163,184,0.14),rgba(10,11,13,0.72))]',
    mobileHover: 'hover:border-slate-300/55 hover:shadow-[0_24px_60px_rgba(148,163,184,0.24)]',
    band: 'border-slate-300/25 bg-gradient-to-r from-slate-400/24 via-stone-300/22 to-zinc-300/18',
    accent: 'bg-slate-300',
  },
  community: {
    mobileCard: 'border-orange-400/30 bg-[linear-gradient(180deg,rgba(249,115,22,0.15),rgba(14,10,7,0.72))]',
    mobileHover: 'hover:border-orange-400/60 hover:shadow-[0_24px_60px_rgba(249,115,22,0.28)]',
    band: 'border-orange-300/25 bg-gradient-to-r from-orange-400/28 via-amber-300/22 to-yellow-200/18',
    accent: 'bg-orange-400',
  },
  contact: {
    mobileCard: 'border-cyan-400/30 bg-[linear-gradient(180deg,rgba(34,211,238,0.15),rgba(7,12,14,0.72))]',
    mobileHover: 'hover:border-cyan-400/60 hover:shadow-[0_24px_60px_rgba(34,211,238,0.28)]',
    band: 'border-cyan-300/25 bg-gradient-to-r from-cyan-400/28 via-sky-300/22 to-teal-200/18',
    accent: 'bg-cyan-400',
  },
  software: {
    mobileCard: 'border-indigo-400/30 bg-[linear-gradient(180deg,rgba(99,102,241,0.15),rgba(9,9,14,0.72))]',
    mobileHover: 'hover:border-indigo-400/60 hover:shadow-[0_24px_60px_rgba(99,102,241,0.3)]',
    band: 'border-indigo-300/25 bg-gradient-to-r from-indigo-400/28 via-blue-300/22 to-violet-300/18',
    accent: 'bg-indigo-400',
  },
} as const;

export function LinkCard({
  item,
  className,
  titleClassName,
  descriptionClassName,
}: LinkCardProps) {
  const categoryKey = item.categoryKey ?? (item.kind === 'tool' ? 'tool' : 'content');
  const categoryLabel = item.categoryLabel ?? (item.kind === 'tool' ? 'ARAÇ' : 'İÇERİK');
  const categoryStyle = CATEGORY_STYLES[categoryKey];

  return (
    <a
      href={item.href}
      className={cn(
        'group relative flex h-full w-full flex-col overflow-hidden rounded-[1.35rem] border text-white shadow-[0_18px_48px_rgba(0,0,0,0.45)] backdrop-blur-xl transition-all duration-300',
        'hover:-translate-y-1.5',
        categoryStyle.mobileCard,
        categoryStyle.mobileHover,
        'min-h-[220px] sm:min-h-[240px] md:min-h-[280px]',
        className
      )}
    >
      {/* Top category band */}
      <div
        className={cn(
          'flex min-h-[50px] items-center border-b px-3 py-1 text-center sm:min-h-[58px] sm:px-4 sm:py-1.5',
          categoryStyle.band
        )}
      >
        <div className="flex w-full flex-col items-center justify-center gap-0.5">
          <span className="text-[9px] font-bold uppercase tracking-[0.32em] text-white/80 sm:text-[10px]">
            {categoryLabel}
          </span>
          <span className="block h-px w-14 rounded-full bg-white/25" aria-hidden="true" />
          <span className="text-[11px] font-semibold uppercase tracking-[0.22em] text-white sm:text-xs">
            {item.topLabel}
          </span>
        </div>
      </div>

      {/* Image */}
      <div className="relative min-h-[88px] overflow-hidden border-b border-white/10 md:min-h-[96px]">
        <Image
          src={item.image}
          alt={item.label}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-black/65" />
        {/* Neon accent line under image */}
        <span
          className={cn(
            'absolute inset-x-0 bottom-0 h-[2px] origin-left scale-x-0 opacity-0 transition-all duration-500 group-hover:scale-x-100 group-hover:opacity-100',
            categoryStyle.accent
          )}
          aria-hidden="true"
        />
      </div>

      {/* Text */}
      <div className="flex flex-1 flex-col justify-center gap-2 px-3 py-3 sm:px-4 sm:py-4">
        <h3
          className={cn(
            'text-center font-display text-[0.82rem] font-semibold leading-tight text-white sm:text-sm md:text-base',
            titleClassName
          )}
        >
          {item.label}
        </h3>
        <p
          className={cn(
            'line-clamp-3 text-center text-[11px] leading-[1.45] text-white/70 sm:text-xs md:line-clamp-2 md:text-sm md:leading-relaxed',
            descriptionClassName
          )}
        >
          {item.description}
        </p>
      </div>
    </a>
  );
}
