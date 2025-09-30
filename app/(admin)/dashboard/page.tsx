import NavLayout from "@/components/NavLayout"; 
import StableTime from "@/components/StableTime";
import { prisma } from "@/lib/prisma";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

// Define the RecentDownline type outside the component
type RecentDownline = {
  id: string;
  fullName: string;
  Project: { name: string };
  Package: { name: string };
  createdAt: Date;
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Dashboard() {
  // Query DB on the server (no self-fetch)
  const [projects, packages, downlines, recent] = await Promise.all([
    prisma.project.count({ where: { deleted: false } }),
    prisma.package.count({ where: { deleted: false } }),
    prisma.downline.count(),
    prisma.downline.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { Project: true, Package: true },
    }),
  ]);

  const data = {
    totals: { projects, packages, downlines },
    recent: recent.map((r: RecentDownline) => ({
      id: r.id,
      fullName: r.fullName,
      project: r.Project.name,
      package: r.Package.name,
      createdAt: r.createdAt.toISOString(),
    })),
  };

  return (
    <NavLayout>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="g-card">
          <div className="g-sub">Projects</div>
          <div className="g-title">{data.totals.projects}</div>
        </div>
        <div className="g-card">
          <div className="g-sub">Packages</div>
          <div className="g-title">{data.totals.packages}</div>
        </div>
        <div className="g-card">
          {data.recent.map((r: { id: Key | null | undefined; fullName: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; project: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; package: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; createdAt: string; }) => (
            <div key={r.id} className="g-table-row py-2 flex justify-between">
              <div>
                {r.fullName} · <span className="g-sub">{r.project} / {r.package}</span>
              </div>
              <div className="g-sub"><StableTime iso={r.createdAt} /></div>
            </div>
          ))}
        </div>
      </div>
    </NavLayout>
  );
}
