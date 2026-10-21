import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import type { AnchorHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

export type ArrowLinkTone = 'ink' | 'brand' | 'light';

export interface ArrowLinkProps
  extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href' | 'children'> {
  href: string;
  children: ReactNode;
  /** Opens in a new tab. Defaults to true for absolute http(s) URLs. */
  external?: boolean;
  /** `ink` on light surfaces, `brand` for inline brand links, `light` on the dark band. */
  tone?: ArrowLinkTone;
}

const TONE_CLASSES: Record<ArrowLinkTone, string> = {
  ink: 'text-ink decoration-ink/30 hover:text-brand-700 hover:decoration-brand-700',
  brand: 'text-brand-700 decoration-brand-700/30 hover:text-brand-800 hover:decoration-brand-800',
  light: 'text-white decoration-white/40 hover:decoration-white',
};

const ABSOLUTE_URL = /^(https?:)?\/\//i;

/** Corteqs `.text-link`: underlined label with a trailing arrow and a 44px tap target. */
export function ArrowLink({ href, children, external, tone = 'ink', className, ...rest }: ArrowLinkProps) {
  const classes = cn(
    'inline-flex min-h-[44px] items-center gap-1 text-sm font-semibold underline underline-offset-4 transition-colors motion-reduce:transition-none',
    TONE_CLASSES[tone],
    className
  );
  const content = (
    <>
      {children}
      <ArrowUpRight aria-hidden="true" size={14} className="shrink-0" />
    </>
  );

  if (external ?? ABSOLUTE_URL.test(href)) {
    return (
      <a {...rest} href={href} target="_blank" rel="noopener noreferrer" className={classes}>
        {content}
      </a>
    );
  }

  return (
    <Link {...rest} href={href} className={classes}>
      {content}
    </Link>
  );
}
