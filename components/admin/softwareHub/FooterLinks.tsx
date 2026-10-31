import { Button } from '@/components/ui/Button';

export default function FooterLinks() {
  return (
    <div className="flex flex-wrap justify-center gap-3 pb-8 pt-6">
      <Button href="/" variant="outline">
        Ana Sayfaya Dön
      </Button>
      <Button href="/devuser" variant="primary">
        Software Dashboard
      </Button>
    </div>
  );
}
