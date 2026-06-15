import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import type { ToolItem } from '@/constants/home-data';

interface LinkCardProps {
  item: ToolItem;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  variant?: 'default' | 'devuserMobile';
}

const CATEGORY_STYLES = {
  tool: {
    mobileCard: 'border-google-green/25 bg-[linear-gradient(180deg,rgba(52,168,83,0.22),rgba(255,255,255,0.04))]',
    mobileHover: 'hover:border-google-green/45 hover:shadow-[0_24px_60px_rgba(52,168,83,0.2)]',
    desktopCard: 'md:border-google-green/20 md:bg-[linear-gradient(180deg,rgba(236,253,245,0.96),rgba(255,255,255,0.98))]',
    defaultCard: 'border-google-green/20 bg-green-50',
    band: 'border-google-green/20 bg-gradient-to-r from-google-green/30 via-emerald-400/25 to-google-yellow/25 md:border-google-green/20 md:bg-emerald-300',
  },
  career: {
    mobileCard: 'border-google-blue/25 bg-[linear-gradient(180deg,rgba(66,133,244,0.2),rgba(255,255,255,0.04))]',
    mobileHover: 'hover:border-google-blue/45 hover:shadow-[0_24px_60px_rgba(66,133,244,0.2)]',
    desktopCard: 'md:border-google-blue/20 md:bg-[linear-gradient(180deg,rgba(239,246,255,0.98),rgba(255,255,255,0.98))]',
    defaultCard: 'border-google-blue/20 bg-sky-50',
    band: 'border-google-blue/20 bg-gradient-to-r from-google-blue/30 via-sky-400/25 to-cyan-300/25 md:border-google-blue/20 md:bg-sky-300',
  },
  content: {
    mobileCard: 'border-google-yellow/25 bg-[linear-gradient(180deg,rgba(251,188,5,0.18),rgba(255,255,255,0.04))]',
    mobileHover: 'hover:border-google-yellow/45 hover:shadow-[0_24px_60px_rgba(251,188,5,0.18)]',
    desktopCard: 'md:border-google-yellow/20 md:bg-[linear-gradient(180deg,rgba(255,251,235,0.98),rgba(255,255,255,0.98))]',
    defaultCard: 'border-google-yellow/20 bg-amber-50',
    band: 'border-google-yellow/20 bg-gradient-to-r from-google-yellow/35 via-amber-300/30 to-orange-300/20 md:border-google-yellow/20 md:bg-amber-300',
  },
  news: {
    mobileCard: 'border-google-red/25 bg-[linear-gradient(180deg,rgba(234,67,53,0.2),rgba(255,255,255,0.04))]',
    mobileHover: 'hover:border-google-red/45 hover:shadow-[0_24px_60px_rgba(234,67,53,0.2)]',
    desktopCard: 'md:border-google-red/20 md:bg-[linear-gradient(180deg,rgba(254,242,242,0.98),rgba(255,255,255,0.98))]',
    defaultCard: 'border-google-red/20 bg-rose-50',
    band: 'border-google-red/20 bg-gradient-to-r from-google-red/35 via-rose-400/25 to-orange-300/25 md:border-google-red/20 md:bg-rose-300',
  },
  document: {
    mobileCard: 'border-violet-400/25 bg-[linear-gradient(180deg,rgba(167,139,250,0.18),rgba(255,255,255,0.04))]',
    mobileHover: 'hover:border-violet-400/45 hover:shadow-[0_24px_60px_rgba(167,139,250,0.18)]',
    desktopCard: 'md:border-violet-300/20 md:bg-[linear-gradient(180deg,rgba(245,243,255,0.98),rgba(255,255,255,0.98))]',
    defaultCard: 'border-violet-300/20 bg-violet-50',
    band: 'border-violet-300/20 bg-gradient-to-r from-violet-400/30 via-fuchsia-300/25 to-indigo-300/20 md:border-violet-300/20 md:bg-violet-300',
  },
  team: {
    mobileCard: 'border-pink-400/25 bg-[linear-gradient(180deg,rgba(236,72,153,0.18),rgba(255,255,255,0.04))]',
    mobileHover: 'hover:border-pink-400/45 hover:shadow-[0_24px_60px_rgba(236,72,153,0.18)]',
    desktopCard: 'md:border-pink-300/20 md:bg-[linear-gradient(180deg,rgba(253,242,248,0.98),rgba(255,255,255,0.98))]',
    defaultCard: 'border-pink-300/20 bg-pink-50',
    band: 'border-pink-300/20 bg-gradient-to-r from-pink-400/30 via-rose-300/25 to-orange-200/20 md:border-pink-300/20 md:bg-pink-300',
  },
  about: {
    mobileCard: 'border-slate-300/20 bg-[linear-gradient(180deg,rgba(148,163,184,0.16),rgba(255,255,255,0.04))]',
    mobileHover: 'hover:border-slate-300/40 hover:shadow-[0_24px_60px_rgba(148,163,184,0.16)]',
    desktopCard: 'md:border-slate-300/20 md:bg-[linear-gradient(180deg,rgba(248,250,252,0.98),rgba(255,255,255,0.98))]',
    defaultCard: 'border-slate-300/20 bg-slate-50',
    band: 'border-slate-300/20 bg-gradient-to-r from-slate-400/25 via-stone-300/25 to-zinc-300/20 md:border-slate-300/20 md:bg-slate-300',
  },
  community: {
    mobileCard: 'border-orange-400/25 bg-[linear-gradient(180deg,rgba(249,115,22,0.18),rgba(255,255,255,0.04))]',
    mobileHover: 'hover:border-orange-400/45 hover:shadow-[0_24px_60px_rgba(249,115,22,0.18)]',
    desktopCard: 'md:border-orange-300/20 md:bg-[linear-gradient(180deg,rgba(255,247,237,0.98),rgba(255,255,255,0.98))]',
    defaultCard: 'border-orange-300/20 bg-orange-50',
    band: 'border-orange-300/20 bg-gradient-to-r from-orange-400/30 via-amber-300/25 to-yellow-200/20 md:border-orange-300/20 md:bg-orange-300',
  },
  contact: {
    mobileCard: 'border-cyan-400/25 bg-[linear-gradient(180deg,rgba(34,211,238,0.18),rgba(255,255,255,0.04))]',
    mobileHover: 'hover:border-cyan-400/45 hover:shadow-[0_24px_60px_rgba(34,211,238,0.18)]',
    desktopCard: 'md:border-cyan-300/20 md:bg-[linear-gradient(180deg,rgba(236,254,255,0.98),rgba(255,255,255,0.98))]',
    defaultCard: 'border-cyan-300/20 bg-cyan-50',
    band: 'border-cyan-300/20 bg-gradient-to-r from-cyan-400/30 via-sky-300/25 to-teal-200/20 md:border-cyan-300/20 md:bg-cyan-300',
  },
  software: {
    mobileCard: 'border-indigo-400/25 bg-[linear-gradient(180deg,rgba(99,102,241,0.18),rgba(255,255,255,0.04))]',
    mobileHover: 'hover:border-indigo-400/45 hover:shadow-[0_24px_60px_rgba(99,102,241,0.2)]',
    desktopCard: 'md:border-indigo-300/20 md:bg-[linear-gradient(180deg,rgba(238,242,255,0.98),rgba(255,255,255,0.98))]',
    defaultCard: 'border-indigo-300/20 bg-indigo-50',
    band: 'border-indigo-300/20 bg-gradient-to-r from-indigo-400/30 via-blue-300/25 to-violet-300/20 md:border-indigo-300/20 md:bg-indigo-300',
  },
} as const;

