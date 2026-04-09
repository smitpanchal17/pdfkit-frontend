import { NextRequest, NextResponse } from 'next/server';
import { CONFIG } from '@/lib/config';

export async function POST(req: NextRequest) {
  try {
    const { email, tool } = await req.json();
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Store in Supabase email_leads table
    const res = await fetch(`${CONFIG.SUPABASE_URL}/rest/v1/email_leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': CONFIG.SUPABASE_ANON,
        'Authorization': `Bearer ${CONFIG.SUPABASE_ANON}`,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify({
        email: email.toLowerCase(),
        source: 'download_capture',
        tool: tool || null,
        created_at: new Date().toISOString(),
      }),
    });

    // 409 = duplicate email, still a success from user's perspective
    if (!res.ok && res.status !== 409) {
      console.error('[capture-email] Supabase error:', res.status);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('[capture-email]', e);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
