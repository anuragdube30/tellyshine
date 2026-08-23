import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { serialSchema } from "@/lib/validations";
import { generateUniqueSlug } from "@/lib/slug";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const q = searchParams.get("q");
  const serials = await prisma.serial.findMany({
    where: q ? { name: { contains: q } } : undefined,
    orderBy: { updatedAt: "desc" },
  });
  return NextResponse.json(serials);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = serialSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = await generateUniqueSlug("serial", data.name);

  const serial = await prisma.serial.create({
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

  return NextResponse.json(serial, { status: 201 });
}
