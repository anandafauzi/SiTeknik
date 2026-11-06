import { NextRequest, NextResponse } from "next/server";
import { refreshDbFromSupabase, saveDb, savePricingToSupabase, savePricingDeleteToSupabase } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { PricingItem } from "@/lib/types";
import { revalidateAllPublicPages } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await refreshDbFromSupabase();
  return NextResponse.json({ pricing: db.pricing });
}

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: PricingItem = await req.json();
    const db = await refreshDbFromSupabase();

    if (!body.name || !body.category || body.basePrice === undefined) {
      return NextResponse.json({ error: "Nama, kategori, dan harga wajib diisi" }, { status: 400 });
    }

    const newItem: PricingItem = {
      ...body,
      id: body.id || `prc-${Date.now()}`,
      code: body.code || `CUSTOM_${Date.now()}`,
    };

    await savePricingToSupabase([newItem]);
    db.pricing.push(newItem);
    saveDb(db);
    revalidateAllPublicPages();

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
    const db = await refreshDbFromSupabase();

    const idx = db.pricing.findIndex((p) => p.id === body.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Item harga tidak ditemukan" }, { status: 404 });
    }

    db.pricing[idx] = { ...db.pricing[idx], ...body };
    await savePricingToSupabase([db.pricing[idx]]);
    saveDb(db);
    revalidateAllPublicPages();

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

  try {
    const db = await refreshDbFromSupabase();
    await savePricingDeleteToSupabase(id);
    db.pricing = db.pricing.filter((p) => p.id !== id);
    saveDb(db);
    revalidateAllPublicPages();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
