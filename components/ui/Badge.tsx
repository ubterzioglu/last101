import { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import type { BadgeColor } from '@/types';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  size?: 'sm' | 'md' | 'lg';
}

const badgeColors: Record<BadgeColor, string> = {
  blue: 'bg-blue-100 text-blue-800',
  red: 'bg-red-100 text-red-800',
  yellow: 'bg-yellow-100 text-yellow-800',
  green: 'bg-green-100 text-green-800',
  gray: 'bg-gray-100 text-gray-800',
};

const badgeSizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-sm',
  lg: 'px-3 py-1.5 text-base',
};

export function Badge({ className, color = 'blue', size = 'md', children, ...props }: BadgeProps) {
  const classes = cn(
    'inline-flex items-center font-medium rounded-full',
    badgeColors[color],
    badgeSizes[size],
    className
  );

  return (
    <span className={classes} {...props}>
      {children}
    </span>
  );
}
