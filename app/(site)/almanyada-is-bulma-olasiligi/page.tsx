import { ToolPageScaffold } from '@/components/tools/ToolPageScaffold';
import { createMetadata } from '@/lib/seo/metadata';
import AlmanyadaIsBulmaOlasiligiClient from './AlmanyadaIsBulmaOlasiligiClient';
import { toolConfig } from './toolConfig';

export const metadata = createMetadata({
  title: toolConfig.title,
  description: toolConfig.description,
  path: toolConfig.path,
});

export default function AlmanyadaIsBulmaOlasiligiPage() {
  return (
    <ToolPageScaffold config={toolConfig}>
      <AlmanyadaIsBulmaOlasiligiClient />
    </ToolPageScaffold>
  );
}

