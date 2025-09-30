import RegistrationForm from "@/components/RegistrationForm";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function RegistrationPage({ params }: { params: { token: string } }) {
  // Minimal public page, no nav
  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <RegistrationForm token={params.token} />
    </div>
  );
}
