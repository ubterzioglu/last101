import { cn } from '@/lib/utils/cn';
import { LinkCard } from './LinkCard';
import type { ToolItem } from '@/constants/home-data';

interface LinkGridSectionProps {
  title: string;
  subtitle?: string;
  items: ToolItem[];
  className?: string;
  gridClassName?: string;
  cardClassName?: string;
  cardTitleClassName?: string;
  cardDescriptionClassName?: string;
  overlayOpacity?: string | false;
  backgroundImage?: string | false;
  titleMarginSmall?: boolean;
  noCenter?: boolean;
}

export function LinkGridSection({
  title,
  subtitle,
  items,
  className,
  gridClassName,
  cardClassName,
  cardTitleClassName,
  cardDescriptionClassName,
  overlayOpacity = 'bg-black/60',
  backgroundImage = '/images/backgrounds/hero.jpg',
  titleMarginSmall = false,
  noCenter = false,
}: LinkGridSectionProps) {
  return (
    <section
      className={cn(
        'h-[1000px] flex flex-col items-center relative bg-cover bg-center py-8',
        noCenter ? 'justify-start' : 'justify-center',
        className
      )}
      style={backgroundImage !== false ? { backgroundImage: `url(${backgroundImage})` } : undefined}
    >
      {overlayOpacity !== false && <div className={cn('absolute inset-0', overlayOpacity)} />}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {(title || subtitle) && (
          <div className={cn('text-center', titleMarginSmall ? 'mb-2' : 'mb-6')}>
            {title && (
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-1">
                {title}
              </h2>
            )}
            {subtitle && <p className="text-xs text-gray-300">{subtitle}</p>}
          </div>
        )}
        <div
          className={cn(
            'grid auto-rows-fr grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 max-w-6xl mx-auto items-stretch',
            gridClassName
          )}
        >
          {items.map((item) => (
            <LinkCard
              key={item.href}
              item={item}
              className={cardClassName}
              titleClassName={cardTitleClassName}
              descriptionClassName={cardDescriptionClassName}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
