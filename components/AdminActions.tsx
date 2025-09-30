"use client";

import { useState } from "react";
import { Archive, ArchiveRestore, Trash2, ShieldAlert } from "lucide-react";

type Props = {
  entity: "project" | "package";
  id: string;
  name: string;
  archived?: boolean;
  deleted?: boolean;
  onDone?: () => void;
};

export default function AdminActions({
  entity,
  id,
  name,
  archived = false,
  deleted = false,
  onDone,
}: Props) {
  const [busy, setBusy] = useState<string | null>(null);
  const base = entity === "project" ? "/api/projects" : "/api/packages";
  const isBusy = (key: string) => (busy?.includes(key) ? true : undefined);

  const post = async (url: string, body?: unknown) => {
    setBusy(url);
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: body ? { "Content-Type": "application/json" } : undefined,
        body: body ? JSON.stringify(body) : undefined,
      });
      if (!res.ok) throw new Error(await res.text());
      onDone?.();
      setTimeout(() => location.reload(), 120);
    } catch (e) {
      alert("Action failed:\n" + (e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const doArchive = () => post(`${base}/${id}/archive`);
  const doUnarchive = () => post(`${base}/${id}/unarchive`);
  const doSoftDelete = () =>
    confirm(`Soft delete this ${entity}?`) && post(`${base}/${id}/delete`, { hard: false });
  const doHardDelete = () => {
    const typed = prompt(`Type the FULL ${entity} name to HARD DELETE.\n\nName: ${name}`);
    if (!typed) return;
    post(`${base}/${id}/delete`, { hard: true, confirmName: typed });
  };

  return (
    <div className="flex items-center gap-1.5">
      <button
        className="g-btn icon-btn"
        onClick={doArchive}
        aria-label="Archive"
        title="Archive"
        disabled={archived || deleted}
        aria-busy={isBusy("/archive")}
      >
        <Archive />
      </button>

      <button
        className="g-btn icon-btn"
        onClick={doUnarchive}
        aria-label="Unarchive"
        title="Unarchive"
        disabled={!archived}
        aria-busy={isBusy("/unarchive")}
      >
        <ArchiveRestore />
      </button>

      <button
        className="g-btn icon-btn"
        onClick={doSoftDelete}
        aria-label="Soft delete"
        title="Soft delete"
        disabled={deleted}
        aria-busy={isBusy("/delete")}
      >
        <Trash2 />
      </button>

      <button
        className="g-btn icon-btn"
        onClick={doHardDelete}
        aria-label="HARD delete (type name)"
        title="HARD delete (type name)"
        aria-busy={isBusy("/delete")}
      >
        <ShieldAlert />
      </button>
    </div>
  );
}
