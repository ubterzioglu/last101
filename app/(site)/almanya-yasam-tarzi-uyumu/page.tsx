import { ToolPageScaffold } from '@/components/tools/ToolPageScaffold';
import { createMetadata } from '@/lib/seo/metadata';
import AlmanyaYasamTarziUyumuClient from './AlmanyaYasamTarziUyumuClient';
import { toolConfig } from './toolConfig';

export const metadata = createMetadata({
  title: toolConfig.title,
  description: toolConfig.description,
  path: toolConfig.path,
});

export default function AlmanyaYasamTarziUyumuPage() {
  return (
    <ToolPageScaffold config={toolConfig}>
      <AlmanyaYasamTarziUyumuClient />
    </ToolPageScaffold>
  );
}
