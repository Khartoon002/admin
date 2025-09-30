import NavLayout from "@/components/NavLayout";
import { prisma } from "@/lib/prisma";
import NewLinkButton from "@/components/NewLinkButton";
import CopyButton from "@/components/CopyButton";
import ExportButton from "@/components/ExportButton";
import AdminActions from "@/components/AdminActions";
import DeleteDownlineButton from "@/components/DeleteDownlineButton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type LinkView = {
  id: string;
  token: string;
  createdAt: Date;
  consumedAt: Date | null;
};

type DownlineView = {
  id: string;
  fullName: string;
  username: string;
  phone: string;
  email: string | null;
  country?: string | null;
  createdAt: Date;
};

export default async function PackagePage({ params }: { params: { id: string } }) {
  const pkg = await prisma.package.findUnique({
    where: { id: params.id },
    include: {
      project: true,
      links: { orderBy: { createdAt: "desc" } },
      downlines: { orderBy: { createdAt: "desc" } },
    },
  });

  if (!pkg) return <NavLayout><div className="g-card">Not found</div></NavLayout>;

  const archived = !!pkg.archivedAt;
  const deleted = pkg.deleted;

  return (
    <NavLayout>
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="g-title">
            {pkg.name} <span className="g-sub">/ {pkg.project.name}</span>
          </div>
          <div className="g-sub mt-1">
            Status: {deleted ? "deleted" : archived ? "archived" : "active"}
          </div>
        </div>

        {/* Small icon actions for this package */}
        <AdminActions
          entity="package"
          id={pkg.id}
          name={pkg.name}
          archived={archived}
          deleted={deleted}
        />
      </div>

      <div className="mt-3">
        <NewLinkButton pkgId={pkg.id} />
      </div>

      {/* Links + Downlines */}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
        {/* LINKS */}
        <div>
          <div className="font-semibold mb-2">Links</div>
          <div className="grid grid-cols-1 gap-4">
            {(pkg.links as LinkView[]).map((link) => {
              const isUsed = !!link.consumedAt;
              return (
                <div
                  key={link.id}
                  className="g-card px-4 py-3"
                  style={{ fontSize: "0.97rem", borderRadius: "1rem" }}
                >
                  <div className="flex items-center justify-between">
                    <div className="g-title" style={{ fontSize: "1.02rem" }}>
                      {link.token}
                    </div>
                    <span
                      className={`badge ${isUsed ? "opacity-70" : ""}`}
                      title={isUsed ? `Used at ${link.consumedAt?.toISOString()}` : "Active"}
                    >
                      {isUsed ? "Used" : "Active"}
                    </span>
                  </div>

                  <div className="g-sub" style={{ fontSize: "0.92rem" }}>
                    Created: {link.createdAt.toISOString()}
                    {isUsed && <> · Used: {link.consumedAt?.toISOString()}</>}
                  </div>

                  <div className="flex gap-2 mt-2">
                    <CopyButton text={`${process.env.APP_BASE_URL || ""}/registrations/${link.token}`} />
                  </div>
                </div>
              );
            })}
            {pkg.links.length === 0 && <div className="g-sub">No links yet.</div>}
          </div>
        </div>

        {/* DOWNLINES */}
        <div>
          <div className="font-semibold mb-2 flex items-center justify-between">
            <span>Downlines</span>
            <ExportButton packageId={pkg.id} />
          </div>

          <div className="grid grid-cols-1 gap-4">
            {(pkg.downlines as unknown as DownlineView[]).map((d) => (
              <div key={d.id} className="g-card">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{d.fullName}</div>
                  <span className="g-sub text-xs">{new Date(d.createdAt).toISOString()}</span>
                </div>
                <div className="g-sub">
                  @{d.username} · +{d.phone}
                  {d.email ? <> · {d.email}</> : null}
                  {d.country ? <> · {d.country}</> : null}
                </div>
                <div className="mt-2">
                  <DeleteDownlineButton id={d.id} />
                </div>
              </div>
            ))}
            {pkg.downlines.length === 0 && <div className="g-sub">No downlines yet.</div>}
          </div>
        </div>
      </div>
    </NavLayout>
  );
}
