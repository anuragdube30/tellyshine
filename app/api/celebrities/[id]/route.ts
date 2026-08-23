import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { celebritySchema } from "@/lib/validations";
import { generateUniqueSlug } from "@/lib/slug";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const celebrity = await prisma.celebrity.findUnique({ where: { id: params.id } });
  if (!celebrity) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(celebrity);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.celebrity.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = celebritySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.name !== existing.name ? await generateUniqueSlug("celebrity", data.name, existing.id) : existing.slug;

  const celebrity = await prisma.celebrity.update({
    where: { id: params.id },
    data: {
      name: data.name,
      slug,
      profileImage: data.profileImage,
      coverImage: data.coverImage || null,
      biography: data.biography,
      profession: data.profession,
      socialLinks: JSON.stringify(data.socialLinks || {}),
      featured: !!data.featured,
    },
  });

  return NextResponse.json(celebrity);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.celebrity.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
