import CornerAuthorPanelClient from '@/components/CornerAuthorPanelClient';

interface AuthorLoginPageProps {
  params: Promise<{ authorSlug: string }>;
}

export const metadata = {
  title: 'Köşe Girişi',
  robots: { index: false, follow: false },
};

export default async function AuthorLoginPage({ params }: AuthorLoginPageProps) {
  const { authorSlug } = await params;
  return <CornerAuthorPanelClient slug={authorSlug} mode="login" />;
}

