import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { SiteSettings } from "@/lib/types";

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  return NextResponse.json({ settings: db.settings });
}

export async function PUT(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: Partial<SiteSettings> = await req.json();
    const db = getDb();

    db.settings = { ...db.settings, ...body };
    saveDb(db);

    return NextResponse.json({ success: true, settings: db.settings });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
