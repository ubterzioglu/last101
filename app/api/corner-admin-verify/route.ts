import { NextRequest, NextResponse } from 'next/server';
import { isCornerAdminAuthorized } from '@/lib/admin/cornerAuth';

export async function GET(request: NextRequest) {
  const auth = await isCornerAdminAuthorized(request);
  if (!auth.ok) return NextResponse.json({ error: auth.reason }, { status: auth.status });
  return NextResponse.json({ ok: true });
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}
