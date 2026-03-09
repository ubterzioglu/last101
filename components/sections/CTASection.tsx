import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';

interface CTASectionProps extends HTMLAttributes<HTMLElement> {
  title: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  centered?: boolean;
  variant?: 'default' | 'blue' | 'gray' | 'yellow';
}

const variantStyles = {
  default: 'bg-white border border-gray-200',
  blue: 'bg-google-blue text-white',
  gray: 'bg-gray-50',
  yellow: 'bg-google-yellow text-gray-900',
};

export function CTASection({
  title,
  description,
  primaryAction,
  secondaryAction,
  centered = true,
  variant = 'default',
  className,
  ...props
}: CTASectionProps) {
  const isBlue = variant === 'blue';
  const isYellow = variant === 'yellow';
  const textColor = isBlue ? 'text-white' : isYellow ? 'text-gray-900' : 'text-gray-900';
  const descriptionColor = isBlue ? 'text-blue-100' : isYellow ? 'text-gray-700' : 'text-gray-600';

  return (
    <section className={cn('py-16 md:py-20', variantStyles[variant], className)} {...props}>
      <Container>
        <div className={cn('max-w-3xl', centered ? 'text-center mx-auto' : '')}>
          <h2 className={cn('text-3xl md:text-4xl font-bold mb-4', textColor)}>{title}</h2>
          <p className={cn('text-lg mb-8', descriptionColor)}>{description}</p>
          <div className={cn('flex flex-col sm:flex-row gap-4', centered ? 'justify-center' : 'justify-start')}>
            <Button
              variant={isBlue ? 'secondary' : 'primary'}
              size="lg"
              asChild
              href={primaryAction.href}
            >
              {primaryAction.label}
            </Button>
            {secondaryAction && (
              <Button
                variant={isBlue ? 'ghost' : 'outline'}
                size="lg"
                asChild
                href={secondaryAction.href}
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        </div>
      </Container>
    </section>
  );
}
