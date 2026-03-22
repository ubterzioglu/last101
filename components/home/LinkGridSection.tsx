import { cn } from '@/lib/utils/cn';
import { LinkCard } from './LinkCard';
import type { ToolItem } from '@/constants/home-data';

interface LinkGridSectionProps {
  title: string;
  subtitle?: string;
  items: ToolItem[];
  className?: string;
  gridClassName?: string;
}

export function LinkGridSection({
  title,
  subtitle,
  items,
  className,
  gridClassName,
}: LinkGridSectionProps) {
  return (
    <section
      className={cn(
        'min-h-screen flex flex-col items-center justify-center relative bg-cover bg-center py-8',
        className
      )}
      style={{ backgroundImage: 'url(/images/backgrounds/hero.jpg)' }}
    >
      <div className="absolute inset-0 bg-black/60" />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="text-center mb-6">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-2">
            {title}
          </h2>
          {subtitle && <p className="text-sm text-gray-300">{subtitle}</p>}
        </div>
        <div
          className={cn(
            'grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 md:gap-5 max-w-6xl mx-auto',
            gridClassName
          )}
        >
          {items.map((item) => (
            <LinkCard key={item.href} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
