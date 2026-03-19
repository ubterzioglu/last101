// DevUser Count API - Toplam kayıt sayısını döndürür
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    
    const { count, error } = await supabase
      .from('devuser')
      .select('id', { count: 'exact', head: true });
    
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
