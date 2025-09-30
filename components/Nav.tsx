"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Route } from "next";   // 👈 add this

type NavItem = { href: Route; label: string }; // 👈 use Route

const items: NavItem[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/projects",  label: "Projects"  },
  { href: "/downlines", label: "Downlines" },
];

export default function Nav() {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => setOpen(false), [pathname]);

  const logout = async () => {
    if (busy) return;
    setBusy(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.replace("/login");
      setTimeout(() => location.assign("/login"), 50);
    } finally {
      setBusy(false);
    }
  };

  const linkCls = (href: string) => `g-btn ${pathname?.startsWith(href) ? "ring-1" : ""}`;

  return (
    <nav className="app-nav">
      <div className="container-max flex items-center justify-between py-3 gap-3">
        <Link href={"/dashboard"} className="font-semibold tracking-wide">
          Admin Panel
        </Link>

        <div className="hidden md:flex items-center gap-2">
          {items.map((it) => (
            <Link key={it.href} href={it.href} className={linkCls(it.href)}>
              {it.label}
            </Link>
          ))}
          <button onClick={logout} className="g-btn" aria-busy={busy || undefined} title="Logout">
            Logout
          </button>
        </div>

        <button
          className="hamburger md:hidden"
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label="Toggle navigation"
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      <div id="mobile-menu" className={`mobile-menu md:hidden ${open ? "is-open" : ""}`}>
        <div className="container-max py-3 flex flex-col gap-2">
          {items.map((it) => (
            <Link
              key={it.href}
              href={it.href}
              className={linkCls(it.href)}
              onClick={() => setOpen(false)}
            >
              {it.label}
            </Link>
          ))}
          <button onClick={logout} className="g-btn" aria-busy={busy || undefined}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
