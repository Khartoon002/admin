"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function NewPackagePage() {
  return (
    <Suspense fallback={<div className="container-max py-10 g-sub">Loading…</div>}>
      <NewPackageInner />
    </Suspense>
  );
}

function NewPackageInner() {
  const router = useRouter();
  const search = useSearchParams(); // safe inside Suspense
  const projectId = search.get("projectId") || "";

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [pending, start] = useTransition();
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    start(async () => {
      const res = await fetch("/api/packages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectId, name, slug, description: desc }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data?.error || "Failed to create package");
        return;
      }
      const data = await res.json();
      router.replace(`/packages/${data.id}`);
    });
  };

  return (
    <div className="container-max mt-6">
      <div className="g-title mb-4">New Package</div>
      <form onSubmit={onSubmit} className="g-card max-w-xl space-y-3">
        {err && <div className="g-outline px-3 py-2 text-sm text-red-300">{err}</div>}
        <div className="grid sm:grid-cols-2 gap-3">
          <input className="g-input" placeholder="Name"
                 value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="g-input" placeholder="Slug (optional)"
                 value={slug} onChange={(e) => setSlug(e.target.value)} />
        </div>
        <textarea className="g-input min-h-28" placeholder="Description (optional)"
                  value={desc} onChange={(e) => setDesc(e.target.value)} />
        <div className="g-sub">Project: {projectId || "(select via Projects → New Package)"}</div>
        <button className="g-btn" disabled={pending || !projectId}>
          {pending ? "Creating…" : "Create Package"}
        </button>
      </form>
    </div>
  );
}
