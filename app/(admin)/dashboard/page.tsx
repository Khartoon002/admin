// app/(admin)/dashboard/page.tsx
import NavLayout from "@/components/NavLayout";
import StableTime from "@/components/StableTime";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RecentRow = {
  id: string;
  fullName: string;
  projectName: string;
  pkgName: string;
  createdAtISO: string;
};

export default async function Dashboard() {
  // server-side queries (no self-fetch)
  const [projects, packages, downlines, recentRaw] = await Promise.all([
    prisma.project.count({ where: { deleted: false } }),
    prisma.package.count({ where: { deleted: false } }),
    prisma.downline.count(),
    prisma.downline.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { Project: true, Package: true },
    }),
  ]);

  const recent: RecentRow[] = recentRaw.map((r) => ({
    id: r.id,
    fullName: r.fullName,
    projectName: r.Project.name,
    pkgName: r.Package.name, // renamed from "package" -> "pkgName"
    createdAtISO: r.createdAt.toISOString(), // pass ISO string to client comp
  }));

  return (
    <NavLayout>
      <div className="g-title mb-4">Dashboard</div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="g-card">
          <div className="g-sub">Projects</div>
          <div className="g-title">{projects}</div>
        </div>
        <div className="g-card">
          <div className="g-sub">Packages</div>
          <div className="g-title">{packages}</div>
        </div>
        <div className="g-card">
          <div className="g-sub">Downlines</div>
          <div className="g-title">{downlines}</div>
        </div>
      </div>

      <div className="g-card mt-6">
        <div className="font-semibold mb-2">Recent registrations</div>
        {recent.length === 0 && <div className="g-sub">No recent activity.</div>}
        {recent.map((r) => (
          <div key={r.id} className="g-table-row py-2 flex justify-between">
            <div>
              {r.fullName} ·{" "}
              <span className="g-sub">
                {r.projectName} / {r.pkgName}
              </span>
            </div>
            <div className="g-sub">
              <StableTime iso={r.createdAtISO} />
            </div>
          </div>
        ))}
      </div>
    </NavLayout>
  );
}
