import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const Body = z.object({
  token: z.string().min(6),
  fullName: z.string().min(2),
  username: z.string().min(3),
  password: z.string().min(4),
  phone: z.string().min(5),
  email: z.string().email().optional().nullable(),
  country: z.string().optional().nullable(), // ok even if your DB doesn’t have it
});

function whatsappUrl(toNumber: string, text: string) {
  return `https://wa.me/${toNumber}?text=${encodeURIComponent(text)}`;
}

async function safeFetch(url: string) {
  const ac = new AbortController();
  const t = setTimeout(() => ac.abort(), 6000);
  try {
    await fetch(url, { method: "GET", signal: ac.signal });
  } catch {
    // ignore
  } finally {
    clearTimeout(t);
  }
}

export async function POST(req: Request) {
  try {
    const json = await req.json().catch(() => ({}));
    const body = Body.parse(json);

    // Validate token / link
    const link = await prisma.personLink.findUnique({
      where: { token: body.token },
      include: { project: true, package: true },
    });

    if (!link) {
      return NextResponse.json({ ok: false, error: "Invalid link." }, { status: 404 });
    }
    if (link.oneTime && link.consumedAt) {
      return NextResponse.json({ ok: false, error: "This link has already been used." }, { status: 400 });
    }

    // Username unique
    const exists = await prisma.downline.findUnique({ where: { username: body.username } });
    if (exists) {
      return NextResponse.json({ ok: false, error: "Username already taken." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(body.password, 10);

    // Create Downline
    const downline = await prisma.downline.create({
      data: {
        projectId: link.projectId,
        packageId: link.packageId,
        fullName: body.fullName,
        username: body.username,
        passwordHash,
        passwordPlain: body.password, // admin-only viewing on server pages
        phone: body.phone,
        email: body.email || null,
        // If you added a 'country' column in your DB, this will use it.
        // If not, remove the next line or keep it if you've migrated.
        // @ts-ignore – keep silent if schema doesn’t have country
        country: body.country || null,
        uniqueCode: Math.random().toString(36).slice(2, 10).toUpperCase(),
      },
      include: { Project: true, Package: true },
    });

    // Mark link consumed (if one-time)
    await prisma.personLink.update({
      where: { id: link.id },
      data: { consumedAt: new Date(), usedByDownlineId: downline.id },
    });

    // Build WhatsApp text
    const toNumber = link.project.defaultWhatsApp || process.env.DEFAULT_WHATSAPP_NUMBER || "";
    const summary =
      `New registration\n` +
      `Name: ${downline.fullName}\n` +
      `User: ${downline.username}\n` +
      `Phone: ${downline.phone}\n` +
      `Project: ${link.project.name}\n` +
      `Package: ${link.package.name}\n` +
      `When: ${downline.createdAt.toISOString()}`;

    const wa = whatsappUrl(toNumber, summary);

    // Fire AutoRemote (non-blocking)
    if (process.env.AUTOREMOTE_KEY) {
      const ar = `https://autoremotejoaomgcd.appspot.com/sendmessage?key=${process.env.AUTOREMOTE_KEY}&message=` +
                encodeURIComponent(`lead:=:${downline.fullName}: :+${downline.phone}`);
      safeFetch(ar);
    }

    return NextResponse.json({ ok: true, whatsapp_url: wa, vcf_url: null });
  } catch (e: any) {
    // Zod errors or anything else
    const msg = e?.errors?.[0]?.message || e?.message || "Invalid request.";
    return NextResponse.json({ ok: false, error: msg }, { status: 400 });
  }
}
