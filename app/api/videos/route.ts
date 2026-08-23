import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { videoSchema } from "@/lib/validations";
import { generateUniqueSlug } from "@/lib/slug";
import { youtubeThumbnail } from "@/lib/utils";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const videos = await prisma.video.findMany({
    where: q ? { title: { contains: q } } : undefined,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(videos);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = videoSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = await generateUniqueSlug("video", data.title);

  const video = await prisma.video.create({
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

  return NextResponse.json(video, { status: 201 });
}
