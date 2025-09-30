// lib/auth.ts
import { cookies, headers } from "next/headers";

/**
 * Returns the admin session cookie value, or null.
 */
export function getAdminSession(): string | null {
  const c = cookies().get("adminSession")?.value ?? null;
  return c && c.length > 0 ? c : null;
}

/**
 * Throws a Response(401) if there is no admin session cookie.
 * Call this at the top of protected route handlers.
 */
export function requireAdmin(): void {
  const sess = getAdminSession();
  if (!sess) {
    // You can also log user agent / ip if you want:
    // const ua = headers().get("user-agent") ?? "";
    throw new Response("Unauthorized", { status: 401 });
  }
}

/**
 * True if request is from an authenticated admin.
 */
export function isAdmin(): boolean {
  return getAdminSession() !== null;
}
