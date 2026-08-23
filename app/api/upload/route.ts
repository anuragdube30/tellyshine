import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { uploadImage } from "@/lib/cloudinary";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { image, alt } = await req.json();
  if (!image) return NextResponse.json({ error: "No image provided" }, { status: 400 });

  try {
    const { url, publicId } = await uploadImage(image);
    await prisma.media.create({ data: { url, publicId, type: "image", alt } });
    return NextResponse.json({ url, publicId });
  } catch (err) {
    return NextResponse.json({ error: "Upload failed. Check Cloudinary credentials." }, { status: 500 });
  }
}
