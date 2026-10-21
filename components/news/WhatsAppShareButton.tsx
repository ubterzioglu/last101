import { ArrowUpRight, MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function WhatsAppShareButton({ text, className }: { text: string; className?: string }) {
  const href = `https://wa.me/?text=${encodeURIComponent(text)}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'inline-flex min-h-[44px] items-center justify-center gap-2 rounded-btn bg-brand-700 px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-brand-800 motion-reduce:transition-none',
        className
      )}
    >
      <MessageCircle aria-hidden="true" size={16} className="shrink-0" />
      WhatsApp'ta paylaş
      <ArrowUpRight aria-hidden="true" size={16} className="shrink-0" />
    </a>
  );
}
