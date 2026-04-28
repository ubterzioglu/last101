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

export function LinkCard({
  item,
  className,
  titleClassName,
  descriptionClassName,
  variant = 'default',
}: LinkCardProps) {
  const isDevuserMobile = variant === 'devuserMobile';

  return (
    <a
      href={item.href}
      className={cn(
        'group flex h-full w-full flex-col overflow-hidden transition-all duration-300',
        isDevuserMobile
          ? [
              'rounded-[1.35rem] border border-white/10 bg-white/[0.04] text-white shadow-[0_18px_48px_rgba(0,0,0,0.32)] backdrop-blur-xl',
              'hover:-translate-y-1 hover:border-white/20 hover:shadow-[0_24px_60px_rgba(66,133,244,0.18)]',
              'md:rounded-xl md:border-transparent md:bg-white/95 md:text-gray-900 md:shadow-lg md:backdrop-blur-none md:hover:bg-white md:hover:scale-105 md:hover:shadow-2xl',
              'min-h-[220px] sm:min-h-[240px] md:min-h-[280px]',
            ]
          : [
              'rounded-xl bg-white/95 hover:bg-white shadow-lg hover:scale-105 hover:shadow-2xl',
              'min-h-[220px] sm:min-h-[280px]',
            ],
        className
      )}
    >
      <div
        className={cn(
          'flex min-h-[34px] items-center px-3 py-1 text-center sm:min-h-[40px] sm:px-4 sm:py-1.5',
          isDevuserMobile
            ? 'border-b border-white/10 bg-gradient-to-r from-google-blue/20 via-google-red/15 to-google-yellow/20 md:border-b md:border-black/10 md:bg-google-yellow'
            : 'border-b border-black/10 bg-google-yellow'
        )}
      >
        <span
          className={cn(
            'w-full text-[11px] font-semibold uppercase tracking-[0.22em] sm:text-xs',
            isDevuserMobile ? 'text-white md:text-black' : 'text-black'
          )}
        >
          {item.topLabel}
        </span>
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
