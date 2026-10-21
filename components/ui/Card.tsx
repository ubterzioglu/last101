import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import type { CardVariant } from '@/types';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  noPadding?: boolean;
}

const CARD_BASE = 'rounded-card border border-line bg-white';

const cardVariants: Record<CardVariant, string> = {
  default: '',
  hoverable: 'transition-colors hover:border-ink/30',
  featured: 'shadow-float',
  bordered: '',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', noPadding = false, children, ...props }, ref) => {
    const classes = cn(CARD_BASE, cardVariants[variant], !noPadding && 'p-6', className);

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
