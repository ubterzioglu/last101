import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import type { HTMLAttributes, ReactNode } from 'react';
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
  density?: 'default' | 'compact';
  contentClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  children?: ReactNode;
}

export function HeroSection({
  title,
  description,
  primaryAction,
  secondaryAction,
  centered = true,
  backgroundImage,
  overlay = false,
  density = 'default',
  contentClassName,
  titleClassName,
  descriptionClassName,
  children,
  className,
  ...props
}: HeroSectionProps) {
  return (
    <section
      className={cn(
        density === 'compact' ? 'py-16 md:py-20 lg:py-24' : 'py-32 md:py-48 lg:py-64',
        backgroundImage || children ? 'relative overflow-hidden' : 'bg-gray-50',
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
      {overlay && backgroundImage ? (
        <div className="absolute inset-0 bg-black/40" aria-hidden="true" />
      ) : null}
      {children}

      <Container>
        <div
          className={cn(
            'relative z-10 max-w-3xl animate-fade-in-up',
            centered ? 'mx-auto text-center' : '',
            contentClassName
          )}
        >
          <h1
            className={cn(
              'mb-6 text-4xl font-bold md:text-5xl lg:text-6xl',
              backgroundImage ? 'text-white' : 'text-gray-900',
              titleClassName
            )}
          >
            {title}
          </h1>
          <p
            className={cn(
              'mb-8 text-lg leading-relaxed md:text-xl',
              backgroundImage ? 'text-gray-100' : 'text-gray-700',
              descriptionClassName
            )}
          >
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
