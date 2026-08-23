import { NextRequest, NextResponse } from "next/server";
import { globalSearch } from "@/lib/data";

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q") || "";
  const results = await globalSearch(q);
  return NextResponse.json(results);
}
