'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils/cn';

interface ShareBarProps {
  url: string;
  title: string;
  /** WhatsApp için özel metin; verilmezse "başlık + bağlantı" kullanılır. */
  whatsappText?: string;
  className?: string;
}

const COPY_RESET_MS = 2000;

const CHIP_CLASSES =
  'inline-flex min-h-[44px] items-center rounded-btn border border-line bg-white px-4 py-2 text-sm font-semibold text-ink transition-colors hover:border-ink motion-reduce:transition-none';

export function ShareBar({ url, title, whatsappText, className }: ShareBarProps) {
  const [copied, setCopied] = useState(false);

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

  return (
    <div className={cn('flex flex-wrap items-center gap-2', className)}>
      <span className="mr-1 w-full text-[13px] font-bold uppercase tracking-[0.13em] text-muted">Paylaş</span>
      {targets.map((target) => (
        <a
          key={target.label}
          href={target.href}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${target.label} üzerinde paylaş`}
          className={CHIP_CLASSES}
        >
          {target.label}
        </a>
      ))}
      <button type="button" onClick={copyLink} className={CHIP_CLASSES} aria-live="polite">
        {copied ? 'Kopyalandı' : 'Bağlantıyı kopyala'}
      </button>
    </div>
  );
}
