import { ToolPageScaffold } from '@/components/tools/ToolPageScaffold';
import { createMetadata } from '@/lib/seo/metadata';
import OnceHangiSorunuCozmelisinClient from './OnceHangiSorunuCozmelisinClient';
import { toolConfig } from './toolConfig';

export const metadata = createMetadata({
  title: toolConfig.title,
  description: toolConfig.description,
  path: toolConfig.path,
});

export default function OnceHangiSorunuCozmelisinPage() {
  return (
    <ToolPageScaffold config={toolConfig}>
      <OnceHangiSorunuCozmelisinClient />
    </ToolPageScaffold>
  );
}

