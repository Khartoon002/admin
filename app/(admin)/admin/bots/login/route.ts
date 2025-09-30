import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  const form = await req.formData();
  const token = String(form.get("token") || "");
  const expected = process.env.BOTS_ADMIN_TOKEN || "";

  // Invalid token → back to login with ?error
  if (!token || token !== expected) {
    return NextResponse.redirect(new URL("/admin/bots/login?error=1", req.url));
  }

  // Set cookie for bots panel
  cookies().set("bots_admin", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7
  });

  // Redirect to next or bots home
  const next = new URL(req.url).searchParams.get("next") || "/admin/bots";
  return NextResponse.redirect(new URL(next, req.url));
}
