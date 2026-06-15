import { NewsEditorAdminClient } from '@/components/admin/news/NewsEditorAdminClient';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminNewsDetailPage({ params }: PageProps) {
  const { id } = await params;
  return <NewsEditorAdminClient postId={id} />;
}
