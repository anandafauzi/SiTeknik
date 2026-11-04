import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { WarrantyPolicy } from "@/lib/types";

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  return NextResponse.json({ warranties: db.warranties });
}

export async function PUT(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: WarrantyPolicy = await req.json();
    const db = getDb();

    const idx = db.warranties.findIndex((w) => w.id === body.id || w.serviceCategory === body.serviceCategory);
    if (idx === -1) {
      db.warranties.push(body);
    } else {
      db.warranties[idx] = { ...db.warranties[idx], ...body };
    }

    saveDb(db);
    return NextResponse.json({ success: true, policy: body });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
