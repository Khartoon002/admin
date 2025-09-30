import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

// Body: { hard?: boolean, confirmName?: string }
export async function POST(req: Request, { params }: { params: { id: string } }) {
  await requireAdmin();

  const { hard, confirmName } = await req.json().catch(() => ({}));

  const pkg = await prisma.package.findUnique({
    where: { id: params.id },
  });
  if (!pkg) return NextResponse.json({ ok: false, error: "Not found" }, { status: 404 });

  if (hard) {
    if (!confirmName || confirmName.trim() !== pkg.name) {
      return NextResponse.json({ ok: false, error: "CONFIRM_NAME_MISMATCH" }, { status: 400 });
    }
    await prisma.package.delete({ where: { id: params.id } });
  } else {
    await prisma.package.update({
      where: { id: params.id },
      data: { deleted: true },
    });
  }

  return NextResponse.json({ ok: true });
}
