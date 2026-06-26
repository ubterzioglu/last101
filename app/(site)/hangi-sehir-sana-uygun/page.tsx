import { ToolPageScaffold } from '@/components/tools/ToolPageScaffold';
import { createMetadata } from '@/lib/seo/metadata';
import HangiSehirSanaUygunClient from './HangiSehirSanaUygunClient';
import { toolConfig } from './toolConfig';

export const metadata = createMetadata({
  title: toolConfig.title,
  description: toolConfig.description,
  path: toolConfig.path,
});

export default function HangiSehirSanaUygunPage() {
  return (
    <ToolPageScaffold config={toolConfig}>
      <HangiSehirSanaUygunClient />
    </ToolPageScaffold>
  );
}

