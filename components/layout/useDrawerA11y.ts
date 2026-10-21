'use client';

import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';

const FOCUSABLE_SELECTOR = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

/**
 * Where focus should go when Tab (Shift+Tab with `backwards`) is pressed inside
 * a focus trap. Returns null when the browser's own move stays inside the trap.
 */
export function getTrapTarget<T>(
  focusables: readonly T[],
  active: T | null,
  backwards: boolean
): T | null {
  if (focusables.length === 0) return null;

  const first = focusables[0];
  const last = focusables[focusables.length - 1];
  const index = active === null ? -1 : focusables.indexOf(active);

  if (index === -1) return backwards ? last : first;
  if (backwards && index === 0) return last;
  if (!backwards && index === focusables.length - 1) return first;
  return null;
}

/** Focusable descendants that are actually rendered (collapsed panels are skipped). */
function renderedFocusables(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)).filter(
    (element) => element.getClientRects().length > 0
  );
}

interface DrawerA11yOptions {
  panelRef: RefObject<HTMLElement | null>;
  initialFocusRef: RefObject<HTMLElement | null>;
  returnFocusRef: RefObject<HTMLElement | null>;
  onClose: () => void;
}

/**
 * Modal behaviour for a drawer while it is mounted: focus moves into the panel,
 * Escape closes it, Tab stays inside, the page behind does not scroll, and focus
 * returns to the trigger when the drawer unmounts.
 */
export function useDrawerA11y({
  panelRef,
  initialFocusRef,
  returnFocusRef,
  onClose,
}: DrawerA11yOptions): void {
  const onCloseRef = useRef(onClose);

  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    const panel = panelRef.current;
    const returnTarget = returnFocusRef.current;
    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarWidth = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) body.style.paddingRight = `${scrollbarWidth}px`;
    (initialFocusRef.current ?? panel)?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab' || !panel) return;

      const focusables = renderedFocusables(panel);
      const active = document.activeElement instanceof HTMLElement ? document.activeElement : null;
      const target = getTrapTarget(focusables, active, event.shiftKey);

      if (target || focusables.length === 0) event.preventDefault();
      target?.focus();
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPaddingRight;
      returnTarget?.focus();
    };
  }, [panelRef, initialFocusRef, returnFocusRef]);
}
