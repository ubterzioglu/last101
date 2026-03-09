import { HTMLAttributes } from 'react';
import { Container } from '@/components/ui/Container';
import { cn } from '@/lib/utils/cn';

interface SectionProps extends HTMLAttributes<HTMLElement> {
  contained?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export function Section({ className, contained = true, size = 'xl', children, ...props }: SectionProps) {
  const paddingClass = 'py-12 md:py-16 lg:py-20';

  if (contained) {
    return (
      <section className={cn(paddingClass, className)} {...props}>
        <Container size={size}>{children}</Container>
      </section>
    );
  }

  return (
    <section className={cn(paddingClass, className)} {...props}>
      {children}
    </section>
  );
}
