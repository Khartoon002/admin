"use client";
import { useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const sp = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    const res = await fetch("/api/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const data = await res.json();
    setLoading(false);
    if (!data.ok) { setError(data.error || "Login failed"); return; }
    const next = sp.get("next") || "/dashboard";
    location.href = next;
  }

  return (
    <form onSubmit={onSubmit} className="g-card space-y-3">
      <div className="g-title">Admin Login</div>
      {error && <div className="text-red-400" role="alert">{error}</div>}
      <label className="block">
        <span className="g-sub">Email</span>
        <input className="g-input mt-1" name="email" type="email" required defaultValue={process.env.ADMIN_EMAIL || ""} />
      </label>
      <label className="block">
        <span className="g-sub">Password</span>
        <input className="g-input mt-1" name="password" type="password" required defaultValue={process.env.ADMIN_PASSWORD || ""} />
      </label>
      <button className="g-btn w-full" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
    </form>
  );
}
