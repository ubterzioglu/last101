'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NewsScrollerProps {
  /** `<li>` cards rendered by the server. */
  children: ReactNode;
  /** Accessible name of the list. */
  label: string;
}

const EDGE_TOLERANCE_PX = 10;

const ROUND_BUTTON_CLASSES =
  'flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-ink transition-colors hover:border-ink/40 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line';

/** Horizontal scroll-snap row with round previous/next buttons. */
export function NewsScroller({ children, label }: NewsScrollerProps) {
  const listRef = useRef<HTMLUListElement>(null);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);

  const updateScrollState = useCallback(() => {
    const list = listRef.current;
    if (!list) return;
    setCanScrollPrev(list.scrollLeft > EDGE_TOLERANCE_PX);
    setCanScrollNext(list.scrollLeft < list.scrollWidth - list.clientWidth - EDGE_TOLERANCE_PX);
  }, []);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return undefined;

    updateScrollState();
    list.addEventListener('scroll', updateScrollState, { passive: true });
    window.addEventListener('resize', updateScrollState);
    return () => {
      list.removeEventListener('scroll', updateScrollState);
      window.removeEventListener('resize', updateScrollState);
    };
  }, [updateScrollState]);

  const scrollByPage = (direction: -1 | 1) => {
    const list = listRef.current;
    if (!list) return;
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    list.scrollBy({ left: direction * list.clientWidth, behavior: reduceMotion ? 'auto' : 'smooth' });
  };

  return (
    <div>
      <ul
        ref={listRef}
        aria-label={label}
        className="no-scrollbar flex snap-x snap-mandatory gap-[22px] overflow-x-auto"
      >
        {children}
      </ul>
      <div className="mt-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={() => scrollByPage(-1)}
          disabled={!canScrollPrev}
          aria-label="Önceki haberler"
          className={ROUND_BUTTON_CLASSES}
        >
          <ChevronLeft aria-hidden="true" className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => scrollByPage(1)}
          disabled={!canScrollNext}
          aria-label="Sonraki haberler"
          className={ROUND_BUTTON_CLASSES}
        >
          <ChevronRight aria-hidden="true" className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}
