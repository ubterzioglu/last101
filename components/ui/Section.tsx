import type { HTMLAttributes } from 'react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils/cn';
import type { SectionTone } from '@/types';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  contained?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Background surface. Omit it to sit transparently on the page background. */
  tone?: SectionTone;
}

const sectionTones: Record<SectionTone, string> = {
  page: 'bg-page',
  band: 'bg-band',
  white: 'bg-white',
  ink: 'bg-ink text-white',
};

/** Corteqs section: 64px vertical rhythm; full-bleed tone with a Container inside. */
export function Section({
  className,
  contained = true,
  size = 'xl',
  tone,
  children,
  ...props
}: SectionProps) {
  return (
    <section className={cn('py-16', tone && sectionTones[tone], className)} {...props}>
      {contained ? <Container size={size}>{children}</Container> : children}
    </section>
  );
}
