import { redirect } from 'next/navigation';

export default function AdminNewsPipelinePage() {
  redirect('/admin/haberler?tab=pipeline');
}
