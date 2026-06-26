import { ToolPageScaffold } from '@/components/tools/ToolPageScaffold';
import { createMetadata } from '@/lib/seo/metadata';
import AlmanyayaHazirMisinClient from './AlmanyayaHazirMisinClient';
import { toolConfig } from './toolConfig';

export const metadata = createMetadata({
  title: toolConfig.title,
  description: toolConfig.description,
  path: toolConfig.path,
});

export default function AlmanyayaHazirMisinPage() {
  return (
    <ToolPageScaffold config={toolConfig}>
      <AlmanyayaHazirMisinClient />
    </ToolPageScaffold>
  );
}
