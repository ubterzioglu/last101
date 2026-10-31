import type { ReactNode } from 'react';
import { cn } from '@/lib/utils/cn';

interface ClassNameProps {
  children?: ReactNode;
  className?: string;
}

export interface AdminTableProps extends ClassNameProps {
  /** Ekran okuyucular icin gorunmez tablo basligi. */
  caption?: string;
}

/** Yatay kayan, cizgili beyaz tablo kabugu. */
export function AdminTable({ children, className, caption }: AdminTableProps) {
  return (
    <div className="overflow-x-auto rounded-card border border-line bg-white">
      <table className={cn('w-full border-collapse text-left', className)}>
        {caption ? <caption className="sr-only">{caption}</caption> : null}
        {children}
      </table>
    </div>
  );
}

export function AdminThead({ children, className }: ClassNameProps) {
  return <thead className={cn('bg-band', className)}>{children}</thead>;
}

export function AdminTh({ children, className }: ClassNameProps) {
  return (
    <th
      scope="col"
      className={cn(
        'px-4 py-3 text-[12px] font-bold uppercase tracking-wide text-muted',
        className
      )}
    >
      {children}
    </th>
  );
}

export function AdminTr({ children, className }: ClassNameProps) {
  return <tr className={cn('border-t border-line hover:bg-page', className)}>{children}</tr>;
}

export interface AdminTdProps extends ClassNameProps {
  colSpan?: number;
}

export function AdminTd({ children, className, colSpan }: AdminTdProps) {
  return (
    <td colSpan={colSpan} className={cn('px-4 py-3 align-top text-sm text-ink', className)}>
      {children}
    </td>
  );
}
