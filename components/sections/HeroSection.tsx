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
  backgroundImage?: string;
  overlay?: boolean;
}

export function HeroSection({
  title,
  description,
  primaryAction,
  secondaryAction,
  centered = true,
  backgroundImage,
  overlay = false,
  className,
  ...props
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        'py-32 md:py-48 lg:py-64',
        backgroundImage ? 'relative' : 'bg-gray-50',
        className
      )}
      {...props}
    >
      {backgroundImage && (
        <div
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      )}

      <Container>
        <div className={cn(
          'max-w-3xl relative z-10',
          centered ? 'text-center mx-auto' : '',
          'animate-fade-in-up'
        )}>
          <h1 className={cn(
            'text-4xl md:text-5xl lg:text-6xl font-bold mb-6',
            backgroundImage ? 'text-white' : 'text-gray-900'
          )}>
            {title}
          </h1>
          <p className={cn(
            'text-lg md:text-xl mb-8 leading-relaxed',
            backgroundImage ? 'text-gray-100' : 'text-gray-700'
          )}>
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
