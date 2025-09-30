import NavLayout from "@/components/NavLayout";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type Bot = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  // Add other fields if needed
};

export default async function BotsAdmin() {
  const bots: Bot[] = await prisma.bot.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <NavLayout>
      <div className="g-title mb-3">Bots</div>
      <div className="g-card">
        {bots.map((b: Bot) => (
          <div key={b.id} className="g-table-row py-2 flex justify-between">
            <div>{b.name} <span className="g-sub">/ {b.slug}</span></div>
            <div className="flex gap-2">
              <a className="g-btn" href={`/bots/${b.slug}`} target="_blank">Public URL</a>
              <a className="g-btn" href={`/admin/bots/${b.id}`}>Manage</a>
            </div>
          </div>
        ))}
      </div>
    </NavLayout>
  );
}
