import { DevUserShell } from '@/components/devuser/DevUserShell';
import DisadClient from './DisadClient';

export default function DisadPage() {
  return (
    <DevUserShell backHref="/devuser/dev" frameVariant="wide">
      <DisadClient />
    </DevUserShell>
  );
}
