import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
}

const containerSizes: Record<NonNullable<ContainerProps['size']>, string> = {
  sm: 'max-w-4xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
  full: 'max-w-full',
};

export function Container({ className, size = 'xl', children, ...props }: ContainerProps) {
  const classes = cn(
    'container mx-auto px-4 sm:px-6 lg:px-8',
    containerSizes[size],
    className
  );

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
}
