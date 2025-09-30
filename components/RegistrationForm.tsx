"use client";

import { useState } from "react";

type Props = { token: string };

export default function RegistrationForm({ token }: Props) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState(""); // optional if your DB has it
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    // Second warning/confirmation
    const summary = `Please confirm your details:\n\nName: ${fullName}\nUsername: ${username}\nPhone: ${phone}\nEmail: ${email || "-"}\nCountry: ${country || "-"}`;
    if (!window.confirm(summary + "\n\nAfter submission these cannot be changed. Continue?")) return;

    setBusy(true);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, fullName, username, password, phone, email, country }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setErr(data?.error || "Registration failed. Please try again.");
        setBusy(false);
        return;
      }

      // Redirect to WhatsApp with summary (server builds url)
      if (data.whatsapp_url) {
        window.location.href = data.whatsapp_url as string;
        return;
      }

      // Fallback
      setErr("Submitted, but no WhatsApp URL was returned.");
    } catch (e: any) {
      setErr(e?.message || "Network error.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="g-card max-w-md mx-auto space-y-3">
      <div className="g-title">Complete Registration</div>
      {err && <div className="g-outline px-3 py-2 text-sm text-red-300" role="alert">{err}</div>}

      <input className="g-input" placeholder="Full name" value={fullName} onChange={e=>setFullName(e.target.value)} required />
      <input className="g-input" placeholder="Username" value={username} onChange={e=>setUsername(e.target.value)} required />
      <input className="g-input" placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} required />
      <input className="g-input" placeholder="Phone (digits only)" value={phone} onChange={e=>setPhone(e.target.value)} required />
      <input className="g-input" placeholder="Email (optional)" type="email" value={email} onChange={e=>setEmail(e.target.value)} />
      <input className="g-input" placeholder="Country (optional)" value={country} onChange={e=>setCountry(e.target.value)} />

      <button className="g-btn w-full" type="submit" disabled={busy}>
        {busy ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
