import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const html = await req.text();
  if (!html) return NextResponse.json({ ok: false, error: "No HTML" }, { status: 400 });
  const last = await prisma.botPage.findFirst({ where: { botId: params.id }, orderBy: { version: "desc" } });
  const nextVer = (last?.version || 0) + 1;
  await prisma.botPage.create({ data: { botId: params.id, html, version: nextVer } });
  return NextResponse.json({ ok: true, version: nextVer });
}
