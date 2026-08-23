import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { videoSchema } from "@/lib/validations";
import { generateUniqueSlug } from "@/lib/slug";
import { youtubeThumbnail } from "@/lib/utils";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const video = await prisma.video.findUnique({ where: { id: params.id } });
  if (!video) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(video);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.video.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = videoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = data.title !== existing.title ? await generateUniqueSlug("video", data.title, existing.id) : existing.slug;

  const video = await prisma.video.update({
    where: { id: params.id },
    data: {
      title: data.title,
      slug,
      description: data.description || null,
      youtubeUrl: data.youtubeUrl,
      thumbnail: youtubeThumbnail(data.youtubeUrl),
      duration: data.duration || null,
      categoryId: data.categoryId || null,
      serialId: data.serialId || null,
      isPublished: data.isPublished ?? true,
    },
  });

  return NextResponse.json(video);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.video.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
