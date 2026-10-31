import { useState } from 'react';
import { ADMIN_CONTROL_CLASS } from '@/components/admin/ui/AdminField';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils/cn';
import type { SoftwareHubNewsRow } from '@/types/software-hub';

export default function NewsCategorySelect({ item, index, selectedCat, categories, onSave }: {
  item: SoftwareHubNewsRow; index: number; selectedCat: string; categories: string[];
  onSave: (id: string, category: string) => Promise<void>;
}) {
  const [cat, setCat] = useState(selectedCat);
  return (
    <>
      <select
        value={cat}
        onChange={(e) => setCat(e.target.value)}
        aria-label={`Kategori ${index + 1}`}
        className={cn(ADMIN_CONTROL_CLASS, 'w-auto min-w-[110px]')}
      >
        {categories.map((c) => <option key={c} value={c}>{c}</option>)}
      </select>
      <Button type="button" variant="outline" size="sm" className="min-h-[44px]" onClick={() => onSave(item.id, cat)}>
        Kaydet
      </Button>
    </>
  );
}
