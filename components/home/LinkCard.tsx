import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import type { ToolItem } from '@/constants/home-data';

interface LinkCardProps {
  item: ToolItem;
  className?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function LinkCard({
  item,
  className,
  titleClassName,
  descriptionClassName,
}: LinkCardProps) {
  return (
    <a
      href={item.href}
      className={cn(
        'group flex h-full w-full flex-col bg-white/95 hover:bg-white rounded-xl overflow-hidden',
        'transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg',
        'min-h-[220px] sm:min-h-[280px]',
        className
      )}
    >
      <div className="flex min-h-[34px] items-center border-b border-black/5 bg-slate-950 px-3 py-1 text-center sm:min-h-[40px] sm:px-4 sm:py-1.5">
        <span className="w-full text-[11px] font-semibold uppercase tracking-[0.22em] text-google-yellow sm:text-xs">
          {item.topLabel}
        </span>
      </div>

      {/* Image */}
      <div className="h-[30%] min-h-[78px] sm:min-h-[96px] relative overflow-hidden">
        <Image
          src={item.image}
          alt={item.label}
          fill
          unoptimized
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
      </div>

      {/* Content */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center">
        <h3
          className={cn(
            'text-sm sm:text-base font-bold text-gray-900 text-center mb-1 sm:mb-2 break-words leading-tight',
            titleClassName
          )}
        >
          {item.label}
        </h3>
        <p
          className={cn(
            'text-xs sm:text-sm text-gray-600 text-center line-clamp-2 leading-relaxed break-words',
            descriptionClassName
          )}
        >
          {item.description}
        </p>
      </div>
    </a>
  );
}
