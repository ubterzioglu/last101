import { DevUserShell } from '@/components/devuser/DevUserShell';
import { GelismelerClient } from './GelismelerClient';

export default function GelismelerPage() {
  return (
    <DevUserShell
      title="etkinlik takvimi / duyurular"
      backHref="/devuser/dev"
      backLabel="← dashboard'a dön"
      frameVariant="wide"
    >
      <GelismelerClient />
    </DevUserShell>
  );
}
