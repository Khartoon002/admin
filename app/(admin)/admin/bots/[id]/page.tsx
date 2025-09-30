import NavLayout from "@/components/NavLayout";
import { prisma } from "@/lib/prisma";
import UploadHtmlForm from "@/components/UploadHtmlForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type BotPage = {
  id: string;
  version: number;
  // add other properties if needed
};

type Bot = {
  id: string;
  name: string;
  pages: BotPage[];
};

export default async function BotManage({ params }: { params: { id: string } }) {
  const bot = await prisma.bot.findUnique({
    where: { id: params.id },
    include: { pages: { orderBy: { version: "desc" } } }
  }) as Bot | null;
  if (!bot) return <NavLayout><div className="g-card">Not found</div></NavLayout>;
  return (
    <NavLayout>
      <div className="g-title">{bot.name}</div>
      <div className="grid md:grid-cols-2 gap-4 mt-3">
        <div className="g-card">
          <div className="font-semibold mb-2">Upload New HTML Version</div>
          <UploadHtmlForm botId={bot.id} />
        </div>
        <div className="g-card">
          <div className="font-semibold mb-2">Versions</div>
          {bot.pages.map((p: BotPage) => (
            <div key={p.id} className="g-table-row py-2 flex justify-between">
              <div>v{p.version}</div>
              <div className="flex gap-2">
                <a className="g-btn" href={`/api/bots-panel/bots/${bot.id}/pages/${p.version}`}>Download</a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </NavLayout>
  );
}
