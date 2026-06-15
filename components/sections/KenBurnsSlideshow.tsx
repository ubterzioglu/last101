'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils/cn';

interface KenBurnsSlide {
  src: string;
  alt: string;
}

interface KenBurnsSlideshowProps {
  slides: KenBurnsSlide[];
  /** Her görselin görünür kalma süresi (ms). */
  intervalMs?: number;
  className?: string;
}

const DEFAULT_INTERVAL_MS = 6000;

/**
 * Yerel görseller arasında yavaş zoom (Ken Burns) + crossfade yapan
 * dekoratif arka plan slaytı. Dış CDN / video bağımlılığı yoktur.
 * `prefers-reduced-motion` aktifse zoom devre dışı kalır, sadece geçiş yapılır.
 */
export function KenBurnsSlideshow({
  slides,
  intervalMs = DEFAULT_INTERVAL_MS,
  className,
}: KenBurnsSlideshowProps) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) {
      return;
    }

    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, intervalMs);

    return () => clearInterval(timer);
  }, [slides.length, intervalMs]);

  return (
    <div
      aria-hidden="true"
      className={cn('absolute inset-0 overflow-hidden bg-black', className)}
    >
      {slides.map((slide, index) => {
        const isActive = index === activeIndex;

        return (
          <div
            key={slide.src}
            className={cn(
              'absolute inset-0 transition-opacity duration-1500 ease-soft',
              isActive ? 'opacity-100' : 'opacity-0',
            )}
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              priority={index === 0}
              sizes="100vw"
              className={cn(
                'object-cover',
                isActive ? 'kb-zoom-active' : 'kb-zoom-idle',
              )}
            />
          </div>
        );
      })}
    </div>
  );
}
