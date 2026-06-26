import { ToolPageScaffold } from '@/components/tools/ToolPageScaffold';
import { createMetadata } from '@/lib/seo/metadata';
import AlmanyaMaasBeklentisiClient from './AlmanyaMaasBeklentisiClient';
import { toolConfig } from './toolConfig';

export const metadata = createMetadata({
  title: toolConfig.title,
  description: toolConfig.description,
  path: toolConfig.path,
});

export default function AlmanyaMaasBeklentisiPage() {
  return (
    <ToolPageScaffold config={toolConfig}>
      <AlmanyaMaasBeklentisiClient />
    </ToolPageScaffold>
  );
}

