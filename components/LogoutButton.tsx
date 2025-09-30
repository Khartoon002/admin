"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const doLogout = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      // hard reload to clear any client state
      setTimeout(() => location.assign("/login"), 50);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button className="g-btn" onClick={doLogout} aria-busy={busy}>
      {busy ? "Logging out..." : "Logout"}
    </button>
  );
}
