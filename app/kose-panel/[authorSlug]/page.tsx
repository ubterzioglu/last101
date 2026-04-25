import CornerAuthorPanelClient from '@/components/CornerAuthorPanelClient';

interface AuthorPanelPageProps {
  params: Promise<{ authorSlug: string }>;
}

export const metadata = {
  title: 'Köşe Paneli',
  robots: { index: false, follow: false },
};

export default async function AuthorPanelPage({ params }: AuthorPanelPageProps) {
  const { authorSlug } = await params;
  return <CornerAuthorPanelClient slug={authorSlug} mode="panel" />;
}

