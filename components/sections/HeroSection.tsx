import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface HeroSectionProps extends HTMLAttributes<HTMLElement> {
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  centered?: boolean;
}

export function HeroSection({
  title,
  description,
  primaryAction,
  secondaryAction,
  centered = true,
  className,
  ...props
}: HeroSectionProps) {
  return (
    <section className={cn('bg-gray-50 py-16 md:py-24 lg:py-32', className)} {...props}>
      <Container>
        <div className={cn('max-w-3xl', centered ? 'text-center mx-auto' : '')}>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
            {title}
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            {description}
          </p>
          {(primaryAction || secondaryAction) && (
            <div className={cn('flex flex-col sm:flex-row gap-4', centered ? 'justify-center' : 'justify-start')}>
              {primaryAction && (
                <Button variant="primary" size="lg" asChild href={primaryAction.href}>
                  {primaryAction.label}
                </Button>
              )}
              {secondaryAction && (
                <Button variant="secondary" size="lg" asChild href={secondaryAction.href}>
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
