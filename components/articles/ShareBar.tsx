'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';
import { ARTICLE_TONE_CLASSES } from './articleTone';
import type { ArticleTone } from './articleTone';

interface ShareBarProps {
  url: string;
  title: string;
  /** WhatsApp için özel metin; verilmezse "başlık + bağlantı" kullanılır. */
  whatsappText?: string;
  tone?: ArticleTone;
  className?: string;
}

const COPY_RESET_MS = 2000;

export function ShareBar({ url, title, whatsappText, tone = 'dark', className }: ShareBarProps) {
  const [copied, setCopied] = useState(false);
  const classes = ARTICLE_TONE_CLASSES[tone];

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const targets = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(whatsappText || `${title} ${url}`)}` },
    { label: 'X', href: `https://x.com/intent/post?text=${encodedTitle}&url=${encodedUrl}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}` },
  ];

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), COPY_RESET_MS);
    } catch {
      // Pano erişimi reddedilirse sessizce geçilir; diğer paylaşım bağlantıları çalışmaya devam eder.
    }
  }

  const chipClass = cn(
    'inline-flex rounded-full border px-4 py-2 text-sm font-semibold transition',
    classes.chip
  );

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className={cn('mr-1 text-sm font-semibold', classes.muted)}>Paylaş:</span>
      {targets.map((target) => (
        <a
          key={target.label}
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${target.label} üzerinde paylaş`}
          className={chipClass}
        >
          {target.label}
        </a>
      ))}
      <button type="button" onClick={copyLink} className={chipClass} aria-live="polite">
        {copied ? 'Kopyalandı' : 'Bağlantıyı kopyala'}
      </button>
    </div>
  );
}