export function LinkCard({
  item,
  className,
  titleClassName,
  descriptionClassName,
  variant = 'default',
}: LinkCardProps) {
  const isDevuserMobile = variant === 'devuserMobile';
  const categoryKey = item.categoryKey ?? (item.kind === 'tool' ? 'tool' : 'content');
  const categoryLabel = item.categoryLabel ?? (item.kind === 'tool' ? 'ARAÇ' : 'İÇERİK');
  const categoryStyle = CATEGORY_STYLES[categoryKey];

  return (
    <a
      href={item.href}
      className={cn(
        'group flex h-full w-full flex-col overflow-hidden transition-all duration-300',
        isDevuserMobile
          ? [
              'rounded-[1.35rem] border text-white shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-xl',
              categoryStyle.mobileCard,
              categoryStyle.mobileHover,
              'md:rounded-xl md:text-gray-900 md:shadow-lg md:backdrop-blur-none md:hover:scale-105 md:hover:shadow-2xl',
              categoryStyle.desktopCard,
              'min-h-[220px] sm:min-h-[240px] md:min-h-[280px]',
            ]
          : [
              'rounded-xl border hover:bg-white shadow-lg hover:scale-105 hover:shadow-2xl',
              categoryStyle.defaultCard,
              'min-h-[220px] sm:min-h-[280px]',
            ],
        className
      )}
    >
      <div
        className={cn(
          'flex items-center px-3 py-1 text-center sm:px-4 sm:py-1.5',
          'min-h-[50px] sm:min-h-[58px]',
          isDevuserMobile
            ? `border-b ${categoryStyle.band}`
            : `border-b ${categoryStyle.band}`
        )}
      >
        <div className="flex w-full flex-col items-center justify-center gap-0.5">
          <span
            className={cn(
              'text-[9px] font-bold uppercase tracking-[0.32em] sm:text-[10px]',
              isDevuserMobile ? 'text-white/80 md:text-black/65' : 'text-black/65'
            )}
          >
            {categoryLabel}
          </span>
          <span
            className={cn(
              'text-[11px] font-semibold uppercase tracking-[0.22em] sm:text-xs',
              isDevuserMobile ? 'text-white md:text-black' : 'text-black'
            )}
          >
            {item.topLabel}
          </span>
        </div>
      </div>

      <div
        className={cn(
          'relative overflow-hidden',
          isDevuserMobile
            ? 'min-h-[88px] border-b border-white/10 md:min-h-[96px] md:border-b-0'
            : 'h-[30%] min-h-[78px] sm:min-h-[96px]'
        )}
      >
        <Image
          src={item.image}
          alt={item.label}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div
          className={cn(
            'absolute inset-0',
            isDevuserMobile
              ? 'bg-gradient-to-b from-black/10 via-transparent to-black/55 md:bg-gradient-to-b md:from-transparent md:to-black/20'
              : 'bg-gradient-to-b from-transparent to-black/20'
          )}
        />
      </div>

      <div
        className={cn(
          'flex flex-1 flex-col justify-center',
          isDevuserMobile ? 'gap-2 px-3 py-3 sm:px-4 sm:py-4' : 'p-3 sm:p-4'
        )}
      >
        <h3
          className={cn(
            isDevuserMobile
              ? 'text-center text-[0.82rem] font-semibold leading-tight text-white sm:text-sm md:mb-2 md:text-base md:font-bold md:text-gray-900'
              : 'mb-1 text-sm font-bold leading-tight text-gray-900 break-words sm:mb-2 sm:text-base text-center',
            titleClassName
          )}
        >
          {item.label}
        </h3>
        <p
          className={cn(
            isDevuserMobile
              ? 'line-clamp-3 text-center text-[11px] leading-[1.45] text-white/68 sm:text-xs md:line-clamp-2 md:text-sm md:leading-relaxed md:text-gray-600'
              : 'line-clamp-2 text-center text-xs leading-relaxed text-gray-600 break-words sm:text-sm',
            descriptionClassName
          )}
        >
          {item.description}
        </p>
      </div>
    </a>
  );
}
