import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { celebritySchema } from "@/lib/validations";
import { generateUniqueSlug } from "@/lib/slug";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q");
  const celebrities = await prisma.celebrity.findMany({
    where: q ? { name: { contains: q } } : undefined,
    orderBy: { name: "asc" },
  });
  return NextResponse.json(celebrities);
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const parsed = celebritySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input", issues: parsed.error.flatten() }, { status: 400 });
  }

  const data = parsed.data;
  const slug = await generateUniqueSlug("celebrity", data.name);

  const celebrity = await prisma.celebrity.create({
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

  return NextResponse.json(celebrity, { status: 201 });
}
