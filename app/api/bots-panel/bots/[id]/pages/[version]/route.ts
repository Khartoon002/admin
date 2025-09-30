import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(_req: Request, { params }: { params: { id: string; version: string } }) {
  const v = parseInt(params.version, 10);
  const page = await prisma.botPage.findFirst({ where: { botId: params.id, version: v } });
  if (!page) return NextResponse.json({ ok: false }, { status: 404 });
  return new NextResponse(page.html, {
    headers: {
      "Content-Type": "text/html",
      "Content-Disposition": `attachment; filename="bot-${params.id}-v${v}.html"`
    }
  });
}
