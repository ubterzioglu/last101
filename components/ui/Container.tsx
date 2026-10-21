import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const containerSizes: Record<NonNullable<ContainerProps['size']>, string> = {
  sm: 'max-w-4xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-[1280px]',
  full: 'max-w-full',
};

/** Corteqs container: 1280px wide (xl), 16px / 24px / 36px side gutters. */
export function Container({ className, size = 'xl', children, ...props }: ContainerProps) {
  return (
    <div
      className={cn('mx-auto w-full px-4 sm:px-6 lg:px-9', containerSizes[size], className)}
      {...props}
    >
      {children}
    </div>
  );
}
