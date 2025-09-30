import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { toCSV } from "@/lib/csv";

export async function GET() {
  const ds = await prisma.downline.findMany({ include: { Project: true, Package: true } });
  const rows = [["fullName","username","phone","email","project","package","createdAtISO"]];
  for (const d of ds) rows.push([d.fullName, d.username, d.phone, d.email || "", d.Project.name, d.Package.name, d.createdAt.toISOString()]);
  const csv = toCSV(rows);
  return new NextResponse(csv, { headers: { "Content-Type": "text/csv", "Content-Disposition": `attachment; filename="all-downlines.csv"` } });
}
