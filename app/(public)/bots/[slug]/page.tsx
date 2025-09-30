import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function BotPublicPage({ params }: { params: { slug: string } }) {
  const bot = await prisma.bot.findUnique({ where: { slug: params.slug }, include: { pages: { orderBy: { version: "desc" }, take: 1 } } });
  if (!bot || bot.pages.length === 0) {
    return <div className="container-max py-10"><h1 className="g-title">Bot not found</h1><p className="g-sub">No pages for this bot yet.</p></div>;
  }
  const html = bot.pages[0].html;
  return (
    <div>
      <div className="app-nav">
        <div className="container-max py-3">CLINTON FX Bots · <span className="g-sub">{bot.name}</span></div>
      </div>
      <div className="container-max py-6">
        <div className="g-card">
          <iframe className="w-full h-[75vh] rounded-xl border" srcDoc={html} sandbox="allow-same-origin allow-scripts allow-forms"></iframe>
        </div>
      </div>
    </div>
  );
}
