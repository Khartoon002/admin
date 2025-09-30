import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(_req: Request, { params }: { params: { id: string } }) {
  const token = (Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2)).slice(0, 24);
  const pkg = await prisma.package.findUnique({ where: { id: params.id }, include: { project: true } });
  if (!pkg) return NextResponse.json({ ok: false, error: "Package not found" }, { status: 404 });
  await prisma.personLink.create({ data: { token, packageId: pkg.id, projectId: pkg.projectId } });
  return NextResponse.json({ ok: true, token });
}
