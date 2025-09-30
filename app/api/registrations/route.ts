import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { buildSummary, whatsappUrl } from "@/lib/whats";
import { sendAutoRemote } from "@/lib/autoremove";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, fullName, username, password, phone, email } = body as Record<string, string>;
    if (!token || !fullName || !username || !password || !phone) {
      return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    }
    const link = await prisma.personLink.findUnique({ where: { token }, include: { project: true, package: true } });
    if (!link) return NextResponse.json({ ok: false, error: "Invalid token" }, { status: 404 });
    if (link.oneTime && link.consumedAt) return NextResponse.json({ ok: false, error: "Link already used" }, { status: 400 });

    const existingUsername = await prisma.downline.findUnique({ where: { username } });
    if (existingUsername) return NextResponse.json({ ok: false, error: "Username already exists" }, { status: 400 });

    const hash = await bcrypt.hash(password, 10);
    const code = Math.random().toString(36).slice(2, 10).toUpperCase();

    const dl = await prisma.downline.create({
      data: {
        projectId: link.projectId,
        packageId: link.packageId,
        fullName, username,
        passwordHash: hash,
        passwordPlain: password,
        phone, email,
        uniqueCode: code
      }
    });

    await prisma.personLink.update({ where: { id: link.id }, data: { consumedAt: new Date(), usedByDownlineId: dl.id } });

    const summary = buildSummary({ name: fullName, username, phone, project: link.project.name, pkg: link.package.name, timestampISO: new Date().toISOString() });
    const to = link.project.defaultWhatsApp || process.env.DEFAULT_WHATSAPP_NUMBER!;
    const wa = whatsappUrl(to, summary);

    const key = process.env.AUTOREMOTE_KEY;
    if (key) sendAutoRemote(key, fullName, phone);

    return NextResponse.json({ ok: true, whatsapp_url: wa, vcf_url: null });
  } catch (e:any) {
    return NextResponse.json({ ok: false, error: e?.message || "Error" }, { status: 500 });
  }
}
