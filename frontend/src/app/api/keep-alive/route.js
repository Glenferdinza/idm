import { NextResponse } from 'next/server';

export async function GET() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://itmqzgmiberkfwqocpqd.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  let dbPing = null;

  try {
    if (supabaseKey) {
      const res = await fetch(`${supabaseUrl}/rest/v1/users?select=id&limit=1`, {
        headers: {
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        cache: 'no-store'
      });
      if (res.ok) {
        dbPing = 'Supabase PostgreSQL DB Ping Success';
      } else {
        dbPing = `Supabase REST API (HTTP ${res.status})`;
      }
    } else {
      const res = await fetch(`${supabaseUrl}/rest/v1/`, { cache: 'no-store' });
      dbPing = `Pinged Supabase Project Reference (HTTP ${res.status})`;
    }
  } catch (err) {
    dbPing = err.message;
  }

  return NextResponse.json({
    success: true,
    message: 'MEMORA Supabase Keep-Alive Executed Successfully!',
    projectId: 'itmqzgmiberkfwqocpqd',
    dbPing,
    timestamp: new Date().toISOString()
  });
}
