import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    let refreshToken = body.refresh_token;

    // If not in body, check cookies (for credentials: 'include' calls)
    if (!refreshToken) {
      refreshToken = request.cookies.get('__Host-pdfkit_rt')?.value 
                  || request.cookies.get('pdfkit_rt')?.value;
    }

    if (!refreshToken) {
      return NextResponse.json({ error: 'No refresh token' }, { status: 401 });
    }

    const resp = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=refresh_token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_ANON,
        'Authorization': `Bearer ${SUPABASE_ANON}`,
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });

    const data = await resp.json();
    if (!resp.ok) {
      return NextResponse.json({ error: data.error_description || 'Refresh failed' }, { status: resp.status });
    }

    return NextResponse.json({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_in: data.expires_in,
      token_type: 'bearer',
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({ ok: true });
}
