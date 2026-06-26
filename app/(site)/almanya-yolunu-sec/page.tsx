import { ToolPageScaffold } from '@/components/tools/ToolPageScaffold';
import { createMetadata } from '@/lib/seo/metadata';
import AlmanyaYolunuSecClient from './AlmanyaYolunuSecClient';
import { toolConfig } from './toolConfig';

export const metadata = createMetadata({
  title: toolConfig.title,
  description: toolConfig.description,
  path: toolConfig.path,
});

export default function AlmanyaYolunuSecPage() {
  return (
    <ToolPageScaffold config={toolConfig}>
      <AlmanyaYolunuSecClient />
    </ToolPageScaffold>
  );
}

