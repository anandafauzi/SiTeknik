import { NextRequest, NextResponse } from "next/server";
import { refreshDbFromSupabase } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const db = await refreshDbFromSupabase();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category");

  let items = db.gallery;
  if (category && category !== "all") {
    items = items.filter((item) => item.category === category);
  }

  return NextResponse.json({ gallery: items });
}

