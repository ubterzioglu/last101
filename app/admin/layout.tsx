import type { Metadata } from 'next';
import Script from 'next/script';
import { SEO_SITE_NAME } from '@/lib/utils/constants';
import { AdminLayoutShell } from '@/components/admin/AdminLayoutShell';

export const metadata: Metadata = {
  title: `Admin Panel | ${SEO_SITE_NAME}`,
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {/*
        Set `data-devuser` before first paint so the global site Header/Footer
        (hidden via `body[data-devuser]` in globals.css) never flash on admin
        pages. AdminLayoutShell keeps managing the attribute after hydration.
      */}
      <Script id="admin-chrome-flag" strategy="beforeInteractive">
        {`document.body.setAttribute('data-devuser','true');`}
      </Script>
      <AdminLayoutShell>{children}</AdminLayoutShell>
    </>
  );
}
