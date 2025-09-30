import { prisma } from "@/lib/prisma";
import RegistrationForm from "./regform";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RegistrationPage({ params }: { params: { token: string } }) {
  const link = await prisma.personLink.findUnique({ where: { token: params.token }, include: { project: true, package: true } });
  if (!link || (link.oneTime && link.consumedAt)) {
    return <div className="min-h-screen flex items-center justify-center"><div className="g-card"><div className="g-title">Invalid or Used Link</div><div className="g-sub">Please contact support to request a new registration link.</div></div></div>;
  }
  return <RegistrationForm token={params.token} projectName={link.project.name} packageName={link.package.name} />;
}
