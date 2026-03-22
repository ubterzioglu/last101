import { DevUserShell } from '@/components/devuser/DevUserShell';
import TypingClient from './TypingClient';

export default function TypingPage() {
  return (
    <DevUserShell backHref="/devuser/dev" frameVariant="wide">
      <TypingClient />
    </DevUserShell>
  );
}
