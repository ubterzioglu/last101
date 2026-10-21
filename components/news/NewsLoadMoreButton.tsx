'use client';

import { Button } from '@/components/ui/Button';

export function NewsLoadMoreButton({
  onClick,
  loading,
  disabled,
}: {
  onClick: () => void;
  loading: boolean;
  disabled?: boolean;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={onClick}
      disabled={loading || disabled}
      aria-busy={loading}
    >
      {loading ? 'Yükleniyor...' : 'Daha fazla yükle'}
    </Button>
  );
}
