import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  const { token } = await req.json().catch(() => ({}));
  if (!token || token !== process.env.BOTS_ADMIN_TOKEN) {
    return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 401 });
  }

  cookies().set("bots_admin", process.env.BOTS_ADMIN_TOKEN!, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production",
  });

  return NextResponse.json({ ok: true });
}
