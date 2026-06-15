import { redirect } from 'next/navigation';

export default function AdminNewsSourcesPage() {
  redirect('/admin/haberler?tab=kaynaklar');
}
