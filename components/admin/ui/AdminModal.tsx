'use client';

import { useEffect, useId, useRef } from 'react';
import type { ReactNode } from 'react';
import { useDrawerA11y } from '@/components/layout/useDrawerA11y';

export interface AdminModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  footer?: ReactNode;
}

type PanelProps = Omit<AdminModalProps, 'open'>;

function AdminModalPanel({ onClose, title, children, footer }: PanelProps) {
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLElement | null>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  // Declared before useDrawerA11y so the trigger is captured before focus moves.
  useEffect(() => {
    returnFocusRef.current =
      document.activeElement instanceof HTMLElement ? document.activeElement : null;
  }, []);

  useDrawerA11y({ panelRef, initialFocusRef, returnFocusRef, onClose });

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="flex max-h-[90vh] w-full max-w-lg flex-col rounded-card border border-line bg-white shadow-float"
      >
        <h2 id={titleId} className="px-6 pt-6 text-lg font-extrabold tracking-tight text-ink">
          {title}
        </h2>
        <div className="overflow-y-auto px-6 py-4 text-sm text-ink">{children}</div>
        {footer ? (
          <div className="flex flex-wrap justify-end gap-3 border-t border-line px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Erisilebilir modal: Escape ile kapanir, odak iceride kalir ve kapaninca tetikleyiciye doner. */
export function AdminModal({ open, ...panelProps }: AdminModalProps) {
  if (!open) return null;
  return <AdminModalPanel {...panelProps} />;
}
