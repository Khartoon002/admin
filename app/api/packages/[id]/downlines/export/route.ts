// app/api/packages/[id]/downlines/export/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stringify } from "csv-stringify/sync";

// If you don't have `country` in your Downline model, add it and migrate.
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const downlines = await prisma.downline.findMany({
      where: { packageId: params.id },
      select: {
        fullName: true,
        username: true,
        phone: true,
        email: true,
        country: true,        // <-- requires a `country` column
        createdAt: true,
      },
      orderBy: { createdAt: "desc" },
    });

    const headersRow = [
      "Full Name",
      "Username",
      "Phone",
      "Email",
      "Country",
      "Created At",
    ];

    const rows = downlines.map((d) => [
      d.fullName ?? "",
      d.username ?? "",
      d.phone ?? "",
      d.email ?? "",
      d.country ?? "",
      d.createdAt.toISOString(),
    ]);

    // Generate CSV (quoted to be safe for commas)
    const csv = stringify([headersRow, ...rows], {
      header: false,
      quoted: true,
    });

    const res = new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        // force download with a nice filename
        "Content-Disposition": `attachment; filename="downlines_${params.id}.csv"`,
        // make sure edge/platforms don't cache this
        "Cache-Control": "no-store",
      },
    });

    return res;
  } catch (err) {
    console.error("CSV export error:", err);
    return NextResponse.json(
      { error: "Failed to generate CSV" },
      { status: 500 }
    );
  }
}

export const dynamic = "force-dynamic";
export const revalidate = 0;
