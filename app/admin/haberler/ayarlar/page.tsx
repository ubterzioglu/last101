import { redirect } from 'next/navigation';

export default function AdminNewsSettingsPage() {
  redirect('/admin/haberler?tab=ayarlar');
}
