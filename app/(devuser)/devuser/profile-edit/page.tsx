import type { Metadata } from 'next';
import { ProfileEditClient } from './ProfileEditClient';

export const metadata: Metadata = {
  title: 'Profil Düzenle - almanya101',
  robots: { index: false, follow: false },
};

export default function ProfileEditPage() {
  return <ProfileEditClient />;
}
