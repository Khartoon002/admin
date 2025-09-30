import NavLayout from "@/components/NavLayout";
import AdminActions from "@/components/AdminActions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectsPage() {
  const projects = await prisma.project.findMany({
    where: { deleted: false },
    orderBy: { createdAt: "desc" },
    include: { packages: { where: { deleted: false } } },
  });

  return (
    <NavLayout>
      <div className="flex items-center justify-between">
        <div className="g-title">Projects</div>
        <a href="/projects/new" className="g-btn">New Project</a>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {projects.map((p) => (
          <div key={p.id} className="g-card">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="font-semibold text-lg">{p.name}</div>
                <div className="g-sub text-sm">/{p.slug}</div>
                <div className="g-sub text-sm mt-1">
                  {p.archivedAt ? "archived" : "active"} · {p.packages.length} packages
                </div>
              </div>
              <AdminActions
                entity="project"
                id={p.id}
                name={p.name}
                archived={!!p.archivedAt}
                deleted={false}
              />
            </div>

            <div className="mt-3 flex gap-2">
              <a className="g-btn" href={`/projects/${p.id}`}>Open</a>
              <a className="g-btn" href={`/packages/new?projectId=${p.id}`}>New Package</a>
            </div>
          </div>
        ))}
        {projects.length === 0 && <div className="g-sub">No projects yet.</div>}
      </div>
    </NavLayout>
  );
}
