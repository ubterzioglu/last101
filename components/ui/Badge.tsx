import type { HTMLAttributes } from 'react';
import { TONE_STYLES } from '@/components/site/tones';
import { cn } from '@/lib/utils/cn';
import type { BadgeColor } from '@/types';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  color?: BadgeColor;
  size?: 'sm' | 'md' | 'lg';
}

// Same look as the site Chip: tone tint + AA text, gray is the neutral chip.
const badgeColors: Record<BadgeColor, string> = {
  blue: `${TONE_STYLES.blue.tint} ${TONE_STYLES.blue.text}`,
  red: `${TONE_STYLES.red.tint} ${TONE_STYLES.red.text}`,
  yellow: `${TONE_STYLES.yellow.tint} ${TONE_STYLES.yellow.text}`,
  green: `${TONE_STYLES.green.tint} ${TONE_STYLES.green.text}`,
  gray: 'border border-line bg-white text-ink',
};

const badgeSizes: Record<NonNullable<BadgeProps['size']>, string> = {
  sm: 'px-2.5 py-0.5 text-xs',
  md: 'px-3 py-1 text-xs',
  lg: 'px-3.5 py-1.5 text-sm',
};

export function Badge({ className, color = 'blue', size = 'md', children, ...props }: BadgeProps) {
  const classes = cn(
    'inline-flex items-center rounded-full font-semibold',
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
