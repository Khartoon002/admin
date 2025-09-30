"use client";

import { useState } from "react";
import { Trash2 } from "lucide-react";

export default function DeleteDownlineButton({ id }: { id: string }) {
  const [busy, setBusy] = useState(false);

  const run = async () => {
    if (!confirm("Delete this downline? This cannot be undone.")) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/downlines/${id}/delete`, { method: "POST" });
      if (!res.ok) throw new Error(await res.text());
      setTimeout(() => location.reload(), 120);
    } catch (e) {
      alert("Failed:\n" + (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      className="g-btn icon-btn"
      onClick={run}
      aria-label="Delete downline"
      title="Delete downline"
      aria-busy={busy || undefined}
      disabled={busy}
    >
      <Trash2 />
    </button>
  );
}
