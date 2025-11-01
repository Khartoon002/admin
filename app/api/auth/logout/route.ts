// app/api/auth/logout/route.ts
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set('adminSession', '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    expires: new Date(0),
  });
  return res;
}
