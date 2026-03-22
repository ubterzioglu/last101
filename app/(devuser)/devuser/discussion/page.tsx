import { DevUserShell } from '@/components/devuser/DevUserShell';
import { DiscussionClient } from './DiscussionClient';

export default function DiscussionPage() {
  return (
    <DevUserShell
      title="tartışma konusu öner"
      backHref="/devuser/dev"
      backLabel="← dashboard'a dön"
      frameVariant="compact"
    >
      <DiscussionClient />
    </DevUserShell>
  );
}
