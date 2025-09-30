import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();
  await prisma.downline.delete({ where: { id: params.id } });
  return NextResponse.json({ ok: true });
}
