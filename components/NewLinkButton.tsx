"use client";
import { useState } from "react";

export default function NewLinkButton({ pkgId }: { pkgId: string }) {
  const [creating, setCreating] = useState(false);
  const [token, setToken] = useState<string | null>(null);

  async function createLink() {
    setCreating(true);
    try {
      const res = await fetch(`/api/packages/${pkgId}/links/new`, { method: "POST" });
      const data = await res.json();
      setToken(data.token);
    } finally {
      setCreating(false);
    }
  }

  return (
    <div className="flex items-center gap-3">
      <button className="g-btn" onClick={createLink} disabled={creating}>{creating ? "Creating..." : "New One-time Link"}</button>
      {token ? <span className="g-sub break-all">{location.origin}/registrations/{token}</span> : null}
    </div>
  );
}
