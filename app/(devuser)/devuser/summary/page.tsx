import { DevUserShell } from '@/components/devuser/DevUserShell';
import { SummaryClient } from './SummaryClient';

export default function SummaryPage() {
  return (
    <DevUserShell
      title="haftalık özetler"
      backHref="/devuser/dev"
      backLabel="← dashboard'a dön"
      frameVariant="default"
    >
      <SummaryClient />
    </DevUserShell>
  );
}
