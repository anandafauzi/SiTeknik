import { NextRequest, NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { ServiceItem } from "@/lib/types";

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  return NextResponse.json({ services: db.services });
}

export async function POST(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: ServiceItem = await req.json();
    const db = getDb();

    if (!body.title || !body.category) {
      return NextResponse.json({ error: "Title dan kategori wajib diisi" }, { status: 400 });
    }

    const newService: ServiceItem = {
      ...body,
      id: body.id || `srv-${Date.now()}`,
      slug: body.slug || body.title.toLowerCase().replace(/[^\w\s-]/g, "").replace(/\s+/g, "-"),
    };

    db.services.push(newService);
    saveDb(db);

    return NextResponse.json({ success: true, service: newService });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: ServiceItem = await req.json();
    const db = getDb();

    const idx = db.services.findIndex((s) => s.id === body.id || s.slug === body.slug);
    if (idx === -1) {
      return NextResponse.json({ error: "Layanan tidak ditemukan" }, { status: 404 });
    }

    db.services[idx] = { ...db.services[idx], ...body };
    saveDb(db);

    return NextResponse.json({ success: true, service: db.services[idx] });
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
  db.services = db.services.filter((s) => s.id !== id);
  saveDb(db);

  return NextResponse.json({ success: true });
}
