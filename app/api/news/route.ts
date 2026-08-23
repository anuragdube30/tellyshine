import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { newsSchema } from "@/lib/validations";
import { generateUniqueSlug } from "@/lib/slug";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = req.nextUrl;
  const status = searchParams.get("status");
  const q = searchParams.get("q");
  const page = Number(searchParams.get("page") || 1);
  const pageSize = 15;

  const where = {
    ...(status ? { status: status as "DRAFT" | "PUBLISHED" | "SCHEDULED" } : {}),
    ...(q ? { title: { contains: q } } : {}),
  };

  const [items, total] = await Promise.all([
    prisma.news.findMany({
      where,
      include: { category: true, author: { select: { name: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * pageSize,
      take: pageSize,
    }),
    prisma.news.count({ where }),
  ]);

  return NextResponse.json({ items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = newsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = await generateUniqueSlug("news", data.title);

  const news = await prisma.news.create({
    data: {
      title: data.title,
      slug,
      excerpt: data.excerpt,
      content: data.content,
      featuredImage: data.featuredImage,
      status: data.status,
      publishedAt: data.status === "PUBLISHED" ? new Date() : null,
      scheduledFor: data.scheduledFor ? new Date(data.scheduledFor) : null,
      seoTitle: data.seoTitle || null,
      seoDescription: data.seoDescription || null,
      categoryId: data.categoryId,
      authorId: session.user.id,
      tags: data.tagNames?.length
        ? {
            connectOrCreate: data.tagNames.map((name) => ({
              where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
              create: { name, slug: name.toLowerCase().replace(/\s+/g, "-") },
            })),
          }
        : undefined,
    },
  });

  return NextResponse.json(news, { status: 201 });
}
