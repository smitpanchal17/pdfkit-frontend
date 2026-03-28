import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

/**
 * POST /api/auth/ensure-profile
 * Called by pdfkit-app.js after OAuth sign-in to register/update the user profile.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}));
    const accessToken = body.access_token;

    if (!accessToken) {
      return NextResponse.json({ error: 'No access token' }, { status: 401 });
    }

    // Verify token and get user info from Supabase
    const userResp = await fetch(`${SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        apikey: SUPABASE_ANON,
      },
    });

    if (!userResp.ok) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 });
    }

    const user = await userResp.json();

    // Best-effort: upsert profile into DB
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceKey) {
      await fetch(`${SUPABASE_URL}/rest/v1/profiles`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
          Prefer: 'resolution=merge-duplicates',
        },
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          full_name: user.user_metadata?.full_name ?? null,
          avatar_url: user.user_metadata?.avatar_url ?? null,
          updated_at: new Date().toISOString(),
        }),
      }).catch(() => {});
    }

    return NextResponse.json({
      ok: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        avatar: user.user_metadata?.avatar_url ?? null,
        plan: 'free',
      },
    });
  } catch {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
