import { redirect } from 'next/navigation';

interface PageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function AdminNewsDetailPage({ params }: PageProps) {
  const { id } = await params;
  redirect(`/admin/haberler?tab=editor&id=${encodeURIComponent(id)}`);
}
