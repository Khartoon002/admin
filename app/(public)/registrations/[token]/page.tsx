import { prisma } from "@/lib/prisma";
import RegistrationForm from "@/components/RegistrationForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function RegistrationPage({ params }: { params: { token: string } }) {
  const link = await prisma.personLink.findUnique({
    where: { token: params.token },
    include: { project: true, package: true },
  });

  if (!link || (link.oneTime && link.consumedAt)) {
    return (
      <div className="min-h-dvh flex items-center justify-center px-4">
        <div className="g-card max-w-md w-full text-center">
          <div className="g-title mb-1">Invalid or used link</div>
          <div className="g-sub">Please request a fresh registration link.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <RegistrationForm
        token={params.token}
        projectName={link.project.name}
        packageName={link.package.name}
      />
    </div>
  );
}
