import { redirect } from "next/navigation";

export default function BotsLogout() {
  return redirect("/api/auth/logout?bots=1");
}
