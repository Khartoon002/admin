"use client";
import { useState } from "react";

export default function UploadHtmlForm({ botId }: { botId: string }) {
  const [html, setHtml] = useState("");
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/bots-panel/bots/${botId}/pages`, { method: "POST", body: html });
      const data = await res.json();
      setMessage(data.ok ? "Uploaded" : data.error || "Failed");
    } catch (e:any) {
      setMessage(e?.message || "Error");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-3">
      <textarea className="g-input h-48" value={html} onChange={e => setHtml(e.target.value)} placeholder="Paste HTML here"></textarea>
      <button className="g-btn" disabled={saving}>{saving ? "Saving..." : "Upload HTML"}</button>
      {message && <div className="g-sub">{message}</div>}
    </form>
  );
}
