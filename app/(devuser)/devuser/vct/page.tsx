import { DevUserShell } from '@/components/devuser/DevUserShell';
import VctClient from './VctClient';

export default function VctPage() {
  return (
    <DevUserShell backHref="/devuser/dev" frameVariant="wide">
      <VctClient />
    </DevUserShell>
  );
}
