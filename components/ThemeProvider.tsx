"use client";
import { useEffect, useState } from "react";

type Theme = { palette: string; dark: boolean; layout: "topbar" | "sidebar" };

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/settings/theme", { cache: "no-store" });
      const data = await res.json();
      apply(data);
      setTheme(data);
    })();
  }, []);

  function apply(t: Theme) {
    document.documentElement.dataset.theme = t.palette;
    document.documentElement.classList.toggle("dark", t.dark);
    document.documentElement.setAttribute("data-mode", t.dark ? "dark" : "light");
  }

  async function update(partial: Partial<Theme>) {
    if (!theme) return;
    const next = { ...theme, ...partial };
    apply(next);
    setTheme(next);
    await fetch("/api/settings/theme", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(next) });
  }

  if (!theme) return null;

  return (
    <div>
      <div className="app-nav">
        <div className="container-max flex items-center justify-between py-3">
          <div className="font-semibold">CLINTON FX Admin</div>
          <div className="flex items-center gap-2">
            <select value={theme.palette} onChange={e => update({ palette: e.target.value as Theme["palette"] })} className="g-input w-36">
              <option value="blue">Blue</option>
              <option value="orange">Orange</option>
              <option value="cyan">Cyan</option>
              <option value="magenta">Magenta</option>
              <option value="yellow">Yellow</option>
              <option value="bw">B/W</option>
            </select>
            <button className="g-btn" onClick={() => update({ dark: !theme.dark })}>{theme.dark ? "Light" : "Dark"}</button>
          </div>
        </div>
      </div>
      <div className="container-max py-6">{children}</div>
    </div>
  );
}
