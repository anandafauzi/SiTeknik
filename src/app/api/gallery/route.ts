import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(req: NextRequest) {
  const db = getDb();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  let items = db.gallery;
  if (category && category !== "all") {
    items = items.filter((item) => item.category === category);
  }

  return NextResponse.json({ gallery: items });
}

