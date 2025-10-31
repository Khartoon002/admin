// app/api/downlines/export/route.ts
export const dynamic = 'force-dynamic';
export const revalidate = 0;
export const runtime = 'nodejs';

import { prisma } from "@/lib/db"; // <-- change to "@/lib/prisma" if that's your client path

// CSV escape (quotes/newlines/commas). Wrap in quotes and double any inner quotes.
function esc(v: unknown) {
  const s = String(v ?? "");
  return `"${s.replace(/"/g, '""')}"`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const packageId = url.searchParams.get("packageId");
  const projectId = url.searchParams.get("projectId");

  const rows = await prisma.downline.findMany({
    where: {
      ...(packageId ? { packageId } : {}),
      ...(projectId ? { projectId } : {}),
    },
    orderBy: { createdAt: "desc" },
    select: {
      fullName: true,
      username: true,
      phone: true,
      email: true,
      uniqueCode: true,
      passwordPlain: true,
      createdAt: true,
      Project: { select: { name: true } },
      Package: { select: { name: true } },
    },
  });

  const header = [
    "Full Name",
    "Username",
    "Password",
    "Phone",
    "Email",
    "Unique Code",
    "Project",
    "Package",
    "Created At",
  ];

  const dataLines = rows.map((r) =>
    [
      r.fullName,
      r.username,
      r.passwordPlain ?? "",
      r.phone,
      r.email ?? "",
      r.uniqueCode ?? "",
      r.Project?.name ?? "",
      r.Package?.name ?? "",
      r.createdAt.toISOString(),
    ]
      .map(esc)
      .join(",")
  );

  // Join with CRLF; prepend BOM so Excel interprets UTF-8 correctly
  const csv = ["\uFEFF" + header.map(esc).join(","), ...dataLines].join("\r\n");

  const dt = new Date();
  const filename =
    `downlines-${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, "0")}${String(dt.getDate()).padStart(2, "0")}` +
    (packageId ? `-pkg_${packageId}` : projectId ? `-proj_${projectId}` : "") +
    `.csv`;

  return new Response(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
