import Image from 'next/image';
import { cn } from '@/lib/utils/cn';
import type { ToolItem } from '@/constants/home-data';

interface LinkCardProps {
  item: ToolItem;
  className?: string;
}

export function LinkCard({ item, className }: LinkCardProps) {
  return (
    <a
      href={item.href}
      className={cn(
        'group flex flex-col bg-white/95 hover:bg-white rounded-xl overflow-hidden',
        'transition-all duration-300 hover:scale-105 hover:shadow-2xl shadow-lg',
        'min-h-[220px] sm:min-h-[280px]',
        className
      )}
    >
      {/* Image - Top Half */}
      <div className="h-1/2 min-h-[110px] sm:min-h-[140px] relative overflow-hidden">
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

      {/* Content - Bottom Half */}
      <div className="flex-1 p-3 sm:p-4 flex flex-col justify-center">
        <h3 className="text-sm sm:text-base font-bold text-gray-900 text-center mb-1 sm:mb-2 break-words leading-tight">
          {item.label}
        </h3>
        <p className="text-xs sm:text-sm text-gray-600 text-center line-clamp-2 leading-relaxed break-words">
          {item.description}
        </p>
      </div>
    </a>
  );
}
