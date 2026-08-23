import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialSchema } from "@/lib/validations";
import { generateUniqueSlug } from "@/lib/slug";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const serial = await prisma.serial.findUnique({ where: { id: params.id } });
  if (!serial) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(serial);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.serial.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = serialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.name !== existing.name ? await generateUniqueSlug("serial", data.name, existing.id) : existing.slug;

  const serial = await prisma.serial.update({
    where: { id: params.id },
    data: {
      name: data.name,
      slug,
      poster: data.poster,
      banner: data.banner,
      description: data.description,
      channel: data.channel,
      genre: data.genre,
      cast: JSON.stringify(data.cast),
      status: data.status,
      startDate: data.startDate ? new Date(data.startDate) : null,
      latestEpisode: data.latestEpisode || null,
      upcomingEpisode: data.upcomingEpisode || null,
      categoryId: data.categoryId || null,
      featured: !!data.featured,
    },
  });

  return NextResponse.json(serial);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.serial.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
