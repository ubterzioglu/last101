// DevUser Count API - Toplam kayıt sayısını döndürür
import { NextResponse } from 'next/server';
import { tryCreateServiceClient } from '@/lib/supabase/admin';

// Sayım, eskiden anon client + RLS ("aratilabilir = true") ile yapılıyordu. Anon artık devuser tablosunu
// okumadığı için aynı filtre service role ile açıkça uygulanır; dönen sayı değişmez.
export async function GET() {
  try {
    const supabase = tryCreateServiceClient();
    if (!supabase) throw new Error('Service not configured');

    const { count, error } = await supabase
      .from('devuser')
      .select('id', { count: 'exact', head: true })
      .eq('aratilabilir', true);

    if (error) {
      throw error;
    }

    return NextResponse.json(
      { count: Number(count || 0) },
      {
        headers: {
          'Cache-Control': 'public, s-maxage=120, stale-while-revalidate=300',
          'Access-Control-Allow-Origin': '*',
        }
      }
    );
  } catch (error) {
    console.error('devuser-count failed:', error);
    return NextResponse.json(
      { error: 'Count unavailable' },
      { status: 500 }
    );
  }
}
