import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { breakingNewsSchema } from "@/lib/validations";

export async function GET() {
  const items = await prisma.breakingNews.findMany({ orderBy: { order: "asc" } });
  return NextResponse.json(items);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = breakingNewsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const maxOrder = await prisma.breakingNews.aggregate({ _max: { order: true } });

  const item = await prisma.breakingNews.create({
    data: {
      text: data.text,
      link: data.link || null,
      isActive: data.isActive ?? true,
      order: data.order ?? (maxOrder._max.order ?? 0) + 1,
    },
  });

  return NextResponse.json(item, { status: 201 });
}
