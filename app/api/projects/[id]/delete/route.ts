import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Body: { hard?: boolean, confirmName?: string }
export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();

  const { hard, confirmName } = await req.json().catch(() => ({}));

  const proj = await prisma.project.findUnique({ where: { id: params.id } });
  if (!proj) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  if (hard) {
    if (!confirmName || confirmName.trim() !== proj.name) {
      return NextResponse.json({ ok: false, error: "CONFIRM_NAME_MISMATCH" }, { status: 400 });
    }
    // HARD DELETE: removes project and cascades by Prisma relations only if defined
    await prisma.project.delete({ where: { id: params.id } });
  } else {
    // SOFT DELETE
    await prisma.project.update({
      where: { id: params.id },
      data: { deleted: true },
    });
  }

  return NextResponse.json({ ok: true });
}
