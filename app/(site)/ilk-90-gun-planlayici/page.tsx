import { ToolPageScaffold } from '@/components/tools/ToolPageScaffold';
import { createMetadata } from '@/lib/seo/metadata';
import Ilk90GunPlanlayiciClient from './Ilk90GunPlanlayiciClient';
import { toolConfig } from './toolConfig';

export const metadata = createMetadata({
  title: toolConfig.title,
  description: toolConfig.description,
  path: toolConfig.path,
});

export default function Ilk90GunPlanlayiciPage() {
  return (
    <ToolPageScaffold config={toolConfig}>
      <Ilk90GunPlanlayiciClient />
    </ToolPageScaffold>
  );
}

