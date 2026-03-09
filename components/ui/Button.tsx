import Link from 'next/link';
import { ButtonHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils/cn';
import type { ButtonVariant, ButtonSize } from '@/types';
import { COLORS } from '@/constants/colors';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  href?: string;
}

const buttonVariants: Record<ButtonVariant, string> = {
  primary: `bg-google-blue text-white hover:bg-blue-600 focus:ring-google-blue`,
  secondary: `bg-white text-google-blue border-2 border-google-blue hover:bg-gray-50 focus:ring-google-blue`,
  danger: `bg-google-red text-white hover:bg-red-600 focus:ring-google-red`,
  success: `bg-google-green text-white hover:bg-green-600 focus:ring-google-green`,
  outline: `bg-transparent border-2 border-gray-300 text-gray-700 hover:border-gray-400 focus:ring-gray-400`,
  ghost: `bg-transparent text-gray-700 hover:bg-gray-100 focus:ring-gray-400`,
};

const buttonSizes: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
  xl: 'px-8 py-4 text-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      asChild = false,
      href,
      children,
      ...props
    },
    ref
  ) => {
    const baseClasses =
      'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';

    const classes = cn(
      baseClasses,
      buttonVariants[variant],
      buttonSizes[size],
      className
    );

    if (asChild && href) {
      return (
        <Link href={href} className={classes}>
          {children}
        </Link>
      );
    }

    return (
      <button ref={ref} className={classes} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
