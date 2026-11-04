import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET() {
  const db = getDb();
  return NextResponse.json({
    services: db.services,
    warranties: db.warranties,
    settings: {
      businessName: db.settings.businessName,
      whatsappNumber: db.settings.whatsappNumber,
      phoneDisplay: db.settings.phoneDisplay,
      serviceAreas: db.settings.serviceAreas,
    },
  });
}
