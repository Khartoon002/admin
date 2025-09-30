"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function NewPackageForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const sp = useSearchParams();
  const projectId = sp.get("projectId") || "";

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    const res = await fetch("/api/packages", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...body, projectId })});
    const data = await res.json();
    setLoading(false);
    if (!data.ok) { setError(data.error || "Failed"); return; }
    router.push(`/packages/${data.id}`);
  }

  return (
    <form onSubmit={onSubmit} className="g-card space-y-3">
      <div className="g-title">New Package</div>
      {error && <div className="text-red-400">{error}</div>}
      <input className="g-input" name="name" placeholder="Name" required />
      <input className="g-input" name="slug" placeholder="slug" required />
      <textarea className="g-input h-28" name="description" placeholder="Description"></textarea>
      <button className="g-btn w-full" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
    </form>
  );
}
