// Health Check Endpoint
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'almanya101',
  }, {
    status: 200,
    headers: {
      'Cache-Control': 'no-cache',
    },
  });
}

export const dynamic = 'force-dynamic';
