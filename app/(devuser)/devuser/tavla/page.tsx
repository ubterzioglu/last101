import { DevUserShell } from '@/components/devuser/DevUserShell';
import TavlaClient from './TavlaClient';

export default function TavlaPage() {
  return (
    <DevUserShell backHref="/devuser/dev" frameVariant="wide">
      <TavlaClient />
    </DevUserShell>
  );
}
