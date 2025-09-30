"use client";

import { Suspense, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Route } from "next"; // ← typed routes

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="container-max py-10 g-sub">Loading…</div>}>
      <LoginInner />
    </Suspense>
  );
}

function LoginInner() {
  const router = useRouter();
  const search = useSearchParams();

  // derive a safe typed route
  const fallback: Route = "/dashboard";
  const rawNext = search.get("next") || "";
  const nextHref: Route =
    rawNext.startsWith("/") ? (rawNext as Route) : fallback;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [pending, start] = useTransition();

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);
    start(async () => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        setErr("Invalid credentials");
        return;
      }
      router.replace(nextHref);          // ← now a Route, type-safe
      setTimeout(() => location.assign(nextHref), 50);
    });
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <form onSubmit={onSubmit} className="g-card w-full max-w-sm space-y-4">
        <div className="g-title">Sign in</div>
        {err && <div className="g-outline px-3 py-2 text-sm text-red-300">{err}</div>}
        <input
          className="g-input"
          placeholder="Email"
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="g-input"
          placeholder="Password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button className="g-btn w-full" disabled={pending}>
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
