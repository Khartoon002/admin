// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PUBLIC_PREFIXES = [
  "/login",
  "/admin/bots/login",
  "/admin/bots/logout",
  "/bots",
  "/registrations",
  "/api",
  "/_next",
  "/favicon.ico",
  "/images",
  "/assets",
];

function isPublic(pathname: string) {
  // Home should redirect to /login unless already authenticated
  if (pathname === "/") return false;
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));
}

export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl;

  // Always allow truly public assets and API (never fetch here!)
  if (isPublic(pathname)) {
    // Extra: bots admin gate lives under /admin/bots, handle there
    if (pathname.startsWith("/admin/bots") && !pathname.startsWith("/admin/bots/login")) {
      const token = req.cookies.get("bots_admin")?.value;
      if (token !== process.env.BOTS_ADMIN_TOKEN) {
        const url = new URL("/admin/bots/login", req.url);
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  // Private admin area: require adminSession
  const session = req.cookies.get("adminSession")?.value;
  if (!session) {
    const url = new URL("/login", req.url);
    url.searchParams.set("next", pathname + search);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

// Match everything except static files Next already excludes
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
