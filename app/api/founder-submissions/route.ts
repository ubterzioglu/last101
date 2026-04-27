import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import {
  sanitizeLinkedinUrl,
  sanitizePhone,
  sanitizeText,
} from '@/lib/founder';

function normalizeEnvValue(value: unknown): string {
  const raw = String(value || '').trim();
  if (!raw) return '';
  if ((raw.startsWith('"') && raw.endsWith('"')) || (raw.startsWith("'") && raw.endsWith("'"))) {
    return raw.slice(1, -1).trim();
  }
  return raw;
}

function assignNullableIfPresent(target: Record<string, unknown>, key: string, value: string) {
  if (value) {
    target[key] = value;
  }
}

export async function OPTIONS() {
  return new NextResponse(null, { status: 204 });
}

export async function POST(request: NextRequest) {
  const supabaseUrl = normalizeEnvValue(process.env.NEXT_PUBLIC_SUPABASE_URL);
  const serviceRoleKey = normalizeEnvValue(process.env.SUPABASE_SERVICE_ROLE_KEY);

  if (!supabaseUrl || !serviceRoleKey) {
    return NextResponse.json({ error: 'Service not configured' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Geçersiz istek gövdesi.' }, { status: 400 });
  }

  const fullName = sanitizeText(body.full_name, 120);
  const linkedinUrl = sanitizeLinkedinUrl(body.linkedin_url);
  const whatsapp = sanitizePhone(body.whatsapp, 32);
  const phone = sanitizePhone(body.phone, 32);
  const projectName = sanitizeText(body.project_name, 160);
  const shortDescription = sanitizeText(body.short_description, 1200);

  const supabase: any = createClient(supabaseUrl, serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  try {
    let existing = null;
    if (whatsapp) {
      const { data: existingByWhatsapp, error: existingWhatsappError } = await supabase
        .from('founder_submissions')
        .select('id, status')
        .eq('whatsapp', whatsapp)
        .limit(1);

      if (existingWhatsappError) throw existingWhatsappError;
      existing = Array.isArray(existingByWhatsapp) ? existingByWhatsapp[0] : null;
    }

    if (!existing && linkedinUrl) {
      const { data: existingByLinkedin, error: existingLinkedinError } = await supabase
        .from('founder_submissions')
        .select('id, status')
        .eq('linkedin_url', linkedinUrl)
        .limit(1);

      if (existingLinkedinError) throw existingLinkedinError;
      existing = Array.isArray(existingByLinkedin) ? existingByLinkedin[0] : null;
    }

    if (existing?.id) {
      const updatePayload: Record<string, unknown> = {
        updated_at: new Date().toISOString(),
      };

      assignNullableIfPresent(updatePayload, 'full_name', fullName);
      assignNullableIfPresent(updatePayload, 'linkedin_url', linkedinUrl);
      assignNullableIfPresent(updatePayload, 'whatsapp', whatsapp);
      assignNullableIfPresent(updatePayload, 'phone', phone);
      assignNullableIfPresent(updatePayload, 'project_name', projectName);
      assignNullableIfPresent(updatePayload, 'short_description', shortDescription);

      const { data, error } = await supabase
        .from('founder_submissions')
        .update(updatePayload)
        .eq('id', existing.id)
        .select('id, status')
        .single();

      if (error) throw error;

      return NextResponse.json(
        {
          ok: true,
          id: data?.id ?? existing.id,
          status: data?.status ?? existing.status ?? 'pending',
          duplicate: true,
        },
        { status: 200 }
      );
    }

    const { data, error } = await supabase
      .from('founder_submissions')
      .insert([
        {
          status: 'pending',
          ...(fullName ? { full_name: fullName } : {}),
          ...(linkedinUrl ? { linkedin_url: linkedinUrl } : {}),
          ...(whatsapp ? { whatsapp } : {}),
          ...(phone ? { phone } : {}),
          ...(projectName ? { project_name: projectName } : {}),
          ...(shortDescription ? { short_description: shortDescription } : {}),
        },
      ])
      .select('id, status')
      .single();

    if (error) throw error;

    return NextResponse.json(
      {
        ok: true,
        id: data?.id ?? null,
        status: data?.status ?? 'pending',
        duplicate: false,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('founder-submissions POST failed:', error);
    const message = (error as Error)?.message || 'Başvuru gönderilemedi.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
