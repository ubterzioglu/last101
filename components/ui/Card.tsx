import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import type { CardVariant } from '@/types';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: CardVariant;
  noPadding?: boolean;
}

const cardVariants: Record<CardVariant, string> = {
  default: 'bg-white border border-gray-200 shadow-sm',
  hoverable: 'bg-white border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-shadow duration-200',
  featured: 'bg-white border-2 border-google-blue shadow-lg',
  bordered: 'bg-white border-2 border-gray-300 shadow-sm',
};

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant = 'default', noPadding = false, children, ...props }, ref) => {
    const paddingClass = noPadding ? '' : 'p-6';
    const classes = cn(cardVariants[variant], paddingClass, className);

    return (
      <div ref={ref} className={classes} {...props}>
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';
