import { NextRequest, NextResponse } from "next/server";
import { refreshDbFromSupabase, saveDb, saveGalleryToSupabase, saveGalleryDeleteToSupabase } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { GalleryItem } from "@/lib/types";
import { revalidateAllPublicPages } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await refreshDbFromSupabase();
  return NextResponse.json({ gallery: db.gallery });
}

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: GalleryItem = await req.json();
    const db = await refreshDbFromSupabase();

    if (!body.title || !body.category || !body.imageUrl) {
      return NextResponse.json({ error: "Judul, kategori, dan foto wajib diisi" }, { status: 400 });
    }

    const newItem: GalleryItem = {
      ...body,
      id: body.id || `gal-${Date.now()}`,
      date: body.date || new Date().toISOString().split("T")[0],
    };

    await saveGalleryToSupabase([newItem]);
    db.gallery.unshift(newItem);
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
    const body: GalleryItem = await req.json();
    const db = await refreshDbFromSupabase();

    const idx = db.gallery.findIndex((g) => g.id === body.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Dokumentasi galeri tidak ditemukan" }, { status: 404 });
    }

    db.gallery[idx] = { ...db.gallery[idx], ...body };
    await saveGalleryToSupabase([db.gallery[idx]]);
    saveDb(db);
    revalidateAllPublicPages();

    return NextResponse.json({ success: true, item: db.gallery[idx] });
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
    await saveGalleryDeleteToSupabase(id);
    db.gallery = db.gallery.filter((g) => g.id !== id);
    saveDb(db);
    revalidateAllPublicPages();

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
