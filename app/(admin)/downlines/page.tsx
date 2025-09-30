import NavLayout from "@/components/NavLayout";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DownlinesPage() {
  const list = await prisma.downline.findMany({ orderBy: { createdAt: "desc" }, include: { Project: true, Package: true } });
  return (
    <NavLayout>
      <div className="flex items-center justify-between mb-3">
        <div className="g-title">Downlines</div>
        <a className="g-btn" href="/api/downlines/export">Export CSV</a>
      </div>
      <div className="g-card">
        {list.map((d: any) => (
          <div key={d.id} className="g-table-row py-2 flex justify-between">
            <div>
              {d.fullName} <span className="g-sub">/ {d.Project.name} / {d.Package.name}</span>
            </div>
            <div className="g-sub">+{d.phone}</div>
          </div>
        ))}
      </div>
    </NavLayout>
  );
}
