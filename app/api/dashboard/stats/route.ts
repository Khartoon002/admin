import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const [projects, packages, downlines] = await Promise.all([
    prisma.project.count({ where: { deleted: false } }),
    prisma.package.count({ where: { deleted: false } }),
    prisma.downline.count()
  ]);

  const recent = await prisma.downline.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { Project: true, Package: true } });
  const mapped = recent.map(r => ({ id: r.id, fullName: r.fullName, project: r.Project.name, package: r.Package.name, createdAt: r.createdAt.toISOString() }));

  return NextResponse.json({ totals: { projects, packages, downlines }, recent: mapped });
}
