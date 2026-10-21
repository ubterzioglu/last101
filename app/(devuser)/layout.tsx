import Script from 'next/script';
import './devuser-shell.css';
import { DevUserCanvas } from '@/components/devuser/DevUserCanvas';
import { DevUserPageController } from '@/components/devuser/DevUserPageController';

export default function DevUserLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/*
        Set `data-devuser` before first paint so the light public Header/Footer
        never flash above the dark devuser shell. DevUserPageController keeps
        managing the attribute after hydration (same pattern as app/admin).
      */}
      <Script id="devuser-chrome-flag" strategy="beforeInteractive">
        {`document.body.setAttribute('data-devuser','true');`}
      </Script>
      <DevUserPageController />
      <DevUserCanvas />
      <div className="devuser-shell-page devuser-shell-scroll" style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </>
  );
}
