import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { PricingItem } from "@/lib/types";

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  return NextResponse.json({ pricing: db.pricing });
}

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: PricingItem = await req.json();
    const db = getDb();

    if (!body.name || !body.category || body.basePrice === undefined) {
      return NextResponse.json({ error: "Nama, kategori, dan harga wajib diisi" }, { status: 400 });
    }

    const newItem: PricingItem = {
      ...body,
      id: body.id || `prc-${Date.now()}`,
      code: body.code || `CUSTOM_${Date.now()}`,
    };

    db.pricing.push(newItem);
    saveDb(db);

    return NextResponse.json({ success: true, item: newItem });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: PricingItem = await req.json();
    const db = getDb();

    const idx = db.pricing.findIndex((p) => p.id === body.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Item harga tidak ditemukan" }, { status: 404 });
    }

    db.pricing[idx] = { ...db.pricing[idx], ...body };
    saveDb(db);

    return NextResponse.json({ success: true, item: db.pricing[idx] });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get("id");
  if (!id) return NextResponse.json({ error: "ID wajib disertakan" }, { status: 400 });

  const db = getDb();
  db.pricing = db.pricing.filter((p) => p.id !== id);
  saveDb(db);

  return NextResponse.json({ success: true });
}

