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
      <DevUserPageController />
      <DevUserCanvas />
      <div className="devuser-shell-page devuser-shell-scroll" style={{ minHeight: '100vh' }}>
        {children}
      </div>
    </>
  );
}
