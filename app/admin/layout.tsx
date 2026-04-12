import type { Metadata } from 'next';
import { SEO_SITE_NAME } from '@/lib/utils/constants';

export const metadata: Metadata = {
  title: `Admin Panel | ${SEO_SITE_NAME}`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
