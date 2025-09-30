"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function NewProjectForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true); setError(null);
    const fd = new FormData(e.currentTarget);
    const body = Object.fromEntries(fd.entries());
    const res = await fetch("/api/packages", { // reuse endpoint to avoid bloat? we'll do minimal sample API below
      method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ __createProject: true, ...body })
    });
    const data = await res.json();
    setLoading(false);
    if (!data.ok) { setError(data.error || "Failed"); return; }
    router.push(`/projects/${data.projectId}`);
  }

  return (
    <form onSubmit={onSubmit} className="g-card space-y-3">
      <div className="g-title">New Project</div>
      {error && <div className="text-red-400">{error}</div>}
      <input className="g-input" name="name" placeholder="Name" required />
      <input className="g-input" name="slug" placeholder="slug" required />
      <input className="g-input" name="defaultWhatsApp" placeholder="Default WhatsApp (digits)" />
      <button className="g-btn w-full" disabled={loading}>{loading ? "Creating..." : "Create"}</button>
    </form>
  );
}
