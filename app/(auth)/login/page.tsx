// app/(auth)/login/page.tsx
"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const search = useSearchParams();
  const next = search.get("next") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [err, setErr] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    // Hide any global nav by not using NavLayout here (this page is minimal)
    // If you had theme/nav state, nothing to do; page renders standalone.
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    startTransition(async () => {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, remember }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErr(data?.error || "Login failed");
        return;
      }

      // go to ?next=... or dashboard
      router.replace(next as any);
      // ensure cookie-based session is reflected
      setTimeout(() => location.assign(next), 50);
    });
  };

  return (
    <div className="min-h-dvh flex items-center justify-center px-4">
      <form
        onSubmit={onSubmit}
        className="g-card w-full max-w-sm space-y-4"
        aria-busy={isPending}
      >
        <div className="g-title">Admin Login</div>

        {err ? (
          <div className="g-outline px-3 py-2 text-sm text-red-300" role="alert">
            {err}
          </div>
        ) : null}

        <div>
          <label className="g-sub block mb-1" htmlFor="email">Email</label>
          <input
            id="email"
            className="g-input"
            autoComplete="username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="g-sub block mb-1" htmlFor="password">Password</label>
          <input
            id="password"
            className="g-input"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          Remember me (keep me signed in)
        </label>

        <button className="g-btn w-full" type="submit" disabled={isPending}>
          {isPending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </div>
  );
}
