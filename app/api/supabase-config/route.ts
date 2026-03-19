// Supabase Config API - Frontend'e güvenli config sunar
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const headers = new Headers({
    'Cache-Control': 'no-store, no-cache, must-revalidate',
    Pragma: 'no-cache',
  });
  
  headers.set('Access-Control-Allow-Origin', '*');
  
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  
  const revokedPublicKeys = new Set([
    'sb_publishable_vBFFGmqZ3eKr5oqm_dbfMA_5euLMj2x',
  ]);
  
  const rawCandidates = [
    process.env.SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY,
    process.env.SUPABASE_PUBLISHABLE_KEY,
    'sb_publishable_mqX5A9NdO66oM2GjvPJwNw_C7MhIDcI',
  ];
  
  const candidateKeys = Array.from(
    new Set(
      rawCandidates
        .map((key) => String(key || '').trim())
        .filter((key) => key && !revokedPublicKeys.has(key))
    )
  );
  
  const supabaseAnonKey = candidateKeys[0] || null;
  
  if (!supabaseUrl || !supabaseAnonKey) {
    return NextResponse.json({ error: 'Configuration missing' }, { status: 500, headers });
  }
  
  return NextResponse.json({
    url: supabaseUrl,
    anonKey: supabaseAnonKey,
  }, { headers });
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
    },
  });
}
