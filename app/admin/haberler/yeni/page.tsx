import { redirect } from 'next/navigation';

export default function AdminNewsCreatePage() {
  redirect('/admin/haberler?tab=editor');
}
