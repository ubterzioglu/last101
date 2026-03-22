import { Breadcrumb } from '@/components/layout/Breadcrumb';

interface MarketingLayoutProps {
  children: React.ReactNode;
}

export default function MarketingLayout({ children }: MarketingLayoutProps) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  );
}
