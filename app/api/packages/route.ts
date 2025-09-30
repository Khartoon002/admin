import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/slugify";

export async function POST(req: Request) {
  const body = await req.json();

  // Small multipurpose endpoint: create project (when __createProject flag) or create package
  if (body.__createProject) {
    const { name, slug, defaultWhatsApp } = body;
    if (!name || !slug) return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
    const p = await prisma.project.create({
      data: { name, slug: String(slug), defaultWhatsApp: defaultWhatsApp || null, createdById: "admin" }
    });
    return NextResponse.json({ ok: true, projectId: p.id });
  }

  const { name, slug, description, projectId } = body;
  if (!name || !slug || !projectId) return NextResponse.json({ ok: false, error: "Missing fields" }, { status: 400 });
  const pkg = await prisma.package.create({
    data: { projectId, name, slug: String(slug), description: description || null }
  });
  return NextResponse.json({ ok: true, id: pkg.id });
}
