import { NextResponse, type NextRequest } from "next/server";

const ADMIN_COOKIE = "adminSession";
const BOTS_COOKIE = "bots_admin";

const PUBLIC_PATHS = [
  "/_next/",
  "/api/",
  "/registrations/",
  "/bots/",
  "/admin/bots/login",
  "/admin/bots/logout",
  "/login",            // must be public
  "/favicon.ico",
  "/robots.txt",
  "/sitemap.xml"
];

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Public allow-list
  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  if (isPublic) {
    // Guard only for bots admin sub-app (not public /bots/[slug])
    if (pathname.startsWith("/admin/bots") && !pathname.endsWith("/login") && !pathname.endsWith("/logout")) {
      const token = req.cookies.get(BOTS_COOKIE)?.value;
      if (!token || token !== process.env.BOTS_ADMIN_TOKEN) {
        const url = req.nextUrl.clone();
        url.pathname = "/admin/bots/login";
        if (pathname !== "/admin/bots/login") url.searchParams.set("next", pathname);
        return NextResponse.redirect(url);
      }
    }
    return NextResponse.next();
  }

  // Private admin area
  const admin = req.cookies.get(ADMIN_COOKIE)?.value;
  if (!admin) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
