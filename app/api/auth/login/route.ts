// app/api/auth/login/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function strEq(a?: string | null, b?: string | null) {
  // simple constant-ish time compare fallback
  if (!a || !b) return false;
  if (a.length !== b.length) return false;
  let ok = 0;
  for (let i = 0; i < a.length; i++) ok |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return ok === 0;
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const rawEmail: string = (body.email ?? "").toString();
  const password: string = (body.password ?? "").toString();
  const remember: boolean = !!body.remember;

  const email = rawEmail.trim().toLowerCase();
  if (!email || !password) {
    return NextResponse.json({ ok: false, error: "Missing email or password" }, { status: 400 });
  }

  const ENV_EMAIL = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const ENV_PASS = (process.env.ADMIN_PASSWORD || "").toString();

  // 1) Ensure a User row exists matching env (seed-on-demand)
  if (ENV_EMAIL && ENV_PASS) {
    const existing = await prisma.user.findUnique({ where: { email: ENV_EMAIL } });
    if (!existing) {
      const passwordHash = await bcrypt.hash(ENV_PASS, 10);
      await prisma.user.create({
        data: { email: ENV_EMAIL, passwordHash, role: "ADMIN" },
      });
    }
  }

  // 2) Try DB user first (bcrypt)
  const dbUser = await prisma.user.findUnique({ where: { email } });
  let authed = false;

  if (dbUser) {
    authed = await bcrypt.compare(password, dbUser.passwordHash);
  } else if (ENV_EMAIL && ENV_PASS) {
    // 3) Fallback: env credentials (plain env compare)
    authed = strEq(email, ENV_EMAIL) && strEq(password, ENV_PASS);
  }

  if (!authed) {
    return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
  }

  // 4) Set cookie
  const c = cookies();
  const value = "sess-" + Date.now().toString(36);
  const base = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  };
  if (remember) {
    c.set("adminSession", value, { ...base, maxAge: 60 * 60 * 24 * 7 }); // 7d
  } else {
    c.set("adminSession", value, base); // session cookie
  }

  return NextResponse.json({ ok: true });
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
