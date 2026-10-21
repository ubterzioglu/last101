import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ButtonSize, ButtonVariant } from '@/types';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Kept for compatibility: any `href` renders a Next.js `Link`. */
  asChild?: boolean;
  href?: string;
  /** Appends a lucide ArrowUpRight after the label (navigational CTAs). */
  arrow?: boolean;
}

const BASE_CLASSES =
  'inline-flex items-center justify-center gap-2 rounded-btn font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50';

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'min-h-[40px] px-4 py-2 text-sm',
  md: 'min-h-[44px] px-6 py-3.5 text-sm',
  lg: 'min-h-[44px] px-6 py-3.5 text-sm',
  xl: 'min-h-[52px] px-8 py-4 text-base',
};

// Applied after the size so the ghost text link can drop the horizontal padding.
const buttonVariants: Record<ButtonVariant, string> = {
  primary: 'bg-brand-700 text-white hover:bg-brand-800',
  secondary: 'bg-ink text-white hover:bg-ink-soft',
  outline: 'border border-line bg-white text-ink hover:border-ink',
  ghost:
    'gap-1.5 bg-transparent px-0 text-ink underline decoration-ink/30 underline-offset-4 hover:text-brand-700 hover:decoration-brand-700',
  danger: 'bg-alm-red-ink text-white hover:brightness-90',
  success: 'bg-alm-green-ink text-white hover:brightness-90',
};

// Attributes that are safe to move from <button> onto the rendered <a>.
const LINK_SAFE_PROP = /^(aria-|data-)|^(id|title|role|tabIndex|onClick|style|lang|dir)$/;

function pickLinkProps(props: Record<string, unknown>): Record<string, unknown> {
  return Object.fromEntries(Object.entries(props).filter(([key]) => LINK_SAFE_PROP.test(key)));
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      asChild: _asChild,
      href,
      arrow = false,
      children,
      ...props
    },
    ref
  ) => {
    const classes = cn(BASE_CLASSES, buttonSizes[size], buttonVariants[variant], className);
    const content = (
      <>
        {children}
        {arrow && (
          <ArrowUpRight aria-hidden="true" size={variant === 'ghost' ? 14 : 16} className="shrink-0" />
        )}
      </>
    );

    if (href) {
      return (
        <Link href={href} className={classes} {...pickLinkProps(props)}>
          {content}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
