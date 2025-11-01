// app/api/auth/login/route.ts
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/db'; // or "@/lib/prisma"
import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';

type Body = {
  email?: string;
  password?: string;
  remember?: boolean;
};

function setSessionCookie(res: NextResponse, remember: boolean | undefined) {
  const token = crypto.randomUUID(); // presence-based session (middleware only checks existence)
  // 7 days if remember, else session cookie
  const maxAge = remember ? 60 * 60 * 24 * 7 : undefined;

  res.cookies.set('adminSession', token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    path: '/',
    ...(maxAge ? { maxAge } : {}),
  });
}

export async function POST(req: NextRequest) {
  try {
    const { email, password, remember }: Body = await req.json().catch(() => ({} as Body));

    const e = (email ?? '').trim().toLowerCase();
    const p = (password ?? '').trim();

    if (!e || !p) {
      return NextResponse.json({ ok: false, error: 'Email and password are required.' }, { status: 400 });
    }

    // 1) Try ENV pair
    const ENV_EMAIL = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const ENV_PASS = process.env.ADMIN_PASSWORD ?? '';

    // If either env is missing, we still allow DB auth below, but return a hint for easier debugging
    const envConfigured = Boolean(ENV_EMAIL && ENV_PASS);

    if (envConfigured && e === ENV_EMAIL && p === ENV_PASS) {
      const res = NextResponse.json({ ok: true });
      setSessionCookie(res, !!remember);
      return res;
    }

    // 2) Fallback to DB user (bcrypt)
    const user = await prisma.user.findUnique({ where: { email: e } });
    if (user && (await bcrypt.compare(p, user.passwordHash))) {
      const res = NextResponse.json({ ok: true });
      setSessionCookie(res, !!remember);
      return res;
    }

    // Helpful error if ENV missing vs bad password
    if (!envConfigured && !user) {
      return NextResponse.json(
        { ok: false, error: 'Invalid credentials (and admin ENV not configured in this environment).' },
        { status: 401 }
      );
    }

    return NextResponse.json({ ok: false, error: 'Invalid credentials' }, { status: 401 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: 'Login failed' }, { status: 500 });
  }
}
