import { ToolPageScaffold } from '@/components/tools/ToolPageScaffold';
import { createMetadata } from '@/lib/seo/metadata';
import ToplulukVeDanismanlikClient from './ToplulukVeDanismanlikClient';
import { toolConfig } from './toolConfig';

export const metadata = createMetadata({
  title: toolConfig.title,
  description: toolConfig.description,
  path: toolConfig.path,
});

export default function ToplulukVeDanismanlikPage() {
  return (
    <ToolPageScaffold config={toolConfig}>
      <ToplulukVeDanismanlikClient />
    </ToolPageScaffold>
  );
}

