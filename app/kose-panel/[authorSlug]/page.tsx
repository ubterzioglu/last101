import { redirect } from 'next/navigation';

interface LegacyAuthorPanelPageProps {
  params: Promise<{ authorSlug: string }>;
}

export const metadata = {
  robots: { index: false, follow: false },
};

// Köşe yazarı paneli /authors/<slug>/panel altına taşındı. Eski
// /kose-panel/<slug> linkleri kalıcı olarak yeni route'a yönlendirilir.
export default async function LegacyAuthorPanelPage({ params }: LegacyAuthorPanelPageProps) {
  const { authorSlug } = await params;
  redirect(`/authors/${authorSlug}/panel`);
}
