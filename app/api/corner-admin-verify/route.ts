import { NextResponse } from 'next/server';
import { withCornerAdmin } from '@/lib/admin/withAuth';

export const GET = withCornerAdmin(async (request) => {
  return NextResponse.json({ ok: true });
});

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
