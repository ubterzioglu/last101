'use client';

import { Button } from '@/components/ui/Button';
import { Container } from '@/components/ui/Container';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils/cn';
import { useEffect, useRef } from 'react';

interface HeroSectionProps extends HTMLAttributes<HTMLElement> {
  title: string;
  description: string;
  primaryAction?: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  centered?: boolean;
  backgroundImage?: string;
  overlay?: boolean;
}

export function HeroSection({
  title,
  description,
  primaryAction,
  secondaryAction,
  centered = true,
  backgroundImage,
  overlay = false,
  className,
  ...props
}: HeroSectionProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !backgroundImage) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    // Particles
    const particles: Array<{x: number; y: number; size: number; speed: number; opacity: number; type: 'star' | 'rain' | 'particle'}> = [];
    const numParticles = 150;

    // Initialize particles
    for (let i = 0; i < numParticles; i++) {
      const type = Math.random() < 0.4 ? 'star' : Math.random() < 0.7 ? 'rain' : 'particle';
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: type === 'star' ? Math.random() * 2 + 1 : Math.random() * 3 + 1,
        speed: type === 'rain' ? Math.random() * 3 + 2 : Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.3,
        type,
      });
    }

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Draw background image
      const img = new Image();
      img.src = backgroundImage;
      if (img.complete) {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      }

      // Draw particles
      particles.forEach((p, index) => {
        ctx.beginPath();

        if (p.type === 'star') {
          // Yıldız - yavaşça süzül
          p.y -= p.speed * 0.3;
          p.opacity = 0.3 + Math.sin(Date.now() * 0.001 + index) * 0.2;

          const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size);
          gradient.addColorStop(0, `rgba(255, 255, 255, ${p.opacity})`);
          gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

          ctx.fillStyle = gradient;
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();

          // Reset position
          if (p.y < 0) {
            p.y = canvas.height;
            p.x = Math.random() * canvas.width;
          }

        } else if (p.type === 'rain') {
          // Yağmur damlaları - topdan düşen
          p.y += p.speed;

          ctx.fillStyle = `rgba(200, 220, 255, ${p.opacity * 0.5})`;
          ctx.fillRect(p.x, p.y, 1, p.size * 3);

          // Reset position
          if (p.y > canvas.height) {
            p.y = -10;
            p.x = Math.random() * canvas.width;
          }

        } else {
          // Parçacıklar - hızlı süzülen
          p.y -= p.speed;
          p.x += Math.sin(Date.now() * 0.001 + index) * 0.5;

          ctx.fillStyle = `rgba(255, 255, 220, ${p.opacity * 0.6})`;
          ctx.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2);
          ctx.fill();

          // Reset position
          if (p.y < 0) {
            p.y = canvas.height;
            p.x = Math.random() * canvas.width;
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    // Start animation when image loads
    img.onload = () => {
      animate();
    };

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [backgroundImage]);

  return (
    <section
      className={cn(
        'py-32 md:py-48 lg:py-64',
        backgroundImage ? 'relative overflow-hidden' : 'bg-gray-50',
        className
      )}
      {...props}
    >
      {backgroundImage && (
        <canvas
          ref={canvasRef}
          className="absolute inset-0"
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        />
      )}

      {overlay && backgroundImage && (
        <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm" />
      )}

      <Container>
        <div className={cn(
          'max-w-3xl relative z-10',
          centered ? 'text-center mx-auto' : '',
          'animate-fade-in-up'
        )}>
          <h1 className={cn(
            'text-4xl md:text-5xl lg:text-6xl font-bold mb-6',
            backgroundImage ? 'text-white' : 'text-gray-900'
          )}>
            {title}
          </h1>
          <p className={cn(
            'text-lg md:text-xl mb-8 leading-relaxed',
            backgroundImage ? 'text-gray-100' : 'text-gray-700'
          )}>
            {description}
          </p>
          {(primaryAction || secondaryAction) && (
            <div className={cn('flex flex-col sm:flex-row gap-4', centered ? 'justify-center' : 'justify-start')}>
              {primaryAction && (
                <Button variant="primary" size="lg" asChild href={primaryAction.href}>
                  {primaryAction.label}
                </Button>
              )}
              {secondaryAction && (
                <Button variant="secondary" size="lg" asChild href={secondaryAction.href}>
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}
