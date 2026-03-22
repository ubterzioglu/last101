import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createClient as createServiceClient } from '@supabase/supabase-js';

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function GET() {
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();
  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const service = createServiceClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

  try {
    let { data: row } = await service
      .from('devuser')
      .select('*')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();

    if (!row) {
      // Try by email
      const email = (user.email ?? '').toLowerCase();
      const { data: byEmail } = await service
        .from('devuser')
        .select('*')
        .eq('login_email', email)
        .limit(1)
        .maybeSingle();

      if (byEmail) {
        // Claim the row
        const { data: claimed } = await service
          .from('devuser')
          .update({ user_id: user.id, login_email: email })
          .eq('id', byEmail.id)
          .select('*')
          .maybeSingle();
        row = claimed ?? byEmail;
      }
    }

    if (!row) {
      return NextResponse.json({ error: 'Profile not found. Lütfen önce kayıt formunu doldurun.' }, { status: 404 });
    }

    // Strip sensitive fields
    const { login_pin_hash: _h, login_pin_salt: _s, ...safe } = row as Record<string, unknown>;
    return NextResponse.json({ data: safe });
  } catch (err) {
    console.error('devuser-me failed:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
