import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const admin = cookies().get("adminSession")?.value;
  if (!admin) {
    redirect("/login?next=/dashboard");
  }
  redirect("/dashboard");
}
