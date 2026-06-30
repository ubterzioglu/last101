import { redirect } from 'next/navigation';

interface LegacyAuthorLoginPageProps {
  params: Promise<{ authorSlug: string }>;
}

export const metadata = {
  robots: { index: false, follow: false },
};

// Köşe yazarı girişi /authors altına taşındı. Daha önce paylaşılmış
// /kose-giris/<slug> linkleri kırılmasın diye kalıcı yönlendirme yapılır.
export default async function LegacyAuthorLoginPage({ params }: LegacyAuthorLoginPageProps) {
  const { authorSlug } = await params;
  redirect(`/authors/${authorSlug}`);
}
