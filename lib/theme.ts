import { cookies } from "next/headers";
import { prisma } from "./prisma";

const THEME_COOKIE = "theme_settings";

type Theme = { palette: string; dark: boolean; layout: "topbar" | "sidebar" };
const defaultTheme: Theme = { palette: "blue", dark: true, layout: "topbar" };

export async function getTheme(userEmail?: string): Promise<Theme> {
  if (userEmail) {
    const user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (user?.theme) {
      try { return JSON.parse(user.theme) as Theme; } catch {}
    }
  }
  const raw = cookies().get(THEME_COOKIE)?.value;
  if (raw) { try { return JSON.parse(raw) as Theme; } catch {} }
  return defaultTheme;
}

export async function saveTheme(theme: Theme, userEmail?: string) {
  if (userEmail) {
    await prisma.user.update({ where: { email: userEmail }, data: { theme: JSON.stringify(theme) } });
  } else {
    cookies().set(THEME_COOKIE, JSON.stringify(theme), { httpOnly: false, sameSite: "lax", secure: true, path: "/", maxAge: 60*60*24*365 });
  }
  return theme;
}
