import Link from 'next/link';

interface DevUserShellProps {
  children: React.ReactNode;
  title?: string;
  backHref?: string;
  backLabel?: string;
  frameVariant?: 'default' | 'compact' | 'wide';
}

const frameClasses = {
  default: 'devuser-shell-frame',
  compact: 'devuser-shell-frame devuser-shell-frame--compact',
  wide: 'devuser-shell-frame devuser-shell-frame--wide',
};

export function DevUserShell({
  children,
  title = 'de tr software dashboard',
  backHref,
  backLabel = '← dashboard\'a dön',
  frameVariant = 'default',
}: DevUserShellProps) {
  return (
    <div className={frameClasses[frameVariant]}>
      <div className="devuser-shell-top-logo">
        <Link href="/" className="text-xl font-bold text-white hover:opacity-80 transition-opacity">
          almanya101
        </Link>
      </div>
      <header className="devuser-shell-header">
        <h1 className="devuser-shell-title">{title}</h1>
      </header>
      {backHref && (
        <Link href={backHref} className="devuser-shell-back-link">
          {backLabel}
        </Link>
      )}
      {children}
    </div>
  );
}
