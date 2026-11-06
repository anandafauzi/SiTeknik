import { NextRequest, NextResponse } from "next/server";
import { refreshDbFromSupabase, saveDb, saveWarrantiesToSupabase } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";
import { WarrantyPolicy } from "@/lib/types";
import { revalidateAllPublicPages } from "@/lib/revalidate";

export const dynamic = "force-dynamic";

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = await refreshDbFromSupabase();
  return NextResponse.json({ warranties: db.warranties });
}

export async function PUT(req: NextRequest) {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const body: WarrantyPolicy = await req.json();
    const db = await refreshDbFromSupabase();

    const idx = db.warranties.findIndex((w) => w.id === body.id || w.serviceCategory === body.serviceCategory);
    if (idx === -1) {
      db.warranties.push(body);
    } else {
      db.warranties[idx] = { ...db.warranties[idx], ...body };
    }

    await saveWarrantiesToSupabase(db.warranties);
    saveDb(db);
    revalidateAllPublicPages();

    return NextResponse.json({ success: true, policy: body });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
