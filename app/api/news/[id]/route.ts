import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { newsSchema } from "@/lib/validations";
import { generateUniqueSlug } from "@/lib/slug";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const news = await prisma.news.findUnique({
    where: { id: params.id },
    include: { category: true, tags: true },
  });
  if (!news) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(news);
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const existing = await prisma.news.findUnique({ where: { id: params.id } });
  if (!existing) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await req.json();
  const parsed = newsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug =
    data.title !== existing.title
      ? await generateUniqueSlug("news", data.title, existing.id)
      : existing.slug;

  const wasPublished = existing.status === "PUBLISHED";
  const nowPublished = data.status === "PUBLISHED";

  const news = await prisma.news.update({
    where: { id: params.id },
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featuredImage,
      status: data.status,
      publishedAt: nowPublished && !wasPublished ? new Date() : existing.publishedAt,
      scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      categoryId: data.categoryId,
      tags: data.tagNames
        ? {
            set: [],
            connectOrCreate: data.tagNames.map((name) => ({
              where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
              create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
            })),
          }
        : undefined,
    },
  });

  return NextResponse.json(news);
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  await prisma.news.delete({ where: { id: params.id } });
  return NextResponse.json({ success: true });
}
