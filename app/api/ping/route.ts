import { NextResponse } from "next/server";

export async function GET() {
  const url = process.env.SUPABASE_URL;
  if (url) {
    try {
      const ctrl = new AbortController();
      const id = setTimeout(() => ctrl.abort(), 3000);
      await fetch(url, { method: "HEAD", signal: ctrl.signal, cache: "no-store" });
      clearTimeout(id);
    } catch {}
  }
  return NextResponse.json({ ok: true });
}
