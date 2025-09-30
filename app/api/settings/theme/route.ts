import { NextResponse } from "next/server";
import { getTheme, saveTheme } from "@/lib/theme";

export async function GET() {
  const t = await getTheme(process.env.ADMIN_EMAIL); // minimal: treat single admin user for persistence
  return NextResponse.json(t);
}
export async function POST(req: Request) {
  const theme = await req.json();
  const saved = await saveTheme(theme, process.env.ADMIN_EMAIL);
  return NextResponse.json(saved);
}
