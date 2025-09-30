"use client";

import { useState } from "react";

export type RegistrationFormProps = {
  token: string;
  projectName: string;
  packageName: string;
};

export default function RegistrationForm({
  token,
  projectName,
  packageName,
}: RegistrationFormProps) {
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [country, setCountry] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  const allFilled =
    fullName.trim() &&
    username.trim() &&
    password.trim() &&
    phone.trim() &&
    email.trim() &&
    country.trim();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    const summary =
      `Confirm your details:\n\n` +
      `Project: ${projectName}\n` +
      `Package: ${packageName}\n` +
      `Name: ${fullName}\n` +
      `Username: ${username}\n` +
      `Phone: ${phone}\n` +
      `Email: ${email}\n` +
      `Country: ${country}\n\n` +
      `These cannot be changed after submission. Continue?`;
    if (!window.confirm(summary)) return;

    setBusy(true);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          token,
          fullName,
          username,
          password,
          phone,
          email,
          country,
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.ok) {
        setErr(data?.error || "Registration failed. Please try again.");
        return;
      }

      if (data.whatsapp_url) {
        window.location.href = data.whatsapp_url as string;
      } else {
        setErr("Submitted, but WhatsApp redirection was not returned.");
      }
    } catch (e: any) {
      setErr(e?.message || "Network error.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="g-card w-full max-w-md space-y-3">
      <div className="g-title">Complete Registration</div>
      {err && (
        <div className="g-outline px-3 py-2 text-sm text-red-300" role="alert">
          {err}
        </div>
      )}

      {/* Read-only project/package */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <div className="g-sub mb-1">Project</div>
          <input className="g-input opacity-70" value={projectName} readOnly />
        </div>
        <div>
          <div className="g-sub mb-1">Package</div>
          <input className="g-input opacity-70" value={packageName} readOnly />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          className="g-input"
          placeholder="Full name"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
        />
        <input
          className="g-input"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          className="g-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <input
          className="g-input"
          placeholder="Phone (digits only)"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          inputMode="numeric"
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input
          className="g-input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="g-input"
          placeholder="Country"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          required
        />
      </div>

      <button className="g-btn w-full" type="submit" disabled={busy || !allFilled}>
        {busy ? "Submitting…" : "Submit"}
      </button>
    </form>
  );
}
