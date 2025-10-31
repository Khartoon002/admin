// app/api/dashboard/stats/route.ts
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // keep your actual prisma client path

export async function GET() {
  try {
    // 7-day window (UTC-safe enough for dashboard use)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    // Aggregate counts (respect soft-delete & archived flags)
    const [totalProjects, totalPackages, totalDownlines, registrationsLast7Days] =
      await Promise.all([
        prisma.project.count({
          where: { deleted: false, archivedAt: null },
        }),
        prisma.package.count({
          where: { project: { deleted: false, archivedAt: null } },
        }),
        prisma.downline.count({
          where: { Project: { deleted: false, archivedAt: null } },
        }),
        prisma.downline.count({
          where: {
            createdAt: { gte: sevenDaysAgo },
            Project: { deleted: false, archivedAt: null },
          },
        }),
      ]);

    // Recent activity feed (last 7 days)
    const recent = await prisma.downline.findMany({
      where: {
        createdAt: { gte: sevenDaysAgo },
        Project: { deleted: false, archivedAt: null },
      },
      orderBy: { createdAt: "desc" },
      take: 8,
      select: {
        fullName: true,
        createdAt: true,
        Project: { select: { name: true } },
        Package: { select: { name: true } },
      },
    });

    const payload = {
      totalProjects,
      totalPackages,
      totalDownlines,
      registrationsLast7Days,
      logs: recent.map((r) => ({
        name: r.fullName,
        projectName: r.Project?.name ?? "",
        packageName: r.Package?.name ?? "",
        date: r.createdAt.toISOString(),
      })),
    };

    return NextResponse.json(payload, {
      headers: {
        "Cache-Control": "no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch (err) {
    // Prevent build/export from failing and surface a structured error
    return NextResponse.json(
      { error: "Failed to load dashboard stats" },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store",
          "X-Content-Type-Options": "nosniff",
        },
      }
    );
  }
}
