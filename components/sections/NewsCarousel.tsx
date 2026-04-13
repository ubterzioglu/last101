'use client';

import { useRef, useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface NewsItem {
  id: string;
  slug?: string;
  href?: string;
  title: string;
  excerpt?: string;
  image: string;
  date: string;
  category?: string;
}

interface NewsCarouselProps {
  items: NewsItem[];
}

export function NewsCarousel({ items }: NewsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    checkScroll();
    el.addEventListener('scroll', checkScroll, { passive: true });
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: 'left' | 'right') => {
    const el = scrollRef.current;
    if (!el) return;
    const scrollAmount = 340;
    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-white/15 bg-white/10 px-6 py-10 text-center text-white">
        <h3 className="text-xl font-bold">Henüz yayında haber bulunmuyor.</h3>
        <p className="mt-3 text-sm leading-7 text-white/75">
          Admin panelinden yayınlanan haberler burada otomatik olarak görünecek.
        </p>
      </div>
    );
  }

  return (
    <div className="relative group/carousel">
      <button
        onClick={() => scroll('left')}
        className={cn(
          "absolute left-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition hover:bg-black/90 hover:scale-110",
          canScrollLeft ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-label="Sola kaydır"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>

      <button
        onClick={() => scroll('right')}
        className={cn(
          "absolute right-2 top-1/2 -translate-y-1/2 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white backdrop-blur-sm transition hover:bg-black/90 hover:scale-110",
          canScrollRight ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        aria-label="Sağa kaydır"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      <div
        ref={scrollRef}
        className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory px-12 py-2"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="flex-shrink-0 w-80 snap-start bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300"
          >
            <div className="h-48 relative overflow-hidden">
              <Image
                src={item.image}
                alt={item.title}
                fill
                unoptimized
                sizes="320px"
                className="object-cover"
              />
              {item.category && (
                <span className="absolute top-3 left-3 px-3 py-1 bg-google-yellow text-gray-900 text-xs font-medium rounded-full">
                  {item.category}
                </span>
              )}
            </div>

            <div className="h-48 p-5 flex flex-col justify-between bg-white">
              <div>
                <span className="text-xs text-gray-500">{item.date}</span>
                <h3 className="text-base font-bold text-gray-900 mt-1 line-clamp-2 leading-tight">
                  {item.title}
                </h3>
                {item.excerpt ? (
                  <p className="text-sm text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                    {item.excerpt}
                  </p>
                ) : null}
              </div>
              <Link
                href={item.href || '/haberler'}
                className="inline-flex items-center text-sm text-google-blue hover:text-blue-700 font-medium transition-colors mt-2"
              >
                Devamını Oku →
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
