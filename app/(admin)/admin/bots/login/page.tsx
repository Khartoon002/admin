"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

export default function BotsLoginPage() {
  const [token, setToken] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    start(async () => {
      const res = await fetch("/api/admin-bots/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data?.error || "Login failed");
        return;
      }
      router.replace("/admin/bots");
      setTimeout(() => location.assign("/admin/bots"), 50);
    });
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <form onSubmit={submit} className="g-card w-full max-w-sm space-y-4">
        <div className="g-title">Bots Admin Login</div>
        {err && <div className="g-outline px-3 py-2 text-sm text-red-300" role="alert">{err}</div>}
        <input
          className="g-input"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          placeholder="Enter token"
          required
        />
        <button className="g-btn w-full" type="submit" disabled={pending}>
          {pending ? "Entering..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
