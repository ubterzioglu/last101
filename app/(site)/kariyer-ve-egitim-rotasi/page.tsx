import { ToolPageScaffold } from '@/components/tools/ToolPageScaffold';
import { createMetadata } from '@/lib/seo/metadata';
import KariyerVeEgitimRotasiClient from './KariyerVeEgitimRotasiClient';
import { toolConfig } from './toolConfig';

export const metadata = createMetadata({
  title: toolConfig.title,
  description: toolConfig.description,
  path: toolConfig.path,
});

export default function KariyerVeEgitimRotasiPage() {
  return (
    <ToolPageScaffold config={toolConfig}>
      <KariyerVeEgitimRotasiClient />
    </ToolPageScaffold>
  );
}

