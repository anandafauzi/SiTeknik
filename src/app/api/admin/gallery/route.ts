import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { GalleryItem } from "@/lib/types";

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  return NextResponse.json({ gallery: db.gallery });
}

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: GalleryItem = await req.json();
    const db = getDb();

    if (!body.title || !body.category || !body.imageUrl) {
      return NextResponse.json({ error: "Judul, kategori, dan foto wajib diisi" }, { status: 400 });
    }

    const newItem: GalleryItem = {
      ...body,
      id: body.id || `gal-${Date.now()}`,
      date: body.date || new Date().toISOString().split("T")[0],
    };

    db.gallery.unshift(newItem);
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
    const body: GalleryItem = await req.json();
    const db = getDb();

    const idx = db.gallery.findIndex((g) => g.id === body.id);
    if (idx === -1) {
      return NextResponse.json({ error: "Dokumentasi galeri tidak ditemukan" }, { status: 404 });
    }

    db.gallery[idx] = { ...db.gallery[idx], ...body };
    saveDb(db);

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

  const db = getDb();
  db.gallery = db.gallery.filter((g) => g.id !== id);
  saveDb(db);

  return NextResponse.json({ success: true });
}

