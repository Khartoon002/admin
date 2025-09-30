import NavLayout from "@/components/NavLayout";
import AdminActions from "@/components/AdminActions";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function ProjectPage({ params }: { params: { id: string } }) {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      packages: { where: { deleted: false }, orderBy: { createdAt: "desc" } },
      bots: true,
    },
  });

  if (!project) {
    return (
      <NavLayout>
        <div className="g-card">Project not found</div>
      </NavLayout>
    );
  }

  const archived = !!project.archivedAt;
  const deleted = project.deleted;

  return (
    <NavLayout>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="g-title">
            {project.name} <span className="g-sub">/ {project.slug}</span>
          </div>
          <div className="g-sub mt-1">
            Status: {deleted ? "deleted" : archived ? "archived" : "active"}
          </div>
        </div>

        {/* Small icon controls (archive/unarchive/soft delete/HARD delete) */}
        <AdminActions
          entity="project"
          id={project.id}
          name={project.name}
          archived={archived}
          deleted={deleted}
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <div className="g-card">
          <div className="g-title mb-3">Packages</div>
          <div className="space-y-3">
            {project.packages.map((p) => (
              <a key={p.id} href={`/packages/${p.id}`} className="block g-outline px-3 py-2 rounded-xl">
                <div className="font-medium">{p.name}</div>
                <div className="g-sub text-sm">/{p.slug}</div>
              </a>
            ))}
            {project.packages.length === 0 && <div className="g-sub">No packages yet.</div>}
          </div>
          <div className="mt-3">
            <a className="g-btn" href={`/packages/new?projectId=${project.id}`}>New Package</a>
          </div>
        </div>

        <div className="g-card">
          <div className="g-title mb-3">Bots</div>
          <div className="space-y-2">
            {project.bots.map((b) => (
              <div key={b.id} className="g-outline px-3 py-2 rounded-xl">
                <div className="font-medium">{b.name}</div>
                <div className="g-sub text-sm">/{b.slug}</div>
              </div>
            ))}
            {project.bots.length === 0 && <div className="g-sub">No bots.</div>}
          </div>
        </div>
      </div>
    </NavLayout>
  );
}
