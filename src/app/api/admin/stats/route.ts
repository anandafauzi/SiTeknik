import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { getSessionUser } from "@/lib/auth";

export async function GET() {
  const user = getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = getDb();
  return NextResponse.json({
    servicesCount: db.services.length,
    pricingCount: db.pricing.length,
    galleryCount: db.gallery.length,
    knowledgeCount: db.knowledge.length,
    warrantiesCount: db.warranties.length,
    whatsappNumber: db.settings.whatsappNumber,
    businessName: db.settings.businessName,
  });
}
