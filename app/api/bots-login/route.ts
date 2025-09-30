import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(req: Request) {
  // Accept either form POST or JSON for flexibility
  const contentType = req.headers.get("content-type") || "";
  let token = "";

  if (contentType.includes("application/json")) {
    const body = await req.json().catch(() => ({}));
    token = String(body.token || "");
  } else {
    const form = await req.formData();
    token = String(form.get("token") || "");
  }

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

  // Go to bots home
  return NextResponse.redirect(new URL("/admin/bots", req.url));
}
